import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { placeholderDatasheets } from '@/lib/media-data'
import type { Datasheet } from '@/lib/types'

export function DatasheetsInitializer() {
  const [datasheets, setDatasheets] = useKV<Datasheet[]>('datasheets', [])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (isInitialized) return

    const needsDatasheets = (datasheets?.length || 0) === 0
    if (needsDatasheets) {
      setDatasheets(placeholderDatasheets)
      setIsInitialized(true)
    }
  }, [datasheets, isInitialized, setDatasheets])

  return null
}
