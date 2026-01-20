/**
 * Local Storage KV Hook
 * 
 * A fallback implementation of the useKV hook that uses localStorage
 * when the GitHub Spark KV backend is unavailable (e.g., when deployed to Netlify).
 * 
 * This provides the same API as @github/spark/hooks useKV but stores data
 * in the browser's localStorage.
 * 
 * @module use-kv
 */

import { useState, useCallback, useEffect } from 'react'

/** Prefix for all KV keys in localStorage to avoid conflicts */
const KV_PREFIX = 'spark_kv_'

/**
 * Custom hook that provides a key-value store backed by localStorage.
 * 
 * This is a drop-in replacement for @github/spark/hooks useKV that works
 * without the Spark backend, making it suitable for static deployments.
 * 
 * @param key - The unique key for storing the value
 * @param initialValue - The default value if no stored value exists
 * @returns A tuple of [currentValue, setValue] similar to useState
 * 
 * @example
 * ```tsx
 * const [team, setTeam] = useLocalKV<TeamMember[]>('team', [])
 * ```
 */
export function useLocalKV<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Initialize state from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    
    try {
      const item = window.localStorage.getItem(KV_PREFIX + key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(`[useLocalKV] Error reading key "${key}" from localStorage:`, error)
      return initialValue
    }
  })

  // Persist value to localStorage
  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(KV_PREFIX + key, JSON.stringify(value))
      }
    } catch (error) {
      console.warn(`[useLocalKV] Error saving key "${key}" to localStorage:`, error)
    }
  }, [key])

  // Sync across tabs using storage event
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === KV_PREFIX + key && event.newValue) {
        try {
          setStoredValue(JSON.parse(event.newValue) as T)
        } catch {
          // Ignore parse errors
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue]
}

export { useLocalKV as useKV }
