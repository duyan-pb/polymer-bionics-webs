/**
 * Mobile Detection Hook
 * 
 * Provides responsive breakpoint detection for mobile-first UI patterns.
 * Uses the standard 768px breakpoint (matching Tailwind's `md` breakpoint).
 * 
 * @module hooks/use-mobile
 */

import { useEffect, useState } from "react"

/** Breakpoint threshold for mobile detection (matches Tailwind's md breakpoint) */
const MOBILE_BREAKPOINT = 768

/**
 * Hook to detect if the viewport is at mobile width.
 * 
 * Uses `window.matchMedia` for efficient resize detection without
 * attaching to the resize event directly.
 * 
 * @returns {boolean} `true` if viewport width is less than 768px, `false` otherwise
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isMobile = useIsMobile()
 *   
 *   return isMobile ? <MobileNav /> : <DesktopNav />
 * }
 * ```
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
