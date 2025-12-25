import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { teamMembers } from '@/lib/team-data'
import type { TeamMember } from '@/lib/types'

export function TeamInitializer() {
  const [team, setTeam] = useKV<TeamMember[]>('team', [])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const needsUpdate = (team?.length || 0) !== teamMembers.length
    
    if (needsUpdate && !isInitialized) {
      setTeam(teamMembers)
      setIsInitialized(true)
    }
    // Only run when team length changes or on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [team?.length])

  return null
}
