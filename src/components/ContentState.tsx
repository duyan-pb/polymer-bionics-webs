/**
 * Content State
 * 
 * Standardizes loading and empty states for content sections.
 * 
 * @module components/ContentState
 */

import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ComingSoonCard } from '@/components/ComingSoonCard'
import type { ComponentProps } from 'react'
import { DEFAULT_LOADING_SKELETON_COUNT } from '@/lib/constants'

interface ContentStateProps {
  isLoading?: boolean
  isEmpty?: boolean
  loadingCount?: number
  emptyProps?: ComponentProps<typeof ComingSoonCard>
  emptyActions?: ReactNode
  children: ReactNode
}

export function ContentState({
  isLoading,
  isEmpty,
  loadingCount = DEFAULT_LOADING_SKELETON_COUNT,
  emptyProps,
  emptyActions,
  children,
}: ContentStateProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {Array.from({ length: loadingCount }).map((_, idx) => (
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
    )
  }

  if (isEmpty && emptyProps) {
    return (
      <div className="space-y-4">
        <ComingSoonCard {...emptyProps} />
        {emptyActions}
      </div>
    )
  }

  return <>{children}</>
}
