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
import { Cpu } from '@phosphor-icons/react'
import { ImageLightbox } from '@/components/ImageLightbox'
import type { Product } from '@/lib/types'
import { PageLayout } from '@/components/layout/PageLayout'
import { devices } from '@/lib/devices-data'
import ElastomerArray from '@/assets/images/optimized/Elastomer_array.webp'
import { ProductDialogContent } from '@/components/products/ProductDialogContent'
import { ProductCard } from '@/components/products/ProductCard'
import { OrderModal } from '@/components/OrderModal'

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
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [orderItem, setOrderItem] = useState<string>('')
  const [isOrderOpen, setIsOrderOpen] = useState(false)
  const FEATURE_PREVIEW_COUNT = 3

  const handleDeviceSelect = useCallback((device: Product) => {
    setSelectedDevice(device)
  }, [])

  const handleOrder = useCallback((e: MouseEvent, device: Product) => {
    e.stopPropagation()
    setSelectedDevice(null)
    setOrderItem(device.name)
    setIsOrderOpen(true)
  }, [])

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
              onZoomImage={(imageUrl, gallery) => {
                setLightboxImages(gallery)
                setLightboxIndex(Math.max(0, gallery.indexOf(imageUrl)))
              }}
              onOrder={handleOrder}
              showWhatsApp
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
                onSelectImage={(imageUrl, gallery) => {
                  setLightboxImages(gallery)
                  setLightboxIndex(Math.max(0, gallery.indexOf(imageUrl)))
                }}
                onOrder={handleOrder}
                showWhatsApp
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
        alt="Device detail"
      />

      <OrderModal
        open={isOrderOpen}
        onOpenChange={setIsOrderOpen}
        itemName={orderItem}
        itemType="Device"
      />
    </PageLayout>
  )
}
