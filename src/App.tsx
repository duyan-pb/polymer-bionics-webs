import { useState, useCallback, useEffect, lazy, Suspense, memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { HomePage } from '@/components/HomePage'
import { ProductsInitializer } from '@/components/ProductsInitializer'
import { TeamInitializer } from '@/components/TeamInitializer'
import { NewsInitializer } from '@/components/NewsInitializer'
import { MediaInitializer } from '@/components/MediaInitializer'
import { DatasheetsInitializer } from '@/components/DatasheetsInitializer'
import { FloatingContactButton } from '@/components/FloatingContactButton'
import { BackToTopButton } from '@/components/BackToTopButton'
import { AnalyticsProvider } from '@/components/AnalyticsProvider'
import { ConsentBanner } from '@/components/ConsentBanner'
import { useTheme } from '@/hooks/use-theme'
import { usePageTracking } from '@/lib/analytics/hooks'
import { PAGE_TRANSITION } from '@/lib/constants'
import type { TeamMember, Product, Video, CaseStudy, Datasheet, NewsItem, Publication } from '@/lib/types'
import { placeholderPublications, placeholderNews } from '@/lib/publications-data'

// Lazy load non-critical page components for better initial load performance
const TeamPage = lazy(() => import('@/components/TeamPage').then(m => ({ default: m.TeamPage })))
const MaterialsPage = lazy(() => import('@/components/MaterialsPage').then(m => ({ default: m.MaterialsPage })))
const ApplicationsPage = lazy(() => import('@/components/ApplicationsPage').then(m => ({ default: m.ApplicationsPage })))
const ProductsPage = lazy(() => import('@/components/ProductsPage').then(m => ({ default: m.ProductsPage })))
const MediaPage = lazy(() => import('@/components/MediaPage').then(m => ({ default: m.MediaPage })))
const DatasheetsPage = lazy(() => import('@/components/DatasheetsPage').then(m => ({ default: m.DatasheetsPage })))
const NewsPage = lazy(() => import('@/components/NewsPage').then(m => ({ default: m.NewsPage })))
const ContactPage = lazy(() => import('@/components/ContactPage').then(m => ({ default: m.ContactPage })))
const GlobalSearch = lazy(() => import('@/components/GlobalSearch').then(m => ({ default: m.GlobalSearch })))

// Loading fallback component
const PageLoader = memo(() => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="animate-pulse flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-primary/20" />
      <div className="h-4 w-32 bg-muted rounded" />
    </div>
  </div>
))

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  
  // Track page views when currentPage changes
  usePageTracking(currentPage)
  
  const [team] = useKV<TeamMember[]>('team', [])
  const [products] = useKV<Product[]>('products', [])
  const [videos] = useKV<Video[]>('videos', [])
  const [caseStudies] = useKV<CaseStudy[]>('caseStudies', [])
  const [datasheets] = useKV<Datasheet[]>('datasheets', [])
  const [news] = useKV<NewsItem[]>('news', placeholderNews)
  const [publications] = useKV<Publication[]>('publications', placeholderPublications)

  // Global error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('[App] Unhandled error:', event.error)
      event.preventDefault()
    }
    
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('[App] Unhandled promise rejection:', event.reason)
      event.preventDefault()
    }
    
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)
    
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const preload = () => {
      import('@/components/ProductsPage')
      import('@/components/MediaPage')
      import('@/components/DatasheetsPage')
      import('@/components/ContactPage')
      import('@/components/TeamPage')
    }

    type IdleCallback = (cb: IdleRequestCallback) => number
    type IdleCancelCallback = (id: number) => void
    const win = window as Window & { requestIdleCallback?: IdleCallback; cancelIdleCallback?: IdleCancelCallback }
    let timeoutId: number | undefined
    let idleId: number | undefined

    if (win.requestIdleCallback) {
      idleId = win.requestIdleCallback(preload)
    } else {
      timeoutId = window.setTimeout(preload, 500)
    }

    return () => {
      if (idleId && win.cancelIdleCallback) {
        win.cancelIdleCallback(idleId)
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [])

  const renderPage = () => {
    const pageContent = (() => {
      switch (currentPage) {
        case 'team':
          return <TeamPage team={team || []} onNavigate={handleNavigate} />
        case 'materials':
          return <MaterialsPage onNavigate={handleNavigate} />
        case 'applications':
          return <ApplicationsPage onNavigate={handleNavigate} />
        case 'products':
          return <ProductsPage products={products || []} onNavigate={handleNavigate} />
        case 'media':
          return <MediaPage videos={videos || []} caseStudies={caseStudies || []} onNavigate={handleNavigate} />
        case 'datasheets':
          return <DatasheetsPage datasheets={datasheets || []} onNavigate={handleNavigate} />
        case 'news':
          return <NewsPage news={news || []} publications={publications || []} onNavigate={handleNavigate} />
        case 'contact':
          return <ContactPage onNavigate={handleNavigate} />
        default:
          return <HomePage onNavigate={handleNavigate} />
      }
    })()
    
    // HomePage is eagerly loaded, others are lazy
    if (currentPage === 'home') {return pageContent}
    return <Suspense fallback={<PageLoader />}>{pageContent}</Suspense>
  }

  return (
    <AnalyticsProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <ProductsInitializer />
        <TeamInitializer />
        <NewsInitializer />
        <MediaInitializer />
        <DatasheetsInitializer />
        <Navigation 
          currentPage={currentPage} 
          onNavigate={handleNavigate} 
          onOpenSearch={() => setIsSearchOpen(true)} 
          isDark={isDark} 
          onToggleTheme={toggleTheme} 
        />
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={PAGE_TRANSITION.initial}
              animate={PAGE_TRANSITION.animate}
              exit={PAGE_TRANSITION.exit}
              transition={PAGE_TRANSITION.transition}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
        <Footer />
        <FloatingContactButton />
        {isSearchOpen && (
          <Suspense fallback={null}>
            <GlobalSearch
              open={isSearchOpen}
              onOpenChange={setIsSearchOpen}
              onNavigate={handleNavigate}
              products={products || []}
              team={team || []}
              datasheets={datasheets || []}
              news={news || []}
            />
          </Suspense>
        )}
        <BackToTopButton />
        <ConsentBanner />
      </div>
    </AnalyticsProvider>
  )
}

export default App