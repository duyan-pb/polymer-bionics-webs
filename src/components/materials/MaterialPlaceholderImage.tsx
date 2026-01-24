/**
 * Material Placeholder Image
 * 
 * Displays a placeholder for materials without uploaded images.
 * Shows a category-specific gradient with a "Coming Soon" indicator.
 * 
 * @module components/materials/MaterialPlaceholderImage
 */

import { Flask } from '@phosphor-icons/react'

interface MaterialPlaceholderImageProps {
  materialName: string
  imageClass?: string
}

/**
 * Placeholder image component for materials without uploaded images.
 * Displays a gradient background with a Flask icon and "Coming Soon" text.
 * 
 * @example
 * ```tsx
 * <MaterialPlaceholderImage materialName="BionGel" />
 * ```
 */
export function MaterialPlaceholderImage({ materialName, imageClass }: MaterialPlaceholderImageProps) {
  // TODO: Replace placeholder with actual material images
  const gradientClass = imageClass || 'bg-gradient-to-br from-primary/20 to-secondary/10'
  
  return (
    <div 
      className={`w-full h-full ${gradientClass} flex flex-col items-center justify-center`}
      aria-label={`Placeholder image for ${materialName}`}
    >
      <Flask 
        size={48} 
        weight="light" 
        className="text-muted-foreground/60 mb-2"
      />
      <span className="text-xs text-muted-foreground/60 font-medium">
        Image Coming Soon
      </span>
    </div>
  )
}
