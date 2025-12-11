import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Download, CheckCircle, TestTube, Package, FileText } from '@phosphor-icons/react'
import type { Product } from '@/lib/types'

interface ProductsPageProps {
  products: Product[]
}

export function ProductsPage({ products }: ProductsPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))]

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 px-8">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="text-6xl font-bold mb-6">Product Portfolio</h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            Our proprietary biomaterials platform delivers high-performance solutions for surgical applications,
            wearable medical devices, and advanced drug delivery systems.
          </p>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2 text-sm capitalize"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer border-2 hover:border-accent"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-base text-muted-foreground italic">{product.tagline}</p>
                  </div>
                  <Badge variant="secondary" className="capitalize">{product.category}</Badge>
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

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {product.datasheetId && (
                      <Button variant="ghost" size="sm">
                        <FileText className="mr-1" size={16} /> Datasheet
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedProduct && (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <DialogTitle className="text-3xl mb-2">{selectedProduct.name}</DialogTitle>
                      <p className="text-lg text-muted-foreground italic">{selectedProduct.tagline}</p>
                    </div>
                    <Badge variant="secondary" className="capitalize text-base px-4 py-2">
                      {selectedProduct.category}
                    </Badge>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
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

                  <div className="flex gap-3 pt-4">
                    {selectedProduct.datasheetId && (
                      <Button>
                        <Download className="mr-2" /> Download Datasheet
                      </Button>
                    )}
                    {selectedProduct.caseStudyId && (
                      <Button variant="outline">
                        View Case Study
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
