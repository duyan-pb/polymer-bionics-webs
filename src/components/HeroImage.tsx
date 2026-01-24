/**
 * Hero Image Component
 * 
 * Background image for hero sections with instant display.
 * Uses CSS background-image for immediate rendering without loading flash.
 * 
 * @module components/HeroImage
 */

import { memo } from 'react'
import { cn } from '@/lib/utils'

/**
 * Props for the HeroImage component.
 */
interface HeroImageProps {
  /** Image source URL */
  src: string
  /** Alt text for accessibility (used as aria-label) */
  alt?: string
  /** Image opacity (0-1, default: 0.15) */
  opacity?: number
  /** Additional CSS classes */
  className?: string
  /** Whether to load eagerly - not used, kept for API compatibility */
  priority?: boolean
}

/**
 * Hero background image with instant display.
 * 
 * Uses CSS background-image instead of img element for:
 * - Instant rendering (no loading state needed)
 * - Better performance with pre-optimized images
 * - Simpler DOM structure
 * 
 * @example
 * ```tsx
 * <HeroImage 
 *   src={backgroundImage} 
 *   alt="Hero background" 
 *   opacity={0.3} 
 * />
 * ```
 */
export const HeroImage = memo(({
  src, 
  alt = '', 
  opacity = 0.15, 
  className = '',
}: HeroImageProps) => {
  return (
    <div 
      className={cn('absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat', className)}
      style={{ 
        backgroundImage: `url(${src})`,
        opacity,
      }}
      role="img"
      aria-label={alt || undefined}
    />
  )
})
