/**
 * Datasheet Card List (mobile)
 * 
 * @module components/datasheets/DatasheetCardList
 */

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar, Download } from '@phosphor-icons/react'
import type { Datasheet } from '@/lib/types'

interface DatasheetCardListProps {
  datasheets: Datasheet[]
  onSelect: (datasheet: Datasheet) => void
  onDownload: (datasheet: Datasheet) => void
}

export function DatasheetCardList({ datasheets, onSelect, onDownload }: DatasheetCardListProps) {
  return (
    <div className="md:hidden grid grid-cols-1 gap-3">
      {datasheets.map((datasheet) => (
        <Card
          key={datasheet.id}
          className="p-4 md:p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-accent"
          onClick={() => onSelect(datasheet)}
        >
          <div className="flex items-start justify-between mb-2 md:mb-3">
            <h3 className="text-base md:text-lg font-semibold flex-1 pr-2">{datasheet.name}</h3>
            <Badge variant="secondary">{datasheet.version}</Badge>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="capitalize">{datasheet.category}</Badge>
          </div>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Calendar size={16} className="mr-1" />
            Updated: {datasheet.lastUpdated}
          </div>
          <Button
            size="sm"
            disabled={!datasheet.pdfUrl}
            onClick={(e) => {
              e.stopPropagation()
              onDownload(datasheet)
            }}
          >
            <Download size={16} className="mr-2" /> Download PDF
          </Button>
        </Card>
      ))}
    </div>
  )
}
