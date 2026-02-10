/**
 * Team Member Dialog Content
 * 
 * Displays full profile details for a team member.
 * 
 * @module components/team/TeamMemberDialogContent
 */

import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { LinkedinLogo, User, GraduationCap } from '@phosphor-icons/react'
import type { TeamMember } from '@/lib/types'

interface TeamMemberDialogContentProps {
  member: TeamMember
}

export function TeamMemberDialogContent({ member }: TeamMemberDialogContentProps) {
  return (
    <>
      <DialogHeader>
        <div className="flex items-start gap-6 mb-6">
          <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
            {member.imageUrl ? (
              <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover rounded-lg" style={{ ...(member.imagePosition ? { objectPosition: member.imagePosition } : {}), ...(member.imageScale ? { transform: `scale(${member.imageScale})` } : {}) }} loading="lazy" decoding="async" />
            ) : (
              <User size={60} className="text-muted-foreground" weight="light" />
            )}
          </div>
          <div className="flex-1">
            <DialogTitle className="text-3xl mb-2">{member.name}</DialogTitle>
            <p className="text-lg text-accent font-medium mb-4">{member.title}</p>
            <div className="flex gap-2">
              {member.linkedin && (
                <Button size="sm" variant="outline" asChild>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <LinkedinLogo className="mr-2" /> LinkedIn
                  </a>
                </Button>
              )}
              {member.scholar && (
                <Button size="sm" variant="outline" asChild>
                  <a href={member.scholar} target="_blank" rel="noopener noreferrer">
                    <GraduationCap className="mr-2" /> Google Scholar
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogHeader>

      {member.shortBio && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Biography</h3>
          <p className="text-base leading-relaxed text-muted-foreground">{member.shortBio}</p>
        </div>
      )}
    </>
  )
}
