/**
 * Datasheet Table (desktop)
 * 
 * @module components/datasheets/DatasheetTable
 */

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Download } from '@phosphor-icons/react'
import type { Datasheet } from '@/lib/types'

interface DatasheetTableProps {
  datasheets: Datasheet[]
  onSelect: (datasheet: Datasheet) => void
  onDownload: (datasheet: Datasheet) => void
}

export function DatasheetTable({ datasheets, onSelect, onDownload }: DatasheetTableProps) {
  return (
    <div className="hidden md:block border rounded-lg overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50">
            <TableHead className="font-bold text-base">Product Name</TableHead>
            <TableHead className="font-bold text-base">Category</TableHead>
            <TableHead className="font-bold text-base">Version</TableHead>
            <TableHead className="font-bold text-base">Last Updated</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datasheets.map((datasheet) => (
            <TableRow
              key={datasheet.id}
              className="cursor-pointer hover:bg-muted/30"
              onClick={() => onSelect(datasheet)}
            >
              <TableCell className="font-medium">{datasheet.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">{datasheet.category}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{datasheet.version}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {datasheet.lastUpdated}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={!datasheet.pdfUrl}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDownload(datasheet)
                  }}
                >
                  <Download size={16} className="mr-2" /> Download
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
