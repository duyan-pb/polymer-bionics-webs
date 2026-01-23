/**
 * Page Section
 * 
 * Consistent page section wrapper with padding and container width.
 * 
 * @module components/layout/PageSection
 */

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageSectionProps {
  children: ReactNode
  className?: string
  containerClassName?: string
}

export function PageSection({ children, className, containerClassName }: PageSectionProps) {
  return (
    <section className={cn('py-12 md:py-20 px-4 md:px-8', className)}>
      <div className={cn('max-w-[1280px] mx-auto', containerClassName)}>
        {children}
      </div>
    </section>
  )
}
