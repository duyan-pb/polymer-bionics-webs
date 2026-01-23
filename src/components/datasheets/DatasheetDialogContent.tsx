/**
 * Datasheet Dialog Content
 * 
 * @module components/datasheets/DatasheetDialogContent
 */

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Calendar, Download } from '@phosphor-icons/react'
import type { Datasheet } from '@/lib/types'
import { ContactCTA } from '@/components/ContactCTA'

interface DatasheetDialogContentProps {
  datasheet: Datasheet
  onDownload: (datasheet: Datasheet) => void
}

export function DatasheetDialogContent({ datasheet, onDownload }: DatasheetDialogContentProps) {
  return (
    <>
      <DialogHeader>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <DialogTitle className="text-3xl mb-2">{datasheet.name}</DialogTitle>
            <p className="text-muted-foreground">{datasheet.description}</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant="secondary" className="text-base px-4 py-2">{datasheet.version}</Badge>
            <Badge variant="outline" className="capitalize">{datasheet.category}</Badge>
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar size={16} className="mr-2" />
          Last updated: {datasheet.lastUpdated}
        </div>
      </DialogHeader>

      <Separator className="my-6" />

      <div className="space-y-6">
        {datasheet.technicalSpecs && (
          <div>
            <h4 className="text-lg font-semibold mb-4">Technical Specifications</h4>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(datasheet.technicalSpecs).map(([key, value], idx) => (
                <div key={idx} className="flex border-b pb-3">
                  <div className="w-1/2 font-medium text-sm">{key}</div>
                  <div className="w-1/2 text-sm text-muted-foreground">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 flex gap-3">
          <Button disabled={!datasheet.pdfUrl} onClick={() => onDownload(datasheet)}>
            <Download className="mr-2" /> Download Complete Datasheet (PDF)
          </Button>
          <ContactCTA emailType="sales" variant="outline" />
        </div>
      </div>
    </>
  )
}
