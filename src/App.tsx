/**
 * Main Application Component
 * 
 * Root component that handles:
 * - Page routing and navigation
 * - KV store data subscriptions
 * - Theme management
 * - Analytics and consent integration
 * - Data initializers for KV store
 * 
 * @module App
 */

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
import { PAGE_TRANSITION, IDLE_CALLBACK_TIMEOUT_MS } from '@/lib/constants'
import type { TeamMember, Product, Video, CaseStudy, Datasheet, NewsItem, Publication } from '@/lib/types'
import { placeholderPublications, placeholderNews } from '@/lib/publications-data'

// =============================================================================
// LAZY LOADED PAGES
// =============================================================================

/**
 * Lazy load non-critical page components for better initial load performance.
 * Only HomePage is loaded eagerly since it's the landing page.
 */
const TeamPage = lazy(() => import('@/components/TeamPage').then(m => ({ default: m.TeamPage })))
const MaterialsPage = lazy(() => import('@/components/MaterialsPage').then(m => ({ default: m.MaterialsPage })))
const ApplicationsPage = lazy(() => import('@/components/ApplicationsPage').then(m => ({ default: m.ApplicationsPage })))
const ProductsPage = lazy(() => import('@/components/ProductsPage').then(m => ({ default: m.ProductsPage })))
const MediaPage = lazy(() => import('@/components/MediaPage').then(m => ({ default: m.MediaPage })))
const DatasheetsPage = lazy(() => import('@/components/DatasheetsPage').then(m => ({ default: m.DatasheetsPage })))
const NewsPage = lazy(() => import('@/components/NewsPage').then(m => ({ default: m.NewsPage })))
const ContactPage = lazy(() => import('@/components/ContactPage').then(m => ({ default: m.ContactPage })))
const GlobalSearch = lazy(() => import('@/components/GlobalSearch').then(m => ({ default: m.GlobalSearch })))

// =============================================================================
// COMPONENTS
// =============================================================================

/**
 * Loading fallback component displayed while lazy-loaded pages are fetched.
 */
const PageLoader = memo(() => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/20" />
        <div className="h-4 w-32 bg-muted rounded" />
      </div>
    </div>
  )
})

/**
 * Main application component.
 * 
 * Handles:
 * - State-based routing between pages
 * - KV store subscriptions for all data entities
 * - Page transition animations
 * - Global search integration
 * - Analytics and consent initialization
 */
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
      timeoutId = window.setTimeout(preload, IDLE_CALLBACK_TIMEOUT_MS)
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

  const pageRenderers: Record<string, () => JSX.Element> = {
    home: () => <HomePage onNavigate={handleNavigate} />,
    team: () => <TeamPage team={team || []} onNavigate={handleNavigate} />,
    materials: () => <MaterialsPage onNavigate={handleNavigate} />,
    applications: () => <ApplicationsPage onNavigate={handleNavigate} />,
    products: () => <ProductsPage products={products || []} onNavigate={handleNavigate} />,
    media: () => <MediaPage videos={videos || []} caseStudies={caseStudies || []} onNavigate={handleNavigate} />,
    datasheets: () => <DatasheetsPage datasheets={datasheets || []} onNavigate={handleNavigate} />,
    news: () => <NewsPage news={news || []} publications={publications || []} onNavigate={handleNavigate} />,
    contact: () => <ContactPage onNavigate={handleNavigate} />,
  }

  const renderPage = () => {
    const pageContent = (pageRenderers[currentPage] ?? pageRenderers.home)()

    // HomePage is eagerly loaded, others are lazy
    if (currentPage === 'home') {return pageContent}
    return <Suspense fallback={<PageLoader />}>{pageContent}</Suspense>
  }

  return (
    <AnalyticsProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Skip to main content link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Skip to main content
        </a>
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
        <main id="main-content" className="flex-1" role="main">
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
        </main>
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