/**
 * MediaPage Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MediaPage } from '../MediaPage'
import type { Video, CaseStudy } from '@/lib/types'

// Mock PageHero
vi.mock('@/components/PageHero', () => ({
  PageHero: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="page-hero">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
}))

// Mock ClickableCard
vi.mock('@/components/ClickableCard', () => ({
  ClickableCard: ({ children, onClick, ariaLabel }: { children: React.ReactNode; onClick?: () => void; ariaLabel?: string }) => (
    <div onClick={onClick} role="button" aria-label={ariaLabel} data-testid="media-card">
      {children}
    </div>
  ),
}))

// Mock ContactLinks
vi.mock('@/components/ContactLinks', () => ({
  ContactLinks: () => <div data-testid="contact-links">Contact Links</div>,
}))

// Mock Dialog components
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) => open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2 data-testid="dialog-title">{children}</h2>,
}))

describe('MediaPage', () => {
  const mockVideos: Video[] = [
    {
      id: 'video-1',
      title: 'Introduction to BioFlex',
      description: 'An overview of our flagship electrode array technology.',
      category: 'product-demo',
      videoUrl: 'https://youtube.com/watch?v=abc123',
      thumbnailUrl: '/images/videos/bioflex-intro.jpg',
      duration: '5:32',
    },
    {
      id: 'video-2',
      title: 'Manufacturing Process',
      description: 'See how we create precision polymer devices.',
      category: 'manufacturing',
      videoUrl: 'https://youtube.com/watch?v=def456',
      duration: '8:45',
    },
    {
      id: 'video-3',
      title: 'Clinical Trial Results',
      description: 'Key findings from our Phase II clinical trial.',
      category: 'research',
      videoUrl: 'https://youtube.com/watch?v=ghi789',
      duration: '12:15',
    },
  ]

  const mockCaseStudies: CaseStudy[] = [
    {
      id: 'case-1',
      title: 'Neural Interface for Parkinson\'s Treatment',
      summary: 'Successful implantation and 12-month follow-up.',
      challenge: 'Precise deep brain stimulation with minimal tissue damage.',
      solution: 'Our flexible PEDOT:PSS electrode array.',
      results: 'Significant improvement in motor symptoms.',
      category: 'neural',
      productId: 'product-1',
    },
    {
      id: 'case-2',
      title: 'Wearable ECG Monitoring in Athletes',
      summary: 'Continuous heart monitoring during training.',
      challenge: 'Accurate measurement during high-intensity exercise.',
      solution: 'FlexPatch with advanced motion artifact rejection.',
      results: '99.2% correlation with clinical ECG.',
      category: 'wearables',
      productId: 'product-3',
    },
  ]

  const mockOnNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders page hero with title', () => {
      render(<MediaPage videos={mockVideos} caseStudies={mockCaseStudies} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByTestId('page-hero')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1, name: /videos & case studies/i })).toBeInTheDocument()
    })

    it('renders tabs for videos and case studies', () => {
      render(<MediaPage videos={mockVideos} caseStudies={mockCaseStudies} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByRole('tab', { name: /videos/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /case studies/i })).toBeInTheDocument()
    })

    it('shows videos tab by default', () => {
      render(<MediaPage videos={mockVideos} caseStudies={mockCaseStudies} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByRole('tab', { name: /videos/i, selected: true })).toBeInTheDocument()
    })

    it('renders all video cards', () => {
      render(<MediaPage videos={mockVideos} caseStudies={mockCaseStudies} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText('Introduction to BioFlex')).toBeInTheDocument()
      expect(screen.getByText('Manufacturing Process')).toBeInTheDocument()
      expect(screen.getByText('Clinical Trial Results')).toBeInTheDocument()
    })

    it('displays video durations', () => {
      render(<MediaPage videos={mockVideos} caseStudies={mockCaseStudies} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText('5:32')).toBeInTheDocument()
      expect(screen.getByText('8:45')).toBeInTheDocument()
    })

    it('displays video categories', () => {
      render(<MediaPage videos={mockVideos} caseStudies={mockCaseStudies} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText('product-demo')).toBeInTheDocument()
      expect(screen.getByText('manufacturing')).toBeInTheDocument()
    })
  })

  describe('tab switching', () => {
    it('switches to case studies tab', async () => {
      render(<MediaPage videos={mockVideos} caseStudies={mockCaseStudies} onNavigate={mockOnNavigate} />)
      
      const caseStudiesTab = screen.getByRole('tab', { name: /case studies/i })
      await userEvent.click(caseStudiesTab)
      
      expect(screen.getByRole('tab', { name: /case studies/i, selected: true })).toBeInTheDocument()
    })

    it('shows case study cards when tab is selected', async () => {
      render(<MediaPage videos={mockVideos} caseStudies={mockCaseStudies} onNavigate={mockOnNavigate} />)
      
      const caseStudiesTab = screen.getByRole('tab', { name: /case studies/i })
      await userEvent.click(caseStudiesTab)
      
      expect(screen.getByText(/neural interface for parkinson/i)).toBeInTheDocument()
      expect(screen.getByText(/wearable ecg monitoring/i)).toBeInTheDocument()
    })
  })

  describe('video selection', () => {
    it('opens video dialog on card click', async () => {
      render(<MediaPage videos={mockVideos} caseStudies={mockCaseStudies} onNavigate={mockOnNavigate} />)
      
      const cards = screen.getAllByTestId('media-card')
      await userEvent.click(cards[0])
      
      await waitFor(() => {
        expect(screen.getByTestId('dialog')).toBeInTheDocument()
      })
    })

    it('displays selected video title in dialog', async () => {
      render(<MediaPage videos={mockVideos} caseStudies={mockCaseStudies} onNavigate={mockOnNavigate} />)
      
      const cards = screen.getAllByTestId('media-card')
      await userEvent.click(cards[0])
      
      await waitFor(() => {
        expect(screen.getByTestId('dialog-title')).toHaveTextContent('Introduction to BioFlex')
      })
    })
  })

  describe('case study selection', () => {
    it('opens case study dialog on card click', async () => {
      render(<MediaPage videos={mockVideos} caseStudies={mockCaseStudies} onNavigate={mockOnNavigate} />)
      
      // Switch to case studies tab
      const caseStudiesTab = screen.getByRole('tab', { name: /case studies/i })
      await userEvent.click(caseStudiesTab)
      
      // Click on case study card
      const cards = screen.getAllByTestId('media-card')
      await userEvent.click(cards[0])
      
      await waitFor(() => {
        expect(screen.getByTestId('dialog')).toBeInTheDocument()
      })
    })
  })

  describe('empty states', () => {
    it('shows videos coming soon message when videos array is empty', () => {
      render(<MediaPage videos={[]} caseStudies={mockCaseStudies} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText(/videos coming soon/i)).toBeInTheDocument()
      expect(screen.getByTestId('contact-links')).toBeInTheDocument()
    })

    it('shows case studies coming soon message when case studies array is empty', async () => {
      render(<MediaPage videos={mockVideos} caseStudies={[]} onNavigate={mockOnNavigate} />)
      
      const caseStudiesTab = screen.getByRole('tab', { name: /case studies/i })
      await userEvent.click(caseStudiesTab)
      
      expect(screen.getByText(/case studies coming soon/i)).toBeInTheDocument()
      expect(screen.getByTestId('contact-links')).toBeInTheDocument()
    })

    it('shows both coming soon messages when all arrays are empty', async () => {
      render(<MediaPage videos={[]} caseStudies={[]} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText(/videos coming soon/i)).toBeInTheDocument()
      
      const caseStudiesTab = screen.getByRole('tab', { name: /case studies/i })
      await userEvent.click(caseStudiesTab)
      
      expect(screen.getByText(/case studies coming soon/i)).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('video cards have aria labels', () => {
      render(<MediaPage videos={mockVideos} caseStudies={mockCaseStudies} onNavigate={mockOnNavigate} />)
      
      const cards = screen.getAllByTestId('media-card')
      cards.forEach(card => {
        expect(card).toHaveAttribute('aria-label')
      })
    })

    it('tabs are keyboard navigable', async () => {
      render(<MediaPage videos={mockVideos} caseStudies={mockCaseStudies} onNavigate={mockOnNavigate} />)
      
      const videosTab = screen.getByRole('tab', { name: /videos/i })
      videosTab.focus()
      
      expect(document.activeElement).toBe(videosTab)
    })
  })
})
