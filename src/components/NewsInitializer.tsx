import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { placeholderNews, placeholderPublications } from '@/lib/publications-data'
import type { NewsItem, Publication } from '@/lib/types'

/**
 * Initializes News & Publications with placeholder data.
 * Forces reset to ensure placeholder content is used.
 */
export function NewsInitializer() {
  const [, setNews] = useKV<NewsItem[]>('news', [])
  const [, setPublications] = useKV<Publication[]>('publications', [])

  useEffect(() => {
    // Force set placeholder data to override any existing persisted data
    setNews(placeholderNews)
    setPublications(placeholderPublications)
  }, [setNews, setPublications])

  return null
}
