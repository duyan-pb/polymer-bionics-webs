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
import { CheckCircle, FilePdf, Download, MagnifyingGlassPlus } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import type { Material } from '@/lib/types'

interface MaterialDialogContentProps {
  material: Material
  onZoomImage?: (imageUrl: string) => void
}

export function MaterialDialogContent({ material, onZoomImage }: MaterialDialogContentProps) {
  return (
    <>
      <DialogHeader>
        <div className="h-56 md:h-72 -mx-6 -mt-6 mb-6 overflow-hidden bg-muted">
          {material.imageUrl ? (
            <div
              className="relative group cursor-zoom-in w-full h-full"
              onClick={() => onZoomImage?.(material.imageUrl!)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onZoomImage?.(material.imageUrl!)
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Enlarge image of ${material.name}`}
            >
              <img src={material.imageUrl} alt={material.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" decoding="async" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                <MagnifyingGlassPlus
                  size={40}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
                  weight="bold"
                />
              </div>
            </div>
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

        {material.datasheets && material.datasheets.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-lg font-semibold mb-3">Datasheets</h4>
              <div className="flex flex-col gap-2">
                {material.datasheets.map((ds, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="w-full justify-start gap-3 h-auto py-3"
                    asChild
                  >
                    <a href={ds.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <FilePdf size={20} weight="duotone" className="text-red-500 flex-shrink-0" />
                      <span className="text-sm font-medium">{ds.name}</span>
                      <Download size={16} className="ml-auto text-muted-foreground" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="flex gap-3 pt-4">
          <ContactCTA emailType="sales" />
        </div>
      </div>
    </>
  )
}
