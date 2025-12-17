import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Flask, Users, FileText, Video, Atom, Lightbulb } from '@phosphor-icons/react'
import { ContactLinks } from '@/components/ContactLinks'
import { HeroImage } from '@/components/HeroImage'
import BackgroundCover from '@/assets/images/Background_Cover.png'

interface HomePageProps {
  onNavigate: (page: string) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-accent/10 via-background to-primary/5 py-56 px-8 overflow-hidden">
        <div className="absolute inset-0">
          <HeroImage src={BackgroundCover} alt="" opacity={0.7} />
        </div>
        <div className="relative max-w-[1280px] mx-auto z-10">
          <div className="max-w-3xl">
            <h1 className="text-6xl text-foreground mb-6 tracking-tight leading-tight">
              Flexible Bioelectronics & Polymer Medical Devices
            </h1>
            <p className="text-xl text-foreground/80 mb-8 leading-relaxed">
              Polymer Bionics develops advanced polymer-based bioelectronics and flexible medical devices for 
              next-generation healthcare solutions, combining material science innovation with clinical precision.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => onNavigate('products')} className="text-base tracking-wide">
                Explore Products <ArrowRight className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => onNavigate('team')} className="text-base bg-background/80 backdrop-blur-sm">
                Meet the Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-8 bg-background">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer bg-card/50 backdrop-blur-sm" onClick={() => onNavigate('team')}>
              <Users size={48} className="text-primary mb-4" weight="duotone" />
              <h3 className="text-2xl mb-3">Our Team</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Expert polymer scientists, biomedical engineers, and materials researchers advancing flexible bioelectronics.
              </p>
              <div className="flex items-center text-primary hover:gap-3 gap-2 transition-all">
                Learn more <ArrowRight size={20} />
              </div>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer bg-card/50 backdrop-blur-sm" onClick={() => onNavigate('materials')}>
              <Atom size={48} className="text-primary mb-4" weight="duotone" />
              <h3 className="text-2xl mb-3">Materials</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Advanced polymers including PEDOT:PSS, hydrogels, silicones, and specialty coatings for biomedical use.
              </p>
              <div className="flex items-center text-primary hover:gap-3 gap-2 transition-all">
                View materials <ArrowRight size={20} />
              </div>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer bg-card/50 backdrop-blur-sm" onClick={() => onNavigate('applications')}>
              <Lightbulb size={48} className="text-primary mb-4" weight="duotone" />
              <h3 className="text-2xl mb-3">Applications</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Neural interfaces, wearable sensors, drug delivery, cardiac devices, and advanced surgical tools.
              </p>
              <div className="flex items-center text-primary hover:gap-3 gap-2 transition-all">
                Explore uses <ArrowRight size={20} />
              </div>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer bg-card/50 backdrop-blur-sm" onClick={() => onNavigate('products')}>
              <Flask size={48} className="text-primary mb-4" weight="duotone" />
              <h3 className="text-2xl mb-3">Products</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Flexible bioelectronic devices, conductive polymer systems, and soft tissue-compatible sensors.
              </p>
              <div className="flex items-center text-primary hover:gap-3 gap-2 transition-all">
                Explore catalog <ArrowRight size={20} />
              </div>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer bg-card/50 backdrop-blur-sm" onClick={() => onNavigate('media')}>
              <Video size={48} className="text-primary mb-4" weight="duotone" />
              <h3 className="text-2xl mb-3">Case Studies</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Real-world applications in wearable diagnostics, implantable devices, and smart wound healing.
              </p>
              <div className="flex items-center text-primary hover:gap-3 gap-2 transition-all">
                View studies <ArrowRight size={20} />
              </div>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer bg-card/50 backdrop-blur-sm" onClick={() => onNavigate('datasheets')}>
              <FileText size={48} className="text-primary mb-4" weight="duotone" />
              <h3 className="text-2xl mb-3">Technical Data</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Material properties, biocompatibility testing, mechanical flexibility, and performance specifications.
              </p>
              <div className="flex items-center text-primary hover:gap-3 gap-2 transition-all">
                Access library <ArrowRight size={20} />
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-4 px-8 bg-secondary/30">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-4xl text-center mb-2">Trusted by Leading Institutions</h2>
          <p className="text-center text-muted-foreground mb-4 max-w-2xl mx-auto text-lg">
            Collaborating with world-class medical centers and research institutions to advance flexible bioelectronics.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            <div className="text-center">
              <div className="text-lg text-muted-foreground/60">Medical Centers</div>
            </div>
            <div className="text-center">
              <div className="text-lg text-muted-foreground/60">Research Institutes</div>
            </div>
            <div className="text-center">
              <div className="text-lg text-muted-foreground/60">University Labs</div>
            </div>
            <div className="text-center">
              <div className="text-lg text-muted-foreground/60">Clinical Partners</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
