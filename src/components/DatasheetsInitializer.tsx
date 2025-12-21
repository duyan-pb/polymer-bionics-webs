import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import type { Datasheet } from '@/lib/types'

export function DatasheetsInitializer() {
  const [datasheets, setDatasheets] = useKV<Datasheet[]>('datasheets', [])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (isInitialized) return

    const needsDatasheets = (datasheets?.length || 0) === 0
    if (needsDatasheets) {
      // No datasheets available yet; seed empty array so UI can show "coming soon"
      setDatasheets([])
      setIsInitialized(true)
    }
  }, [datasheets, isInitialized, setDatasheets])

  return null
}
