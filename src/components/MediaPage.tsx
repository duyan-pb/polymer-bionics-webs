import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, Quotes, FileText } from '@phosphor-icons/react'
import type { Video, CaseStudy } from '@/lib/types'

interface MediaPageProps {
  videos: Video[]
  caseStudies: CaseStudy[]
}

export function MediaPage({ videos, caseStudies }: MediaPageProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 px-8">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="text-6xl font-bold mb-6">Videos & Case Studies</h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            Explore our technology demonstrations, laboratory validations, and real-world application case studies
            showcasing the performance of our biomaterials.
          </p>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-[1280px] mx-auto">
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="videos" className="text-base px-6">Videos</TabsTrigger>
              <TabsTrigger value="case-studies" className="text-base px-6">Case Studies</TabsTrigger>
            </TabsList>

            <TabsContent value="videos">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((video) => (
                  <Card
                    key={video.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 hover:border-accent"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                      {video.thumbnailUrl ? (
                        <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                      ) : (
                        <Play size={64} className="text-primary/60" weight="fill" />
                      )}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play size={64} className="text-white" weight="fill" />
                      </div>
                      {video.duration && (
                        <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                          {video.duration}
                        </Badge>
                      )}
                    </div>
                    <div className="p-6">
                      <Badge variant="outline" className="mb-2 capitalize">{video.category}</Badge>
                      <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="case-studies">
              <div className="grid grid-cols-1 gap-8">
                {caseStudies.map((study) => (
                  <Card
                    key={study.id}
                    className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-accent"
                    onClick={() => setSelectedCaseStudy(study)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-2">{study.title}</h3>
                        <Badge variant="secondary" className="capitalize">{study.category}</Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mt-6">
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
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-5xl">
          {selectedVideo && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl mb-2">{selectedVideo.title}</DialogTitle>
                <Badge variant="outline" className="w-fit capitalize">{selectedVideo.category}</Badge>
              </DialogHeader>
              <div className="aspect-video bg-black rounded-lg overflow-hidden my-4">
                {selectedVideo.videoUrl ? (
                  <video controls className="w-full h-full" src={selectedVideo.videoUrl}>
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <p>Video player placeholder - {selectedVideo.title}</p>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{selectedVideo.description}</p>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedCaseStudy} onOpenChange={() => setSelectedCaseStudy(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedCaseStudy && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-3xl mb-2">{selectedCaseStudy.title}</DialogTitle>
                  <Badge variant="secondary" className="w-fit capitalize text-base px-4 py-2">
                    {selectedCaseStudy.category}
                  </Badge>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-primary uppercase tracking-wide">The Problem</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedCaseStudy.problem}</p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-primary uppercase tracking-wide">Our Solution</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedCaseStudy.solution}</p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-primary uppercase tracking-wide">Demonstrated Results</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedCaseStudy.results}</p>
                  </div>

                  {selectedCaseStudy.quote && (
                    <>
                      <Separator />
                      <div className="bg-muted/50 p-6 rounded-lg border-l-4 border-accent">
                        <Quotes size={32} className="text-accent mb-3" weight="fill" />
                        <p className="text-base italic mb-3">"{selectedCaseStudy.quote.text}"</p>
                        <div className="text-sm text-muted-foreground">
                          <p className="font-semibold">{selectedCaseStudy.quote.author}</p>
                          <p>{selectedCaseStudy.quote.title}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedCaseStudy.datasheetId && (
                    <div className="pt-4">
                      <Button>
                        <FileText className="mr-2" /> View Related Datasheet
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
