/**
 * Team Initializer Component
 * 
 * Seeds the KV store with team member data on first load.
 * Uses static team data from team-data.ts.
 * 
 * @module components/TeamInitializer
 */

import { useEffect, useRef } from 'react'
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
  const hasInitialized = useRef(false)

  useEffect(() => {
    // Only run once
    if (hasInitialized.current) {
      return
    }
    
    // Always update if the team data length differs (ensures updates are applied)
    if ((team?.length || 0) !== teamMembers.length || (team?.length || 0) === 0) {
      hasInitialized.current = true
      setTeam(teamMembers)
    } else {
      hasInitialized.current = true
    }
  }, [team, setTeam])

  return null
}
