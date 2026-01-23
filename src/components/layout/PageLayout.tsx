/**
 * Page Layout
 * 
 * Combines PageHero and PageSection into a standard page scaffold.
 * 
 * @module components/layout/PageLayout
 */

import type { ReactNode } from 'react'
import { PageHero, type PageHeroProps } from '@/components/PageHero'
import { PageSection } from '@/components/layout/PageSection'
import { cn } from '@/lib/utils'

interface PageLayoutProps {
  hero: PageHeroProps
  children: ReactNode
  className?: string
  sectionClassName?: string
  containerClassName?: string
}

export function PageLayout({ hero, children, className, sectionClassName, containerClassName }: PageLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <PageHero {...hero} />
      <PageSection className={sectionClassName} containerClassName={containerClassName}>
        {children}
      </PageSection>
    </div>
  )
}
