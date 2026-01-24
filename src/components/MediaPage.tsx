/**
 * Media Page Component
 * 
 * Displays videos and case studies in a tabbed interface.
 * Features video players and case study modals.
 * 
 * @module components/MediaPage
 */

// TODO: Add actual video content - upload to YouTube/Vimeo
// TODO: Implement video player with proper controls
// TODO: Add case study PDF downloads

import { useState, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, Quotes, FileText, VideoCamera, Briefcase } from '@phosphor-icons/react'
import type { Video, CaseStudy } from '@/lib/types'
import { ContactLinks } from '@/components/ContactLinks'
import { PageHero } from '@/components/PageHero'
import { ClickableCard } from '@/components/ClickableCard'
import BackgroundCover from '@/assets/images/Background_Cover.png'
import { ComingSoonCard } from '@/components/ComingSoonCard'

/**
 * Props for the MediaPage component.
 */
interface MediaPageProps {
  /** Array of video content */
  videos: Video[]
  /** Array of case studies */
  caseStudies: CaseStudy[]
  /** Navigation handler */
  onNavigate: (page: string) => void
}

/**
 * Media page component with videos and case studies.
 * 
 * Features:
 * - Tabbed interface (Videos / Case Studies)
 * - Video player modal
 * - Case study detail modal with PDF download
 * - Contact CTA
 * 
 * @example
 * ```tsx
 * <MediaPage videos={videos} caseStudies={cases} onNavigate={handleNavigate} />
 * ```
 */
export function MediaPage({ videos, caseStudies, onNavigate }: MediaPageProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null)

  const handleVideoSelect = useCallback((video: Video) => {
    setSelectedVideo(video)
  }, [])

  const handleCaseStudySelect = useCallback((study: CaseStudy) => {
    setSelectedCaseStudy(study)
  }, [])

  const VideoDialogContent = ({ video }: { video: Video }) => (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl mb-2">{video.title}</DialogTitle>
        <Badge variant="outline" className="w-fit capitalize">{video.category}</Badge>
      </DialogHeader>
      <div className="aspect-video bg-black rounded-lg overflow-hidden my-4">
        {video.videoUrl ? (
          <video controls className="w-full h-full" src={video.videoUrl}>
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <p>Video player placeholder - {video.title}</p>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{video.description}</p>
    </>
  )

  const CaseStudyDialogContent = ({ study }: { study: CaseStudy }) => (
    <>
      <DialogHeader>
        <DialogTitle className="text-3xl mb-2">{study.title}</DialogTitle>
        <Badge variant="secondary" className="w-fit capitalize text-base px-4 py-2">
          {study.category}
        </Badge>
      </DialogHeader>

      <div className="space-y-6 mt-6">
        <div>
          <h4 className="text-lg font-semibold mb-3 text-primary uppercase tracking-wide">The Problem</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{study.problem}</p>
        </div>

        <Separator />

        <div>
          <h4 className="text-lg font-semibold mb-3 text-primary uppercase tracking-wide">Our Solution</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{study.solution}</p>
        </div>

        <Separator />

        <div>
          <h4 className="text-lg font-semibold mb-3 text-primary uppercase tracking-wide">Demonstrated Results</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{study.results}</p>
        </div>

        {study.quote && (
          <>
            <Separator />
            <div className="bg-muted/50 p-6 rounded-lg border-l-4 border-accent">
              <Quotes size={32} className="text-accent mb-3" weight="fill" />
              <p className="text-base italic mb-3">"{study.quote.text}"</p>
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold">{study.quote.author}</p>
              </div>
            </div>
          </>
        )}

        {study.datasheetId && (
          <div className="pt-4 flex gap-3">
            <Button onClick={() => { setSelectedCaseStudy(null); onNavigate('datasheets'); }}>
              <FileText className="mr-2" /> View Related Datasheet
            </Button>
            <ContactLinks emailType="sales" variant="outline" showWhatsApp={true} showEmail={true} />
          </div>
        )}
        {!study.datasheetId && (
          <div className="pt-4">
            <ContactLinks emailType="sales" variant="default" showWhatsApp={true} showEmail={true} />
          </div>
        )}
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="Videos & Case Studies"
        description="Explore our technology demonstrations, laboratory validations, and real-world application case studies showcasing the performance of our biomaterials."
        backgroundImage={BackgroundCover}
        backgroundOpacity={0.35}
        breadcrumbs={[
          { label: 'Home', page: 'home' },
          { label: 'Videos & Case Studies' }
        ]}
        onNavigate={onNavigate}
      />

      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-[1280px] mx-auto">
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="mb-8 md:mb-12">
              <TabsTrigger value="videos" className="text-sm md:text-base px-4 md:px-8 py-2 md:py-3 font-semibold">Videos</TabsTrigger>
              <TabsTrigger value="case-studies" className="text-sm md:text-base px-4 md:px-8 py-2 md:py-3 font-semibold">Case Studies</TabsTrigger>
            </TabsList>

            <TabsContent value="videos">
              {videos.length === 0 ? (
                <ComingSoonCard
                  icon={<VideoCamera size={80} className="text-muted-foreground/40 mx-auto mb-4" weight="light" />}
                  title="Videos coming soon"
                  description="We are producing video content showcasing our technology and applications. Check back soon or contact us to learn more."
                  emailType="general"
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                  {videos.map((video) => (
                    <ClickableCard
                      key={video.id}
                      className="overflow-hidden"
                      onClick={() => handleVideoSelect(video)}
                      ariaLabel={`View video: ${video.title}`}
                    >
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                        {video.thumbnailUrl ? (
                          <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        ) : (
                          <Play size={64} className="text-primary/60" weight="fill" />
                        )}
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Play size={64} className="text-white" weight="fill" />
                        </div>
                        {video.duration && (
                          <Badge className="absolute bottom-3 right-3 bg-black/70 text-white font-semibold">
                            {video.duration}
                          </Badge>
                        )}
                      </div>
                      <div className="p-4 md:p-6">
                        <Badge variant="outline" className="mb-2 md:mb-3 capitalize font-semibold text-xs md:text-sm">{video.category}</Badge>
                        <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2">{video.title}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                      </div>
                    </ClickableCard>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="case-studies">
              {caseStudies.length === 0 ? (
                <ComingSoonCard
                  icon={<Briefcase size={80} className="text-muted-foreground/40 mx-auto mb-4" weight="light" />}
                  title="Case studies coming soon"
                  description="We are documenting real-world applications and success stories. Check back soon or contact us to discuss your specific use case."
                  emailType="general"
                />
              ) : (
                <div className="grid grid-cols-1 gap-4 md:gap-8">
                  {caseStudies.map((study) => (
                    <ClickableCard
                      key={study.id}
                      className="p-5 md:p-8 border-2"
                      onClick={() => handleCaseStudySelect(study)}
                      ariaLabel={`View case study: ${study.title}`}
                    >
                      <div className="flex items-start justify-between mb-3 md:mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl md:text-2xl font-normal mb-2">{study.title}</h3>
                          <Badge variant="secondary" className="capitalize">{study.category}</Badge>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-6">
                        <div>
                          <h4 className="text-sm font-semibold mb-2 text-primary uppercase tracking-wide">Problem</h4>
                          <p className="text-sm text-muted-foreground line-clamp-3">{study.problem}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-2 text-primary uppercase tracking-wide">Solution</h4>
                          <p className="text-sm text-muted-foreground line-clamp-3">{study.solution}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-2 text-primary uppercase tracking-wide">Results</h4>
                          <p className="text-sm text-muted-foreground line-clamp-3">{study.results}</p>
                        </div>
                      </div>

                      <Button variant="outline" className="mt-6">
                        Read Full Case Study
                      </Button>
                    </ClickableCard>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-5xl">
          {selectedVideo && (
            <VideoDialogContent video={selectedVideo} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedCaseStudy} onOpenChange={() => setSelectedCaseStudy(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedCaseStudy && (
              <CaseStudyDialogContent study={selectedCaseStudy} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
