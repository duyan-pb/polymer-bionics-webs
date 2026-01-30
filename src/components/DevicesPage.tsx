/**
 * Devices Page Component
 * 
 * Displays proprietary bioelectronic devices developed in-house.
 * Complete wearable or implantable systems.
 * 
 * @module components/DevicesPage
 */

import { useState, useCallback, type MouseEvent } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Cpu, X } from '@phosphor-icons/react'
import type { Product } from '@/lib/types'
import { PageLayout } from '@/components/layout/PageLayout'
import { devices } from '@/lib/devices-data'
import ElastomerArray from '@/assets/images/optimized/Elastomer_array.webp'
import { ProductDialogContent } from '@/components/products/ProductDialogContent'
import { ProductCard } from '@/components/products/ProductCard'

/**
 * Props for the DevicesPage component.
 */
interface DevicesPageProps {
  /** Navigation handler */
  onNavigate: (page: string) => void
}

/**
 * Devices page component displaying proprietary bioelectronic devices.
 * 
 * Features:
 * - Device cards with images and descriptions
 * - Modal with full specifications
 * - Contact CTA for inquiries
 */
export function DevicesPage({ onNavigate }: DevicesPageProps) {
  const [selectedDevice, setSelectedDevice] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const FEATURE_PREVIEW_COUNT = 3

  const handleDeviceSelect = useCallback((device: Product) => {
    setSelectedDevice(device)
  }, [])

  const navigateToContact = useCallback((e: MouseEvent) => {
    e.stopPropagation()
    onNavigate('contact')
  }, [onNavigate])

  const hero = {
    title: 'Devices',
    description: 'Proprietary bioelectronic devices developed in-house',
    subDescription: 'Complete wearable or implantable systems built on our core materials and electrode platforms. Designed for clinical translation and commercial deployment.',
    backgroundImage: ElastomerArray,
    backgroundOpacity: 0.7,
    breadcrumbs: [
      { label: 'Home', page: 'home' },
      { label: 'Devices' },
    ],
    onNavigate,
  }

  return (
    <PageLayout hero={hero}>
      {devices.length === 0 ? (
        <div className="text-center py-20">
          <Cpu size={64} className="mx-auto text-muted-foreground/40 mb-4" weight="duotone" />
          <h3 className="text-xl font-semibold mb-2">Devices coming soon</h3>
          <p className="text-muted-foreground mb-4">
            Our proprietary bioelectronic devices are currently in development.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {devices.map((device) => (
            <ProductCard
              key={device.id}
              product={device}
              featurePreviewCount={FEATURE_PREVIEW_COUNT}
              onSelect={handleDeviceSelect}
              onZoomImage={(imageUrl) => setSelectedImage(imageUrl)}
              onContact={navigateToContact}
            />
          ))}
        </div>
      )}

      <Dialog open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedDevice && (
              <ProductDialogContent
                product={selectedDevice}
                onSelectImage={setSelectedImage}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <div className="relative flex items-center justify-center w-full h-full min-h-[50vh]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 rounded-full"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image"
            >
              <X size={24} weight="bold" />
            </Button>
            <img 
              src={selectedImage || ''} 
              alt="Device detail - full size"
              className="max-w-full max-h-[90vh] object-contain"
              loading="eager"
              decoding="sync"
            />
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}
