/**
 * Datasheets Initializer Component
 * 
 * Seeds the KV store with datasheet documents on first load.
 * Currently seeds an empty array as placeholder.
 * 
 * @module components/DatasheetsInitializer
 */

import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import type { Datasheet } from '@/lib/types'

/**
 * Initializes datasheets in the KV store.
 * 
 * Seeds empty array so UI can show "coming soon" state.
 * Renders nothing to the DOM.
 * 
 * @returns null - This is a headless component
 */
export function DatasheetsInitializer() {
  const [datasheets, setDatasheets] = useKV<Datasheet[]>('datasheets', [])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (isInitialized) {
      return
    }

    const needsDatasheets = (datasheets?.length || 0) === 0
    if (needsDatasheets) {
      // No datasheets available yet; seed empty array so UI can show "coming soon"
      setDatasheets([])
      setIsInitialized(true)
    }
  }, [datasheets, isInitialized, setDatasheets])

  return null
}
