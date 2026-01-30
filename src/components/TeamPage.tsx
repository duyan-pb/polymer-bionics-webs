/**
 * Team Page Component
 * 
 * Displays team member profiles organized by category.
 * Features profile cards with modal detail view.
 * 
 * @module components/TeamPage
 */

// TODO: Add real team member photos (upload to assets/images/team/)
// TODO: Update all team bios in team-data.ts
// TODO: Add Google Scholar and LinkedIn URLs for each member

import { useState, useMemo, useCallback } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageLayout } from '@/components/layout/PageLayout'
import BackgroundCover from '@/assets/images/optimized/Background_Cover.webp'
import { TEAM_CATEGORIES, type TeamCategory } from '@/lib/constants'
import type { TeamMember } from '@/lib/types'
import { TeamGrid } from '@/components/team/TeamGrid'
import { TeamMemberDialogContent } from '@/components/team/TeamMemberDialogContent'
import { ContentState } from '@/components/ContentState'

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
export function TeamPage({ team, onNavigate }: TeamPageProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
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

  // Order categories for display (management moved to bottom)
  const categoryOrder: TeamCategory[] = ['founders', 'research-innovation', 'product-engineering', 'advisory', 'management']

  const handleMemberSelect = useCallback((member: TeamMember) => {
    setSelectedMember(member)
  }, [])

  const hero = {
    title: 'Our Team',
    description: 'Our multidisciplinary team are experts in translating advanced materials into real-world bioelectronic devices',
    backgroundImage: BackgroundCover,
    backgroundOpacity: 0.7,
    breadcrumbs: [
      { label: 'Home', page: 'home' },
      { label: 'Team' },
    ],
    onNavigate,
  }

  return (
    <PageLayout hero={hero}>
      <ContentState isLoading={isLoading}>
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
      </ContentState>

      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedMember && (
              <TeamMemberDialogContent member={selectedMember} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}
