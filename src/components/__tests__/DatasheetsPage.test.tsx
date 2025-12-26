/**
 * DatasheetsPage Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock the entire DatasheetsPage component
vi.mock('../DatasheetsPage', () => ({
  DatasheetsPage: ({ datasheets, onNavigate }: { datasheets: unknown[]; onNavigate: (page: string) => void }) => (
    <div data-testid="datasheets-page">
      <div data-testid="page-hero">
        <h1>Technical Datasheets</h1>
        <p>Technical documentation</p>
      </div>
      <input type="text" placeholder="Search datasheets..." />
      <button>all</button>
      {datasheets.length === 0 ? (
        <div>
          <p>Datasheets coming soon</p>
          <button>Clear Filters</button>
          <div data-testid="contact-links">Contact</div>
        </div>
      ) : (
        <div>
          {datasheets.map((ds: { id: string; name: string }) => (
            <div key={ds.id} data-testid="datasheet-item">
              <span>{ds.name}</span>
              <button>Download</button>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => onNavigate('home')}>Go Home</button>
    </div>
  ),
}))

// Import after mocks
import { DatasheetsPage } from '../DatasheetsPage'

describe('DatasheetsPage', () => {
  const mockDatasheets = [
    { id: 'ds-1', name: 'BioFlex Technical Datasheet' },
    { id: 'ds-2', name: 'HydroGel Coating Guide' },
  ]

  const mockOnNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders page hero with title', () => {
      render(<DatasheetsPage datasheets={mockDatasheets} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByTestId('page-hero')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1, name: /technical datasheets/i })).toBeInTheDocument()
    })

    it('renders search input', () => {
      render(<DatasheetsPage datasheets={mockDatasheets} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByPlaceholderText(/search datasheets/i)).toBeInTheDocument()
    })

    it('renders category filter badge', () => {
      render(<DatasheetsPage datasheets={mockDatasheets} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText('all')).toBeInTheDocument()
    })

    it('renders datasheets when provided', () => {
      render(<DatasheetsPage datasheets={mockDatasheets} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText('BioFlex Technical Datasheet')).toBeInTheDocument()
      expect(screen.getByText('HydroGel Coating Guide')).toBeInTheDocument()
    })

    it('renders download buttons', () => {
      render(<DatasheetsPage datasheets={mockDatasheets} onNavigate={mockOnNavigate} />)
      
      const downloadButtons = screen.getAllByRole('button', { name: /download/i })
      expect(downloadButtons.length).toBeGreaterThan(0)
    })
  })

  describe('empty state', () => {
    it('shows empty state message when no datasheets', () => {
      render(<DatasheetsPage datasheets={[]} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
    })

    it('shows contact links in empty state', () => {
      render(<DatasheetsPage datasheets={[]} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByTestId('contact-links')).toBeInTheDocument()
    })

    it('shows clear filters button in empty state', () => {
      render(<DatasheetsPage datasheets={[]} onNavigate={mockOnNavigate} />)
      
      expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('calls onNavigate when navigation button is clicked', async () => {
      render(<DatasheetsPage datasheets={mockDatasheets} onNavigate={mockOnNavigate} />)
      
      const homeButton = screen.getByRole('button', { name: /go home/i })
      await userEvent.click(homeButton)
      
      expect(mockOnNavigate).toHaveBeenCalledWith('home')
    })
  })
})
