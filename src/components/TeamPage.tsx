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
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { LinkedinLogo, User, GraduationCap } from '@phosphor-icons/react'
import { PageHero } from '@/components/PageHero'
import { ClickableCard } from '@/components/ClickableCard'
import BackgroundCover from '@/assets/images/Background_Cover.png'
import { TEAM_CATEGORIES, type TeamCategory } from '@/lib/constants'
import type { TeamMember } from '@/lib/types'

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

  const TeamGrid = ({ members, title }: { members: TeamMember[], title: string }) => (
    <div className="mb-12 md:mb-20">
      <h2 className="text-2xl md:text-4xl font-bold mb-6 md:mb-10 text-primary">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {members.map((member) => (
          <ClickableCard
            key={member.id}
            className="overflow-hidden"
            onClick={() => handleMemberSelect(member)}
            ariaLabel={`View profile of ${member.name}`}
          >
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center">
              {member.imageUrl ? (
                <img 
                  src={member.imageUrl} 
                  alt={member.name} 
                  className="w-full h-full object-cover" 
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

      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-[1280px] mx-auto">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {Array.from({ length: 6 }).map((_, idx) => (
                <Card key={idx} className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </Card>
              ))}
            </div>
          )}
          {categoryOrder.map(category => {
            const members = teamByCategory[category]
            if (!members || members.length === 0) {return null}
            return (
              <TeamGrid 
                key={category} 
                members={members} 
                title={TEAM_CATEGORIES[category]} 
              />
            )
          })}
        </div>
      </section>

      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedMember && (
              <>
                <DialogHeader>
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                      {selectedMember.imageUrl ? (
                        <img src={selectedMember.imageUrl} alt={selectedMember.name} className="w-full h-full object-cover rounded-lg" loading="lazy" decoding="async" />
                      ) : (
                        <User size={60} className="text-muted-foreground" weight="light" />
                      )}
                    </div>
                    <div className="flex-1">
                      <DialogTitle className="text-3xl mb-2">{selectedMember.name}</DialogTitle>
                      <p className="text-lg text-accent font-medium mb-4">{selectedMember.title}</p>
                      <div className="flex gap-2">
                        {selectedMember.linkedin && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer">
                              <LinkedinLogo className="mr-2" /> LinkedIn
                            </a>
                          </Button>
                        )}
                        {selectedMember.scholar && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={selectedMember.scholar} target="_blank" rel="noopener noreferrer">
                              <GraduationCap className="mr-2" /> Google Scholar
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  {selectedMember.shortBio && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Biography</h3>
                      <p className="text-base leading-relaxed text-muted-foreground">{selectedMember.shortBio}</p>
                    </div>
                  )}

                  {selectedMember.education && selectedMember.education.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Education</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {selectedMember.education.map((edu, idx) => (
                          <li key={idx}>{edu}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedMember.achievements && selectedMember.achievements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Achievements</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {selectedMember.achievements.map((achievement, idx) => (
                          <li key={idx}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedMember.publications && selectedMember.publications.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Publications</h3>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {selectedMember.publications.map((pub, idx) => (
                          <li key={idx}>{pub}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
