import type { ReactNode } from 'react'

interface ImageWithFallbackProps {
  src?: string
  alt: string
  fallback?: ReactNode
  className?: string
  imageClassName?: string
}

export function ImageWithFallback({
  src,
  alt,
  fallback,
  className = '',
  imageClassName = 'w-full h-full object-cover'
}: ImageWithFallbackProps) {
  if (!src && !fallback) {
    return null
  }

  return (
    <div className={className}>
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className={imageClassName}
          loading="lazy"
          decoding="async"
        />
      ) : (
        fallback
      )}
    </div>
  )
}
