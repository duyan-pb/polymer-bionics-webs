/**
 * Team Loading Skeleton
 * 
 * Displays placeholder cards while team data loads.
 * 
 * @module components/team/TeamLoadingSkeleton
 */

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface TeamLoadingSkeletonProps {
  count?: number
}

export function TeamLoadingSkeleton({ count = 6 }: TeamLoadingSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {Array.from({ length: count }).map((_, idx) => (
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
