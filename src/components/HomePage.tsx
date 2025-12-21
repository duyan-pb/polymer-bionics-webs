import { useState, useCallback, memo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, Flask, Users, FileText, Video, Atom, Lightbulb } from '@phosphor-icons/react'
import { HeroImage } from '@/components/HeroImage'
import { ClickableCard } from '@/components/ClickableCard'
import BackgroundCover from '@/assets/images/Background_Cover.png'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface HomePageProps {
  onNavigate: (page: string) => void
}

export const HomePage = memo(({ onNavigate }: HomePageProps) => {
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribe = useCallback(async () => {
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    setIsSubscribing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Successfully subscribed!', {
      description: "You'll receive our latest updates soon."
    })
    setEmail('')
    setIsSubscribing(false)
  }, [email])

  const handleNavigate = useCallback((page: string) => () => onNavigate(page), [onNavigate])

  return (
    <div className="min-h-screen">
      <section className="relative bg-background py-24 md:py-36 lg:py-44 px-4 md:px-8 overflow-hidden">
        <HeroImage src={BackgroundCover} alt="" opacity={0.85} priority />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        <div className="relative max-w-[1280px] mx-auto z-10">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 md:mb-6 tracking-tight leading-[1.1]">
                Flexible Bioelectronics & Polymer Medical Devices
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-foreground/90 mb-8 md:mb-10 leading-relaxed max-w-2xl">
                Polymer Bionics develops advanced flexible polymer-based bioelectronics and medical devices for next-generation healthcare solutions, combining material science innovation with clinical precision.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button size="lg" onClick={() => onNavigate('products')} className="text-base font-semibold tracking-wide shadow-lg w-full sm:w-auto h-12 px-8">
                  Explore Products <ArrowRight className="ml-2" size={20} />
                </Button>
                <Button size="lg" variant="outline" onClick={() => onNavigate('team')} className="text-base font-semibold bg-background/90 backdrop-blur-sm w-full sm:w-auto h-12 px-8">
                  Meet the Team
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 md:px-8 bg-background">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <ClickableCard 
              className="p-5 md:p-8 bg-card/60 backdrop-blur hover:shadow-primary/40" 
              onClick={handleNavigate('team')}
              ariaLabel="Navigate to Our Team page"
            >
              <Users size={40} className="text-primary mb-3 md:mb-4 md:w-12 md:h-12" weight="duotone" />
              <h3 className="text-xl md:text-2xl mb-2 md:mb-3">Our Team</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 leading-relaxed">
                Expert polymer scientists, biomedical engineers, and materials researchers advancing flexible bioelectronics.
              </p>
              <div className="flex items-center text-primary hover:gap-3 gap-2 transition-all">
                Learn more <ArrowRight size={20} />
              </div>
            </ClickableCard>

            <ClickableCard 
              className="p-5 md:p-8 bg-card/60 backdrop-blur hover:shadow-primary/40" 
              onClick={handleNavigate('materials')}
              ariaLabel="Navigate to Materials page"
            >
              <Atom size={40} className="text-primary mb-3 md:mb-4 md:w-12 md:h-12" weight="duotone" />
              <h3 className="text-xl md:text-2xl mb-2 md:mb-3">Materials</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 leading-relaxed">
                Advanced polymers including PEDOT:PSS, hydrogels, silicones, and specialty coatings for biomedical use.
              </p>
              <div className="flex items-center text-primary hover:gap-3 gap-2 transition-all">
                View materials <ArrowRight size={20} />
              </div>
            </ClickableCard>

            <ClickableCard 
              className="p-5 md:p-8 bg-card/60 backdrop-blur hover:shadow-primary/40" 
              onClick={handleNavigate('applications')}
              ariaLabel="Navigate to Applications page"
            >
              <Lightbulb size={40} className="text-primary mb-3 md:mb-4 md:w-12 md:h-12" weight="duotone" />
              <h3 className="text-xl md:text-2xl mb-2 md:mb-3">Applications</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 leading-relaxed">
                Neural interfaces, wearable sensors, drug delivery, cardiac devices, and advanced surgical tools.
              </p>
              <div className="flex items-center text-primary hover:gap-3 gap-2 transition-all">
                Explore uses <ArrowRight size={20} />
              </div>
            </ClickableCard>

            <ClickableCard 
              className="p-5 md:p-8 bg-card/60 backdrop-blur hover:shadow-primary/40" 
              onClick={handleNavigate('products')}
              ariaLabel="Navigate to Products page"
            >
              <Flask size={40} className="text-primary mb-3 md:mb-4 md:w-12 md:h-12" weight="duotone" />
              <h3 className="text-xl md:text-2xl mb-2 md:mb-3">Products</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 leading-relaxed">
                Flexible bioelectronic devices, conductive polymer systems, and soft tissue-compatible sensors.
              </p>
              <div className="flex items-center text-primary hover:gap-3 gap-2 transition-all">
                Explore catalog <ArrowRight size={20} />
              </div>
            </ClickableCard>

            <ClickableCard 
              className="p-5 md:p-8 bg-card/60 backdrop-blur hover:shadow-primary/40" 
              onClick={handleNavigate('media')}
              ariaLabel="Navigate to Case Studies page"
            >
              <Video size={40} className="text-primary mb-3 md:mb-4 md:w-12 md:h-12" weight="duotone" />
              <h3 className="text-xl md:text-2xl mb-2 md:mb-3">Case Studies</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 leading-relaxed">
                Real-world applications in wearable diagnostics, implantable devices, and smart wound healing.
              </p>
              <div className="flex items-center text-primary hover:gap-3 gap-2 transition-all">
                View studies <ArrowRight size={20} />
              </div>
            </ClickableCard>

            <ClickableCard 
              className="p-5 md:p-8 bg-card/60 backdrop-blur hover:shadow-primary/40" 
              onClick={handleNavigate('datasheets')}
              ariaLabel="Navigate to Technical Data page"
            >
              <FileText size={40} className="text-primary mb-3 md:mb-4 md:w-12 md:h-12" weight="duotone" />
              <h3 className="text-xl md:text-2xl mb-2 md:mb-3">Technical Data</h3>
              <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 leading-relaxed">
                Material properties, biocompatibility testing, mechanical flexibility, and performance specifications.
              </p>
              <div className="flex items-center text-primary hover:gap-3 gap-2 transition-all">
                Access library <ArrowRight size={20} />
              </div>
            </ClickableCard>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 md:px-8 bg-muted/40">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-2xl md:text-4xl text-center mb-2 font-semibold">Trusted by Leading Institutions</h2>
          <p className="text-center text-muted-foreground mb-6 md:mb-10 max-w-2xl mx-auto text-sm md:text-lg px-4">
            Collaborating with world-class medical centers and research institutions to advance flexible bioelectronics.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 items-center">
            {["Partner Placeholder", "Partner Placeholder", "Partner Placeholder", "Partner Placeholder"].map((name, index) => (
              <Card key={index} className="p-4 md:p-6 text-center border-dashed border-primary/30 hover:border-primary transition-colors">
                <div className="text-sm md:text-lg font-semibold text-foreground">{name}</div>
                <p className="text-xs md:text-sm text-muted-foreground">Partner</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 px-4 md:px-8 bg-background">
        <div className="max-w-[1280px] mx-auto max-w-2xl">
          <div className="text-center px-4">
            <h2 className="text-2xl md:text-4xl mb-3 md:mb-4">Stay ahead with Polymer Bionics</h2>
            <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6">Join our newsletter for the latest breakthroughs, case studies, and clinical data drops.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <div className="flex-1 max-w-sm">
                <Label htmlFor="newsletter-email" className="sr-only">Email address</Label>
                <Input 
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address" 
                  aria-label="Email address for newsletter subscription"
                  className="h-12 text-base" 
                  disabled={isSubscribing}
                />
              </div>
              <Button 
                className="h-12 px-6" 
                onClick={handleSubscribe}
                disabled={isSubscribing}
                aria-label="Subscribe to newsletter"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">We send 1-2 updates per month. No spam.</p>
          </div>
        </div>
      </section>
    </div>
  )
})
