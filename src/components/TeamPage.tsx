import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LinkedinLogo, User, MagnifyingGlass } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { TeamMember } from '@/lib/types'

interface TeamPageProps {
  team: TeamMember[]
}

export function TeamPage({ team: initialTeam }: TeamPageProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [team, setTeam] = useKV<TeamMember[]>('team', initialTeam)

  useEffect(() => {
    const checkOwner = async () => {
      try {
        const user = await window.spark.user()
        setIsOwner(user?.isOwner || false)
      } catch (error) {
        console.error('Error checking user:', error)
      }
    }
    checkOwner()
  }, [])

  const searchLinkedIn = async () => {
    if (!team || team.length === 0) return
    
    setIsSearching(true)
    toast.info('Searching LinkedIn for team profiles...')
    
    try {
      const teamMembers = team.map(m => `- ${m.name} (${m.role})`).join('\n')
      
      const response = await window.spark.llm(
        `You are researching real LinkedIn profiles for the team at Polymer Bionics, a UK-based medical device and biomaterials company specializing in flexible bioelectronics.

The team members to research are:
${teamMembers}

For EACH person, search for their actual LinkedIn profile and professional information. Gather:
1. Their real current job title at Polymer Bionics or related biomedical roles
2. Their actual LinkedIn profile URL (in format: https://linkedin.com/in/username)
3. A brief 2-3 sentence biography based on their real professional background
4. Google Scholar profile URL if they have one and are researchers

IMPORTANT: Research real information. Do not fabricate generic details. If you cannot find specific information for someone, set "found": false.

Return ONLY a valid JSON object with structure:
{
  "teamUpdates": [
    {
      "name": "Full Name",
      "found": true,
      "title": "Actual Current Title",
      "linkedin": "https://linkedin.com/in/realprofile",
      "scholar": "https://scholar.google.com/citations?user=...",
      "shortBio": "1-2 sentence summary based on real info",
      "fullBio": "2-3 sentence biography based on real info"
    }
  ]
}`,
        "gpt-4o",
        true
      )
      
      const data = JSON.parse(response)
      
      if (data.teamUpdates && Array.isArray(data.teamUpdates)) {
        setTeam((currentTeam) => {
          if (!currentTeam) return []
          return currentTeam.map(member => {
            const update = data.teamUpdates.find((u: any) => {
              const memberLastName = member.name.toLowerCase().split(' ').pop()
              const updateName = u.name.toLowerCase()
              return updateName.includes(memberLastName || '')
            })
            
            if (update && update.found !== false) {
              return {
                ...member,
                title: update.title || member.title,
                linkedin: update.linkedin || member.linkedin,
                scholar: update.scholar || member.scholar,
                shortBio: update.shortBio || member.shortBio,
                fullBio: update.fullBio || member.fullBio
              }
            }
            
            return member
          })
        })
        
        toast.success('Team profiles updated from LinkedIn!')
      }
    } catch (error) {
      console.error('Error updating team from LinkedIn:', error)
      toast.error('Failed to update team profiles')
    } finally {
      setIsSearching(false)
    }
  }

  const categorizeTeam = () => {
    const currentTeam = team || []
    return {
      founders: currentTeam.filter(m => m.category === 'founders'),
      labManagement: currentTeam.filter(m => m.category === 'lab-management'),
      management: currentTeam.filter(m => m.category === 'management'),
      researchEngineering: currentTeam.filter(m => m.category === 'research-engineering'),
      research: currentTeam.filter(m => m.category === 'research'),
      engineering: currentTeam.filter(m => m.category === 'engineering'),
      advisory: currentTeam.filter(m => m.category === 'advisory'),
    }
  }

  const { founders, labManagement, management, researchEngineering, research, engineering, advisory } = categorizeTeam()

  const TeamGrid = ({ members, title }: { members: TeamMember[], title: string }) => (
    <div className="mb-16">
      <h2 className="text-4xl font-bold mb-8 text-primary">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((member) => (
          <Card
            key={member.id}
            className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 hover:border-accent"
            onClick={() => setSelectedMember(member)}
          >
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              {member.image ? (
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <User size={80} className="text-muted-foreground" weight="light" />
              )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-sm text-accent font-medium mb-3">{member.title}</p>
              <p className="text-sm text-muted-foreground line-clamp-3">{member.shortBio}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-6xl font-normal mb-6">Our Team</h1>
              <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                Our multidisciplinary team combines world-class expertise in polymer chemistry, biomedical engineering,
                and clinical medicine to develop innovative biomaterials solutions.
              </p>
            </div>
            {isOwner && (
              <Button 
                onClick={searchLinkedIn} 
                disabled={isSearching}
                variant="outline"
                className="flex items-center gap-2"
              >
                <MagnifyingGlass size={18} />
                {isSearching ? 'Searching LinkedIn...' : 'Update from LinkedIn'}
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-[1280px] mx-auto">
          {founders.length > 0 && <TeamGrid members={founders} title="Founders" />}
          {labManagement.length > 0 && <TeamGrid members={labManagement} title="Laboratory Management Team" />}
          {management.length > 0 && <TeamGrid members={management} title="Management Team" />}
          {researchEngineering.length > 0 && <TeamGrid members={researchEngineering} title="Research/Engineering Team" />}
          {research.length > 0 && <TeamGrid members={research} title="Research Team" />}
          {engineering.length > 0 && <TeamGrid members={engineering} title="Engineering Team" />}
          {advisory.length > 0 && <TeamGrid members={advisory} title="Scientific Advisory Board" />}
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
                      {selectedMember.image ? (
                        <img src={selectedMember.image} alt={selectedMember.name} className="w-full h-full object-cover rounded-lg" />
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
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  <div>
                    <p className="text-base leading-relaxed">{selectedMember.fullBio}</p>
                  </div>
                </div>
              </>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
