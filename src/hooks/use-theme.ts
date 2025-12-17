import { useState, useEffect, useCallback } from 'react'

const THEME_KEY = 'pb-theme'

/**
 * Custom hook for managing theme state with localStorage persistence.
 * Follows the single responsibility principle for theme management.
 */
export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem(THEME_KEY)
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev)
  }, [])

  return { isDark, toggleTheme }
}
