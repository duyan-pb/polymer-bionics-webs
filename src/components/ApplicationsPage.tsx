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

export function ApplicationsPage() {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-6">
            <h1 className="text-6xl font-normal mb-4">Applications</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            Applications for healthcare and diagnostics. Polymer Bionics materials enable breakthrough medical 
            technologies across diverse clinical applications—from peripheral nerve interfaces to continuous 
            infant monitoring, our flexible bioelectronics platform supports innovation that improves patient outcomes.
          </p>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {applications.map((application) => (
                <Card
                  key={application.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer border-2 hover:border-accent"
                  onClick={() => setSelectedApplication(application)}
                >
                  <div className={`h-32 ${application.imageClass || 'bg-gradient-to-br from-accent/20 to-primary/10'} 
                    transition-all duration-300 group-hover:scale-105`}>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-3 group-hover:text-accent transition-colors">
                      {application.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {application.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                          Key Benefits
                        </h4>
                        <ul className="space-y-1">
                          {application.benefits.slice(0, 2).map((benefit, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                              <CheckCircle size={14} className="text-accent mt-0.5 flex-shrink-0" weight="fill" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                        {application.benefits.length > 2 && (
                          <p className="text-xs text-accent mt-2">+{application.benefits.length - 2} more benefits</p>
                        )}
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                        Explore Application
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
          <h2 className="text-4xl font-bold mb-4">Partner With Us</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            We collaborate with medical device companies, research institutions, and healthcare providers to bring 
            innovative bioelectronic solutions from concept to clinical reality.
          </p>
          <ContactLinks emailType="sales" />
        </div>
      </section>

      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedApplication && (
              <>
                <DialogHeader>
                  <div className={`h-40 -mx-6 -mt-6 mb-6 ${selectedApplication.imageClass || 'bg-gradient-to-br from-accent/20 to-primary/10'}`}>
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
