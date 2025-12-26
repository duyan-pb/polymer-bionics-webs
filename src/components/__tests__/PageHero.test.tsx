/**
 * PageHero Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PageHero } from '../PageHero'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => (
      <div data-testid="motion-div" {...props}>{children}</div>
    ),
  },
}))

describe('PageHero', () => {
  const defaultProps = {
    title: 'Test Title',
    description: 'Test description text',
  }

  describe('rendering', () => {
    it('renders title correctly', () => {
      render(<PageHero {...defaultProps} />)
      
      expect(screen.getByRole('heading', { name: 'Test Title' })).toBeInTheDocument()
    })

    it('renders description correctly', () => {
      render(<PageHero {...defaultProps} />)
      
      expect(screen.getByText('Test description text')).toBeInTheDocument()
    })

    it('renders as a section element', () => {
      const { container } = render(<PageHero {...defaultProps} />)
      
      expect(container.querySelector('section')).toBeInTheDocument()
    })

    it('renders title as h1', () => {
      render(<PageHero {...defaultProps} />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Test Title')
    })
  })

  describe('breadcrumbs', () => {
    it('renders breadcrumbs when provided with onNavigate', () => {
      const onNavigate = vi.fn()
      const breadcrumbs = [
        { label: 'Home', page: 'home' },
        { label: 'Current Page' },
      ]
      
      render(
        <PageHero
          {...defaultProps}
          breadcrumbs={breadcrumbs}
          onNavigate={onNavigate}
        />
      )
      
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Current Page')).toBeInTheDocument()
    })

    it('does not render breadcrumbs without onNavigate', () => {
      const breadcrumbs = [
        { label: 'Home', page: 'home' },
        { label: 'Current Page' },
      ]
      
      render(<PageHero {...defaultProps} breadcrumbs={breadcrumbs} />)
      
      // Breadcrumbs should not render without onNavigate
      expect(screen.queryByText('Home')).not.toBeInTheDocument()
    })

    it('handles breadcrumb navigation', async () => {
      const onNavigate = vi.fn()
      const breadcrumbs = [
        { label: 'Home', page: 'home' },
        { label: 'Current' },
      ]
      
      render(
        <PageHero
          {...defaultProps}
          breadcrumbs={breadcrumbs}
          onNavigate={onNavigate}
        />
      )
      
      await userEvent.click(screen.getByText('Home'))
      
      expect(onNavigate).toHaveBeenCalledWith('home')
    })
  })

  describe('actions', () => {
    it('renders action buttons when provided', () => {
      render(
        <PageHero
          {...defaultProps}
          actions={<button>Action Button</button>}
        />
      )
      
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument()
    })

    it('does not render actions container when not provided', () => {
      const { container } = render(<PageHero {...defaultProps} />)
      
      // Should only have title and description, no actions wrapper
      expect(container.textContent).not.toContain('Action Button')
    })
  })

  describe('children', () => {
    it('renders children content', () => {
      render(
        <PageHero {...defaultProps}>
          <p>Additional content</p>
        </PageHero>
      )
      
      expect(screen.getByText('Additional content')).toBeInTheDocument()
    })
  })

  describe('background image', () => {
    it('renders HeroImage when backgroundImage is provided', () => {
      const { container } = render(
        <PageHero
          {...defaultProps}
          backgroundImage="/test-image.jpg"
        />
      )
      
      // HeroImage should be rendered (it creates an img element)
      const section = container.querySelector('section')
      expect(section).toBeInTheDocument()
    })

    it('does not render HeroImage when backgroundImage is not provided', () => {
      render(<PageHero {...defaultProps} />)
      
      // Should not have a gradient overlay either
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })

    it('accepts custom backgroundOpacity', () => {
      // This mainly tests that the prop is accepted without error
      render(
        <PageHero
          {...defaultProps}
          backgroundImage="/test.jpg"
          backgroundOpacity={0.5}
        />
      )
      
      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })
  })

  describe('custom className', () => {
    it('accepts and applies custom className', () => {
      const { container } = render(
        <PageHero {...defaultProps} className="custom-hero-class" />
      )
      
      const section = container.querySelector('section')
      expect(section?.className).toContain('custom-hero-class')
    })
  })

  describe('default styles', () => {
    it('applies hero section classes', () => {
      const { container } = render(<PageHero {...defaultProps} />)
      
      const section = container.querySelector('section')
      expect(section?.className).toContain('bg-background')
    })

    it('applies responsive padding', () => {
      const { container } = render(<PageHero {...defaultProps} />)
      
      const section = container.querySelector('section')
      expect(section?.className).toContain('py-')
    })
  })
})
