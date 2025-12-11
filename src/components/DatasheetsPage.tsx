import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Download, MagnifyingGlass, FileText, Calendar } from '@phosphor-icons/react'
import type { Datasheet } from '@/lib/types'

interface DatasheetsPageProps {
  datasheets: Datasheet[]
}

export function DatasheetsPage({ datasheets }: DatasheetsPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDatasheet, setSelectedDatasheet] = useState<Datasheet | null>(null)

  const categories = ['all', ...Array.from(new Set(datasheets.map(d => d.category)))]

  const filteredDatasheets = datasheets.filter(datasheet => {
    const matchesSearch = datasheet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         datasheet.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || datasheet.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 px-8">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="text-6xl font-bold mb-6">Technical Datasheets</h1>
          <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
            Comprehensive technical documentation including mechanical properties, biocompatibility data,
            and regulatory compliance information for all our biomaterials.
          </p>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search datasheets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-2 text-sm capitalize"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          {filteredDatasheets.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText size={64} className="text-muted-foreground mx-auto mb-4" weight="light" />
              <h3 className="text-xl font-semibold mb-2">No datasheets found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
                Clear Filters
              </Button>
            </Card>
          ) : (
            <div className="hidden md:block border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Product Name</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Version</TableHead>
                    <TableHead className="font-semibold">Last Updated</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDatasheets.map((datasheet) => (
                    <TableRow
                      key={datasheet.id}
                      className="cursor-pointer hover:bg-muted/30"
                      onClick={() => setSelectedDatasheet(datasheet)}
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
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedDatasheet(datasheet)
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
          )}

          <div className="md:hidden grid grid-cols-1 gap-4">
            {filteredDatasheets.map((datasheet) => (
              <Card
                key={datasheet.id}
                className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-accent"
                onClick={() => setSelectedDatasheet(datasheet)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold flex-1">{datasheet.name}</h3>
                  <Badge variant="secondary">{datasheet.version}</Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="capitalize">{datasheet.category}</Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar size={16} className="mr-1" />
                  Updated: {datasheet.lastUpdated}
                </div>
                <Button size="sm" onClick={(e) => { e.stopPropagation(); }}>
                  <Download size={16} className="mr-2" /> Download PDF
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedDatasheet} onOpenChange={() => setSelectedDatasheet(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedDatasheet && (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <DialogTitle className="text-3xl mb-2">{selectedDatasheet.name}</DialogTitle>
                      <p className="text-muted-foreground">{selectedDatasheet.description}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge variant="secondary" className="text-base px-4 py-2">{selectedDatasheet.version}</Badge>
                      <Badge variant="outline" className="capitalize">{selectedDatasheet.category}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar size={16} className="mr-2" />
                    Last updated: {selectedDatasheet.lastUpdated}
                  </div>
                </DialogHeader>

                <Separator className="my-6" />

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Technical Specifications</h4>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedDatasheet.technicalSpecs.map((spec, idx) => (
                        <div key={idx} className="flex border-b pb-3">
                          <div className="w-1/2 font-medium text-sm">{spec.label}</div>
                          <div className="w-1/2 text-sm text-muted-foreground">{spec.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="w-full md:w-auto">
                      <Download className="mr-2" /> Download Complete Datasheet (PDF)
                    </Button>
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
