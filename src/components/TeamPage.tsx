/**
 * Team Page Component
 * 
 * Displays team member profiles organized by category.
 * Features profile cards with modal detail view.
 * 
 * @module components/TeamPage
 */

import { useState, useMemo, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageHero } from '@/components/PageHero'
import BackgroundCover from '@/assets/images/Background_Cover.png'
import { TEAM_CATEGORIES, type TeamCategory } from '@/lib/constants'
import type { TeamMember } from '@/lib/types'
import { TeamGrid } from '@/components/team/TeamGrid'
import { TeamMemberDialogContent } from '@/components/team/TeamMemberDialogContent'
import { TeamLoadingSkeleton } from '@/components/team/TeamLoadingSkeleton'
import { PageSection } from '@/components/layout/PageSection'

/**
 * Props for the TeamPage component.
 */
interface TeamPageProps {
  /** Initial team member data from parent */
  team: TeamMember[]
  /** Navigation handler */
  onNavigate: (page: string) => void
}

/**
 * Team page component displaying member profiles.
 * 
 * Features:
 * - Team members grouped by category (founders, research, etc.)
 * - Clickable profile cards with photos
 * - Modal dialog with full biography
 * - LinkedIn and Scholar profile links
 * 
 * @example
 * ```tsx
 * <TeamPage team={teamMembers} onNavigate={handleNavigate} />
 * ```
 */
export function TeamPage({ team: initialTeam, onNavigate }: TeamPageProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [team] = useKV<TeamMember[]>('team', initialTeam)
  const isLoading = !team || team.length === 0

  // Group team members by category using the centralized TEAM_CATEGORIES
  const teamByCategory = useMemo(() => {
    return (team || []).reduce((acc, member) => {
      if (!acc[member.category]) {
        acc[member.category] = []
      }
      acc[member.category].push(member)
      return acc
    }, {} as Record<TeamCategory, TeamMember[]>)
  }, [team])

  // Order categories for display
  const categoryOrder: TeamCategory[] = ['founders', 'management', 'lab-management', 'research-engineering', 'research', 'engineering', 'advisory']

  const handleMemberSelect = useCallback((member: TeamMember) => {
    setSelectedMember(member)
  }, [])


  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="Our Team"
        description="Our multidisciplinary team combines world-class expertise in polymer chemistry, biomedical engineering, and clinical medicine to develop innovative biomaterials solutions."
        backgroundImage={BackgroundCover}
        backgroundOpacity={0.7}
        breadcrumbs={[
          { label: 'Home', page: 'home' },
          { label: 'Team' }
        ]}
        onNavigate={onNavigate}
      />

      <PageSection>
        {isLoading && (
          <TeamLoadingSkeleton />
        )}
        {categoryOrder.map(category => {
          const members = teamByCategory[category]
          if (!members || members.length === 0) {return null}
          return (
            <TeamGrid 
              key={category} 
              members={members} 
              title={TEAM_CATEGORIES[category]} 
              onSelect={handleMemberSelect}
            />
          )
        })}
      </PageSection>

      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedMember && (
              <TeamMemberDialogContent member={selectedMember} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
