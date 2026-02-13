/**
 * Products Page Component
 * Displays the product catalog with filtering and detail modals.
 * @module components/ProductsPage
 */

import { useState, useMemo, useCallback, type MouseEvent, type KeyboardEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Package } from '@phosphor-icons/react'
import { ImageLightbox } from '@/components/ImageLightbox'
import type { Product } from '@/lib/types'
import { PageLayout } from '@/components/layout/PageLayout'
import { Card } from '@/components/ui/card'
import ElastomerArray from '@/assets/images/optimized/Elastomer_array.webp'
import { ProductDialogContent } from '@/components/products/ProductDialogContent'
import { ProductCard } from '@/components/products/ProductCard'

/**
 * Props for the ProductsPage component.
 */
interface ProductsPageProps {
  /** Array of products to display */
  products: Product[]
  /** Navigation handler */
  onNavigate: (page: string) => void
  /** Callback to set payment draft for order flow */
  onSetPaymentDraft: (draft: { product: string; quantity: string } | null) => void
}

/**
 * Products page component with filtering and modal details.
 * 
 * Features:
 * - Category filtering tabs
 * - Product cards with images and descriptions
 * - Modal with full specifications and image gallery
 * - Links to related datasheets and case studies
 * - Contact CTA for inquiries
 * @example
 * <ProductsPage products={productList} onNavigate={handleNavigate} />
 */
export function ProductsPage({ products, onNavigate, onSetPaymentDraft }: ProductsPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const FEATURE_PREVIEW_COUNT = 3
  const isLoading = !products

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(products.map(p => p.category)))],
    [products]
  )

  const filteredProducts = useMemo(
    () => selectedCategory === 'all'
      ? products
      : products.filter(p => p.category === selectedCategory),
    [products, selectedCategory]
  )

  const handleCategorySelect = useCallback((cat: string) => {
    setSelectedCategory(cat)
  }, [])

  const handleCategoryKeyDown = useCallback((event: KeyboardEvent<HTMLElement>, cat: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCategorySelect(cat)
    }
  }, [handleCategorySelect])

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product)
  }, [])
  const navigateToDatasheet = useCallback((e: MouseEvent, datasheetId?: string) => {
    e.stopPropagation()
    if (!datasheetId) {
      return
    }
    onNavigate('datasheets')
  }, [onNavigate])

  const navigateToCaseStudy = useCallback((e: MouseEvent, caseStudyId?: string) => {
    e.stopPropagation()
    if (!caseStudyId) {
      return
    }
    onNavigate('media')
  }, [onNavigate])

  const handleBuy = useCallback((e: MouseEvent, product: Product) => {
    e.stopPropagation()
    setSelectedProduct(null)
    onSetPaymentDraft({
      product: product.name,
      quantity: '1',
    })
    onNavigate('payment')
  }, [onNavigate, onSetPaymentDraft])

  const hero = {
    title: 'Products',
    description: 'High-performance soft electrodes for bioelectronic interfaces',
    subDescription: 'Single and multi-channel electrodes. Flexible, stretchable, and implantable designs. Optimised for sensing and stimulation.',
    backgroundImage: ElastomerArray,
    backgroundOpacity: 0.7,
    breadcrumbs: [
      { label: 'Home', page: 'home' },
      { label: 'Products' },
    ],
    onNavigate,
  }

  return (
    <PageLayout hero={hero}>
      <div className="flex flex-wrap gap-2 mb-8 md:mb-12">
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            className="cursor-pointer px-5 py-2.5 text-sm capitalize font-semibold"
            onClick={() => handleCategorySelect(cat)}
            onKeyDown={(event) => handleCategoryKeyDown(event, cat)}
            role="button"
            tabIndex={0}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="p-8">
              <Skeleton className="h-56 w-full mb-6 rounded-lg" />
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Skeleton className="h-7 w-2/3 mb-2" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="mx-auto text-muted-foreground/40 mb-4" weight="duotone" />
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            {selectedCategory === 'all' 
              ? 'Products coming soon.' 
              : `No products in the "${selectedCategory}" category`}
          </p>
          {selectedCategory !== 'all' && (
            <Button variant="outline" onClick={() => handleCategorySelect('all')}>
              View all products
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              featurePreviewCount={FEATURE_PREVIEW_COUNT}
              onSelect={handleProductSelect}
              onZoomImage={(imageUrl, gallery) => {
                setLightboxImages(gallery)
                setLightboxIndex(Math.max(0, gallery.indexOf(imageUrl)))
              }}
              onBuy={handleBuy}
              onDatasheet={navigateToDatasheet}
              onCaseStudy={navigateToCaseStudy}
              showWhatsApp
            />
          ))}
        </div>
      )}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedProduct && (
              <ProductDialogContent
                product={selectedProduct}
                onSelectImage={(imageUrl, gallery) => {
                  setLightboxImages(gallery)
                  setLightboxIndex(Math.max(0, gallery.indexOf(imageUrl)))
                }}
                onBuy={handleBuy}
                onDatasheet={navigateToDatasheet}
                onCaseStudy={navigateToCaseStudy}
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
        alt="Product detail"
      />
    </PageLayout>
  )
}
