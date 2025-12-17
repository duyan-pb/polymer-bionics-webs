import { useState, memo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface HeroImageProps {
  src: string
  alt?: string
  opacity?: number
  className?: string
  priority?: boolean
}

export const HeroImage = memo(function HeroImage({ 
  src, 
  alt = '', 
  opacity = 0.15, 
  className = '',
  priority = false 
}: HeroImageProps) {
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
