/**
 * Page Hero Component
 * 
 * Reusable hero section for page headers. Provides consistent styling
 * and animation across all page components with support for breadcrumbs,
 * background images, and action buttons.
 * 
 * @module components/PageHero
 */

import { motion } from 'framer-motion'
import { HeroImage } from '@/components/HeroImage'
import { Breadcrumbs, type BreadcrumbItem } from '@/components/Breadcrumbs'
import { HERO_SECTION_CLASSES, CONTENT_MAX_WIDTH } from '@/lib/constants'
import { cn } from '@/lib/utils'

/**
 * Props for the PageHero component.
 */
export interface PageHeroProps {
  /** Page title displayed as h1 */
  title: string
  /** Page description text */
  description: string
  /** Optional background image URL */
  backgroundImage?: string
  /** Background image opacity (0-1, default: 0.7) */
  backgroundOpacity?: number
  /** Breadcrumb navigation trail */
  breadcrumbs?: BreadcrumbItem[]
  /** Navigation handler for breadcrumb links */
  onNavigate?: (page: string) => void
  /** Action buttons or elements to display */
  actions?: React.ReactNode
  /** Additional CSS classes */
  className?: string
  /** Additional content below description */
  children?: React.ReactNode
}

/**
 * Reusable hero section component for page headers.
 * 
 * Features:
 * - Animated entrance with Framer Motion
 * - Optional background image with gradient overlay
 * - Breadcrumb navigation support
 * - Responsive typography and padding
 * - Action button slot for CTAs
 * 
 * @example
 * ```tsx
 * <PageHero
 *   title="Our Team"
 *   description="Meet the experts behind our innovations"
 *   breadcrumbs={[{ label: 'Home', page: 'home' }]}
 *   onNavigate={handleNavigate}
 * />
 * ```
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
