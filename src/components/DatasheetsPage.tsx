/**
 * Datasheets Page Component
 * 
 * Technical datasheets library with search and filtering.
 * Provides downloadable PDF documents for products and materials.
 * 
 * @module components/DatasheetsPage
 */

import { useState, useMemo, useCallback, useEffect, type KeyboardEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MagnifyingGlass, FileText } from '@phosphor-icons/react'
import type { Datasheet } from '@/lib/types'
import { PageLayout } from '@/components/layout/PageLayout'
import { DEBOUNCE_DELAY_MS } from '@/lib/constants'
import { openExternal } from '@/lib/utils'
import { ContentState } from '@/components/ContentState'
import BackgroundCover from '@/assets/images/Background_Cover.png'
import { DatasheetTable } from '@/components/datasheets/DatasheetTable'
import { DatasheetCardList } from '@/components/datasheets/DatasheetCardList'
import { DatasheetDialogContent } from '@/components/datasheets/DatasheetDialogContent'

/**
 * Props for the DatasheetsPage component.
 */
interface DatasheetsPageProps {
  /** Array of datasheet documents */
  datasheets: Datasheet[]
  /** Navigation handler */
  onNavigate: (page: string) => void
}

/**
 * Datasheets library page component.
 * 
 * Features:
 * - Search with debounced input
 * - Category filtering
 * - Table view with version and date info
 * - Detail modal with technical specifications
 * - PDF download links
 * 
 * @example
 * ```tsx
 * <DatasheetsPage datasheets={sheets} onNavigate={handleNavigate} />
 * ```
 */
export function DatasheetsPage({ datasheets, onNavigate }: DatasheetsPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDatasheet, setSelectedDatasheet] = useState<Datasheet | null>(null)

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim().toLowerCase())
    }, DEBOUNCE_DELAY_MS)
    return () => window.clearTimeout(handle)
  }, [searchTerm])

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(datasheets.map(d => d.category)))],
    [datasheets]
  )

  const filteredDatasheets = useMemo(() => {
    return datasheets.filter(datasheet => {
      const matchesSearch = debouncedSearch.length === 0 ||
        datasheet.name.toLowerCase().includes(debouncedSearch) ||
        datasheet.description.toLowerCase().includes(debouncedSearch)
      const matchesCategory = selectedCategory === 'all' || datasheet.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [datasheets, debouncedSearch, selectedCategory])

  const hasDatasheets = filteredDatasheets.length > 0

  const handleDownload = useCallback((datasheet: Datasheet) => {
    if (!datasheet.pdfUrl) {
      return
    }
    openExternal(datasheet.pdfUrl)
  }, [])

  const handleCategoryKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>, cat: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setSelectedCategory(cat)
    }
  }, [])

  const hero = {
    title: 'Technical Datasheets',
    description: 'Comprehensive technical documentation including mechanical properties, biocompatibility data, and processing guidelines for our advanced biomaterials platform.',
    backgroundImage: BackgroundCover,
    backgroundOpacity: 0.7,
    breadcrumbs: [
      { label: 'Home', page: 'home' },
      { label: 'Datasheets' },
    ],
    onNavigate,
  }

  const emptyState = {
    icon: <FileText size={80} className="text-muted-foreground/40 mx-auto mb-4" weight="light" />,
    title: 'Datasheets coming soon',
    description: 'We are finalizing technical datasheets for our products. Check back soon or contact us and we will notify you when they are available.',
    emailType: 'sales' as const,
  }

  return (
    <PageLayout hero={hero}>
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-8 md:mb-12">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Search datasheets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className="cursor-pointer px-5 py-2.5 text-sm capitalize font-semibold"
              onClick={() => setSelectedCategory(cat)}
              onKeyDown={(event) => handleCategoryKeyDown(event, cat)}
              role="button"
              tabIndex={0}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <ContentState
        isEmpty={!hasDatasheets}
        emptyProps={emptyState}
        emptyActions={(
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
              Clear Filters
            </Button>
          </div>
        )}
      >
        <DatasheetTable
          datasheets={filteredDatasheets}
          onSelect={setSelectedDatasheet}
          onDownload={handleDownload}
        />
      </ContentState>

      <DatasheetCardList
        datasheets={filteredDatasheets}
        onSelect={setSelectedDatasheet}
        onDownload={handleDownload}
      />

      <Dialog open={!!selectedDatasheet} onOpenChange={() => setSelectedDatasheet(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedDatasheet && (
              <DatasheetDialogContent
                datasheet={selectedDatasheet}
                onDownload={handleDownload}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </PageLayout>
  )
}
