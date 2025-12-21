import { useState, useMemo, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Download, CheckCircle, TestTube, Package, Image as ImageIcon } from '@phosphor-icons/react'
import type { Product } from '@/lib/types'
import { ContactLinks } from '@/components/ContactLinks'
import { PageHero } from '@/components/PageHero'
import { ClickableCard } from '@/components/ClickableCard'
import { Card } from '@/components/ui/card'
import ElastomerArray from '@/assets/images/Elastomer_array.png'

interface ProductsPageProps {
  products: Product[]
  onNavigate: (page: string) => void
}

export function ProductsPage({ products, onNavigate }: ProductsPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const isLoading = !products || products.length === 0

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

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="Product Portfolio"
        description="Our proprietary biomaterials platform delivers high-performance solutions for surgical applications, wearable medical devices, and advanced drug delivery systems."
        backgroundImage={ElastomerArray}
        backgroundOpacity={0.7}
        breadcrumbs={[
          { label: 'Home', page: 'home' },
          { label: 'Products' }
        ]}
        onNavigate={onNavigate}
      />

      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-wrap gap-2 mb-8 md:mb-12">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                className="cursor-pointer px-5 py-2.5 text-sm capitalize font-semibold"
                onClick={() => handleCategorySelect(cat)}
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
                  ? 'Products are loading...' 
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
              <ClickableCard
                key={product.id}
                className="p-5 md:p-8"
                onClick={() => handleProductSelect(product)}
                ariaLabel={`View details for ${product.name}`}
              >
                {product.imageUrl && (
                  <div className="mb-4 md:mb-6 rounded-lg overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-40 md:h-56 object-cover"
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
                      {product.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle size={16} className="text-accent mt-0.5 flex-shrink-0" weight="fill" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex flex-wrap gap-2">
                      {product.datasheetId && (
                        <Button variant="outline" size="sm" className="text-xs md:text-sm" onClick={(e) => e.stopPropagation()}>
                          <Download className="mr-1" size={16} /> Datasheet
                        </Button>
                      )}
                      {product.caseStudyId && (
                        <Button variant="outline" size="sm" className="text-xs md:text-sm" onClick={(e) => e.stopPropagation()}>
                          Case Study
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="ghost" size="sm">
                        Enquire
                      </Button>
                      <Button variant="ghost" size="sm">
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              </ClickableCard>
            ))}
          </div>
          )}
        </div>
      </section>



      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedProduct && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-3xl mb-2">{selectedProduct.name}</DialogTitle>
                  <div className="flex items-center gap-3 mb-4">
                    <p className="text-lg text-muted-foreground italic">{selectedProduct.tagline}</p>
                    <Badge variant="secondary" className="capitalize">
                      {selectedProduct.category}
                    </Badge>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  {selectedProduct.images && selectedProduct.images.length > 0 && (
                    <>
                      <div>
                        <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <ImageIcon size={20} className="text-primary" /> Product Images
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                          {selectedProduct.images.map((img, idx) => (
                            <div 
                              key={idx}
                              className="cursor-pointer rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors"
                              onClick={() => setSelectedImage(img)}
                            >
                              <img 
                                src={img} 
                                alt={`${selectedProduct.name} - Image ${idx + 1}`}
                                className="w-full h-32 object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <TestTube size={20} className="text-primary" /> Technical Description
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedProduct.technicalDescription}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle size={20} className="text-primary" /> Key Features & Benefits
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedProduct.features.map((feature, idx) => (
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
                      {selectedProduct.applications.map((app, idx) => (
                        <Badge key={idx} variant="outline">{app}</Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-lg font-semibold mb-3">Regulatory & Safety Status</h4>
                    <p className="text-sm text-muted-foreground">{selectedProduct.regulatoryStatus}</p>
                  </div>

                  <div className="space-y-3 pt-4">
                    <div className="flex gap-3">
                      {selectedProduct.datasheetId && (
                        <Button variant="outline">
                          <Download className="mr-2" /> Download Datasheet
                        </Button>
                      )}
                      {selectedProduct.caseStudyId && (
                        <Button variant="outline">
                          View Case Study
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <ContactLinks emailType="sales" variant="default" size="default" showWhatsApp={true} showEmail={true} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl">
          <div className="flex items-center justify-center">
            <img 
              src={selectedImage || ''} 
              alt="Product detail"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProductsPage
