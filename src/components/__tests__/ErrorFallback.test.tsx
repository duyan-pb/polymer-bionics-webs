/**
 * ErrorFallback Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorFallback } from '../../ErrorFallback'

describe('ErrorFallback', () => {
  const mockError = new Error('Test error message')
  const mockResetErrorBoundary = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock import.meta.env.DEV to false for most tests
    vi.stubGlobal('import', { meta: { env: { DEV: false } } })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('rendering in production mode', () => {
    beforeEach(() => {
      // Ensure we're in production mode
      vi.stubEnv('DEV', false)
    })

    it('renders error alert', () => {
      render(
        <ErrorFallback
          error={mockError}
          resetErrorBoundary={mockResetErrorBoundary}
        />
      )
      
      expect(screen.getByText(/encountered a runtime error/i)).toBeInTheDocument()
    })

    it('displays error message', () => {
      render(
        <ErrorFallback
          error={mockError}
          resetErrorBoundary={mockResetErrorBoundary}
        />
      )
      
      expect(screen.getByText('Test error message')).toBeInTheDocument()
    })

    it('renders try again button', () => {
      render(
        <ErrorFallback
          error={mockError}
          resetErrorBoundary={mockResetErrorBoundary}
        />
      )
      
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    })

    it('calls resetErrorBoundary when button is clicked', async () => {
      render(
        <ErrorFallback
          error={mockError}
          resetErrorBoundary={mockResetErrorBoundary}
        />
      )
      
      await userEvent.click(screen.getByRole('button', { name: /try again/i }))
      
      expect(mockResetErrorBoundary).toHaveBeenCalledTimes(1)
    })

    it('displays error details section', () => {
      render(
        <ErrorFallback
          error={mockError}
          resetErrorBoundary={mockResetErrorBoundary}
        />
      )
      
      expect(screen.getByText(/Error Details/)).toBeInTheDocument()
    })

    it('renders with proper layout classes', () => {
      const { container } = render(
        <ErrorFallback
          error={mockError}
          resetErrorBoundary={mockResetErrorBoundary}
        />
      )
      
      const wrapper = container.firstChild
      expect(wrapper).toHaveClass('min-h-screen')
    })

    it('shows contact information', () => {
      render(
        <ErrorFallback
          error={mockError}
          resetErrorBoundary={mockResetErrorBoundary}
        />
      )
      
      expect(screen.getByText(/contact the spark author/i)).toBeInTheDocument()
    })
  })

  describe('error message display', () => {
    it('displays long error messages', () => {
      const longError = new Error('A'.repeat(200))
      
      render(
        <ErrorFallback
          error={longError}
          resetErrorBoundary={mockResetErrorBoundary}
        />
      )
      
      expect(screen.getByText('A'.repeat(200))).toBeInTheDocument()
    })

    it('displays error with special characters', () => {
      const specialError = new Error('Error: <script>alert("xss")</script>')
      
      render(
        <ErrorFallback
          error={specialError}
          resetErrorBoundary={mockResetErrorBoundary}
        />
      )
      
      // React escapes special characters, so it should be displayed as text
      expect(screen.getByText(/Error:.*script/)).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has accessible button', () => {
      render(
        <ErrorFallback
          error={mockError}
          resetErrorBoundary={mockResetErrorBoundary}
        />
      )
      
      const button = screen.getByRole('button', { name: /try again/i })
      expect(button).toBeInTheDocument()
      expect(button).not.toHaveAttribute('aria-hidden', 'true')
    })
  })
})
