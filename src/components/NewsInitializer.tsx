/**
 * News Initializer Component
 * 
 * Seeds the KV store with news and publications on first load.
 * Uses placeholder data from publications-data.ts.
 * 
 * @module components/NewsInitializer
 */

import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { placeholderNews, placeholderPublications } from '@/lib/publications-data'
import type { NewsItem, Publication } from '@/lib/types'

/**
 * Initializes news and publications in the KV store.
 * 
 * Populates both news items and scientific publications
 * when the KV store is empty. Renders nothing to the DOM.
 * 
 * @returns null - This is a headless component
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
  }, [isInitialized, news, publications, setNews, setPublications])

  return null
}
