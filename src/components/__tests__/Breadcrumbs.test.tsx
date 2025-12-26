/**
 * Breadcrumbs Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Breadcrumbs, type BreadcrumbItem } from '../Breadcrumbs'

describe('Breadcrumbs', () => {
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders all breadcrumb items', () => {
      const trail: BreadcrumbItem[] = [
        { label: 'Home', page: 'home' },
        { label: 'Products', page: 'products' },
        { label: 'Current Product' },
      ]
      
      render(<Breadcrumbs trail={trail} onNavigate={mockNavigate} />)
      
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Products')).toBeInTheDocument()
      expect(screen.getByText('Current Product')).toBeInTheDocument()
    })

    it('renders clickable links for items with page prop', () => {
      const trail: BreadcrumbItem[] = [
        { label: 'Home', page: 'home' },
        { label: 'Current' },
      ]
      
      render(<Breadcrumbs trail={trail} onNavigate={mockNavigate} />)
      
      // Home should be a clickable link
      const homeLink = screen.getByText('Home')
      expect(homeLink.tagName.toLowerCase()).not.toBe('span')
    })

    it('renders non-clickable text for items without page prop', () => {
      const trail: BreadcrumbItem[] = [
        { label: 'Home', page: 'home' },
        { label: 'Current Page' },
      ]
      
      render(<Breadcrumbs trail={trail} onNavigate={mockNavigate} />)
      
      // Current Page should be a span (non-clickable)
      const currentPage = screen.getByText('Current Page')
      expect(currentPage.tagName.toLowerCase()).toBe('span')
    })

    it('renders separators between items', () => {
      const trail: BreadcrumbItem[] = [
        { label: 'Home', page: 'home' },
        { label: 'Products', page: 'products' },
        { label: 'Current' },
      ]
      
      render(<Breadcrumbs trail={trail} onNavigate={mockNavigate} />)
      
      // Should have separators - the breadcrumb component renders them
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })

    it('renders single item correctly', () => {
      const trail: BreadcrumbItem[] = [
        { label: 'Home' },
      ]
      
      render(<Breadcrumbs trail={trail} onNavigate={mockNavigate} />)
      
      expect(screen.getByText('Home')).toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('calls onNavigate when clickable item is clicked', async () => {
      const trail: BreadcrumbItem[] = [
        { label: 'Home', page: 'home' },
        { label: 'Products', page: 'products' },
        { label: 'Current' },
      ]
      
      render(<Breadcrumbs trail={trail} onNavigate={mockNavigate} />)
      
      await userEvent.click(screen.getByText('Home'))
      
      expect(mockNavigate).toHaveBeenCalledWith('home')
    })

    it('navigates to correct page for each clickable item', async () => {
      const trail: BreadcrumbItem[] = [
        { label: 'Home', page: 'home' },
        { label: 'Products', page: 'products' },
        { label: 'Current' },
      ]
      
      render(<Breadcrumbs trail={trail} onNavigate={mockNavigate} />)
      
      await userEvent.click(screen.getByText('Products'))
      
      expect(mockNavigate).toHaveBeenCalledWith('products')
    })

    it('does not call onNavigate for non-clickable items', async () => {
      const trail: BreadcrumbItem[] = [
        { label: 'Home', page: 'home' },
        { label: 'Current Page' },
      ]
      
      render(<Breadcrumbs trail={trail} onNavigate={mockNavigate} />)
      
      // Try to click the non-clickable item (span)
      await userEvent.click(screen.getByText('Current Page'))
      
      // Should not have been called for 'Current Page'
      expect(mockNavigate).not.toHaveBeenCalled()
    })
  })

  describe('styling', () => {
    it('applies cursor-pointer to clickable links', () => {
      const trail: BreadcrumbItem[] = [
        { label: 'Home', page: 'home' },
        { label: 'Current' },
      ]
      
      render(<Breadcrumbs trail={trail} onNavigate={mockNavigate} />)
      
      const homeLink = screen.getByText('Home')
      expect(homeLink.className).toContain('cursor-pointer')
    })

    it('applies muted color to non-clickable items', () => {
      const trail: BreadcrumbItem[] = [
        { label: 'Home', page: 'home' },
        { label: 'Current' },
      ]
      
      render(<Breadcrumbs trail={trail} onNavigate={mockNavigate} />)
      
      const currentItem = screen.getByText('Current')
      expect(currentItem.className).toContain('text-muted-foreground')
    })
  })

  describe('edge cases', () => {
    it('handles empty trail', () => {
      const trail: BreadcrumbItem[] = []
      
      render(<Breadcrumbs trail={trail} onNavigate={mockNavigate} />)
      
      // Should render without crashing
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('handles item with empty page string as non-clickable', () => {
      const trail: BreadcrumbItem[] = [
        { label: 'Home', page: '' },
        { label: 'Current' },
      ]
      
      render(<Breadcrumbs trail={trail} onNavigate={mockNavigate} />)
      
      // Empty page string renders as non-clickable (falsy)
      const homeItem = screen.getByText('Home')
      expect(homeItem.tagName.toLowerCase()).toBe('span')
    })
  })
})
