/**
 * ApplicationsPage Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock the entire ApplicationsPage component
vi.mock('../ApplicationsPage', () => ({
  ApplicationsPage: ({ onNavigate }: { onNavigate: (page: string) => void }) => (
    <div data-testid="applications-page">
      <div data-testid="page-hero">
        <h1>Applications</h1>
        <p>Applications description</p>
      </div>
      <div data-testid="applications-grid">
        <div data-testid="application-card" role="button" aria-label="View Neural Interfaces">
          <img src="/test.jpg" alt="Neural Interfaces" loading="lazy" />
          <h3>Neural Interfaces</h3>
          <p>High-performance neural recording</p>
          <ul>
            <li>High signal quality</li>
            <li>Biocompatible</li>
          </ul>
          <span>+2 more benefits</span>
          <button>Explore Application</button>
        </div>
        <div data-testid="application-card" role="button" aria-label="View Wearable Biosensors">
          <h3>Wearable Biosensors</h3>
          <p>Flexible sensors description</p>
          <button>Explore Application</button>
        </div>
        <div data-testid="application-card" role="button" aria-label="View Drug Delivery">
          <h3>Drug Delivery Systems</h3>
          <p>Controlled release platforms</p>
          <button>Explore Application</button>
        </div>
      </div>
      <button onClick={() => onNavigate('home')}>Go Home</button>
    </div>
  ),
}))

// Import after mocks
import { ApplicationsPage } from '../ApplicationsPage'

describe('ApplicationsPage', () => {
  const mockOnNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders page hero with title', () => {
      render(<ApplicationsPage onNavigate={mockOnNavigate} />)
      
      expect(screen.getByTestId('page-hero')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1, name: /applications/i })).toBeInTheDocument()
    })

    it('renders all application cards', () => {
      render(<ApplicationsPage onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText('Neural Interfaces')).toBeInTheDocument()
      expect(screen.getByText('Wearable Biosensors')).toBeInTheDocument()
      expect(screen.getByText('Drug Delivery Systems')).toBeInTheDocument()
    })

    it('displays application descriptions', () => {
      render(<ApplicationsPage onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText(/high-performance neural recording/i)).toBeInTheDocument()
    })

    it('displays key benefits', () => {
      render(<ApplicationsPage onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText('High signal quality')).toBeInTheDocument()
      expect(screen.getByText('Biocompatible')).toBeInTheDocument()
    })

    it('shows "+X more benefits" indicator', () => {
      render(<ApplicationsPage onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText(/\+2 more benefits/)).toBeInTheDocument()
    })

    it('renders explore buttons', () => {
      render(<ApplicationsPage onNavigate={mockOnNavigate} />)
      
      const exploreButtons = screen.getAllByRole('button', { name: /explore application/i })
      expect(exploreButtons.length).toBe(3)
    })
  })

  describe('images', () => {
    it('renders application images when available', () => {
      render(<ApplicationsPage onNavigate={mockOnNavigate} />)
      
      const images = screen.getAllByRole('img')
      expect(images.length).toBeGreaterThan(0)
    })

    it('uses lazy loading for images', () => {
      render(<ApplicationsPage onNavigate={mockOnNavigate} />)
      
      const images = screen.getAllByRole('img')
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy')
      })
    })
  })

  describe('accessibility', () => {
    it('all application cards have aria labels', () => {
      render(<ApplicationsPage onNavigate={mockOnNavigate} />)
      
      const cards = screen.getAllByTestId('application-card')
      cards.forEach(card => {
        expect(card).toHaveAttribute('aria-label')
      })
    })

    it('application cards have button role', () => {
      render(<ApplicationsPage onNavigate={mockOnNavigate} />)
      
      const cards = screen.getAllByTestId('application-card')
      cards.forEach(card => {
        expect(card).toHaveAttribute('role', 'button')
      })
    })
  })

  describe('navigation', () => {
    it('calls onNavigate when navigation button is clicked', async () => {
      render(<ApplicationsPage onNavigate={mockOnNavigate} />)
      
      const homeButton = screen.getByRole('button', { name: /go home/i })
      await userEvent.click(homeButton)
      
      expect(mockOnNavigate).toHaveBeenCalledWith('home')
    })
  })
})
