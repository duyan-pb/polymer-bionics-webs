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
import { FilePdf, CheckCircle } from '@phosphor-icons/react'

interface MaterialCardProps {
  material: Material
  onSelect: (material: Material) => void
}

export function MaterialCard({ material, onSelect }: MaterialCardProps) {
  return (
    <ClickableCard
      className="group overflow-hidden"
      onClick={() => onSelect(material)}
      ariaLabel={`View details for ${material.name}`}
    >
      <div className="h-56 md:h-72 overflow-hidden bg-muted transition-all duration-300 group-hover:scale-105">
        {material.imageUrl ? (
          <img src={material.imageUrl} alt={material.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        ) : (
          <MaterialPlaceholderImage materialName={material.name} imageClass={material.imageClass} />
        )}
      </div>
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
