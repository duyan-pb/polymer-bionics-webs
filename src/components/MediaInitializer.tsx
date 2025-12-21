import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { placeholderVideos, placeholderCaseStudies } from '@/lib/media-data'
import type { Video, CaseStudy } from '@/lib/types'

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
