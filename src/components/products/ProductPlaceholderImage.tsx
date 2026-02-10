/**
 * Product Placeholder Image
 * 
 * Displays a "Coming Soon" placeholder when a product has no image.
 * 
 * @module components/products/ProductPlaceholderImage
 */

import { Package } from '@phosphor-icons/react'

interface ProductPlaceholderImageProps {
  productName: string
  category?: string
  className?: string
}

export function ProductPlaceholderImage({ productName, category, className = '' }: ProductPlaceholderImageProps) {
  // Use different gradient based on category
  const gradientClass = category === 'advanced-materials'
    ? 'from-primary/30 via-primary/10 to-accent/20'
    : 'from-accent/30 via-accent/10 to-primary/20'

  return (
    <div 
      className={`w-full h-56 md:h-72 bg-gradient-to-br ${gradientClass} flex flex-col items-center justify-center gap-3 ${className}`}
      role="img"
      aria-label={`Placeholder image for ${productName}`}
    >
      <Package size={48} className="text-muted-foreground/50" weight="duotone" />
      <div className="text-center px-4">
        <p className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">
          Image Coming Soon
        </p>
      </div>
    </div>
  )
}
