/**
 * Hero Image Component
 * 
 * Animated background image for hero sections.
 * Features fade-in animation and optimized loading.
 * 
 * @module components/HeroImage
 */

import { useState, memo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Props for the HeroImage component.
 */
interface HeroImageProps {
  /** Image source URL */
  src: string
  /** Alt text for accessibility */
  alt?: string
  /** Image opacity (0-1, default: 0.15) */
  opacity?: number
  /** Additional CSS classes */
  className?: string
  /** Whether to load eagerly (for above-the-fold images) */
  priority?: boolean
}

/**
 * Animated hero background image.
 * 
 * Features:
 * - Fade-in animation on load
 * - Scale animation for visual interest
 * - Lazy loading by default
 * - Configurable opacity overlay
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
  priority = false 
}: HeroImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ 
        opacity: isLoaded ? opacity : 0,
        scale: isLoaded ? 1 : 1.05
      }}
      transition={{ 
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={cn('absolute inset-0 w-full h-full', className)}
      style={{ willChange: 'opacity, transform' }}
    >
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        aria-hidden={!alt}
        onLoad={() => setIsLoaded(true)}
      />
    </motion.div>
  )
})
