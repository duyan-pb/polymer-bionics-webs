/**
 * Team Grid
 * 
 * Renders a team category section with member cards.
 * 
 * @module components/team/TeamGrid
 */

import { ClickableCard } from '@/components/ClickableCard'
import { User } from '@phosphor-icons/react'
import type { TeamMember } from '@/lib/types'

interface TeamGridProps {
  members: TeamMember[]
  title: string
  onSelect: (member: TeamMember) => void
}

export function TeamGrid({ members, title, onSelect }: TeamGridProps) {
  return (
    <div className="mb-12 md:mb-20">
      <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-10 text-primary">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {members.map((member) => (
          <ClickableCard
            key={member.id}
            className="overflow-hidden"
            onClick={() => onSelect(member)}
            ariaLabel={`View profile of ${member.name}`}
          >
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center">
              {member.imageUrl ? (
                <img 
                  src={member.imageUrl} 
                  alt={member.name} 
                  className="w-full h-full object-cover" 
                  style={member.imagePosition ? { objectPosition: member.imagePosition } : undefined}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <User size={100} className="text-muted-foreground/40" weight="light" />
              )}
            </div>
            <div className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold mb-1.5">{member.name}</h3>
              <p className="text-xs md:text-sm text-primary font-semibold mb-2 md:mb-3">{member.title}</p>
              <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 leading-relaxed">{member.shortBio}</p>
            </div>
          </ClickableCard>
        ))}
      </div>
    </div>
  )
}
