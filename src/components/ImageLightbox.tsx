/**
 * Image Lightbox Component
 *
 * Image viewer overlay with next/prev navigation for image galleries.
 * Sized to roughly 2 cards wide. Uses a portal to avoid style conflicts.
 *
 * @module components/ImageLightbox
 */

import { useCallback, useEffect } from 'react'
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

/**
 * Image lightbox with keyboard and button navigation.
 *
 * Features:
 * - Constrained to ~2-card width (max-w-3xl / 768px)
 * - Next/previous arrow buttons when gallery has multiple images
 * - Keyboard navigation (ArrowLeft, ArrowRight, Escape)
 * - Image counter badge (e.g. "2 / 5")
 * - Click backdrop or press X to close
 */
export function ImageLightbox({ images, currentIndex, onClose, onNavigate, alt = 'Image detail' }: ImageLightboxProps) {
  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < images.length
  const hasMultiple = images.length > 1

  const goNext = useCallback(() => {
    if (currentIndex === null) { return }
    onNavigate((currentIndex + 1) % images.length)
  }, [currentIndex, images.length, onNavigate])

  const goPrev = useCallback(() => {
    if (currentIndex === null) { return }
    onNavigate((currentIndex - 1 + images.length) % images.length)
  }, [currentIndex, images.length, onNavigate])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) { return }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose() }
      if (e.key === 'ArrowRight') { goNext() }
      if (e.key === 'ArrowLeft') { goPrev() }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, goNext, goPrev, onClose])

  if (!isOpen || currentIndex === null) { return null }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
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
