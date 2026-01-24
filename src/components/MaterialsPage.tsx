/**
 * Materials Page Component
 * 
 * Displays the biomaterials catalog with detailed specifications.
 * Features material cards with modal detail view.
 * 
 * @module components/MaterialsPage
 */

import { useState, useCallback } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { materials } from '@/lib/materials-data'
import type { Material } from '@/lib/types'
import { PageHero } from '@/components/PageHero'
import CESheet from '@/assets/images/optimized/CE_sheet.webp'
import { MaterialCard } from '@/components/materials/MaterialCard'
import { MaterialDialogContent } from '@/components/materials/MaterialDialogContent'

/**
 * Props for the MaterialsPage component.
 */
interface MaterialsPageProps {
  /** Navigation handler */
  onNavigate: (page: string) => void
}

/**
 * Materials page component displaying the biomaterials catalog.
 * 
 * Features:
 * - Material cards with gradient backgrounds
 * - Modal with detailed properties and advantages
 * - Contact CTA for material inquiries
 * 
 * @example
 * ```tsx
 * <MaterialsPage onNavigate={handleNavigate} />
 * ```
 */
export function MaterialsPage({ onNavigate }: MaterialsPageProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)

  const handleMaterialSelect = useCallback((material: Material) => {
    setSelectedMaterial(material)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="Our Materials"
        description="Advanced materials for advancements in humankind. Our portfolio of specialized bionic materials includes flexible conductive polymers, biocompatible gels, and innovative bonding solutions—all engineered for superior performance in wearable and implantable bioelectronic devices."
        backgroundImage={CESheet}
        backgroundOpacity={0.7}
        breadcrumbs={[
          { label: 'Home', page: 'home' },
          { label: 'Materials' }
        ]}
        onNavigate={onNavigate}
      />

      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            {materials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                onSelect={handleMaterialSelect}
              />
            ))}
          </div>
        </div>
      </section>



      <Dialog open={!!selectedMaterial} onOpenChange={() => setSelectedMaterial(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedMaterial && (
              <MaterialDialogContent material={selectedMaterial} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
