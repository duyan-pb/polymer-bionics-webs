/**
 * News Page Component
 * 
 * Displays company news and scientific publications.
 * Features tabbed interface with filtering for publications.
 * 
 * @module components/NewsPage
 */

import { useState, useMemo, useCallback, type KeyboardEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Calendar, Newspaper, BookOpen, ArrowSquareOut, Download } from '@phosphor-icons/react'
import type { NewsItem, Publication } from '@/lib/types'
import { ContactLinks } from '@/components/ContactLinks'
import { PageHero } from '@/components/PageHero'
import { ClickableCard } from '@/components/ClickableCard'
import { openExternal } from '@/lib/utils'
import { ComingSoonCard } from '@/components/ComingSoonCard'
import BackgroundCover from '@/assets/images/Background_Cover.png'

/**
 * Props for the NewsPage component.
 */
interface NewsPageProps {
  /** Array of news articles */
  news: NewsItem[]
  /** Array of publications */
  publications: Publication[]
  /** Navigation handler */
  onNavigate: (page: string) => void
}

/**
 * News and publications page component.
 * 
 * Features:
 * - Tabbed interface (News / Publications)
 * - News article detail modal
 * - Publication filtering by topic tags
 * - DOI and external links for publications
 * 
 * @example
 * ```tsx
 * <NewsPage news={newsItems} publications={pubs} onNavigate={handleNavigate} />
 * ```
 */
export function NewsPage({ news, publications, onNavigate }: NewsPageProps) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)
  const [selectedTag, setSelectedTag] = useState<string>('all')

  const allTags = useMemo(
    () => ['all', ...Array.from(new Set(publications.flatMap(p => p.tags)))],
    [publications]
  )

  const filteredPublications = useMemo(
    () => selectedTag === 'all'
      ? publications
      : publications.filter(p => p.tags.includes(selectedTag)),
    [publications, selectedTag]
  )

  const handleTagSelect = useCallback((tag: string) => {
    setSelectedTag(tag)
  }, [])

  const handleTagKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>, tag: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleTagSelect(tag)
    }
  }, [handleTagSelect])

  const handleNewsSelect = useCallback((item: NewsItem) => {
    setSelectedNews(item)
  }, [])

  const handlePublicationSelect = useCallback((pub: Publication) => {
    setSelectedPublication(pub)
  }, [])

  const publicationTypeColors: Record<Publication['type'], 'default' | 'secondary' | 'outline'> = {
    'journal': 'default',
    'conference': 'secondary',
    'preprint': 'outline',
  }

  const NewsDialogContent = ({ item }: { item: NewsItem }) => (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="secondary" className="capitalize text-base px-4 py-2">
            {item.category}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar size={16} className="mr-1" />
            {item.date}
          </div>
        </div>
        <DialogTitle className="text-3xl mb-4">{item.title}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <p className="text-base leading-relaxed whitespace-pre-line">{item.content}</p>
        <div className="pt-4 flex gap-3">
          {item.link && (
            <Button asChild>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <ArrowSquareOut className="mr-2" /> Read Full Article
              </a>
            </Button>
          )}
          <ContactLinks emailType="general" variant="outline" showWhatsApp={true} showEmail={true} />
        </div>
      </div>
    </>
  )

  const PublicationDialogContent = ({ pub }: { pub: Publication }) => (
    <>
      <DialogHeader>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant={publicationTypeColors[pub.type]} className="capitalize text-base px-4 py-2">
            {pub.type.replace('-', ' ')}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar size={16} className="mr-1" />
            {pub.date}
          </div>
        </div>
        <DialogTitle className="text-3xl mb-2">{pub.title}</DialogTitle>
        <p className="text-base text-muted-foreground">{pub.authors.join(', ')}</p>
        <p className="text-base text-accent font-medium italic">{pub.journal}</p>
      </DialogHeader>

      <Separator className="my-6" />

      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold mb-3">Abstract</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{pub.abstract}</p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {pub.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4 flex-wrap">
          {pub.doi && (
            <Button asChild>
              <a href={pub.doi} target="_blank" rel="noopener noreferrer">
                <ArrowSquareOut className="mr-2" /> View on Publisher Site
              </a>
            </Button>
          )}
          {pub.pdfUrl && (
            <Button variant="outline" onClick={() => openExternal(pub.pdfUrl)}>
              <Download className="mr-2" /> Download PDF
            </Button>
          )}
          <ContactLinks emailType="general" variant="outline" showWhatsApp={true} showEmail={true} />
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="News & Publications"
        description="Stay updated on our latest research, partnerships, grant awards, and peer-reviewed publications advancing the field of medical biomaterials."
        backgroundImage={BackgroundCover}
        backgroundOpacity={0.35}
        breadcrumbs={[
          { label: 'Home', page: 'home' },
          { label: 'News & Publications' }
        ]}
        onNavigate={onNavigate}
      />

      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-[1280px] mx-auto">
          <Tabs defaultValue="news" className="w-full">
            <TabsList className="mb-8 md:mb-12">
              <TabsTrigger value="news" className="text-sm md:text-base px-4 md:px-8 py-2 md:py-3 font-semibold">
                <Newspaper className="mr-1 md:mr-2" size={18} /> News
              </TabsTrigger>
              <TabsTrigger value="publications" className="text-sm md:text-base px-4 md:px-8 py-2 md:py-3 font-semibold">
                <BookOpen className="mr-1 md:mr-2" size={18} /> Publications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="news">
              {news.length === 0 ? (
                <ComingSoonCard
                  icon={<Newspaper size={80} className="text-muted-foreground/40 mx-auto mb-4" weight="light" />}
                  title="News coming soon"
                  description="Stay tuned for updates on our latest research, partnerships, and company announcements. Contact us to stay informed."
                  emailType="general"
                />
              ) : (
                <div className="space-y-4 md:space-y-6">
                  {news.map((item) => (
                    <ClickableCard
                      key={item.id}
                      className="p-5 md:p-8 border-l-4 border-l-primary"
                      onClick={() => handleNewsSelect(item)}
                      ariaLabel={`Read news: ${item.title}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant="secondary" className="capitalize font-semibold">{item.category}</Badge>
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
                    </ClickableCard>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="publications">
              {publications.length === 0 ? (
                <ComingSoonCard
                  icon={<BookOpen size={80} className="text-muted-foreground/40 mx-auto mb-4" weight="light" />}
                  title="Publications coming soon"
                  description="Our peer-reviewed research publications will be listed here. Contact us to discuss our scientific findings and ongoing research."
                  emailType="general"
                />
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTag === tag ? 'default' : 'outline'}
                        className="cursor-pointer px-4 py-2 text-sm capitalize"
                        onClick={() => handleTagSelect(tag)}
                        onKeyDown={(event) => handleTagKeyDown(event, tag)}
                        role="button"
                        tabIndex={0}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-4 md:space-y-6">
                    {filteredPublications.map((pub) => (
                      <ClickableCard
                        key={pub.id}
                        className="p-4 md:p-6 border-l-4 border-l-primary"
                        onClick={() => handlePublicationSelect(pub)}
                        ariaLabel={`View publication: ${pub.title}`}
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
                              <Button variant="ghost" size="sm" onClick={() => openExternal(pub.pdfUrl)}>
                                <Download className="mr-1" size={16} /> Download PDF
                              </Button>
                            )}
                          </div>
                        </div>
                      </ClickableCard>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedNews && (
              <NewsDialogContent item={selectedNews} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedPublication} onOpenChange={() => setSelectedPublication(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedPublication && (
              <PublicationDialogContent pub={selectedPublication} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
