/**
 * Innovation Page Component
 * 
 * Displays advanced bioelectronic innovations in development.
 * Emerging technologies and research platforms.
 * 
 * @module components/InnovationPage
 */

import { useState, useCallback, type MouseEvent } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Lightbulb } from '@phosphor-icons/react'
import { ImageLightbox } from '@/components/ImageLightbox'
import type { Product } from '@/lib/types'
import { PageLayout } from '@/components/layout/PageLayout'
import { innovations } from '@/lib/innovation-data'
import ElastomerArray from '@/assets/images/optimized/Elastomer_array.webp'
import { ProductDialogContent } from '@/components/products/ProductDialogContent'
import { ProductCard } from '@/components/products/ProductCard'

/**
 * Props for the InnovationPage component.
 */
interface InnovationPageProps {
  /** Navigation handler */
  onNavigate: (page: string) => void
}

/**
 * Innovation page component displaying advanced bioelectronic innovations.
 * 
 * Features:
 * - Innovation cards with images and descriptions
 * - Modal with full specifications
 * - Contact CTA for research inquiries
 */
export function InnovationPage({ onNavigate }: InnovationPageProps) {
  const [selectedInnovation, setSelectedInnovation] = useState<Product | null>(null)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const FEATURE_PREVIEW_COUNT = 3

  const handleInnovationSelect = useCallback((innovation: Product) => {
    setSelectedInnovation(innovation)
  }, [])

  const navigateToContact = useCallback((e: MouseEvent) => {
    e.stopPropagation()
    onNavigate('contact')
  }, [onNavigate])

  const hero = {
    title: 'Innovation',
    description: 'Advanced bioelectronic innovations in development',
    subDescription: 'Emerging technologies and research platforms pushing the boundaries of soft bioelectronics.',
    backgroundImage: ElastomerArray,
    backgroundOpacity: 0.7,
    breadcrumbs: [
      { label: 'Home', page: 'home' },
      { label: 'Innovation' },
    ],
    onNavigate,
  }

  return (
    <PageLayout hero={hero}>
      {innovations.length === 0 ? (
        <div className="text-center py-20">
          <Lightbulb size={64} className="mx-auto text-muted-foreground/40 mb-4" weight="duotone" />
          <h3 className="text-xl font-semibold mb-2">Innovations coming soon</h3>
          <p className="text-muted-foreground mb-4">
            Our advanced bioelectronic innovations are currently in development.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {innovations.map((innovation) => (
            <ProductCard
              key={innovation.id}
              product={innovation}
              featurePreviewCount={FEATURE_PREVIEW_COUNT}
              onSelect={handleInnovationSelect}
              onZoomImage={(imageUrl, gallery) => {
                setLightboxImages(gallery)
                setLightboxIndex(Math.max(0, gallery.indexOf(imageUrl)))
              }}
              onContact={navigateToContact}
            />
          ))}
        </div>
      )}

      <Dialog open={!!selectedInnovation} onOpenChange={() => setSelectedInnovation(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedInnovation && (
              <ProductDialogContent
                product={selectedInnovation}
                onSelectImage={(imageUrl, gallery) => {
                  setLightboxImages(gallery)
                  setLightboxIndex(Math.max(0, gallery.indexOf(imageUrl)))
                }}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <ImageLightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onClose={() => { setLightboxIndex(null); setLightboxImages([]); }}
        onNavigate={setLightboxIndex}
        alt="Innovation detail"
      />
    </PageLayout>
  )
}
