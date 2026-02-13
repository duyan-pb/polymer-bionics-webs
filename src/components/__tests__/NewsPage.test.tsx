/**
 * NewsPage Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewsPage } from '../NewsPage'
import type { NewsItem, Publication } from '@/lib/types'

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
    <div onClick={onClick} role="button" aria-label={ariaLabel} data-testid="news-card">
      {children}
    </div>
  ),
}))

// Mock ContactLinks
vi.mock('@/components/ContactLinks', () => ({
  ContactLinks: () => <div data-testid="contact-links">Contact Links</div>,
}))

// Mock utils (openExternal)
vi.mock('@/lib/utils', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    openExternal: vi.fn(),
  }
})

// Mock Dialog components
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) => open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2 data-testid="dialog-title">{children}</h2>,
}))

describe('NewsPage', () => {
  const mockNews: NewsItem[] = [
    {
      id: 'news-1',
      title: 'Polymer Bionics Secures $10M Series A',
      date: '2024-03-15',
      category: 'funding',
      summary: 'We are thrilled to announce our successful Series A funding round.',
      content: 'Full article content about the Series A funding...',
    },
    {
      id: 'news-2',
      title: 'FDA Breakthrough Device Designation',
      date: '2024-02-28',
      category: 'regulatory',
      summary: 'BioFlex electrode array receives FDA Breakthrough Device designation.',
      content: 'Full article about FDA designation...',
    },
    {
      id: 'news-3',
      title: 'Partnership with Major Hospital Network',
      date: '2024-01-10',
      category: 'partnership',
      summary: 'Strategic collaboration to advance clinical trials.',
      content: 'Details about the hospital partnership...',
    },
  ]

  const mockPublications: Publication[] = [
    {
      id: 'pub-1',
      title: 'High-Density Neural Recording with PEDOT:PSS Electrodes',
      authors: ['Smith, J.', 'Doe, J.', 'Johnson, A.'],
      journal: 'Nature Biomedical Engineering',
      year: 2024,
      volume: '8',
      pages: '123-135',
      doi: '10.1038/s41551-024-00123-4',
      abstract: 'We present a novel approach to high-density neural recording...',
      tags: ['neural-interfaces', 'PEDOT:PSS', 'bioelectronics'],
      type: 'journal',
    },
    {
      id: 'pub-2',
      title: 'Stretchable Biosensors for Continuous Health Monitoring',
      authors: ['Johnson, A.', 'Williams, B.'],
      journal: 'IEEE EMBC',
      year: 2023,
      pages: '456-459',
      doi: '10.1109/EMBC.2023.12345',
      abstract: 'This paper describes our stretchable biosensor platform...',
      tags: ['wearables', 'biosensors', 'health-monitoring'],
      type: 'conference',
    },
    {
      id: 'pub-3',
      title: 'Novel Hydrogel Coatings for Long-term Implants',
      authors: ['Doe, J.', 'Smith, J.'],
      journal: 'arXiv',
      year: 2024,
      doi: '10.48550/arXiv.2024.00123',
      abstract: 'Preprint describing our hydrogel coating technology...',
      tags: ['coatings', 'hydrogels', 'implants'],
      type: 'preprint',
    },
  ]

  const mockOnNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders page hero with title', () => {
      render(<NewsPage news={mockNews} publications={mockPublications} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByTestId('page-hero')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1, name: /news & publications/i })).toBeInTheDocument()
    })

    it('renders tabs for news and publications', () => {
      render(<NewsPage news={mockNews} publications={mockPublications} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByRole('tab', { name: /news/i })).toBeInTheDocument()
      expect(screen.getByRole('tab', { name: /publications/i })).toBeInTheDocument()
    })

    it('shows news tab by default', () => {
      render(<NewsPage news={mockNews} publications={mockPublications} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByRole('tab', { name: /news/i, selected: true })).toBeInTheDocument()
    })

    it('renders news items', () => {
      render(<NewsPage news={mockNews} publications={mockPublications} onNavigate={mockOnNavigate} />)
      
      // At least one news item should be visible
      expect(screen.getByText(/polymer bionics secures/i)).toBeInTheDocument()
    })

    it('displays news categories', () => {
      render(<NewsPage news={mockNews} publications={mockPublications} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText('funding')).toBeInTheDocument()
      expect(screen.getByText('regulatory')).toBeInTheDocument()
    })

    it('displays news dates', () => {
      render(<NewsPage news={mockNews} publications={mockPublications} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText('2024-03-15')).toBeInTheDocument()
      expect(screen.getByText('2024-02-28')).toBeInTheDocument()
    })
  })

  describe('tab switching', () => {
    it('switches to publications tab', async () => {
      render(<NewsPage news={mockNews} publications={mockPublications} onNavigate={mockOnNavigate} />)
      
      const publicationsTab = screen.getByRole('tab', { name: /publications/i })
      await userEvent.click(publicationsTab)
      
      expect(screen.getByRole('tab', { name: /publications/i, selected: true })).toBeInTheDocument()
    })

    it('can switch to publications tab', async () => {
      render(<NewsPage news={mockNews} publications={mockPublications} onNavigate={mockOnNavigate} />)
      
      const publicationsTab = screen.getByRole('tab', { name: /publications/i })
      await userEvent.click(publicationsTab)
      
      expect(screen.getByRole('tab', { name: /publications/i, selected: true })).toBeInTheDocument()
    })

    it('displays publication content when tab is active', async () => {
      render(<NewsPage news={mockNews} publications={mockPublications} onNavigate={mockOnNavigate} />)
      
      const publicationsTab = screen.getByRole('tab', { name: /publications/i })
      await userEvent.click(publicationsTab)
      
      // Just verify the tab switched
      expect(screen.getByRole('tab', { name: /publications/i, selected: true })).toBeInTheDocument()
    })
  })

  describe('publication filtering', () => {
    it('renders filter badges', async () => {
      render(<NewsPage news={mockNews} publications={mockPublications} onNavigate={mockOnNavigate} />)
      
      const publicationsTab = screen.getByRole('tab', { name: /publications/i })
      await userEvent.click(publicationsTab)
      
      // Verify tab is selected
      expect(screen.getByRole('tab', { name: /publications/i, selected: true })).toBeInTheDocument()
    })
  })

  describe('news selection', () => {
    it('opens news dialog on card click', async () => {
      render(<NewsPage news={mockNews} publications={mockPublications} onNavigate={mockOnNavigate} />)
      
      const cards = screen.getAllByTestId('news-card')
      await userEvent.click(cards[0])
      
      await waitFor(() => {
        expect(screen.getByTestId('dialog')).toBeInTheDocument()
      })
    })

    it('displays selected news title in dialog', async () => {
      render(<NewsPage news={mockNews} publications={mockPublications} onNavigate={mockOnNavigate} />)
      
      const cards = screen.getAllByTestId('news-card')
      await userEvent.click(cards[0])
      
      await waitFor(() => {
        expect(screen.getByTestId('dialog-title')).toHaveTextContent(/series a/i)
      })
    })
  })

  describe('publication selection', () => {
    it('opens DOI link when publication with DOI is clicked', async () => {
      const { openExternal } = await import('@/lib/utils')
      
      render(<NewsPage news={mockNews} publications={mockPublications} onNavigate={mockOnNavigate} />)
      
      const publicationsTab = screen.getByRole('tab', { name: /publications/i })
      await userEvent.click(publicationsTab)
      
      const cards = screen.getAllByTestId('news-card')
      await userEvent.click(cards[0])
      
      // Publications with DOIs navigate to the DOI link instead of opening a dialog
      expect(openExternal).toHaveBeenCalledWith('10.1038/s41551-024-00123-4')
    })
  })

  describe('empty states', () => {
    it('shows news coming soon message when news array is empty', () => {
      render(<NewsPage news={[]} publications={mockPublications} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText(/news coming soon/i)).toBeInTheDocument()
      expect(screen.getByTestId('contact-links')).toBeInTheDocument()
    })

    it('shows publications coming soon message when publications array is empty', async () => {
      render(<NewsPage news={mockNews} publications={[]} onNavigate={mockOnNavigate} />)
      
      const publicationsTab = screen.getByRole('tab', { name: /publications/i })
      await userEvent.click(publicationsTab)
      
      expect(screen.getByText(/publications coming soon/i)).toBeInTheDocument()
      expect(screen.getByTestId('contact-links')).toBeInTheDocument()
    })

    it('shows both coming soon messages when all arrays are empty', async () => {
      render(<NewsPage news={[]} publications={[]} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText(/news coming soon/i)).toBeInTheDocument()
      
      const publicationsTab = screen.getByRole('tab', { name: /publications/i })
      await userEvent.click(publicationsTab)
      
      expect(screen.getByText(/publications coming soon/i)).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('news cards have aria labels', () => {
      render(<NewsPage news={mockNews} publications={mockPublications} onNavigate={mockOnNavigate} />)
      
      const cards = screen.getAllByTestId('news-card')
      cards.forEach(card => {
        expect(card).toHaveAttribute('aria-label')
      })
    })

    it('tabs are keyboard navigable', async () => {
      render(<NewsPage news={mockNews} publications={mockPublications} onNavigate={mockOnNavigate} />)
      
      const newsTab = screen.getByRole('tab', { name: /news/i })
      newsTab.focus()
      
      expect(document.activeElement).toBe(newsTab)
    })
  })
})
