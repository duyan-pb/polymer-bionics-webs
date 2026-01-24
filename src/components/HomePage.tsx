/**
 * Home Page Component
 * 
 * Landing page with hero section, feature highlights, and newsletter signup.
 * Serves as the main entry point for the website.
 * 
 * @module components/HomePage
 */

import { useState, useCallback, memo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Flask, Users, FileText, Video, Atom, Lightbulb } from '@phosphor-icons/react'
import { HeroImage } from '@/components/HeroImage'
import BackgroundCover from '@/assets/images/optimized/Background_Cover.webp'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { submitNewsletterSubscription } from '@/lib/form-service'
import { HOME_FEATURE_ICON_SIZE, HOME_PARTNER_PLACEHOLDER_COUNT } from '@/lib/constants'
import { HomeFeatureCard } from '@/components/home/HomeFeatureCard'
import { NewsletterSignup } from '@/components/home/NewsletterSignup'

// Preload hero image immediately for faster LCP
const preloadImage = new Image()
preloadImage.src = BackgroundCover

// TODO: Replace partner placeholders with real partner/collaborator logos
// TODO: Add real customer testimonials section
// TODO: Add recent news/announcements section

/**
 * Props for the HomePage component.
 */
interface HomePageProps {
  /** Navigation handler */
  onNavigate: (page: string) => void
}

/**
 * Home page component - the main landing page.
 * 
 * Features:
 * - Hero section with animated background
 * - Feature highlight cards linking to other sections
 * - Newsletter subscription form
 * - Responsive layout for mobile and desktop
 * 
 * @example
 * ```tsx
 * <HomePage onNavigate={handleNavigate} />
 * ```
 */
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
    
    try {
      const result = await submitNewsletterSubscription({ email })
      
      if (result.success) {
        toast.success('Successfully subscribed!', {
          description: "You'll receive our latest updates soon."
        })
        setEmail('')
      } else {
        toast.error('Subscription failed', {
          description: result.error ?? 'Please try again later.'
        })
      }
    } catch {
      toast.error('Something went wrong', {
        description: 'Please try again later.'
      })
    } finally {
      setIsSubscribing(false)
    }
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
                Flexible Bioelectronics & Medical Devices
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
            <HomeFeatureCard
              title="Our Team"
              description="Expert polymer scientists, biomedical engineers, and materials researchers advancing flexible bioelectronics."
              actionLabel="Learn more"
              icon={<Users size={HOME_FEATURE_ICON_SIZE} className="md:w-12 md:h-12" weight="duotone" />}
              onSelect={handleNavigate('team')}
              ariaLabel="Navigate to Our Team page"
            />
            <HomeFeatureCard
              title="Materials"
              description="Advanced polymers including PEDOT:PSS, hydrogels, silicones, and specialty coatings for biomedical use."
              actionLabel="View materials"
              icon={<Atom size={HOME_FEATURE_ICON_SIZE} className="md:w-12 md:h-12" weight="duotone" />}
              onSelect={handleNavigate('materials')}
              ariaLabel="Navigate to Materials page"
            />
            <HomeFeatureCard
              title="Applications"
              description="Neural interfaces, wearable sensors, drug delivery, cardiac devices, and advanced surgical tools."
              actionLabel="Explore uses"
              icon={<Lightbulb size={HOME_FEATURE_ICON_SIZE} className="md:w-12 md:h-12" weight="duotone" />}
              onSelect={handleNavigate('applications')}
              ariaLabel="Navigate to Applications page"
            />
            <HomeFeatureCard
              title="Products"
              description="Flexible bioelectronic devices, conductive polymer systems, and soft tissue-compatible sensors."
              actionLabel="Explore catalog"
              icon={<Flask size={HOME_FEATURE_ICON_SIZE} className="md:w-12 md:h-12" weight="duotone" />}
              onSelect={handleNavigate('products')}
              ariaLabel="Navigate to Products page"
            />
            <HomeFeatureCard
              title="Case Studies"
              description="Real-world applications in wearable diagnostics, implantable devices, and smart wound healing."
              actionLabel="View studies"
              icon={<Video size={HOME_FEATURE_ICON_SIZE} className="md:w-12 md:h-12" weight="duotone" />}
              onSelect={handleNavigate('media')}
              ariaLabel="Navigate to Case Studies page"
            />
            <HomeFeatureCard
              title="Technical Data"
              description="Material properties, biocompatibility testing, mechanical flexibility, and performance specifications."
              actionLabel="Access library"
              icon={<FileText size={HOME_FEATURE_ICON_SIZE} className="md:w-12 md:h-12" weight="duotone" />}
              onSelect={handleNavigate('datasheets')}
              ariaLabel="Navigate to Technical Data page"
            />
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
            {Array.from({ length: HOME_PARTNER_PLACEHOLDER_COUNT }).map((_, index) => (
              <Card key={index} className="p-4 md:p-6 text-center border-dashed border-primary/30 hover:border-primary transition-colors">
                <div className="text-sm md:text-lg font-semibold text-foreground">Partner Placeholder</div>
                <p className="text-xs md:text-sm text-muted-foreground">Partner</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 px-4 md:px-8 bg-background">
        <div className="max-w-[1280px] mx-auto max-w-2xl">
          <NewsletterSignup
            email={email}
            isSubmitting={isSubscribing}
            onEmailChange={setEmail}
            onSubmit={handleSubscribe}
          />
        </div>
      </section>
    </div>
  )
})
