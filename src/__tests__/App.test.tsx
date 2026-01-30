import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

// Mock all lazy-loaded page components
vi.mock('../components/HomePage', () => ({
  HomePage: ({ onNavigate }: { onNavigate: (page: string) => void }) => (
    <div data-testid="home-page">
      <button onClick={() => onNavigate('team')}>Go to Team</button>
    </div>
  ),
}))

vi.mock('../components/TeamPage', () => ({
  TeamPage: () => <div data-testid="team-page">Team Page</div>,
}))

vi.mock('../components/ProductsPage', () => ({
  ProductsPage: () => <div data-testid="products-page">Products Page</div>,
}))

vi.mock('../components/MaterialsPage', () => ({
  MaterialsPage: () => <div data-testid="materials-page">Materials Page</div>,
}))

vi.mock('../components/DevicesPage', () => ({
  DevicesPage: () => <div data-testid="devices-page">Devices Page</div>,
}))

vi.mock('../components/CustomPage', () => ({
  CustomPage: () => <div data-testid="custom-page">Custom Page</div>,
}))

vi.mock('../components/InnovationPage', () => ({
  InnovationPage: () => <div data-testid="innovation-page">Innovation Page</div>,
}))

vi.mock('../components/NewsPage', () => ({
  NewsPage: () => <div data-testid="news-page">News Page</div>,
}))

vi.mock('../components/ContactPage', () => ({
  ContactPage: () => <div data-testid="contact-page">Contact Page</div>,
}))

// Mock other components
vi.mock('../components/Navigation', () => ({
  Navigation: () => <nav data-testid="navigation">Navigation</nav>,
}))

vi.mock('../components/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}))

vi.mock('../components/BackToTopButton', () => ({
  BackToTopButton: () => <div data-testid="back-to-top">Back to Top</div>,
}))

vi.mock('../components/FloatingContactButton', () => ({
  FloatingContactButton: () => <div data-testid="floating-contact">Contact</div>,
}))

vi.mock('../components/GlobalSearch', () => ({
  GlobalSearch: () => <div data-testid="global-search">Search</div>,
}))

vi.mock('../components/ConsentBanner', () => ({
  ConsentBanner: () => <div data-testid="consent-banner">Consent</div>,
}))

vi.mock('../components/AnalyticsProvider', () => ({
  AnalyticsProvider: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

// Mock initializers
vi.mock('../components/ProductsInitializer', () => ({
  ProductsInitializer: () => null,
}))

vi.mock('../components/MediaInitializer', () => ({
  MediaInitializer: () => null,
}))

vi.mock('../components/NewsInitializer', () => ({
  NewsInitializer: () => null,
}))

vi.mock('../components/DatasheetsInitializer', () => ({
  DatasheetsInitializer: () => null,
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    main: ({ children, ...props }: React.PropsWithChildren) => <main {...props}>{children}</main>,
    div: ({ children, ...props }: React.PropsWithChildren) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

// Mock sonner
vi.mock('sonner', () => ({
  Toaster: () => null,
}))

// Mock theme hook
vi.mock('../hooks/use-theme', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}))

import App from '../App'

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders the navigation', async () => {
      render(<App />)
      await waitFor(() => {
        expect(screen.getByTestId('navigation')).toBeInTheDocument()
      })
    })

    it('renders the footer', async () => {
      render(<App />)
      await waitFor(() => {
        expect(screen.getByTestId('footer')).toBeInTheDocument()
      })
    })

    it('renders the home page by default', async () => {
      render(<App />)
      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument()
      })
    })

    it('renders back to top button', async () => {
      render(<App />)
      await waitFor(() => {
        expect(screen.getByTestId('back-to-top')).toBeInTheDocument()
      })
    })

    it('renders floating contact button', async () => {
      render(<App />)
      await waitFor(() => {
        expect(screen.getByTestId('floating-contact')).toBeInTheDocument()
      })
    })
  })

  describe('structure', () => {
    it('has proper page structure', async () => {
      render(<App />)
      await waitFor(() => {
        expect(screen.getByTestId('navigation')).toBeInTheDocument()
        expect(screen.getByTestId('home-page')).toBeInTheDocument()
        expect(screen.getByTestId('footer')).toBeInTheDocument()
      })
    })
  })
})
