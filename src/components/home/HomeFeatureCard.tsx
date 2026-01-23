/**
 * Home Feature Card
 * 
 * Displays a navigation feature card on the home page.
 * 
 * @module components/home/HomeFeatureCard
 */

import type { ReactNode } from 'react'
import { ArrowRight } from '@phosphor-icons/react'
import { ClickableCard } from '@/components/ClickableCard'

interface HomeFeatureCardProps {
  title: string
  description: string
  actionLabel: string
  icon: ReactNode
  onSelect: () => void
  ariaLabel: string
}

export function HomeFeatureCard({ title, description, actionLabel, icon, onSelect, ariaLabel }: HomeFeatureCardProps) {
  return (
    <ClickableCard
      className="p-5 md:p-8 bg-card/60 backdrop-blur hover:shadow-primary/40"
      onClick={onSelect}
      ariaLabel={ariaLabel}
    >
      <div className="text-primary mb-3 md:mb-4 md:w-12 md:h-12">{icon}</div>
      <h3 className="text-xl md:text-2xl mb-2 md:mb-3">{title}</h3>
      <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 leading-relaxed">
        {description}
      </p>
      <div className="flex items-center text-primary hover:gap-3 gap-2 transition-all">
        {actionLabel} <ArrowRight size={20} />
      </div>
    </ClickableCard>
  )
}
