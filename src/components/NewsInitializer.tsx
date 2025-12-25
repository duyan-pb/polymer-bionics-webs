import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { placeholderNews, placeholderPublications } from '@/lib/publications-data'
import type { NewsItem, Publication } from '@/lib/types'

/**
 * Initializes News & Publications with placeholder data.
 * Forces reset to ensure placeholder content is used.
 */
export function NewsInitializer() {
  const [news, setNews] = useKV<NewsItem[]>('news', [])
  const [publications, setPublications] = useKV<Publication[]>('publications', [])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (isInitialized) {
      return
    }

    const needsNews = (news?.length || 0) === 0
    const needsPublications = (publications?.length || 0) === 0

    if (needsNews) {
      setNews(placeholderNews)
    }
    if (needsPublications) {
      setPublications(placeholderPublications)
    }

    if (needsNews || needsPublications) {
      setIsInitialized(true)
    }
    // Only run when news or publications length changes or on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [news?.length, publications?.length])

  return null
}
