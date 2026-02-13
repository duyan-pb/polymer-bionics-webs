/**
 * Image Lightbox Component
 *
 * Image viewer overlay with next/prev navigation for image galleries.
 * Sized to roughly 2 cards wide. Uses a portal to avoid style conflicts.
 * Implements focus trapping and preserves existing scroll-lock state.
 *
 * @module components/ImageLightbox
 */

import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { X, CaretLeft, CaretRight } from '@phosphor-icons/react'

export interface ImageLightboxProps {
  /** Array of image URLs in the gallery */
  images: string[]
  /** Index of the currently displayed image (null = closed) */
  currentIndex: number | null
  /** Called when the lightbox should close or navigate */
  onClose: () => void
  /** Called when the user navigates to a different image */
  onNavigate: (index: number) => void
  /** Alt text for the image */
  alt?: string
}

/** Focusable element selector for focus-trap logic */
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Image lightbox with keyboard and button navigation.
 *
 * Features:
 * - Constrained to ~2-card width (max-w-3xl / 768px)
 * - Next/previous arrow buttons when gallery has multiple images
 * - Keyboard navigation (ArrowLeft, ArrowRight, Escape)
 * - Image counter badge (e.g. "2 / 5")
 * - Click backdrop or press X to close
 * - Focus trapping keeps Tab within the lightbox
 * - Preserves scroll-lock state of underlying modals
 */
export function ImageLightbox({ images, currentIndex, onClose, onNavigate, alt = 'Image detail' }: ImageLightboxProps) {
  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < images.length
  const hasMultiple = images.length > 1
  const containerRef = useRef<HTMLDivElement>(null)
  const previousOverflowRef = useRef<string>('')
  const previousActiveRef = useRef<Element | null>(null)
  /** Track whether we already captured the opener state for this "session" */
  const didCaptureRef = useRef(false)

  const goNext = useCallback(() => {
    if (currentIndex === null) { return }
    onNavigate((currentIndex + 1) % images.length)
  }, [currentIndex, images.length, onNavigate])

  const goPrev = useCallback(() => {
    if (currentIndex === null) { return }
    onNavigate((currentIndex - 1 + images.length) % images.length)
  }, [currentIndex, images.length, onNavigate])

  // Open/close lifecycle — only runs when isOpen truly changes
  // Handles scroll-lock preservation and focus restoration
  useEffect(() => {
    if (!isOpen) {
      // Only restore if we previously captured state
      if (didCaptureRef.current) {
        document.body.style.overflow = previousOverflowRef.current
        if (previousActiveRef.current instanceof HTMLElement) {
          previousActiveRef.current.focus()
        }
        didCaptureRef.current = false
      }
      return
    }

    // Capture state once per open session
    previousOverflowRef.current = document.body.style.overflow
    previousActiveRef.current = document.activeElement
    didCaptureRef.current = true
    document.body.style.overflow = 'hidden'

    // Move focus into lightbox
    requestAnimationFrame(() => {
      containerRef.current?.focus()
    })

    return () => {
      // Cleanup on unmount while still open
      if (didCaptureRef.current) {
        document.body.style.overflow = previousOverflowRef.current
        if (previousActiveRef.current instanceof HTMLElement) {
          previousActiveRef.current.focus()
        }
        didCaptureRef.current = false
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when open state truly changes
  }, [isOpen])

  // Keyboard navigation + focus trap — separate effect so it rebinds
  // on goNext/goPrev changes without triggering open/close side-effects
  useEffect(() => {
    if (!isOpen) { return }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'ArrowRight') { goNext(); return }
      if (e.key === 'ArrowLeft') { goPrev(); return }

      // Focus trap on Tab
      if (e.key === 'Tab' && containerRef.current) {
        const focusable = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
        if (focusable.length === 0) { e.preventDefault(); return }

        const first = focusable[0] as HTMLElement
        const last = focusable[focusable.length - 1] as HTMLElement
        const active = document.activeElement

        // If focus is on the container itself (or outside focusable children),
        // redirect to first/last depending on direction
        const isInsideTrap = containerRef.current.contains(active) && active !== containerRef.current
        if (!isInsideTrap) {
          e.preventDefault()
          ;(e.shiftKey ? last : first).focus()
          return
        }

        if (e.shiftKey && active === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => { window.removeEventListener('keydown', handleKey) }
  }, [isOpen, goNext, goPrev, onClose])

  if (!isOpen || currentIndex === null) { return null }

  return createPortal(
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      tabIndex={-1}
    >
      {/* Card-sized container — roughly 2 cards wide */}
      <div
        className="relative w-[90vw] max-w-3xl bg-background rounded-xl shadow-2xl border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with close button + counter */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
          <span className="text-sm text-muted-foreground">
            {hasMultiple ? `${currentIndex + 1} / ${images.length}` : 'Image preview'}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={onClose}
            aria-label="Close image"
          >
            <X size={18} weight="bold" />
          </Button>
        </div>

        {/* Image area */}
        <div className="relative flex items-center justify-center bg-black/5 dark:bg-black/20 p-4">
          {/* Previous button */}
          {hasMultiple && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 z-10 rounded-full h-10 w-10 shadow-md"
              onClick={goPrev}
              aria-label="Previous image"
            >
              <CaretLeft size={22} weight="bold" />
            </Button>
          )}

          <img
            src={images[currentIndex]}
            alt={alt}
            className="max-h-[70vh] w-auto h-auto object-contain select-none rounded-md"
            loading="eager"
            decoding="sync"
            draggable={false}
          />

          {/* Next button */}
          {hasMultiple && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 z-10 rounded-full h-10 w-10 shadow-md"
              onClick={goNext}
              aria-label="Next image"
            >
              <CaretRight size={22} weight="bold" />
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
