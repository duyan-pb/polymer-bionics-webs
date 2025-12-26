/**
 * Clickable Card Component
 * 
 * An accessible card component that can be clicked or activated via keyboard.
 * Provides proper ARIA attributes, focus states, and hover animations.
 * 
 * @module components/ClickableCard
 */

import React, { forwardRef, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CARD_HOVER_CLASSES } from '@/lib/constants'

/**
 * Props for the ClickableCard component.
 */
export interface ClickableCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  /** Click handler function */
  onClick: () => void
  /** Accessible label for screen readers */
  ariaLabel: string
  /** Enable hover and transition styles (default: true) */
  enableHoverStyles?: boolean
}

/**
 * Accessible clickable card component with keyboard navigation.
 * 
 * Features:
 * - Keyboard support (Enter and Space keys)
 * - Focus visible ring for accessibility
 * - Hover animations with scale transform
 * - ARIA button role and label
 * 
 * @example
 * ```tsx
 * <ClickableCard
 *   onClick={() => handleSelect(item.id)}
 *   ariaLabel={`View details for ${item.name}`}
 * >
 *   <CardContent>...</CardContent>
 * </ClickableCard>
 * ```
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
