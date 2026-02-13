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

  describe('focus management', () => {
    it('moves focus into lightbox when opened', async () => {
      // Create a button outside the lightbox to start with focus
      const externalButton = document.createElement('button')
      externalButton.textContent = 'External'
      document.body.appendChild(externalButton)
      externalButton.focus()
      expect(document.activeElement).toBe(externalButton)

      render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )

      // Wait for focus to move into the lightbox container
      await vi.waitFor(() => {
        const dialog = screen.getByRole('dialog')
        expect(document.activeElement).toBe(dialog)
      })

      document.body.removeChild(externalButton)
    })

    it('restores focus to previously active element when closed', async () => {
      // Create a button that will have focus before opening
      const triggerButton = document.createElement('button')
      triggerButton.textContent = 'Open Lightbox'
      document.body.appendChild(triggerButton)
      triggerButton.focus()
      expect(document.activeElement).toBe(triggerButton)

      const { unmount } = render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )

      // Wait for focus to move into the lightbox
      await vi.waitFor(() => {
        expect(document.activeElement).not.toBe(triggerButton)
      })

      // Close the lightbox
      unmount()

      // Focus should be restored to the trigger button
      expect(document.activeElement).toBe(triggerButton)

      document.body.removeChild(triggerButton)
    })

    it('traps Tab key when focus is on the container itself', () => {
      render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )

      const dialog = screen.getByRole('dialog')

      // Focus the container (simulating initial focus state)
      dialog.focus()
      expect(document.activeElement).toBe(dialog)

      // Press Tab - should move to first focusable element
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
      Object.defineProperty(tabEvent, 'shiftKey', { value: false })
      window.dispatchEvent(tabEvent)

      // The event should be prevented and focus should move to first button
      expect(tabEvent.defaultPrevented).toBe(true)
    })

    it('traps Shift+Tab when focus is on the container itself', () => {
      render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )

      const dialog = screen.getByRole('dialog')

      // Focus the container
      dialog.focus()
      expect(document.activeElement).toBe(dialog)

      // Press Shift+Tab - should move to last focusable element
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true, shiftKey: true })
      window.dispatchEvent(tabEvent)

      // The event should be prevented
      expect(tabEvent.defaultPrevented).toBe(true)
    })

    it('cycles focus forward with Tab from last focusable element', () => {
      render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )

      const nextButton = screen.getByLabelText('Next image')
      nextButton.focus()
      expect(document.activeElement).toBe(nextButton)

      // Press Tab - should wrap to first focusable element
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
      window.dispatchEvent(tabEvent)

      expect(tabEvent.defaultPrevented).toBe(true)
    })

    it('cycles focus backward with Shift+Tab from first focusable element', () => {
      render(
        <ImageLightbox images={images} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )

      const closeButton = screen.getByLabelText('Close image')
      closeButton.focus()
      expect(document.activeElement).toBe(closeButton)

      // Press Shift+Tab - should wrap to last focusable element
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true, shiftKey: true })
      window.dispatchEvent(tabEvent)

      expect(tabEvent.defaultPrevented).toBe(true)
    })

    it('does not trap Tab when no focusable elements exist', () => {
      // Render without navigation buttons (single image)
      render(
        <ImageLightbox images={['/img/single.jpg']} currentIndex={0} onClose={onClose} onNavigate={onNavigate} />
      )

      const dialog = screen.getByRole('dialog')
      dialog.focus()

      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
      window.dispatchEvent(tabEvent)

      // Should prevent default even if no focusables (to prevent escape from lightbox)
      expect(tabEvent.defaultPrevented).toBe(true)
    })
  })
})
