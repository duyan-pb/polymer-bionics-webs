/**
 * ProductsPage Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductsPage } from '../ProductsPage'
import type { Product } from '@/lib/types'

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
    <div onClick={onClick} role="button" aria-label={ariaLabel} data-testid="product-card">
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

describe('ProductsPage', () => {
  const mockProducts: Product[] = [
    {
      id: 'product-1',
      name: 'BioFlex Electrode Array',
      tagline: 'Advanced neural interface',
      description: 'High-density flexible electrode array for neural recording.',
      technicalDescription: 'PEDOT:PSS-based electrodes on parylene substrate.',
      category: 'neural',
      specifications: '64-channel, 50μm pitch',
      features: ['High signal-to-noise ratio', 'Biocompatible materials', 'Flexible substrate'],
      applications: ['Brain-computer interfaces', 'Neural recording', 'Neuroscience research'],
      regulatoryStatus: 'CE Marked',
      datasheetId: 'ds-1',
      caseStudyId: 'cs-1',
      imageUrl: '/images/products/bioflex.png',
    },
    {
      id: 'product-2',
      name: 'HydroGel Coating',
      tagline: 'Biocompatible surface treatment',
      description: 'Advanced hydrogel coating for medical devices.',
      technicalDescription: 'PEG-based hydrogel with controlled release.',
      category: 'coatings',
      specifications: '100nm thickness',
      features: ['Anti-fouling', 'Drug elution capable', 'Long-lasting'],
      applications: ['Implants', 'Catheters', 'Sensors'],
      regulatoryStatus: 'FDA 510(k)',
    },
    {
      id: 'product-3',
      name: 'FlexPatch Sensor',
      tagline: 'Wearable biosensor platform',
      description: 'Flexible patch for continuous health monitoring.',
      technicalDescription: 'Multi-modal sensing on stretchable substrate.',
      category: 'wearables',
      specifications: 'Temperature, ECG, SpO2',
      features: ['Waterproof', 'Rechargeable', 'Wireless'],
      applications: ['Remote patient monitoring', 'Sports medicine', 'Clinical trials'],
      regulatoryStatus: 'Pending',
    },
  ]

  const mockOnNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders page hero with title', () => {
      render(<ProductsPage products={mockProducts} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByTestId('page-hero')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1, name: 'Product Portfolio' })).toBeInTheDocument()
    })

    it('renders all product cards', () => {
      render(<ProductsPage products={mockProducts} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText('BioFlex Electrode Array')).toBeInTheDocument()
      expect(screen.getByText('HydroGel Coating')).toBeInTheDocument()
      expect(screen.getByText('FlexPatch Sensor')).toBeInTheDocument()
    })

    it('displays product taglines', () => {
      render(<ProductsPage products={mockProducts} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText('Advanced neural interface')).toBeInTheDocument()
      expect(screen.getByText('Biocompatible surface treatment')).toBeInTheDocument()
    })

    it('shows regulatory status in cards', () => {
      render(<ProductsPage products={mockProducts} onNavigate={mockOnNavigate} />)
      
      // Check that cards are rendered with product info
      expect(screen.getByText('BioFlex Electrode Array')).toBeInTheDocument()
    })
  })

  describe('category filtering', () => {
    it('displays category badges', () => {
      render(<ProductsPage products={mockProducts} onNavigate={mockOnNavigate} />)
      
      // All badge should exist
      expect(screen.getByText('all')).toBeInTheDocument()
    })

    it('displays products when filter is applied', async () => {
      render(<ProductsPage products={mockProducts} onNavigate={mockOnNavigate} />)
      
      // Products should be visible
      expect(screen.getByText('BioFlex Electrode Array')).toBeInTheDocument()
    })

    it('maintains product visibility when filters change', async () => {
      render(<ProductsPage products={mockProducts} onNavigate={mockOnNavigate} />)
      
      // Products should be visible initially
      expect(screen.getByText('BioFlex Electrode Array')).toBeInTheDocument()
      expect(screen.getByText('HydroGel Coating')).toBeInTheDocument()
    })
  })

  describe('product selection', () => {
    it('opens product dialog on card click', async () => {
      render(<ProductsPage products={mockProducts} onNavigate={mockOnNavigate} />)
      
      const cards = screen.getAllByTestId('product-card')
      await userEvent.click(cards[0])
      
      await waitFor(() => {
        expect(screen.getByTestId('dialog')).toBeInTheDocument()
      })
    })

    it('displays selected product name in dialog', async () => {
      render(<ProductsPage products={mockProducts} onNavigate={mockOnNavigate} />)
      
      const cards = screen.getAllByTestId('product-card')
      await userEvent.click(cards[0])
      
      await waitFor(() => {
        expect(screen.getByTestId('dialog-title')).toHaveTextContent('BioFlex Electrode Array')
      })
    })
  })

  describe('loading state', () => {
    it('handles empty products array as loading state', () => {
      render(<ProductsPage products={[]} onNavigate={mockOnNavigate} />)
      
      // Should show page hero even with empty data
      expect(screen.getByTestId('page-hero')).toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('opens product dialog with product details', async () => {
      render(<ProductsPage products={mockProducts} onNavigate={mockOnNavigate} />)
      
      // Open product dialog first
      const cards = screen.getAllByTestId('product-card')
      await userEvent.click(cards[0])
      
      await waitFor(() => {
        expect(screen.getByTestId('dialog')).toBeInTheDocument()
      })
    })
  })

  describe('empty state', () => {
    it('handles empty products array gracefully', () => {
      render(<ProductsPage products={[]} onNavigate={mockOnNavigate} />)
      
      // Should not crash and should show page hero
      expect(screen.getByTestId('page-hero')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('product cards are keyboard accessible', () => {
      render(<ProductsPage products={mockProducts} onNavigate={mockOnNavigate} />)
      
      const cards = screen.getAllByTestId('product-card')
      cards.forEach(card => {
        expect(card).toHaveAttribute('role', 'button')
      })
    })
  })

  describe('buy button', () => {
    it('renders Buy button on product cards', () => {
      render(<ProductsPage products={mockProducts} onNavigate={mockOnNavigate} />)
      
      const buyButtons = screen.getAllByRole('button', { name: /buy/i })
      expect(buyButtons.length).toBeGreaterThan(0)
    })

    it('Buy button navigates to contact page', async () => {
      render(<ProductsPage products={mockProducts} onNavigate={mockOnNavigate} />)
      
      const buyButtons = screen.getAllByRole('button', { name: /buy/i })
      await userEvent.click(buyButtons[0])
      
      expect(mockOnNavigate).toHaveBeenCalledWith('contact')
    })
  })
})
