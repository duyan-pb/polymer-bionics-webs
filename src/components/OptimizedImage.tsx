/**
 * Optimized Image Component
 * 
 * A performance-optimized image component with:
 * - Native lazy loading
 * - Loading state with blur placeholder
 * - Error handling with fallback
 * - IntersectionObserver for deferred loading
 * - Aspect ratio preservation
 * 
 * @module components/OptimizedImage
 */

import { useState, useRef, useEffect, memo, type ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  /** Image source URL */
  src: string
  /** Alt text for accessibility */
  alt: string
  /** Optional aspect ratio (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string
  /** Optional placeholder color or blur hash */
  placeholder?: string
  /** Priority loading - skip lazy loading for above-the-fold images */
  priority?: boolean
  /** Custom class for the container */
  containerClassName?: string
  /** Callback when image loads successfully */
  onLoadComplete?: () => void
  /** Callback when image fails to load */
  onLoadError?: () => void
}

/**
 * Performance-optimized image component.
 * 
 * Features:
 * - Uses native loading="lazy" for browser-level lazy loading
 * - Shows a loading placeholder while image loads
 * - Handles error states gracefully
 * - Supports priority loading for critical images
 * - Maintains aspect ratio to prevent layout shift
 * 
 * @example
 * ```tsx
 * <OptimizedImage
 *   src="/images/hero.jpg"
 *   alt="Hero image"
 *   aspectRatio="16/9"
 *   priority
 * />
 * ```
 */
export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  aspectRatio,
  placeholder = 'bg-muted',
  priority = false,
  containerClassName,
  onLoadComplete,
  onLoadError,
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Use IntersectionObserver for non-priority images
  useEffect(() => {
    if (priority || isInView) return

    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before viewport
        threshold: 0.01,
      }
    )

    observer.observe(container)

    return () => observer.disconnect()
  }, [priority, isInView])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoadComplete?.()
  }

  const handleError = () => {
    setIsError(true)
    onLoadError?.()
  }

  // Compute aspect ratio style
  const aspectStyle = aspectRatio
    ? { aspectRatio }
    : undefined

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden',
        !isLoaded && !isError && placeholder,
        containerClassName
      )}
      style={aspectStyle}
    >
      {/* Loading skeleton */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 animate-pulse bg-muted/50" />
      )}

      {/* Error fallback */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-muted-foreground text-sm">Failed to load image</span>
        </div>
      )}

      {/* Actual image - only render when in view */}
      {isInView && !isError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          {...props}
        />
      )}
    </div>
  )
})

/**
 * Preload an image programmatically.
 * Useful for preloading images that will be needed soon.
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

/**
 * Preload multiple images in parallel.
 */
export function preloadImages(sources: string[]): Promise<PromiseSettledResult<void>[]> {
  return Promise.allSettled(sources.map(preloadImage))
}
