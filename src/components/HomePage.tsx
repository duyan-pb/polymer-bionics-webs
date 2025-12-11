import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Flask, Users, FileText, Video } from '@phosphor-icons/react'

interface HomePageProps {
  onNavigate: (page: string) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-24 px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-bold text-foreground mb-6 tracking-tight leading-tight">
              Advanced Biomaterials for Medical Innovation
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Polymer Bionics develops next-generation bioadhesives, conductive polymers, and medical-grade materials
              for surgical applications, neural interfaces, and drug delivery systems.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => onNavigate('products')} className="text-base tracking-wide">
                View Products <ArrowRight className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => onNavigate('team')} className="text-base">
                Meet the Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-8 bg-background">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 cursor-pointer" onClick={() => onNavigate('team')}>
              <Users size={40} className="text-primary mb-4" weight="duotone" />
              <h3 className="text-xl font-semibold mb-2">Our Team</h3>
              <p className="text-muted-foreground text-sm mb-4">
                World-class scientists and engineers with expertise in polymer chemistry and medical devices.
              </p>
              <Button variant="ghost" className="p-0 h-auto text-accent hover:text-accent/80">
                Learn more <ArrowRight className="ml-1" size={16} />
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 cursor-pointer" onClick={() => onNavigate('products')}>
              <Flask size={40} className="text-primary mb-4" weight="duotone" />
              <h3 className="text-xl font-semibold mb-2">Products</h3>
              <p className="text-muted-foreground text-sm mb-4">
                High-performance polymers for surgical adhesives, wearable sensors, and implantable devices.
              </p>
              <Button variant="ghost" className="p-0 h-auto text-accent hover:text-accent/80">
                Explore catalog <ArrowRight className="ml-1" size={16} />
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 cursor-pointer" onClick={() => onNavigate('media')}>
              <Video size={40} className="text-primary mb-4" weight="duotone" />
              <h3 className="text-xl font-semibold mb-2">Case Studies</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Real-world validation through laboratory testing and clinical collaborations.
              </p>
              <Button variant="ghost" className="p-0 h-auto text-accent hover:text-accent/80">
                View studies <ArrowRight className="ml-1" size={16} />
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 cursor-pointer" onClick={() => onNavigate('datasheets')}>
              <FileText size={40} className="text-primary mb-4" weight="duotone" />
              <h3 className="text-xl font-semibold mb-2">Technical Data</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Comprehensive datasheets with mechanical properties, biocompatibility, and regulatory compliance.
              </p>
              <Button variant="ghost" className="p-0 h-auto text-accent hover:text-accent/80">
                Access library <ArrowRight className="ml-1" size={16} />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-8 bg-muted/30">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Trusted by Leading Institutions</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Collaborating with world-renowned research institutions and healthcare providers to advance medical technology.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-center text-xl font-semibold text-muted-foreground">University of Oxford</div>
            <div className="text-center text-xl font-semibold text-muted-foreground">NHS Trusts</div>
            <div className="text-center text-xl font-semibold text-muted-foreground">Materials Lab</div>
            <div className="text-center text-xl font-semibold text-muted-foreground">Research Partners</div>
          </div>
        </div>
      </section>
    </div>
  )
}
