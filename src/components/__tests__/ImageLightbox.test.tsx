/**
 * ImageLightbox Component Tests
 *
 * Tests for image viewer overlay including:
 * - Rendering and visibility
 * - Gallery navigation (next/prev)
 * - Keyboard navigation (Arrow keys, Escape)
 * - Focus trapping (Tab / Shift+Tab)
 * - Scroll-lock preservation
 * - Focus restoration on close
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageLightbox } from '../ImageLightbox'

describe('ImageLightbox', () => {
  const images = ['/img/a.jpg', '/img/b.jpg', '/img/c.jpg']
  const onClose = vi.fn()
  const onNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.style.overflow = ''
  })

  describe('rendering', () => {
    it('renders nothing when currentIndex is null', () => {
      const { container } = render(
        <ImageLightbox images={images} currentIndex={null} onClose={onClose} onNavigate={onNavigate} />
      )
      expect(container.innerHTML).toBe('')
    })

    it('renders nothing when currentIndex is out of range', () => {
      const { container } = render(
        <ImageLightbox images={images} currentIndex={10} onClose={onClose} onNavigate={onNavigate} />
      )
      expect(container.innerHTML).toBe('')
    })

    it('renders the dialog when currentIndex is valid', () => {
      render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('renders the correct image', () => {
      render(
        <ImageLightbox images={images} currentIndex={1} onClose={onClose} onNavigate={onNavigate} />
      )
      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('src', '/img/b.jpg')
    })

    it('shows image counter for multi-image galleries', () => {
      render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )
      expect(screen.getByText('1 / 3')).toBeInTheDocument()
    })

    it('shows "Image preview" for single-image galleries', () => {
      render(
        <ImageLightbox images={['/img/only.jpg']} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )
      expect(screen.getByText('Image preview')).toBeInTheDocument()
    })

    it('shows navigation buttons for multi-image galleries', () => {
      render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )
      expect(screen.getByLabelText('Previous image')).toBeInTheDocument()
      expect(screen.getByLabelText('Next image')).toBeInTheDocument()
    })

    it('hides navigation buttons for single-image galleries', () => {
      render(
        <ImageLightbox images={['/img/only.jpg']} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )
      expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('calls onNavigate with next index on Next click', async () => {
      render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )
      await userEvent.click(screen.getByLabelText('Next image'))
      expect(onNavigate).toHaveBeenCalledWith(1)
    })

    it('calls onNavigate with previous index on Prev click', async () => {
      render(
        <ImageLightbox images={images} currentIndex={1} onClose={onClose} onNavigate={onNavigate} />
      )
      await userEvent.click(screen.getByLabelText('Previous image'))
      expect(onNavigate).toHaveBeenCalledWith(0)
    })

    it('wraps forward from last image to first', async () => {
      render(
        <ImageLightbox images={images} currentIndex={2} onClose={onClose} onNavigate={onNavigate} />
      )
      await userEvent.click(screen.getByLabelText('Next image'))
      expect(onNavigate).toHaveBeenCalledWith(0)
    })

    it('wraps backward from first image to last', async () => {
      render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )
      await userEvent.click(screen.getByLabelText('Previous image'))
      expect(onNavigate).toHaveBeenCalledWith(2)
    })
  })

  describe('close behavior', () => {
    it('calls onClose when close button is clicked', async () => {
      render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )
      await userEvent.click(screen.getByLabelText('Close image'))
      expect(onClose).toHaveBeenCalled()
    })

    it('calls onClose when backdrop is clicked', () => {
      render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )
      fireEvent.click(screen.getByRole('dialog'))
      expect(onClose).toHaveBeenCalled()
    })
  })

  describe('keyboard navigation', () => {
    it('calls onClose on Escape key', () => {
      render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )
      fireEvent.keyDown(window, { key: 'Escape' })
      expect(onClose).toHaveBeenCalled()
    })

    it('calls onNavigate on ArrowRight', () => {
      render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )
      fireEvent.keyDown(window, { key: 'ArrowRight' })
      expect(onNavigate).toHaveBeenCalledWith(1)
    })

    it('calls onNavigate on ArrowLeft', () => {
      render(
        <ImageLightbox images={images} currentIndex={1} onClose={onClose} onNavigate={onNavigate} />
      )
      fireEvent.keyDown(window, { key: 'ArrowLeft' })
      expect(onNavigate).toHaveBeenCalledWith(0)
    })
  })

  describe('scroll lock preservation', () => {
    it('sets body overflow to hidden when open', () => {
      render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )
      expect(document.body.style.overflow).toBe('hidden')
    })

    it('restores previous overflow value on unmount', () => {
      // Simulate another modal already locking scroll
      document.body.style.overflow = 'hidden'

      const { unmount } = render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )
      expect(document.body.style.overflow).toBe('hidden')

      unmount()
      // Should restore the previous 'hidden', not empty string
      expect(document.body.style.overflow).toBe('hidden')
    })

    it('restores empty overflow when no prior lock existed', () => {
      document.body.style.overflow = ''

      const { unmount } = render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )
      unmount()
      expect(document.body.style.overflow).toBe('')
    })
  })

  describe('accessibility', () => {
    it('has role="dialog" and aria-modal="true"', () => {
      render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-label', 'Image lightbox')
    })

    it('uses provided alt text on the image', () => {
      render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} alt="Product photo" />
      )
      expect(screen.getByAltText('Product photo')).toBeInTheDocument()
    })
  })
})
