/**
 * Material Card
 * 
 * Displays a single material summary card.
 * 
 * @module components/materials/MaterialCard
 */

import { Button } from '@/components/ui/button'
import { ClickableCard } from '@/components/ClickableCard'
import type { Material } from '@/lib/types'
import { MaterialPlaceholderImage } from '@/components/materials/MaterialPlaceholderImage'
import { FilePdf, CheckCircle, MagnifyingGlassPlus } from '@phosphor-icons/react'

interface MaterialCardProps {
  material: Material
  onSelect: (material: Material) => void
  onZoomImage?: (imageUrl: string) => void
}

export function MaterialCard({ material, onSelect, onZoomImage }: MaterialCardProps) {
  return (
    <ClickableCard
      className="group overflow-hidden"
      onClick={() => onSelect(material)}
      ariaLabel={`View details for ${material.name}`}
    >
      {material.imageUrl ? (
        <div
          className="h-56 md:h-72 overflow-hidden bg-muted relative group/zoom cursor-zoom-in"
          onClick={(e) => {
            e.stopPropagation()
            if (material.imageUrl) { onZoomImage?.(material.imageUrl) }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.stopPropagation()
              if (material.imageUrl) { onZoomImage?.(material.imageUrl) }
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Enlarge image of ${material.name}`}
        >
          <img src={material.imageUrl} alt={material.name} className="w-full h-full object-cover transition-transform duration-300 group-hover/zoom:scale-105" loading="lazy" decoding="async" />
          <div className="absolute inset-0 bg-black/0 group-hover/zoom:bg-black/30 transition-colors duration-300 flex items-center justify-center pointer-events-none">
            <MagnifyingGlassPlus
              size={40}
              className="text-white opacity-0 group-hover/zoom:opacity-100 transition-opacity duration-300 drop-shadow-lg"
              weight="bold"
            />
          </div>
        </div>
      ) : (
        <div className="h-56 md:h-72 overflow-hidden bg-muted transition-all duration-300">
          <MaterialPlaceholderImage materialName={material.name} imageClass={material.imageClass} />
        </div>
      )}
      <div className="p-5 md:p-8">
        <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 group-hover:text-primary transition-colors">
          {material.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          {material.description}
        </p>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-2 text-primary">
              Key Properties
            </h4>
            <ul className="space-y-1">
              {material.properties.map((prop, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <CheckCircle size={16} className="text-accent mt-0.5 flex-shrink-0" weight="fill" />
                  {prop}
                </li>
              ))}
            </ul>
          </div>
          <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm">
            View Full Details
          </Button>
          {material.datasheets && material.datasheets.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {material.datasheets.map((ds, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:text-red-500"
                  asChild
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  <a href={ds.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <FilePdf size={16} weight="duotone" className="text-red-500" />
                    <span className="text-xs">{ds.name}</span>
                  </a>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </ClickableCard>
  )
}
