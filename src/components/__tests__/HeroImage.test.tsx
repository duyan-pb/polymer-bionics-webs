import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<{ className?: string }>) => (
      <div {...props}>{children}</div>
    ),
  },
}))

// Import after mock
import { render, screen, fireEvent } from '@testing-library/react'
import { HeroImage } from '../HeroImage'

describe('HeroImage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Helper to find the image element using aria-hidden attribute
  const findImage = (container: HTMLElement) => container.querySelector('img')

  describe('rendering', () => {
    it('renders an image element', () => {
      const { container } = render(<HeroImage src="/test-image.jpg" />)
      const img = findImage(container)
      expect(img).toBeInTheDocument()
    })

    it('sets correct src attribute', () => {
      const { container } = render(<HeroImage src="/test-image.jpg" />)
      const img = findImage(container)
      expect(img).toHaveAttribute('src', '/test-image.jpg')
    })

    it('uses empty alt text by default', () => {
      const { container } = render(<HeroImage src="/test-image.jpg" />)
      const img = findImage(container)
      expect(img).toHaveAttribute('alt', '')
    })

    it('sets custom alt text when provided', () => {
      render(<HeroImage src="/test-image.jpg" alt="Test image" />)
      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('alt', 'Test image')
    })

    it('applies aria-hidden when no alt text', () => {
      const { container } = render(<HeroImage src="/test-image.jpg" />)
      const img = findImage(container)
      expect(img).toHaveAttribute('aria-hidden', 'true')
    })

    it('does not apply aria-hidden when alt text provided', () => {
      render(<HeroImage src="/test-image.jpg" alt="Test" />)
      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('aria-hidden', 'false')
    })
  })

  describe('loading behavior', () => {
    it('uses lazy loading by default', () => {
      const { container } = render(<HeroImage src="/test-image.jpg" />)
      const img = findImage(container)
      expect(img).toHaveAttribute('loading', 'lazy')
    })

    it('uses eager loading when priority is true', () => {
      const { container } = render(<HeroImage src="/test-image.jpg" priority />)
      const img = findImage(container)
      expect(img).toHaveAttribute('loading', 'eager')
    })

    it('sets high fetchPriority when priority is true', () => {
      const { container } = render(<HeroImage src="/test-image.jpg" priority />)
      const img = findImage(container)
      expect(img).toHaveAttribute('fetchpriority', 'high')
    })

    it('sets auto fetchPriority by default', () => {
      const { container } = render(<HeroImage src="/test-image.jpg" />)
      const img = findImage(container)
      expect(img).toHaveAttribute('fetchpriority', 'auto')
    })

    it('has decoding async attribute', () => {
      const { container } = render(<HeroImage src="/test-image.jpg" />)
      const img = findImage(container)
      expect(img).toHaveAttribute('decoding', 'async')
    })
  })

  describe('image styling', () => {
    it('applies object-cover class', () => {
      const { container } = render(<HeroImage src="/test-image.jpg" />)
      const img = findImage(container)
      expect(img).toHaveClass('object-cover')
    })

    it('applies full width and height classes', () => {
      const { container } = render(<HeroImage src="/test-image.jpg" />)
      const img = findImage(container)
      expect(img).toHaveClass('w-full', 'h-full')
    })
  })

  describe('onLoad behavior', () => {
    it('handles onLoad event', () => {
      const { container } = render(<HeroImage src="/test-image.jpg" />)
      const img = findImage(container)
      expect(img).toBeInTheDocument()
      // Trigger onLoad event
      fireEvent.load(img!)
      // Component should handle this without error
      expect(img).toBeInTheDocument()
    })
  })

  describe('custom props', () => {
    it('accepts custom className', () => {
      const { container } = render(<HeroImage src="/test-image.jpg" className="custom-class" />)
      // The className is applied to the wrapper div, not the img
      const wrapper = findImage(container)?.parentElement
      expect(wrapper).toHaveClass('custom-class')
    })

    it('accepts opacity prop', () => {
      // Opacity is used in the animation state, just ensure it doesn't error
      const { container } = render(<HeroImage src="/test-image.jpg" opacity={0.5} />)
      expect(findImage(container)).toBeInTheDocument()
    })
  })
})
