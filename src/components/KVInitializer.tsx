import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'

interface KVInitializerProps<T> {
  kvKey: string
  initialData: T
  shouldInitialize?: (currentData: T | undefined) => boolean
}

/**
 * Generic KV store initializer component.
 * Initializes KV store data on first mount if needed.
 */
export function KVInitializer<T>({ 
  kvKey, 
  initialData,
  shouldInitialize = (data) => !data || (Array.isArray(data) && data.length === 0)
}: KVInitializerProps<T>) {
  const [data, setData] = useKV<T>(kvKey, initialData)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isInitialized && shouldInitialize(data)) {
      setData(initialData)
      setIsInitialized(true)
    }
  }, [data, initialData, isInitialized, setData, shouldInitialize])

  return null
}
