import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Atom, CheckCircle, Flask } from '@phosphor-icons/react'
import { materials, type Material } from '@/lib/materials-data'

export function MaterialsPage() {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Atom size={48} className="text-accent" weight="duotone" />
            <h1 className="text-6xl font-bold">Our Materials</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            PolymerBionics develops and manufactures advanced polymer materials specifically engineered for 
            biomedical applications. Our materials portfolio spans conductive polymers, biocompatible elastomers, 
            hydrogels, and specialty coatings—all optimized for safety, performance, and manufacturability.
          </p>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {materials.map((material) => (
              <Card
                key={material.id}
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer border-2 hover:border-accent"
                onClick={() => setSelectedMaterial(material)}
              >
                <div className={`h-32 ${material.imageClass || 'bg-gradient-to-br from-accent/20 to-primary/10'} 
                  flex items-center justify-center transition-all duration-300 group-hover:scale-105`}>
                  <Flask size={56} className="text-primary/40" weight="duotone" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-3 group-hover:text-accent transition-colors">
                    {material.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {material.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                        Key Properties
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {material.properties.slice(0, 3).map((prop, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {prop.length > 30 ? prop.substring(0, 30) + '...' : prop}
                          </Badge>
                        ))}
                        {material.properties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{material.properties.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      View Full Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-8 bg-muted/30">
        <div className="max-w-[1280px] mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Custom Material Development</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Need a material tailored to your specific application? Our materials science team can develop 
            custom polymer formulations optimized for your unique requirements.
          </p>
          <Button size="lg" className="text-base">
            Discuss Your Project
          </Button>
        </div>
      </section>

      <Dialog open={!!selectedMaterial} onOpenChange={() => setSelectedMaterial(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedMaterial && (
              <>
                <DialogHeader>
                  <div className={`h-40 -mx-6 -mt-6 mb-6 ${selectedMaterial.imageClass || 'bg-gradient-to-br from-accent/20 to-primary/10'} 
                    flex items-center justify-center`}>
                    <Flask size={80} className="text-primary/40" weight="duotone" />
                  </div>
                  <DialogTitle className="text-3xl mb-2">{selectedMaterial.name}</DialogTitle>
                  <p className="text-base text-muted-foreground">{selectedMaterial.description}</p>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle size={20} className="text-primary" /> Material Properties
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
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Atom size={20} className="text-primary" /> Key Advantages
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
                    <Button>
                      Request Technical Datasheet
                    </Button>
                    <Button variant="outline">
                      Contact Materials Team
                    </Button>
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
