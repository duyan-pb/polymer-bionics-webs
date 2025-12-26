/**
 * Team Initializer Component
 * 
 * Seeds the KV store with team member data on first load.
 * Uses static team data from team-data.ts.
 * 
 * @module components/TeamInitializer
 */

import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { teamMembers } from '@/lib/team-data'
import type { TeamMember } from '@/lib/types'

/**
 * Initializes team members in the KV store.
 * 
 * Syncs team data from the static source to KV store.
 * Renders nothing to the DOM.
 * 
 * @returns null - This is a headless component
 */
export function TeamInitializer() {
  const [team, setTeam] = useKV<TeamMember[]>('team', [])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const needsUpdate = (team?.length || 0) !== teamMembers.length
    
    if (needsUpdate && !isInitialized) {
      setTeam(teamMembers)
      setIsInitialized(true)
    }
  }, [team, isInitialized, setTeam])

  return null
}
