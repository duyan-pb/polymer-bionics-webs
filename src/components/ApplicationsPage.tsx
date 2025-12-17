import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Package
} from '@phosphor-icons/react'
import { applications, type Application } from '@/lib/materials-data'
import { ContactLinks } from '@/components/ContactLinks'
import { HeroImage } from '@/components/HeroImage'
import NeuralCells from '@/assets/images/Neural_Cells.png'

export function ApplicationsPage() {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-28 px-8 overflow-hidden">
        <div className="absolute inset-0">
          <HeroImage src={NeuralCells} alt="" opacity={0.5} />
        </div>
        <div className="relative max-w-[1280px] mx-auto z-10">
          <div className="mb-6">
            <h1 className="text-6xl font-bold mb-6">Applications</h1>
          </div>
          <p className="text-xl text-foreground/80 max-w-3xl leading-relaxed">
            Applications for healthcare and diagnostics. Polymer Bionics materials enable breakthrough medical 
            technologies across diverse clinical applications—from peripheral nerve interfaces to continuous 
            infant monitoring, our flexible bioelectronics platform supports innovation that improves patient outcomes.
          </p>
        </div>
      </section>

      <section className="py-20 px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {applications.map((application) => (
                <Card
                  key={application.id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] cursor-pointer hover:border-primary"
                  onClick={() => setSelectedApplication(application)}
                >
                  <div className="h-40 overflow-hidden bg-muted transition-all duration-300 group-hover:scale-105">
                    {application.imageUrl ? (
                      <img src={application.imageUrl} alt={application.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full ${application.imageClass || 'bg-gradient-to-br from-primary/20 to-secondary/10'}`}></div>
                    )}
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {application.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                      {application.description}
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
                          Key Benefits
                        </h4>
                        <ul className="space-y-2">
                          {application.benefits.slice(0, 2).map((benefit, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                              <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" weight="fill" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                        {application.benefits.length > 2 && (
                          <p className="text-xs text-primary font-semibold mt-3">+{application.benefits.length - 2} more benefits</p>
                        )}
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors font-semibold">
                        Explore Application
                      </Button>
                    </div>
                  </div>
                </Card>
            ))}
          </div>
        </div>
      </section>



      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedApplication && (
              <>
                <DialogHeader>
                  <div className="h-40 -mx-6 -mt-6 mb-6 overflow-hidden bg-muted">
                    {selectedApplication.imageUrl ? (
                      <img src={selectedApplication.imageUrl} alt={selectedApplication.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full ${selectedApplication.imageClass || 'bg-gradient-to-br from-accent/20 to-primary/10'}`}></div>
                    )}
                  </div>
                  <DialogTitle className="text-3xl mb-2">{selectedApplication.name}</DialogTitle>
                  <p className="text-base text-muted-foreground">{selectedApplication.description}</p>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-3">
                      Key Benefits
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedApplication.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle size={16} className="text-accent mt-1 flex-shrink-0" weight="fill" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-lg font-semibold mb-3">
                      Clinical Use Cases
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedApplication.useCases.map((useCase, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle size={16} className="text-accent mt-1 flex-shrink-0" weight="fill" />
                          <span className="text-muted-foreground">{useCase}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-lg font-semibold mb-3">Relevant Materials</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.relevantMaterials.map((material, idx) => (
                        <Badge key={idx} variant="secondary" className="text-sm">
                          {material}
                        </Badge>
                      ))}
                    </div>
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
