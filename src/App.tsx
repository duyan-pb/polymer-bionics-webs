import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { HomePage } from '@/components/HomePage'
import { TeamPage } from '@/components/TeamPage'
import { MaterialsPage } from '@/components/MaterialsPage'
import { ApplicationsPage } from '@/components/ApplicationsPage'
import { ProductsPage } from '@/components/ProductsPage'
import { MediaPage } from '@/components/MediaPage'
import { DatasheetsPage } from '@/components/DatasheetsPage'
import { NewsPage } from '@/components/NewsPage'
import { ContactPage } from '@/components/ContactPage'
import { ProductsInitializer } from '@/components/ProductsInitializer'
import { TeamInitializer } from '@/components/TeamInitializer'
import { FloatingContactButton } from '@/components/FloatingContactButton'
import { GlobalSearch } from '@/components/GlobalSearch'
import { BackToTopButton } from '@/components/BackToTopButton'
import type { TeamMember, Product, Video, CaseStudy, Datasheet, NewsItem, Publication } from '@/lib/types'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  
  const [team] = useKV<TeamMember[]>('team', [])
  const [products] = useKV<Product[]>('products', [])
  const [videos] = useKV<Video[]>('videos', [])
  const [caseStudies] = useKV<CaseStudy[]>('caseStudies', [])
  const [datasheets] = useKV<Datasheet[]>('datasheets', [])
  const [news] = useKV<NewsItem[]>('news', [])
  const [publications] = useKV<Publication[]>('publications', [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('pb-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    const stored = localStorage.getItem('pb-theme')
    if (stored) {
      setIsDark(stored === 'dark')
    }
  }, [])

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const renderPage = () => {
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
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProductsInitializer />
      <TeamInitializer />
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} onOpenSearch={() => setIsSearchOpen(true)} isDark={isDark} onToggleTheme={() => setIsDark((prev) => !prev)} />
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
      <FloatingContactButton />
      <GlobalSearch
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        onNavigate={handleNavigate}
        products={products || []}
        team={team || []}
        datasheets={datasheets || []}
        news={news || []}
      />
      <BackToTopButton />
    </div>
  )
}

export default App