/**
 * Material Dialog Content
 * 
 * Displays full material details in a dialog.
 * 
 * @module components/materials/MaterialDialogContent
 */

import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ContactCTA } from '@/components/ContactCTA'
import { CheckCircle } from '@phosphor-icons/react'
import type { Material } from '@/lib/types'

interface MaterialDialogContentProps {
  material: Material
}

export function MaterialDialogContent({ material }: MaterialDialogContentProps) {
  return (
    <>
      <DialogHeader>
        <div className="h-40 -mx-6 -mt-6 mb-6 overflow-hidden bg-muted">
          {material.imageUrl ? (
            <img src={material.imageUrl} alt={material.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
          ) : (
            <div className={`w-full h-full ${material.imageClass || 'bg-gradient-to-br from-accent/20 to-primary/10'}`}></div>
          )}
        </div>
        <DialogTitle className="text-3xl mb-2">{material.name}</DialogTitle>
        <p className="text-base text-muted-foreground">{material.description}</p>
      </DialogHeader>

      <div className="space-y-6 mt-6">
        <div>
          <h4 className="text-lg font-semibold mb-3">
            Material Properties
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {material.properties.map((prop, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle size={16} className="text-accent mt-1 flex-shrink-0" weight="fill" />
                <span className="text-muted-foreground">{prop}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-lg font-semibold mb-3">
            Key Advantages
          </h4>
          <div className="space-y-2">
            {material.keyAdvantages.map((advantage, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle size={16} className="text-accent mt-1 flex-shrink-0" weight="fill" />
                <span className="text-muted-foreground">{advantage}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-lg font-semibold mb-3">Technical Details</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {material.technicalDetails}
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <ContactCTA emailType="sales" />
        </div>
      </div>
    </>
  )
}
