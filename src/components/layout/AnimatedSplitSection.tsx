/**
 * Animated Split Section
 * 
 * Two-column layout with subtle entrance animations.
 * 
 * @module components/layout/AnimatedSplitSection
 */

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface AnimatedSplitSectionProps {
  left: ReactNode
  right: ReactNode
  leftDelay?: number
  rightDelay?: number
}

export function AnimatedSplitSection({ left, right, leftDelay = 0.2, rightDelay = 0.3 }: AnimatedSplitSectionProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: leftDelay }}
      >
        {left}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: rightDelay }}
      >
        {right}
      </motion.div>
    </div>
  )
}
