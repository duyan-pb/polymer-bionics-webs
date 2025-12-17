import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Download, MagnifyingGlass, FileText, Calendar } from '@phosphor-icons/react'
import type { Datasheet, Product } from '@/lib/types'
import { materials, applications } from '@/lib/materials-data'
import { useKV } from '@github/spark/hooks'
import { ContactLinks } from '@/components/ContactLinks'

interface DatasheetsPageProps {
  datasheets: Datasheet[]
}

export function DatasheetsPage({ datasheets }: DatasheetsPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDatasheet, setSelectedDatasheet] = useState<Datasheet | null>(null)
  const [products] = useKV<Product[]>('products', [])

  const generatedDatasheets = useMemo(() => {
    const sheets: Datasheet[] = []
    
    materials.forEach((material) => {
      sheets.push({
        id: `datasheet-${material.id}`,
        name: material.name,
        title: `${material.name} Technical Datasheet`,
        description: material.description,
        category: 'Advanced Materials',
        version: 'v1.0',
        lastUpdated: 'January 2025',
        pdfUrl: '#',
        technicalSpecs: {
          'Material Type': 'Flexible Bioelectronic Material',
          'Primary Function': material.properties[0] || 'N/A',
          'Biocompatibility': 'ISO 10993 compliant',
          'Sterilization': 'Compatible with EtO and gamma irradiation',
          'Key Properties': material.properties.slice(0, 3).join(', '),
          'Typical Applications': applications
            .filter(app => app.relevantMaterials.includes(material.name))
            .map(app => app.name)
            .join(', ') || 'Various bioelectronic applications',
        }
      })
    })
    
    applications.forEach((application) => {
      sheets.push({
        id: `datasheet-${application.id}`,
        name: application.name,
        title: `${application.name} Product Information`,
        description: application.description,
        category: 'Clinical Applications',
        version: 'v1.0',
        lastUpdated: 'January 2025',
        pdfUrl: '#',
        technicalSpecs: {
          'Product Type': 'Bioelectronic Device/Application',
          'Primary Use': application.useCases[0] || 'N/A',
          'Key Benefits': application.benefits.slice(0, 3).join(', '),
          'Materials Used': application.relevantMaterials.join(', '),
          'Target Applications': application.useCases.slice(0, 2).join(', '),
          'Regulatory Status': 'Development stage - Contact for partnership',
        }
      })
    })
    
    return sheets
  }, [])

  const allDatasheets = [...generatedDatasheets, ...datasheets]

  const categories = ['all', ...Array.from(new Set(allDatasheets.map(d => d.category)))]

  const filteredDatasheets = allDatasheets.filter(datasheet => {
    const matchesSearch = datasheet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         datasheet.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || datasheet.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://www.polymerbionics.com/uploads/1/2/5/6/125699641/published/dsc-9454.jpg" 
            alt="" 
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
        <div className="relative max-w-[1280px] mx-auto z-10">
          <h1 className="text-6xl font-normal mb-6">Technical Datasheets</h1>
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
                  {selectedDatasheet.technicalSpecs && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Technical Specifications</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {Object.entries(selectedDatasheet.technicalSpecs).map(([key, value], idx) => (
                          <div key={idx} className="flex border-b pb-3">
                            <div className="w-1/2 font-medium text-sm">{key}</div>
                            <div className="w-1/2 text-sm text-muted-foreground">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex gap-3">
                    <Button>
                      <Download className="mr-2" /> Download Complete Datasheet (PDF)
                    </Button>
                    <ContactLinks emailType="sales" variant="outline" showWhatsApp={true} showEmail={true} />
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
