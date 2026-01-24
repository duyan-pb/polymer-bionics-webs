/**
 * Application Placeholder Image
 * 
 * Displays a placeholder for applications without uploaded images.
 * Shows a category-specific gradient with a "Coming Soon" indicator.
 * 
 * @module components/applications/ApplicationPlaceholderImage
 */

import { Heartbeat } from '@phosphor-icons/react'

interface ApplicationPlaceholderImageProps {
  applicationName: string
  imageClass?: string
}

/**
 * Placeholder image component for applications without uploaded images.
 * Displays a gradient background with a Heartbeat icon and "Coming Soon" text.
 * 
 * @example
 * ```tsx
 * <ApplicationPlaceholderImage applicationName="ElastiCuff" />
 * ```
 */
export function ApplicationPlaceholderImage({ applicationName, imageClass }: ApplicationPlaceholderImageProps) {
  // TODO: Replace placeholder with actual application images
  const gradientClass = imageClass || 'bg-gradient-to-br from-primary/20 to-secondary/10'
  
  return (
    <div 
      className={`w-full h-full ${gradientClass} flex flex-col items-center justify-center`}
      aria-label={`Placeholder image for ${applicationName}`}
    >
      <Heartbeat 
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
