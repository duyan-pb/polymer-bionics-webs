import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

// Mock child components to simplify testing
vi.mock('@/components/PageHero', () => ({
  PageHero: ({ title, description }: { title: string; description: string }) => (
    <div data-testid="page-hero">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
}))

vi.mock('@/components/ClickableCard', () => ({
  ClickableCard: ({ 
    children, 
    onClick, 
    ariaLabel 
  }: React.PropsWithChildren<{ onClick?: () => void; ariaLabel?: string }>) => (
    <div 
      data-testid="clickable-card" 
      onClick={onClick}
      aria-label={ariaLabel}
      role="button"
    >
      {children}
    </div>
  ),
}))

vi.mock('@/components/ContactLinks', () => ({
  ContactLinks: () => <div data-testid="contact-links">Contact Links</div>,
}))

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ 
    children, 
    open 
  }: React.PropsWithChildren<{ open: boolean }>) => 
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: React.PropsWithChildren) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: React.PropsWithChildren) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: React.PropsWithChildren) => (
    <h2 data-testid="dialog-title">{children}</h2>
  ),
}))

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}))

vi.mock('@/components/ui/separator', () => ({
  Separator: () => <hr />,
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: React.PropsWithChildren) => (
    <span data-testid="badge">{children}</span>
  ),
}))

// Mock the materials data
vi.mock('@/lib/materials-data', () => ({
  materials: [
    {
      id: 'mat1',
      name: 'Test Material 1',
      description: 'A test material description',
      properties: ['Property 1', 'Property 2', 'Property 3'],
      keyAdvantages: ['Advantage 1', 'Advantage 2'],
      relevantMaterials: [],
      imageUrl: '/test.jpg',
    },
    {
      id: 'mat2',
      name: 'Test Material 2',
      description: 'Another test material',
      properties: ['Prop A', 'Prop B'],
      keyAdvantages: ['Adv 1'],
      relevantMaterials: [],
      imageClass: 'bg-gradient-test',
    },
  ],
}))

import { MaterialsPage } from '../MaterialsPage'

describe('MaterialsPage', () => {
  const mockOnNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders the page hero', () => {
      render(<MaterialsPage onNavigate={mockOnNavigate} />)
      expect(screen.getByTestId('page-hero')).toBeInTheDocument()
    })

    it('renders page title', () => {
      render(<MaterialsPage onNavigate={mockOnNavigate} />)
      expect(screen.getByText('Our Materials')).toBeInTheDocument()
    })

    it('renders material cards', () => {
      render(<MaterialsPage onNavigate={mockOnNavigate} />)
      expect(screen.getAllByTestId('clickable-card')).toHaveLength(2)
    })

    it('displays material names', () => {
      render(<MaterialsPage onNavigate={mockOnNavigate} />)
      expect(screen.getByText('Test Material 1')).toBeInTheDocument()
      expect(screen.getByText('Test Material 2')).toBeInTheDocument()
    })

    it('displays material descriptions', () => {
      render(<MaterialsPage onNavigate={mockOnNavigate} />)
      expect(screen.getByText('A test material description')).toBeInTheDocument()
      expect(screen.getByText('Another test material')).toBeInTheDocument()
    })

    it('displays property badges', () => {
      render(<MaterialsPage onNavigate={mockOnNavigate} />)
      const badges = screen.getAllByTestId('badge')
      expect(badges.length).toBeGreaterThan(0)
    })
  })

  describe('material selection', () => {
    it('opens material dialog on card click', async () => {
      const user = userEvent.setup()
      render(<MaterialsPage onNavigate={mockOnNavigate} />)
      
      const cards = screen.getAllByTestId('clickable-card')
      await user.click(cards[0])
      
      expect(screen.getByTestId('dialog')).toBeInTheDocument()
    })

    it('displays selected material name in dialog', async () => {
      const user = userEvent.setup()
      render(<MaterialsPage onNavigate={mockOnNavigate} />)
      
      const cards = screen.getAllByTestId('clickable-card')
      await user.click(cards[0])
      
      expect(screen.getByTestId('dialog-title')).toHaveTextContent('Test Material 1')
    })
  })

  describe('accessibility', () => {
    it('material cards have aria labels', () => {
      render(<MaterialsPage onNavigate={mockOnNavigate} />)
      const cards = screen.getAllByTestId('clickable-card')
      expect(cards[0]).toHaveAttribute('aria-label', 'View details for Test Material 1')
    })
  })
})
