/**
 * Product Card
 * 
 * Displays a single product summary card with actions.
 * 
 * @module components/products/ProductCard
 */

import type { MouseEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ClickableCard } from '@/components/ClickableCard'
import { Download, CheckCircle, MagnifyingGlassPlus, ShoppingCart } from '@phosphor-icons/react'
import type { Product } from '@/lib/types'
import { ProductPlaceholderImage } from '@/components/products/ProductPlaceholderImage'

export interface ProductCardProps {
  product: Product
  featurePreviewCount: number
  onSelect: (product: Product) => void
  onZoomImage: (imageUrl: string) => void
  onBuy?: (e: MouseEvent, product: Product) => void
  onContact: (e: MouseEvent) => void
  onDatasheet?: (e: MouseEvent, datasheetId?: string) => void
  onCaseStudy?: (e: MouseEvent, caseStudyId?: string) => void
}

export function ProductCard({
  product,
  featurePreviewCount,
  onSelect,
  onZoomImage,
  onBuy,
  onContact,
  onDatasheet,
  onCaseStudy,
}: ProductCardProps) {
  return (
    <ClickableCard
      className="p-5 md:p-8"
      onClick={() => onSelect(product)}
      ariaLabel={`View details for ${product.name}`}
    >
      {/* Always render image area for consistent card heights */}
      {product.imageUrl ? (
        <div 
          className="mb-4 md:mb-6 rounded-lg overflow-hidden relative group cursor-zoom-in"
          onClick={(e) => {
            e.stopPropagation()
            onZoomImage(product.imageUrl ?? '')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.stopPropagation()
              onZoomImage(product.imageUrl ?? '')
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Enlarge image of ${product.name}`}
        >
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-56 md:h-72 object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
            <MagnifyingGlassPlus 
              size={40} 
              className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" 
              weight="bold"
            />
          </div>
        </div>
      ) : (
        <div className="mb-4 md:mb-6 rounded-lg overflow-hidden">
          <ProductPlaceholderImage 
            productName={product.name} 
            category={product.category} 
          />
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 md:mb-4 gap-2">
        <div>
          <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">{product.name}</h3>
          <p className="text-sm md:text-base text-muted-foreground italic">{product.tagline}</p>
        </div>
        <Badge variant="secondary" className="capitalize font-semibold self-start">{product.category}</Badge>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-2 text-primary">Key Features</h4>
          <ul className="space-y-1">
            {product.features.slice(0, featurePreviewCount).map((feature, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <CheckCircle size={16} className="text-accent mt-0.5 flex-shrink-0" weight="fill" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex flex-wrap gap-2">
            {onBuy && (
              <Button
                variant="default"
                size="sm"
                className="text-xs md:text-sm"
                onClick={(e) => onBuy(e, product)}
              >
                <ShoppingCart className="mr-1" size={16} weight="duotone" /> Buy
              </Button>
            )}
            {product.datasheetId && onDatasheet && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs md:text-sm"
                onClick={(e) => onDatasheet(e, product.datasheetId)}
              >
                <Download className="mr-1" size={16} /> Datasheet
              </Button>
            )}
            {product.caseStudyId && onCaseStudy && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs md:text-sm"
                onClick={(e) => onCaseStudy(e, product.caseStudyId)}
              >
                Case Study
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={onContact}>
              Enquire
            </Button>
          </div>
        </div>
      </div>
    </ClickableCard>
  )
}
