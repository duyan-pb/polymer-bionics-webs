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

  // If we have a source and no wrapper class, render image directly
  if (src && !className) {
    return (
      <img 
        src={src} 
        alt={alt} 
        className={imageClassName}
        loading="lazy"
        decoding="async"
      />
    )
  }

  // Otherwise use wrapper div for fallback or when className is provided
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
