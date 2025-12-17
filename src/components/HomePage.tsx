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
      <section className="relative bg-gradient-to-br from-accent/10 via-background to-primary/5 py-40 px-8 overflow-hidden">
        <div className="absolute inset-0">
          <HeroImage src={BackgroundCover} alt="" opacity={0.6} />
        </div>
        <div className="relative max-w-[1280px] mx-auto z-10">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-normal text-foreground mb-6 tracking-tight leading-tight">
              Flexible Bioelectronics & Polymer Medical Devices
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Polymer Bionics develops advanced polymer-based bioelectronics and flexible medical devices for 
              next-generation healthcare solutions, combining material science innovation with clinical precision.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => onNavigate('products')} className="text-base tracking-wide">
                Products <ArrowRight className="ml-2" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 cursor-pointer" onClick={() => onNavigate('team')}>
              <Users size={40} className="text-accent mb-4" weight="duotone" />
              <h3 className="text-xl font-semibold mb-2">Our Team</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Expert polymer scientists, biomedical engineers, and materials researchers advancing flexible bioelectronics.
              </p>
              <Button variant="ghost" className="p-0 h-auto text-accent hover:text-accent/80">
                Learn more <ArrowRight className="ml-1" size={16} />
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 cursor-pointer" onClick={() => onNavigate('materials')}>
              <Atom size={40} className="text-accent mb-4" weight="duotone" />
              <h3 className="text-xl font-semibold mb-2">Materials</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Advanced polymers including PEDOT:PSS, hydrogels, silicones, and specialty coatings for biomedical use.
              </p>
              <Button variant="ghost" className="p-0 h-auto text-accent hover:text-accent/80">
                View materials <ArrowRight className="ml-1" size={16} />
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 cursor-pointer" onClick={() => onNavigate('applications')}>
              <Lightbulb size={40} className="text-accent mb-4" weight="duotone" />
              <h3 className="text-xl font-semibold mb-2">Applications</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Neural interfaces, wearable sensors, drug delivery, cardiac devices, and advanced surgical tools.
              </p>
              <Button variant="ghost" className="p-0 h-auto text-accent hover:text-accent/80">
                Explore uses <ArrowRight className="ml-1" size={16} />
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 cursor-pointer" onClick={() => onNavigate('products')}>
              <Flask size={40} className="text-accent mb-4" weight="duotone" />
              <h3 className="text-xl font-semibold mb-2">Products</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Flexible bioelectronic devices, conductive polymer systems, and soft tissue-compatible sensors.
              </p>
              <Button variant="ghost" className="p-0 h-auto text-accent hover:text-accent/80">
                Explore catalog <ArrowRight className="ml-1" size={16} />
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 cursor-pointer" onClick={() => onNavigate('media')}>
              <Video size={40} className="text-accent mb-4" weight="duotone" />
              <h3 className="text-xl font-semibold mb-2">Case Studies</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Real-world applications in wearable diagnostics, implantable devices, and smart wound healing.
              </p>
              <Button variant="ghost" className="p-0 h-auto text-accent hover:text-accent/80">
                View studies <ArrowRight className="ml-1" size={16} />
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 cursor-pointer" onClick={() => onNavigate('datasheets')}>
              <FileText size={40} className="text-accent mb-4" weight="duotone" />
              <h3 className="text-xl font-semibold mb-2">Technical Data</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Material properties, biocompatibility testing, mechanical flexibility, and performance specifications.
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
            Collaborating with world-class medical centers and research institutions to advance flexible bioelectronics.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-center text-xl font-semibold text-muted-foreground">Medical Centers</div>
            <div className="text-center text-xl font-semibold text-muted-foreground">Research Institutes</div>
            <div className="text-center text-xl font-semibold text-muted-foreground">University Labs</div>
            <div className="text-center text-xl font-semibold text-muted-foreground">Clinical Partners</div>
          </div>
        </div>
      </section>
    </div>
  )
}
