import { useState } from 'react'
import { motion } from 'framer-motion'

interface HeroImageProps {
  src: string
  alt?: string
  opacity?: number
  className?: string
}

export function HeroImage({ src, alt = '', opacity = 0.15, className = '' }: HeroImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ 
        opacity: isLoaded ? opacity : 0,
        scale: isLoaded ? 1 : 1.1
      }}
      transition={{ 
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={() => setIsLoaded(true)}
      />
    </motion.div>
  )
}
