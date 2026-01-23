/**
 * Coming Soon Card Component
 * 
 * Standard empty-state card with icon, title, description, and contact CTA.
 * 
 * @module components/ComingSoonCard
 */

import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { ContactCTA } from '@/components/ContactCTA'

interface ComingSoonCardProps {
  /** Icon to display (already styled) */
  icon: ReactNode
  /** Heading text */
  title: string
  /** Description text */
  description: string
  /** Email type for contact CTA */
  emailType?: 'general' | 'sales'
}

/**
 * Standardized empty-state card used across content pages.
 */
export function ComingSoonCard({
  icon,
  title,
  description,
  emailType = 'general',
}: ComingSoonCardProps) {
  return (
    <Card className="p-16 text-center space-y-3">
      {icon}
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-muted-foreground max-w-xl mx-auto">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
        <ContactCTA emailType={emailType} />
      </div>
    </Card>
  )
}
