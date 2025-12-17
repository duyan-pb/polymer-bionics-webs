import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowRight, Flask, Users, FileText, Video, Atom, Lightbulb, Sparkle } from '@phosphor-icons/react'
import { HeroImage } from '@/components/HeroImage'
import BackgroundCover from '@/assets/images/Background_Cover.png'
import { motion } from 'framer-motion'

interface HomePageProps {
  onNavigate: (page: string) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-accent/10 via-background to-primary/5 py-30 px-8 overflow-hidden">
        <div className="absolute inset-0">
          <HeroImage src={BackgroundCover} alt="" opacity={0.7} />
        </div>
        <div className="relative max-w-[1280px] mx-auto z-10">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-6xl text-foreground mb-6 tracking-tight leading-tight">
                Flexible Bioelectronics & Polymer Medical Devices
              </h1>
              <p className="text-xl text-foreground/80 mb-8 leading-relaxed">
                Polymer Bionics develops advanced polymer-based bioelectronics and flexible medical devices for 
                next-generation healthcare solutions, combining material science innovation with clinical precision.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" onClick={() => onNavigate('products')} className="text-base tracking-wide shadow-lg">
                  Explore Products <ArrowRight className="ml-2" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate('team')} className="text-base bg-background/80 backdrop-blur-sm">
                  Meet the Team
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="h-16 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />

      <section className="py-16 px-8 bg-background">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-8 hover:shadow-primary/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-card/60 backdrop-blur" onClick={() => onNavigate('team')}>
              <Users size={48} className="text-primary mb-4" weight="duotone" />
              <h3 className="text-2xl mb-3">Our Team</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Expert polymer scientists, biomedical engineers, and materials researchers advancing flexible bioelectronics.
              </p>
              <div className="flex items-center text-primary hover:gap-3 gap-2 transition-all">
                Learn more <ArrowRight size={20} />
              </div>
            </Card>

            <Card className="p-8 hover:shadow-primary/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-card/60 backdrop-blur" onClick={() => onNavigate('materials')}>
              <Atom size={48} className="text-primary mb-4" weight="duotone" />
              <h3 className="text-2xl mb-3">Materials</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Advanced polymers including PEDOT:PSS, hydrogels, silicones, and specialty coatings for biomedical use.
              </p>
              <div className="flex items-center text-primary hover:gap-3 gap-2 transition-all">
                View materials <ArrowRight size={20} />
              </div>
            </Card>

            <Card className="p-8 hover:shadow-primary/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-card/60 backdrop-blur" onClick={() => onNavigate('applications')}>
              <Lightbulb size={48} className="text-primary mb-4" weight="duotone" />
              <h3 className="text-2xl mb-3">Applications</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Neural interfaces, wearable sensors, drug delivery, cardiac devices, and advanced surgical tools.
              </p>
              <div className="flex items-center text-primary hover:gap-3 gap-2 transition-all">
                Explore uses <ArrowRight size={20} />
              </div>
            </Card>

            <Card className="p-8 hover:shadow-primary/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-card/60 backdrop-blur" onClick={() => onNavigate('products')}>
              <Flask size={48} className="text-primary mb-4" weight="duotone" />
              <h3 className="text-2xl mb-3">Products</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Flexible bioelectronic devices, conductive polymer systems, and soft tissue-compatible sensors.
              </p>
              <div className="flex items-center text-primary hover:gap-3 gap-2 transition-all">
                Explore catalog <ArrowRight size={20} />
              </div>
            </Card>

            <Card className="p-8 hover:shadow-primary/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-card/60 backdrop-blur" onClick={() => onNavigate('media')}>
              <Video size={48} className="text-primary mb-4" weight="duotone" />
              <h3 className="text-2xl mb-3">Case Studies</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Real-world applications in wearable diagnostics, implantable devices, and smart wound healing.
              </p>
              <div className="flex items-center text-primary hover:gap-3 gap-2 transition-all">
                View studies <ArrowRight size={20} />
              </div>
            </Card>

            <Card className="p-8 hover:shadow-primary/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-card/60 backdrop-blur" onClick={() => onNavigate('datasheets')}>
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

      <section className="py-16 px-8 bg-secondary/30">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-4xl text-center mb-2">Trusted by Leading Institutions</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto text-lg">
            Collaborating with world-class medical centers and research institutions to advance flexible bioelectronics.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {["Partner Placeholder", "Partner Placeholder", "Partner Placeholder", "Partner Placeholder"].map((name, index) => (
              <Card key={index} className="p-6 text-center border-dashed border-primary/30 hover:border-primary transition-colors">
                <div className="text-lg font-semibold text-foreground">{name}</div>
                <p className="text-sm text-muted-foreground">Partner</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-8 bg-background">
        <div className="max-w-[1280px] mx-auto max-w-2xl">
          <div className="text-center">
            <h2 className="text-4xl mb-4">Stay ahead with Polymer Bionics</h2>
            <p className="text-lg text-muted-foreground mb-6">Join our newsletter for the latest breakthroughs, case studies, and clinical data drops.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Input placeholder="Email address" className="h-12 text-base max-w-sm" />
              <Button className="h-12 px-6">Subscribe</Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">We send 1-2 updates per month. No spam.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
