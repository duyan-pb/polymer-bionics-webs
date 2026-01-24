/**
 * Material Card
 * 
 * Displays a single material summary card.
 * 
 * @module components/materials/MaterialCard
 */

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ClickableCard } from '@/components/ClickableCard'
import { MATERIAL_CARD } from '@/lib/constants'
import type { Material } from '@/lib/types'
import { MaterialPlaceholderImage } from '@/components/materials/MaterialPlaceholderImage'

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
      <div className="h-40 overflow-hidden bg-muted transition-all duration-300 group-hover:scale-105">
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
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
              Key Properties
            </h4>
            <div className="flex flex-wrap gap-2">
              {material.properties.slice(0, MATERIAL_CARD.MAX_PROPERTIES).map((prop, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {prop.length > MATERIAL_CARD.MAX_PROPERTY_LENGTH ? `${prop.substring(0, MATERIAL_CARD.MAX_PROPERTY_LENGTH)  }...` : prop}
                </Badge>
              ))}
              {material.properties.length > MATERIAL_CARD.MAX_PROPERTIES && (
                <Badge variant="outline" className="text-xs">
                  +{material.properties.length - MATERIAL_CARD.MAX_PROPERTIES} more
                </Badge>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors font-semibold">
            View Full Details
          </Button>
        </div>
      </div>
    </ClickableCard>
  )
}
