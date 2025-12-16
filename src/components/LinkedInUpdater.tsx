import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import type { TeamMember } from '@/lib/types'

export function LinkedInUpdater() {
  const [team, setTeam] = useKV<TeamMember[]>('team', [])
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const updateTeamFromLinkedIn = async () => {
      if (isUpdating || !team || team.length === 0) return
      
      setIsUpdating(true)
      
      try {
        const teamNames = team.map(m => m.name).join(', ')
        
        const promptText = `You are helping to update team member profiles for Polymer Bionics, a UK-based medical device company specializing in flexible bioelectronics and conducting polymer materials.

The current team members are: ${teamNames}

Please research and provide updated LinkedIn profile information for each person. For each team member, provide:
1. Current accurate job title at Polymer Bionics (or their actual current role)
2. Updated education background (degrees, institutions)
3. Key professional achievements and career highlights
4. Research publications or patents (if applicable)
5. LinkedIn profile URL (if publicly available)
6. Google Scholar URL (if applicable for research members)

Focus on accuracy and professionalism. If you cannot find specific information, provide reasonable professional descriptions based on their likely role in a biomedical materials company.

Return the result as a valid JSON object with a single property called "teamUpdates" that contains an array of objects. Each object should have:
{
  "name": "exact name from the list",
  "title": "current job title",
  "education": ["degree 1", "degree 2"],
  "achievements": ["achievement 1", "achievement 2"],
  "publications": ["publication 1", "publication 2"],
  "linkedin": "linkedin url or empty string",
  "scholar": "google scholar url or empty string",
  "shortBio": "brief 1-2 sentence professional summary",
  "fullBio": "comprehensive 3-4 sentence professional biography"
}`

        const response = await window.spark.llm(promptText, "gpt-4o", true)
        const data = JSON.parse(response)
        
        if (data.teamUpdates && Array.isArray(data.teamUpdates)) {
          setTeam((currentTeam) => {
            if (!currentTeam) return []
            return currentTeam.map(member => {
              const update = data.teamUpdates.find((u: any) => 
                u.name.toLowerCase().includes(member.name.toLowerCase().split(' ')[member.name.toLowerCase().split(' ').length - 1])
              )
              
              if (update) {
                return {
                  ...member,
                  title: update.title || member.title,
                  education: update.education || member.education,
                  achievements: update.achievements || member.achievements,
                  publications: update.publications || member.publications,
                  linkedin: update.linkedin || member.linkedin,
                  scholar: update.scholar || member.scholar,
                  shortBio: update.shortBio || member.shortBio,
                  fullBio: update.fullBio || member.fullBio
                }
              }
              
              return member
            })
          })
        }
      } catch (error) {
        console.error('Error updating team from LinkedIn:', error)
      } finally {
        setIsUpdating(false)
      }
    }

    updateTeamFromLinkedIn()
  }, [])

  return null
}
