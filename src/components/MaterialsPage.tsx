import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CheckCircle } from '@phosphor-icons/react'
import { materials } from '@/lib/materials-data'
import type { Material } from '@/lib/types'
import { ContactLinks } from '@/components/ContactLinks'
import { PageHero } from '@/components/PageHero'
import { ClickableCard } from '@/components/ClickableCard'
import CESheet from '@/assets/images/CE_sheet.png'

interface MaterialsPageProps {
  onNavigate: (page: string) => void
}

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
              <ClickableCard
                key={material.id}
                className="group overflow-hidden"
                onClick={() => handleMaterialSelect(material)}
                ariaLabel={`View details for ${material.name}`}
              >
                <div className="h-40 overflow-hidden bg-muted transition-all duration-300 group-hover:scale-105">
                  {material.imageUrl ? (
                    <img src={material.imageUrl} alt={material.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  ) : (
                    <div className={`w-full h-full ${material.imageClass || 'bg-gradient-to-br from-primary/20 to-secondary/10'}`}></div>
                  )}
                </div>
                
                <div className="p-5 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 group-hover:text-primary transition-colors">
                    {material.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    {material.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
                        Key Properties
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {material.properties.slice(0, 3).map((prop, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {prop.length > 30 ? `${prop.substring(0, 30)  }...` : prop}
                          </Badge>
                        ))}
                        {material.properties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{material.properties.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors font-semibold">
                      View Full Details
                    </Button>
                  </div>
                </div>
              </ClickableCard>
            ))}
          </div>
        </div>
      </section>



      <Dialog open={!!selectedMaterial} onOpenChange={() => setSelectedMaterial(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedMaterial && (
              <>
                <DialogHeader>
                  <div className="h-40 -mx-6 -mt-6 mb-6 overflow-hidden bg-muted">
                    {selectedMaterial.imageUrl ? (
                      <img src={selectedMaterial.imageUrl} alt={selectedMaterial.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    ) : (
                      <div className={`w-full h-full ${selectedMaterial.imageClass || 'bg-gradient-to-br from-accent/20 to-primary/10'}`}></div>
                    )}
                  </div>
                  <DialogTitle className="text-3xl mb-2">{selectedMaterial.name}</DialogTitle>
                  <p className="text-base text-muted-foreground">{selectedMaterial.description}</p>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-3">
                      Material Properties
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedMaterial.properties.map((prop, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle size={16} className="text-accent mt-1 flex-shrink-0" weight="fill" />
                          <span className="text-muted-foreground">{prop}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-lg font-semibold mb-3">
                      Key Advantages
                    </h4>
                    <div className="space-y-2">
                      {selectedMaterial.keyAdvantages.map((advantage, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle size={16} className="text-accent mt-1 flex-shrink-0" weight="fill" />
                          <span className="text-muted-foreground">{advantage}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-lg font-semibold mb-3">Technical Details</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedMaterial.technicalDetails}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <ContactLinks emailType="sales" variant="default" size="default" showWhatsApp={true} showEmail={true} />
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
