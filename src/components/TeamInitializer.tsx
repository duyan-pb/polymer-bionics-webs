import { KVInitializer } from '@/components/KVInitializer'
import { teamMembers } from '@/lib/team-data'
import type { TeamMember } from '@/lib/types'

export function TeamInitializer() {
  return (
    <KVInitializer<TeamMember[]>
      kvKey="team"
      initialData={teamMembers}
      shouldInitialize={(data) => (data?.length || 0) !== teamMembers.length}
    />
  )
}
