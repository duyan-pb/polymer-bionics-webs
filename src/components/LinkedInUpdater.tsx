import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import type { TeamMember } from '@/lib/types'

export function LinkedInUpdater() {
  const [team, setTeam] = useKV<TeamMember[]>('team', [])
  const [hasSearched, setHasSearched] = useKV<boolean>('linkedin-search-complete', false)

  useEffect(() => {
    const updateTeamFromLinkedIn = async () => {
      if (hasSearched || !team || team.length === 0) return
      
      try {
        const teamMembers = team.map(m => `- ${m.name} (${m.role})`).join('\n')
        
        const response = await window.spark.llm(
          `You are researching real LinkedIn profiles for the team at Polymer Bionics, a UK-based medical device and biomaterials company specializing in flexible bioelectronics.

The team members to research are:
${teamMembers}

For EACH person, search for their actual LinkedIn profile and professional information. Gather:
1. Their real current job title at Polymer Bionics or related biomedical roles
2. Actual education background from their profiles (real degrees and universities)
3. Real professional achievements, career highlights, and previous positions
4. Research publications or patents if they're academic researchers
5. Their actual LinkedIn profile URL (in format: https://linkedin.com/in/username)
6. Google Scholar profile URL if applicable

IMPORTANT: Research real information. Do not fabricate generic details. If you cannot find specific information for someone, set "found": false.

Return ONLY a valid JSON object with structure:
{
  "teamUpdates": [
    {
      "name": "Full Name",
      "found": true,
      "title": "Actual Current Title",
      "education": ["Real Degree 1", "Real Degree 2"],
      "achievements": ["Real achievement 1", "Real achievement 2"],
      "publications": ["Real publication 1", "Real publication 2"],
      "linkedin": "https://linkedin.com/in/realprofile",
      "scholar": "https://scholar.google.com/citations?user=...",
      "shortBio": "1-2 sentence summary based on real info",
      "fullBio": "3-4 sentence biography based on real info"
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
                  education: update.education && update.education.length > 0 ? update.education : member.education,
                  achievements: update.achievements && update.achievements.length > 0 ? update.achievements : member.achievements,
                  publications: update.publications && update.publications.length > 0 ? update.publications : member.publications,
                  linkedin: update.linkedin || member.linkedin,
                  scholar: update.scholar || member.scholar,
                  shortBio: update.shortBio || member.shortBio,
                  fullBio: update.fullBio || member.fullBio
                }
              }
              
              return member
            })
          })
          
          setHasSearched(true)
        }
      } catch (error) {
        console.error('Error updating team from LinkedIn:', error)
        setHasSearched(true)
      }
    }

    updateTeamFromLinkedIn()
  }, [team, hasSearched, setTeam, setHasSearched])

  return null
}
