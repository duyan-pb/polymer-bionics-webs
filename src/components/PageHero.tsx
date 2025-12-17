import { motion } from 'framer-motion'
import { HeroImage } from '@/components/HeroImage'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/Breadcrumbs'
import { HERO_SECTION_CLASSES, CONTENT_MAX_WIDTH } from '@/lib/constants'
import { cn } from '@/lib/utils'

export interface PageHeroProps {
  title: string
  description: string
  backgroundImage?: string
  backgroundOpacity?: number
  breadcrumbs?: BreadcrumbItem[]
  onNavigate?: (page: string) => void
  actions?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

/**
 * Reusable hero section component for page headers.
 * Reduces duplication across all page components.
 * Mobile-optimized with responsive typography and padding.
 */
export function PageHero({
  title,
  description,
  backgroundImage,
  backgroundOpacity = 0.7,
  breadcrumbs,
  onNavigate,
  actions,
  className,
  children,
}: PageHeroProps) {
  return (
    <section className={cn(HERO_SECTION_CLASSES, 'py-20 md:py-28 lg:py-36 px-4 md:px-8', className)}>
      {backgroundImage && (
        <>
          <HeroImage src={backgroundImage} alt="" opacity={Math.min(backgroundOpacity + 0.2, 1)} />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
        </>
      )}
      <div className={cn('relative z-10', CONTENT_MAX_WIDTH)}>
        {breadcrumbs && onNavigate && (
          <Breadcrumbs trail={breadcrumbs} onNavigate={onNavigate} />
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-8">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 md:mb-6 leading-[1.1]">{title}</h1>
              <p className="text-lg md:text-xl text-foreground/90 max-w-3xl leading-relaxed">
                {description}
              </p>
              {children}
            </div>
            {actions && <div className="flex-shrink-0 mt-4 md:mt-0">{actions}</div>}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
