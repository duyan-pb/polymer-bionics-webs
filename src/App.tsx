/**
 * Main Application Component
 * 
 * Root component that handles:
 * - Page routing and navigation
 * - Theme management
 * - Analytics and consent integration
 * 
 * Static data (team, products, etc.) is imported directly from source files.
 * No localStorage caching - data is always fresh from the build.
 * 
 * @module App
 */

import { useState, useCallback, useEffect, lazy, Suspense, type ReactElement } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { HomePage } from '@/components/HomePage'
import { FloatingContactButton } from '@/components/FloatingContactButton'
import { BackToTopButton } from '@/components/BackToTopButton'
import { AnalyticsProvider } from '@/components/AnalyticsProvider'
import { ConsentBanner } from '@/components/ConsentBanner'
import { useTheme } from '@/hooks/use-theme'
import { usePageTracking } from '@/lib/analytics/hooks'
import { PAGE_TRANSITION } from '@/lib/constants'

// Import static data directly - no caching, always fresh from build
import { teamMembers } from '@/lib/team-data'
import { initialProducts } from '@/lib/seed-data'
import { devices } from '@/lib/devices-data'
import { customSolutions } from '@/lib/custom-data'
import { innovations } from '@/lib/innovation-data'
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
const ProductsPage = lazy(() => import('@/components/ProductsPage').then(m => ({ default: m.ProductsPage })))
const DevicesPage = lazy(() => import('@/components/DevicesPage').then(m => ({ default: m.DevicesPage })))
const CustomPage = lazy(() => import('@/components/CustomPage').then(m => ({ default: m.CustomPage })))
const InnovationPage = lazy(() => import('@/components/InnovationPage').then(m => ({ default: m.InnovationPage })))
const NewsPage = lazy(() => import('@/components/NewsPage').then(m => ({ default: m.NewsPage })))
const ContactPage = lazy(() => import('@/components/ContactPage').then(m => ({ default: m.ContactPage })))
const PaymentPage = lazy(() => import('@/components/PaymentPage').then(m => ({ default: m.PaymentPage })))
const GlobalSearch = lazy(() => import('@/components/GlobalSearch').then(m => ({ default: m.GlobalSearch })))

// =============================================================================
// COMPONENTS
// =============================================================================

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
  const [paymentDraft, setPaymentDraft] = useState<{ product: string; quantity: string } | null>(null)
  const { isDark, toggleTheme } = useTheme()
  
  // Track page views when currentPage changes
  usePageTracking(currentPage)
  
  // Static data - imported directly, no caching needed
  const team = teamMembers
  const products = initialProducts
  const news = placeholderNews
  const publications = placeholderPublications

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
    document.body.dataset.page = currentPage
  }, [currentPage])

  // Preload ALL pages and images immediately after first render for instant navigation
  useEffect(() => {
    const preloadAllPages = () => {
      // Preload all page chunks in parallel
      Promise.all([
        import('@/components/TeamPage'),
        import('@/components/MaterialsPage'),
        import('@/components/ProductsPage'),
        import('@/components/DevicesPage'),
        import('@/components/CustomPage'),
        import('@/components/InnovationPage'),
        import('@/components/NewsPage'),
        import('@/components/ContactPage'),
        import('@/components/PaymentPage'),
        import('@/components/GlobalSearch'),
      ]).catch(() => {
        // Silently ignore preload failures - pages will load on demand
      })
    }

    const preloadAllImages = () => {
      // Import all optimized images and preload them into browser cache
      const imageImports = import.meta.glob('@/assets/images/optimized/*.webp', { eager: true, query: '?url', import: 'default' })
      
      Object.values(imageImports).forEach((src) => {
        if (typeof src === 'string') {
          const img = new Image()
          img.src = src
        }
      })
      
      // Also preload the logo
      import('@/assets/images/logo-nav.webp').then((module) => {
        const img = new Image()
        img.src = module.default
      }).catch(() => {})
    }

    // Start preloading immediately after first paint
    // Using requestAnimationFrame ensures we don't block initial render
    requestAnimationFrame(() => {
      preloadAllPages()
      preloadAllImages()
    })
  }, [])

  const pageRenderers: Record<string, () => ReactElement> = {
    home: () => <HomePage onNavigate={handleNavigate} />,
    team: () => <TeamPage team={team} onNavigate={handleNavigate} />,
    materials: () => <MaterialsPage onNavigate={handleNavigate} />,
    products: () => <ProductsPage products={products} onNavigate={handleNavigate} onSetPaymentDraft={setPaymentDraft} />,
    devices: () => <DevicesPage onNavigate={handleNavigate} />,
    custom: () => <CustomPage onNavigate={handleNavigate} />,
    innovation: () => <InnovationPage onNavigate={handleNavigate} />,
    news: () => <NewsPage news={news} publications={publications} onNavigate={handleNavigate} />,
    contact: () => <ContactPage onNavigate={handleNavigate} />,
    payment: () => <PaymentPage onNavigate={handleNavigate} products={products} paymentDraft={paymentDraft} />,
  }

  const renderPage = () => {
    // Home is guaranteed to exist as fallback for unknown routes
    const pageRenderer = pageRenderers[currentPage] ?? pageRenderers['home']
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- home always exists in pageRenderers
    const pageContent = pageRenderer!()

    // HomePage is eagerly loaded, others are lazy
    if (currentPage === 'home') {return pageContent}
    // Use null fallback for instant page switch (pages are preloaded on idle)
    return <Suspense fallback={null}>{pageContent}</Suspense>
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
              products={products}
              team={team}
              devices={devices}
              customSolutions={customSolutions}
              innovations={innovations}
              news={news}
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