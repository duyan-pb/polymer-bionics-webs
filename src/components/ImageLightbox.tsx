/**
 * Image Lightbox Component
 *
 * Full-screen image viewer with next/prev navigation for image galleries.
 * Used across Products, Devices, Custom, Materials, and Innovation pages.
 *
 * @module components/ImageLightbox
 */

import { useCallback, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
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
 * Full-screen image lightbox with keyboard and button navigation.
 *
 * Features:
 * - Double-sized display (fills viewport)
 * - Next/previous arrow buttons when gallery has multiple images
 * - Keyboard navigation (ArrowLeft, ArrowRight, Escape)
 * - Image counter badge (e.g. "2 / 5")
 * - Click outside or press X to close
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
      if (e.key === 'ArrowRight') { goNext() }
      if (e.key === 'ArrowLeft') { goPrev() }
    }

    window.addEventListener('keydown', handleKey)
    return () => { window.removeEventListener('keydown', handleKey) }
  }, [isOpen, goNext, goPrev])

  if (!isOpen || currentIndex === null) { return null }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-[90vw] h-[90vh] p-0 bg-black/95 border-none [&>button]:hidden">
        <div className="relative flex items-center justify-center w-full h-full">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 rounded-full"
            onClick={onClose}
            aria-label="Close image"
          >
            <X size={24} weight="bold" />
          </Button>

          {/* Previous button */}
          {hasMultiple && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 z-10 text-white hover:bg-white/20 rounded-full h-12 w-12"
              onClick={goPrev}
              aria-label="Previous image"
            >
              <CaretLeft size={32} weight="bold" />
            </Button>
          )}

          {/* Image */}
          <img
            src={images[currentIndex]}
            alt={alt}
            className="max-w-[85vw] max-h-[85vh] object-contain select-none"
            loading="eager"
            decoding="sync"
            draggable={false}
          />

          {/* Next button */}
          {hasMultiple && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 z-10 text-white hover:bg-white/20 rounded-full h-12 w-12"
              onClick={goNext}
              aria-label="Next image"
            >
              <CaretRight size={32} weight="bold" />
            </Button>
          )}

          {/* Image counter */}
          {hasMultiple && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm bg-black/50 px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
