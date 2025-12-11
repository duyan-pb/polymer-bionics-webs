import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Calendar, Newspaper, BookOpen, ArrowSquareOut, Download } from '@phosphor-icons/react'
import type { NewsItem, Publication } from '@/lib/types'

interface NewsPageProps {
  news: NewsItem[]
  publications: Publication[]
}

export function NewsPage({ news, publications }: NewsPageProps) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)
  const [selectedTag, setSelectedTag] = useState<string>('all')

  const allTags = ['all', ...Array.from(new Set(publications.flatMap(p => p.tags)))]

  const filteredPublications = selectedTag === 'all'
    ? publications
    : publications.filter(p => p.tags.includes(selectedTag))

  const publicationTypeColors: Record<Publication['type'], 'default' | 'secondary' | 'outline'> = {
    'peer-reviewed': 'default',
    'conference': 'secondary',
    'white-paper': 'outline',
    'preprint': 'outline',
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 px-8">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="text-6xl font-bold mb-6">News & Publications</h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            Stay updated on our latest research, partnerships, grant awards, and peer-reviewed publications
            advancing the field of medical biomaterials.
          </p>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-[1280px] mx-auto">
          <Tabs defaultValue="news" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="news" className="text-base px-6">
                <Newspaper className="mr-2" size={18} /> News
              </TabsTrigger>
              <TabsTrigger value="publications" className="text-base px-6">
                <BookOpen className="mr-2" size={18} /> Publications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="news">
              <div className="space-y-6">
                {news.map((item) => (
                  <Card
                    key={item.id}
                    className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-accent hover:scale-[1.01]"
                    onClick={() => setSelectedNews(item)}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary" className="capitalize">{item.category}</Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar size={16} className="mr-1" />
                            {item.date}
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.summary}</p>
                      </div>
                      <Button variant="outline" size="sm" className="md:mt-8">
                        Read More
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="publications">
              <div className="flex flex-wrap gap-2 mb-8">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? 'default' : 'outline'}
                    className="cursor-pointer px-4 py-2 text-sm capitalize"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="space-y-6">
                {filteredPublications.map((pub) => (
                  <Card
                    key={pub.id}
                    className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-primary hover:scale-[1.01]"
                    onClick={() => setSelectedPublication(pub)}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant={publicationTypeColors[pub.type]} className="capitalize">
                              {pub.type.replace('-', ' ')}
                            </Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar size={16} className="mr-1" />
                              {pub.date}
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{pub.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {pub.authors.join(', ')}
                          </p>
                          <p className="text-sm text-accent font-medium italic">{pub.journal}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{pub.abstract}</p>
                      <div className="flex flex-wrap gap-2">
                        {pub.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-2">
                        {pub.doi && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={pub.doi} target="_blank" rel="noopener noreferrer">
                              <ArrowSquareOut className="mr-1" size={16} /> View DOI
                            </a>
                          </Button>
                        )}
                        {pub.pdfUrl && (
                          <Button variant="ghost" size="sm">
                            <Download className="mr-1" size={16} /> Download PDF
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedNews && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="secondary" className="capitalize text-base px-4 py-2">
                      {selectedNews.category}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar size={16} className="mr-1" />
                      {selectedNews.date}
                    </div>
                  </div>
                  <DialogTitle className="text-3xl mb-4">{selectedNews.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <p className="text-base leading-relaxed whitespace-pre-line">{selectedNews.content}</p>
                  {selectedNews.link && (
                    <div className="pt-4">
                      <Button asChild>
                        <a href={selectedNews.link} target="_blank" rel="noopener noreferrer">
                          <ArrowSquareOut className="mr-2" /> Read Full Article
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedPublication} onOpenChange={() => setSelectedPublication(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedPublication && (
              <>
                <DialogHeader>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge variant={publicationTypeColors[selectedPublication.type]} className="capitalize text-base px-4 py-2">
                      {selectedPublication.type.replace('-', ' ')}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar size={16} className="mr-1" />
                      {selectedPublication.date}
                    </div>
                  </div>
                  <DialogTitle className="text-3xl mb-2">{selectedPublication.title}</DialogTitle>
                  <p className="text-base text-muted-foreground">{selectedPublication.authors.join(', ')}</p>
                  <p className="text-base text-accent font-medium italic">{selectedPublication.journal}</p>
                </DialogHeader>

                <Separator className="my-6" />

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Abstract</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedPublication.abstract}</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPublication.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    {selectedPublication.doi && (
                      <Button asChild>
                        <a href={selectedPublication.doi} target="_blank" rel="noopener noreferrer">
                          <ArrowSquareOut className="mr-2" /> View on Publisher Site
                        </a>
                      </Button>
                    )}
                    {selectedPublication.pdfUrl && (
                      <Button variant="outline">
                        <Download className="mr-2" /> Download PDF
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
