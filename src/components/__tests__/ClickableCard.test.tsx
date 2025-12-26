/**
 * ClickableCard Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClickableCard } from '../ClickableCard'

describe('ClickableCard', () => {
  const defaultProps = {
    onClick: vi.fn(),
    ariaLabel: 'Test card',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders children correctly', () => {
      render(
        <ClickableCard {...defaultProps}>
          <span>Card content</span>
        </ClickableCard>
      )
      
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('applies aria-label for accessibility', () => {
      render(
        <ClickableCard {...defaultProps}>Content</ClickableCard>
      )
      
      expect(screen.getByRole('button', { name: 'Test card' })).toBeInTheDocument()
    })

    it('has role="button"', () => {
      render(
        <ClickableCard {...defaultProps}>Content</ClickableCard>
      )
      
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('has tabIndex=0 for keyboard focus', () => {
      render(
        <ClickableCard {...defaultProps}>Content</ClickableCard>
      )
      
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('tabindex', '0')
    })
  })

  describe('click handling', () => {
    it('calls onClick when clicked', async () => {
      const handleClick = vi.fn()
      render(
        <ClickableCard onClick={handleClick} ariaLabel="Clickable card">
          Content
        </ClickableCard>
      )
      
      await userEvent.click(screen.getByRole('button'))
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('keyboard navigation', () => {
    it('calls onClick when Enter is pressed', () => {
      const handleClick = vi.fn()
      render(
        <ClickableCard onClick={handleClick} ariaLabel="Keyboard card">
          Content
        </ClickableCard>
      )
      
      const card = screen.getByRole('button')
      fireEvent.keyDown(card, { key: 'Enter' })
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('calls onClick when Space is pressed', () => {
      const handleClick = vi.fn()
      render(
        <ClickableCard onClick={handleClick} ariaLabel="Keyboard card">
          Content
        </ClickableCard>
      )
      
      const card = screen.getByRole('button')
      fireEvent.keyDown(card, { key: ' ' })
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick for other keys', () => {
      const handleClick = vi.fn()
      render(
        <ClickableCard onClick={handleClick} ariaLabel="Keyboard card">
          Content
        </ClickableCard>
      )
      
      const card = screen.getByRole('button')
      fireEvent.keyDown(card, { key: 'Escape' })
      fireEvent.keyDown(card, { key: 'Tab' })
      fireEvent.keyDown(card, { key: 'a' })
      
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('hover styles', () => {
    it('applies hover styles by default', () => {
      render(
        <ClickableCard {...defaultProps}>Content</ClickableCard>
      )
      
      const card = screen.getByRole('button')
      expect(card.className).toContain('hover:')
    })

    it('does not apply hover styles when enableHoverStyles is false', () => {
      render(
        <ClickableCard {...defaultProps} enableHoverStyles={false}>
          Content
        </ClickableCard>
      )
      
      const card = screen.getByRole('button')
      // Should not contain the CARD_HOVER_CLASSES which has hover:shadow-2xl
      expect(card.className).not.toContain('hover:shadow-2xl')
    })
  })

  describe('custom className', () => {
    it('accepts and applies custom className', () => {
      render(
        <ClickableCard {...defaultProps} className="custom-class">
          Content
        </ClickableCard>
      )
      
      const card = screen.getByRole('button')
      expect(card.className).toContain('custom-class')
    })
  })

  describe('focus styles', () => {
    it('has focus-visible styles', () => {
      render(
        <ClickableCard {...defaultProps}>Content</ClickableCard>
      )
      
      const card = screen.getByRole('button')
      expect(card.className).toContain('focus-visible:')
    })
  })
})
