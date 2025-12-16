import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { teamMembers } from '@/lib/team-data'
import type { TeamMember } from '@/lib/types'

export function TeamInitializer() {
  const [team, setTeam] = useKV<TeamMember[]>('team', [])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if ((team?.length || 0) === 0 && !isInitialized) {
      setTeam(teamMembers)
      setIsInitialized(true)
    }
  }, [team?.length, isInitialized, setTeam])

  return null
}
