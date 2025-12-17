import React, { forwardRef, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CARD_HOVER_CLASSES } from '@/lib/constants'

export interface ClickableCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  onClick: () => void
  ariaLabel: string
  enableHoverStyles?: boolean
}

/**
 * Accessible clickable card component with keyboard navigation.
 * Includes proper ARIA attributes, focus states, and hover animations.
 */
export const ClickableCard = forwardRef<HTMLDivElement, ClickableCardProps>(
  ({ onClick, ariaLabel, enableHoverStyles = true, children, className, ...props }, ref) => {
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      },
      [onClick]
    )

    return (
      <Card
        ref={ref}
        className={cn(
          enableHoverStyles && CARD_HOVER_CLASSES,
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          className
        )}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </Card>
    )
  }
)

ClickableCard.displayName = 'ClickableCard'
