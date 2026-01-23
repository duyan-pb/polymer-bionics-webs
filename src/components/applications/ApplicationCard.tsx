/**
 * Application Card
 * 
 * Displays a single application summary card.
 * 
 * @module components/applications/ApplicationCard
 */

import { Button } from '@/components/ui/button'
import { ClickableCard } from '@/components/ClickableCard'
import { CheckCircle } from '@phosphor-icons/react'
import type { Application } from '@/lib/types'

interface ApplicationCardProps {
  application: Application
  onSelect: (application: Application) => void
}

export function ApplicationCard({ application, onSelect }: ApplicationCardProps) {
  return (
    <ClickableCard
      className="group overflow-hidden"
      onClick={() => onSelect(application)}
      ariaLabel={`View details for ${application.name}`}
    >
      <div className="h-40 overflow-hidden bg-muted transition-all duration-300 group-hover:scale-105">
        {application.imageUrl ? (
          <img src={application.imageUrl} alt={application.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        ) : (
          <div className={`w-full h-full ${application.imageClass || 'bg-gradient-to-br from-primary/20 to-secondary/10'}`}></div>
        )}
      </div>
      <div className="p-5 md:p-8">
        <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 group-hover:text-primary transition-colors">
          {application.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          {application.description}
        </p>
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
              Key Benefits
            </h4>
            <ul className="space-y-2">
              {application.benefits.slice(0, 2).map((benefit, idx) => (
                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                  <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" weight="fill" />
                  {benefit}
                </li>
              ))}
            </ul>
            {application.benefits.length > 2 && (
              <p className="text-xs text-primary font-semibold mt-3">+{application.benefits.length - 2} more benefits</p>
            )}
          </div>
          <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors font-semibold">
            Explore Application
          </Button>
        </div>
      </div>
    </ClickableCard>
  )
}
