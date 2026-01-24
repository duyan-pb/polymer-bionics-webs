import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroImage } from '../HeroImage'

describe('HeroImage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders a div with role="img"', () => {
      render(<HeroImage src="/test-image.jpg" />)
      const imgDiv = screen.getByRole('img')
      expect(imgDiv).toBeInTheDocument()
    })

    it('sets background-image style with correct src', () => {
      render(<HeroImage src="/test-image.jpg" />)
      const imgDiv = screen.getByRole('img')
      expect(imgDiv).toHaveStyle({ backgroundImage: 'url(/test-image.jpg)' })
    })

    it('has no aria-label by default (decorative image)', () => {
      render(<HeroImage src="/test-image.jpg" />)
      const imgDiv = screen.getByRole('img')
      expect(imgDiv).not.toHaveAttribute('aria-label')
    })

    it('sets aria-label when alt text is provided', () => {
      render(<HeroImage src="/test-image.jpg" alt="Test image" />)
      const imgDiv = screen.getByRole('img')
      expect(imgDiv).toHaveAttribute('aria-label', 'Test image')
    })
  })

  describe('opacity behavior', () => {
    it('uses default opacity of 0.15', () => {
      render(<HeroImage src="/test-image.jpg" />)
      const imgDiv = screen.getByRole('img')
      expect(imgDiv).toHaveStyle({ opacity: '0.15' })
    })

    it('accepts custom opacity prop', () => {
      render(<HeroImage src="/test-image.jpg" opacity={0.5} />)
      const imgDiv = screen.getByRole('img')
      expect(imgDiv).toHaveStyle({ opacity: '0.5' })
    })
  })

  describe('styling', () => {
    it('applies positioning classes', () => {
      render(<HeroImage src="/test-image.jpg" />)
      const imgDiv = screen.getByRole('img')
      expect(imgDiv).toHaveClass('absolute', 'inset-0', 'w-full', 'h-full')
    })

    it('applies background classes', () => {
      render(<HeroImage src="/test-image.jpg" />)
      const imgDiv = screen.getByRole('img')
      expect(imgDiv).toHaveClass('bg-cover', 'bg-center', 'bg-no-repeat')
    })

    it('accepts custom className', () => {
      render(<HeroImage src="/test-image.jpg" className="custom-class" />)
      const imgDiv = screen.getByRole('img')
      expect(imgDiv).toHaveClass('custom-class')
    })
  })

  describe('priority prop', () => {
    it('accepts priority prop without error (API compatibility)', () => {
      // priority prop is kept for API compatibility but not used
      expect(() => render(<HeroImage src="/test-image.jpg" priority />)).not.toThrow()
    })
  })
})
