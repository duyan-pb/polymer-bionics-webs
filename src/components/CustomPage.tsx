/**
 * Custom Solutions Page Component
 * 
 * Displays custom electrode and system solutions for partners.
 * Supports partners at multiple stages of product development.
 * 
 * @module components/CustomPage
 */

import { useState, useCallback, type MouseEvent } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Wrench, X } from '@phosphor-icons/react'
import type { Product } from '@/lib/types'
import { PageLayout } from '@/components/layout/PageLayout'
import { customSolutions } from '@/lib/custom-data'
import ElastomerArray from '@/assets/images/optimized/Elastomer_array.webp'
import { ProductDialogContent } from '@/components/products/ProductDialogContent'
import { ProductCard } from '@/components/products/ProductCard'

/**
 * Props for the CustomPage component.
 */
interface CustomPageProps {
  /** Navigation handler */
  onNavigate: (page: string) => void
}

/**
 * Custom solutions page component displaying partner-specific electrode solutions.
 * 
 * Features:
 * - Custom solution cards with images and descriptions
 * - Modal with full specifications
 * - Contact CTA for partner inquiries
 */
export function CustomPage({ onNavigate }: CustomPageProps) {
  const [selectedSolution, setSelectedSolution] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const FEATURE_PREVIEW_COUNT = 3

  const handleSolutionSelect = useCallback((solution: Product) => {
    setSelectedSolution(solution)
  }, [])

  const navigateToContact = useCallback((e: MouseEvent) => {
    e.stopPropagation()
    onNavigate('contact')
  }, [onNavigate])

  const hero = {
    title: 'Custom Solutions',
    description: 'We support partners at multiple stages of product development, from standalone electrodes, custom design and complete bioelectronic systems',
    backgroundImage: ElastomerArray,
    backgroundOpacity: 0.7,
    breadcrumbs: [
      { label: 'Home', page: 'home' },
      { label: 'Custom' },
    ],
    onNavigate,
  }

  return (
    <PageLayout hero={hero}>
      {customSolutions.length === 0 ? (
        <div className="text-center py-20">
          <Wrench size={64} className="mx-auto text-muted-foreground/40 mb-4" weight="duotone" />
          <h3 className="text-xl font-semibold mb-2">Custom solutions coming soon</h3>
          <p className="text-muted-foreground mb-4">
            Our custom electrode and system solutions are currently in development.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {customSolutions.map((solution) => (
            <ProductCard
              key={solution.id}
              product={solution}
              featurePreviewCount={FEATURE_PREVIEW_COUNT}
              onSelect={handleSolutionSelect}
              onZoomImage={(imageUrl) => setSelectedImage(imageUrl)}
              onContact={navigateToContact}
            />
          ))}
        </div>
      )}

      <Dialog open={!!selectedSolution} onOpenChange={() => setSelectedSolution(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedSolution && (
              <ProductDialogContent
                product={selectedSolution}
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
              alt="Custom solution detail - full size"
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
