import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { BackToTopButton } from '../BackToTopButton'

describe('BackToTopButton', () => {
  let scrollY = 0
  let rafCallback: FrameRequestCallback | null = null

  beforeEach(() => {
    vi.clearAllMocks()
    scrollY = 0

    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      get: () => scrollY,
      configurable: true,
    })

    // Mock window.scrollTo
    window.scrollTo = vi.fn()

    // Mock requestAnimationFrame to be synchronous
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallback = cb
      return 1
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    rafCallback = null
  })

  const triggerScroll = (y: number) => {
    scrollY = y
    act(() => {
      fireEvent.scroll(window)
      // Execute the RAF callback synchronously
      if (rafCallback) {
        rafCallback(performance.now())
        rafCallback = null
      }
    })
  }

  describe('visibility', () => {
    it('is hidden by default when not scrolled', () => {
      render(<BackToTopButton />)
      expect(screen.queryByRole('button', { name: /back to top/i })).not.toBeInTheDocument()
    })

    it('shows when scrollY is greater than 400', () => {
      render(<BackToTopButton />)
      triggerScroll(450)
      expect(screen.getByRole('button', { name: /back to top/i })).toBeInTheDocument()
    })

    it('hides when scrolling back up below threshold', () => {
      render(<BackToTopButton />)
      
      // Scroll down first
      triggerScroll(500)
      expect(screen.getByRole('button', { name: /back to top/i })).toBeInTheDocument()
      
      // Scroll back up
      triggerScroll(200)
      expect(screen.queryByRole('button', { name: /back to top/i })).not.toBeInTheDocument()
    })

    it('shows when scrollY equals exactly 401', () => {
      render(<BackToTopButton />)
      triggerScroll(401)
      expect(screen.getByRole('button', { name: /back to top/i })).toBeInTheDocument()
    })

    it('hides when scrollY equals exactly 400', () => {
      render(<BackToTopButton />)
      triggerScroll(400)
      expect(screen.queryByRole('button', { name: /back to top/i })).not.toBeInTheDocument()
    })
  })

  describe('scroll to top functionality', () => {
    it('scrolls to top when clicked', () => {
      render(<BackToTopButton />)
      triggerScroll(500)
      
      const button = screen.getByRole('button', { name: /back to top/i })
      fireEvent.click(button)
      
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    })
  })

  describe('accessibility', () => {
    it('has accessible label', () => {
      render(<BackToTopButton />)
      triggerScroll(500)
      
      const button = screen.getByRole('button', { name: /back to top/i })
      expect(button).toHaveAttribute('aria-label', 'Back to top')
    })
  })

  describe('cleanup', () => {
    it('removes scroll listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
      
      const { unmount } = render(<BackToTopButton />)
      unmount()
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    })
  })
})
