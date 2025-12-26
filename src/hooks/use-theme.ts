/**
 * Theme Management Hook
 * 
 * Provides theme state management with localStorage persistence and
 * system preference detection. Follows the single responsibility principle.
 * 
 * @module hooks/use-theme
 */

import { useState, useEffect, useCallback } from 'react'

/** localStorage key for persisting theme preference */
const THEME_KEY = 'pb-theme'

/**
 * Custom hook for managing theme state with localStorage persistence.
 * 
 * Features:
 * - Persists theme choice to localStorage
 * - Respects system preference on first visit
 * - Updates `data-appearance` attribute on `<html>` for Tailwind dark mode
 * 
 * @returns {Object} Theme state and controls
 * @returns {boolean} isDark - Current theme state (`true` for dark mode)
 * @returns {Function} toggleTheme - Function to toggle between light and dark
 * 
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const { isDark, toggleTheme } = useTheme()
 *   
 *   return (
 *     <button onClick={toggleTheme}>
 *       {isDark ? 'Switch to Light' : 'Switch to Dark'}
 *     </button>
 *   )
 * }
 * ```
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') {return false}
    const stored = localStorage.getItem(THEME_KEY)
    if (stored) {return stored === 'dark'}
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    // Use data-appearance attribute for Tailwind dark mode selector
    document.documentElement.setAttribute('data-appearance', isDark ? 'dark' : 'light')
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev)
  }, [])

  return { isDark, toggleTheme }
}
