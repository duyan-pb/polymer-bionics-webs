/**
 * Product Dialog Content
 * 
 * Extracted modal content for ProductsPage.
 * 
 * @module components/products/ProductDialogContent
 */

import type { MouseEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Download, CheckCircle, TestTube, Package, Image as ImageIcon, MagnifyingGlassPlus, ShoppingCart, FilePdf, WhatsappLogo, EnvelopeSimple } from '@phosphor-icons/react'
import type { Product } from '@/lib/types'
import { getWhatsAppUrl, getEmailUrl } from '@/lib/contact-config'
import { openExternal } from '@/lib/utils'

export interface ProductDialogContentProps {
  product: Product
  onSelectImage: (image: string) => void
  onBuy?: (e: MouseEvent, product: Product) => void
  onOrder?: (e: MouseEvent, product: Product) => void
  onDatasheet?: (e: MouseEvent, datasheetId?: string) => void
  onCaseStudy?: (e: MouseEvent, caseStudyId?: string) => void
  /** Show WhatsApp button */
  showWhatsApp?: boolean
}

function ProductImageGrid({ product, onSelectImage }: { product: Product; onSelectImage: (image: string) => void }) {
  if (!product.images || product.images.length === 0) {
    return null
  }

  return (
    <>
      <div>
        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <ImageIcon size={20} className="text-primary" /> Product Images
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {product.images.map((img, idx) => (
            <div 
              key={idx}
              className="cursor-zoom-in rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary relative group"
              onClick={() => onSelectImage(img)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectImage(img); } }}
              tabIndex={0}
              role="button"
              aria-label={`View ${product.name} image ${idx + 1} in full size`}
            >
              <img 
                src={img} 
                alt={`${product.name} - Image ${idx + 1}`}
                className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <MagnifyingGlassPlus 
                  size={28} 
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" 
                  weight="bold"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Separator />
    </>
  )
}

export function ProductDialogContent({ product, onSelectImage, onBuy, onOrder, onDatasheet, onCaseStudy, showWhatsApp = false }: ProductDialogContentProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-3xl mb-2">{product.name}</DialogTitle>
        <div className="flex items-center gap-3 mb-4">
          <p className="text-lg text-muted-foreground italic">{product.tagline}</p>
          <Badge variant="secondary" className="capitalize">
            {product.category}
          </Badge>
        </div>
      </DialogHeader>
      <div className="space-y-6">
        <ProductImageGrid product={product} onSelectImage={onSelectImage} />
        <div>
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TestTube size={20} className="text-primary" /> Technical Description
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {product.technicalDescription}
          </p>
        </div>
        <Separator />
        <div>
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <CheckCircle size={20} className="text-primary" /> Key Features & Benefits
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {product.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle size={16} className="text-accent mt-1 flex-shrink-0" weight="fill" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Package size={20} className="text-primary" /> Intended Applications
          </h4>
          <div className="flex flex-wrap gap-2">
            {product.applications.map((app, idx) => (
              <Badge key={idx} variant="outline">{app}</Badge>
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <h4 className="text-lg font-semibold mb-3">Regulatory & Safety Status</h4>
          <p className="text-sm text-muted-foreground">{product.regulatoryStatus}</p>
        </div>
        {product.datasheets && product.datasheets.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FilePdf size={20} className="text-primary" /> Datasheets
              </h4>
              <div className="flex flex-col gap-2">
                {product.datasheets.map((ds, idx) => (
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
        <div className="space-y-3 pt-4">
          <div className="flex flex-wrap gap-3">
            {showWhatsApp && (
              <Button
                className="bg-[#25D366] hover:bg-[#1da851] text-white"
                onClick={(e) => {
                  e.stopPropagation()
                  openExternal(getWhatsAppUrl(`Hi, I'm interested in ${product.name}. Could you provide more information?`))
                }}
              >
                <WhatsappLogo className="mr-2" weight="fill" /> WhatsApp
              </Button>
            )}
            {(onBuy || onOrder) && (
              <Button variant="default" onClick={(e) => {
                if (onOrder) {
                  onOrder(e, product)
                } else if (onBuy) {
                  onBuy(e, product)
                }
              }}>
                <ShoppingCart className="mr-2" weight="duotone" /> Order
              </Button>
            )}
            <Button variant="default" onClick={(e) => {
              e.stopPropagation()
              openExternal(getEmailUrl('sales', `Enquiry – ${product.name}`))
            }}>
              <EnvelopeSimple className="mr-2" /> Enquiry
            </Button>
            {product.datasheetId && onDatasheet && (
              <Button variant="outline" onClick={(e) => onDatasheet(e, product.datasheetId)}>
                <Download className="mr-2" /> View Datasheet
              </Button>
            )}
            {product.caseStudyId && onCaseStudy && (
              <Button variant="outline" onClick={(e) => onCaseStudy(e, product.caseStudyId)}>
                View Case Study
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
