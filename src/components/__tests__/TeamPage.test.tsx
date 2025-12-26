/**
 * TeamPage Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TeamPage } from '../TeamPage'
import type { TeamMember } from '@/lib/types'

// Mock useKV hook
vi.mock('@github/spark/hooks', () => ({
  useKV: <T,>(key: string, initialValue: T): [T, (v: T) => void] => [initialValue, vi.fn()],
}))

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
    <div onClick={onClick} role="button" aria-label={ariaLabel} data-testid="clickable-card">
      {children}
    </div>
  ),
}))

// Mock Dialog components
vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) => open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2 data-testid="dialog-title">{children}</h2>,
}))

describe('TeamPage', () => {
  const mockTeam: TeamMember[] = [
    {
      id: 'member-1',
      name: 'Dr. Jane Smith',
      role: 'Chief Executive Officer',
      title: 'CEO & Co-Founder',
      bio: 'Dr. Smith has over 20 years of experience in biomedical research.',
      shortBio: 'CEO with 20+ years of experience',
      category: 'founders',
      imageUrl: '/images/team/jane-smith.jpg',
      linkedIn: 'https://linkedin.com/in/janesmith',
    },
    {
      id: 'member-2',
      name: 'Dr. John Doe',
      role: 'Chief Technology Officer',
      title: 'CTO & Co-Founder',
      bio: 'Dr. Doe leads our technology development team.',
      shortBio: 'CTO leading technology development',
      category: 'founders',
      linkedIn: 'https://linkedin.com/in/johndoe',
    },
    {
      id: 'member-3',
      name: 'Alice Johnson',
      role: 'Senior Researcher',
      title: 'Lead Scientist',
      bio: 'Alice specializes in polymer chemistry.',
      shortBio: 'Polymer chemistry specialist',
      category: 'research',
    },
    {
      id: 'member-4',
      name: 'Bob Williams',
      role: 'Engineer',
      title: 'Senior Engineer',
      bio: 'Bob designs manufacturing processes.',
      shortBio: 'Manufacturing process designer',
      category: 'engineering',
    },
  ]

  const mockOnNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders page hero with title', () => {
      render(<TeamPage team={mockTeam} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByTestId('page-hero')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1, name: 'Our Team' })).toBeInTheDocument()
    })

    it('renders team member cards', () => {
      render(<TeamPage team={mockTeam} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('Dr. John Doe')).toBeInTheDocument()
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
      expect(screen.getByText('Bob Williams')).toBeInTheDocument()
    })

    it('displays team member roles', () => {
      render(<TeamPage team={mockTeam} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText('CEO & Co-Founder')).toBeInTheDocument()
      expect(screen.getByText('CTO & Co-Founder')).toBeInTheDocument()
    })

    it('displays team member short bios', () => {
      render(<TeamPage team={mockTeam} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText('CEO with 20+ years of experience')).toBeInTheDocument()
      expect(screen.getByText('Polymer chemistry specialist')).toBeInTheDocument()
    })

    it('renders member images when available', () => {
      render(<TeamPage team={mockTeam} onNavigate={mockOnNavigate} />)
      
      const images = screen.getAllByRole('img')
      expect(images.length).toBeGreaterThan(0)
    })
  })

  describe('category grouping', () => {
    it('groups team members by category', () => {
      render(<TeamPage team={mockTeam} onNavigate={mockOnNavigate} />)
      
      // Should render category headers
      expect(screen.getByText('Founders')).toBeInTheDocument()
    })
  })

  describe('member selection', () => {
    it('opens member dialog on card click', async () => {
      render(<TeamPage team={mockTeam} onNavigate={mockOnNavigate} />)
      
      const cards = screen.getAllByTestId('clickable-card')
      await userEvent.click(cards[0])
      
      await waitFor(() => {
        expect(screen.getByTestId('dialog')).toBeInTheDocument()
      })
    })

    it('displays selected member name in dialog', async () => {
      render(<TeamPage team={mockTeam} onNavigate={mockOnNavigate} />)
      
      const cards = screen.getAllByTestId('clickable-card')
      await userEvent.click(cards[0])
      
      await waitFor(() => {
        expect(screen.getByTestId('dialog-title')).toBeInTheDocument()
      })
    })
  })

  describe('loading state', () => {
    it('handles empty team array as loading state', () => {
      render(<TeamPage team={[]} onNavigate={mockOnNavigate} />)
      
      // Should show page hero even with empty data
      expect(screen.getByTestId('page-hero')).toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    it('handles empty team array gracefully', () => {
      render(<TeamPage team={[]} onNavigate={mockOnNavigate} />)
      
      // Should not crash and should show page hero
      expect(screen.getByTestId('page-hero')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('all team cards have aria labels', () => {
      render(<TeamPage team={mockTeam} onNavigate={mockOnNavigate} />)
      
      const cards = screen.getAllByTestId('clickable-card')
      cards.forEach(card => {
        expect(card).toHaveAttribute('aria-label')
      })
    })

    it('team member images have lazy loading', () => {
      render(<TeamPage team={mockTeam} onNavigate={mockOnNavigate} />)
      
      const images = screen.getAllByRole('img')
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy')
      })
    })
  })
})
