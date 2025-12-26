/**
 * Media Initializer Component
 * 
 * Seeds the KV store with videos and case studies on first load.
 * Uses placeholder data from media-data.ts.
 * 
 * @module components/MediaInitializer
 */

import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { placeholderVideos, placeholderCaseStudies } from '@/lib/media-data'
import type { Video, CaseStudy } from '@/lib/types'

/**
 * Initializes videos and case studies in the KV store.
 * 
 * Populates media content when the KV store is empty.
 * Renders nothing to the DOM.
 * 
 * @returns null - This is a headless component
 */
export function MediaInitializer() {
  const [videos, setVideos] = useKV<Video[]>('videos', [])
  const [caseStudies, setCaseStudies] = useKV<CaseStudy[]>('caseStudies', [])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (isInitialized) {
      return
    }

    const needsVideos = (videos?.length || 0) === 0
    const needsCaseStudies = (caseStudies?.length || 0) === 0

    if (needsVideos) {
      setVideos(placeholderVideos)
    }
    if (needsCaseStudies) {
      setCaseStudies(placeholderCaseStudies)
    }

    if (needsVideos || needsCaseStudies) {
      setIsInitialized(true)
    }
  }, [caseStudies, isInitialized, setCaseStudies, setVideos, videos])

  return null
}
