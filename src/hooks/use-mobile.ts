import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Optimized hook for detecting mobile breakpoint using singleton MediaQueryList.
 * Uses matchMedia API for efficient media query matching without recreating listeners.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    // Create MediaQueryList once - it's reusable and efficient
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Use the matches property directly for initial value
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
    }
    
    // Set initial value
    handleChange(mql)
    
    // Use addEventListener for modern browsers (more efficient than deprecated addListener)
    mql.addEventListener("change", handleChange)
    
    return () => mql.removeEventListener("change", handleChange)
  }, [])

  return !!isMobile
}
