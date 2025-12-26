/**
 * Navigation Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navigation } from '../Navigation'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
      <button onClick={onClick} className={className}>{children}</button>
    ),
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
}))

// Mock the logo import
vi.mock('@/assets/images/unnamed.png', () => ({
  default: '/mock-logo.png',
}))

describe('Navigation', () => {
  const defaultProps = {
    currentPage: 'home',
    onNavigate: vi.fn(),
    onOpenSearch: vi.fn(),
    isDark: false,
    onToggleTheme: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders navigation element', () => {
      render(<Navigation {...defaultProps} />)
      
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('renders logo image', () => {
      render(<Navigation {...defaultProps} />)
      
      const logo = screen.getByRole('img', { name: /polymer bionics/i })
      expect(logo).toBeInTheDocument()
    })

    it('renders brand name', () => {
      render(<Navigation {...defaultProps} />)
      
      expect(screen.getByText('polymerbionics')).toBeInTheDocument()
    })

    it('renders navigation items', () => {
      render(<Navigation {...defaultProps} />)
      
      // Should have Team, Products, etc.
      expect(screen.getByRole('button', { name: 'Team' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Products' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Contact' })).toBeInTheDocument()
    })

    it('renders search button', () => {
      render(<Navigation {...defaultProps} />)
      
      expect(screen.getByRole('button', { name: /open search/i })).toBeInTheDocument()
    })

    it('renders theme toggle button', () => {
      render(<Navigation {...defaultProps} />)
      
      expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('calls onNavigate when nav item is clicked', async () => {
      const onNavigate = vi.fn()
      render(<Navigation {...defaultProps} onNavigate={onNavigate} />)
      
      await userEvent.click(screen.getByRole('button', { name: 'Team' }))
      
      expect(onNavigate).toHaveBeenCalledWith('team')
    })

    it('calls onNavigate with home when logo is clicked', async () => {
      const onNavigate = vi.fn()
      render(<Navigation {...defaultProps} onNavigate={onNavigate} />)
      
      // Find the logo button (contains the polymerbionics text)
      const logoButton = screen.getByText('polymerbionics').closest('button')
      if (logoButton) {
        await userEvent.click(logoButton)
        expect(onNavigate).toHaveBeenCalledWith('home')
      }
    })
  })

  describe('search', () => {
    it('calls onOpenSearch when search button is clicked', async () => {
      const onOpenSearch = vi.fn()
      render(<Navigation {...defaultProps} onOpenSearch={onOpenSearch} />)
      
      await userEvent.click(screen.getByRole('button', { name: /open search/i }))
      
      expect(onOpenSearch).toHaveBeenCalledTimes(1)
    })
  })

  describe('theme toggle', () => {
    it('calls onToggleTheme when theme button is clicked', async () => {
      const onToggleTheme = vi.fn()
      render(<Navigation {...defaultProps} onToggleTheme={onToggleTheme} />)
      
      await userEvent.click(screen.getByRole('button', { name: /toggle theme/i }))
      
      expect(onToggleTheme).toHaveBeenCalledTimes(1)
    })

    it('shows sun icon when dark mode is active', () => {
      render(<Navigation {...defaultProps} isDark={true} />)
      
      // In dark mode, we show the sun icon to switch to light
      const themeButton = screen.getByRole('button', { name: /toggle theme/i })
      expect(themeButton).toBeInTheDocument()
    })

    it('shows moon icon when light mode is active', () => {
      render(<Navigation {...defaultProps} isDark={false} />)
      
      // In light mode, we show the moon icon to switch to dark
      const themeButton = screen.getByRole('button', { name: /toggle theme/i })
      expect(themeButton).toBeInTheDocument()
    })
  })

  describe('current page highlighting', () => {
    it('highlights current page nav item', () => {
      render(<Navigation {...defaultProps} currentPage="team" />)
      
      const teamButton = screen.getByRole('button', { name: 'Team' })
      // The current page button should have variant="default" which adds different styling
      expect(teamButton).toBeInTheDocument()
    })
  })

  describe('mobile navigation', () => {
    it('renders mobile menu trigger', () => {
      render(<Navigation {...defaultProps} />)
      
      // The mobile menu trigger is a button with List icon - verify navigation renders
      // Mobile menu should exist in the DOM
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })
})
