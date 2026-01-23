/**
 * Applications Page Component
 * 
 * Displays clinical applications enabled by Polymer Bionics materials.
 * Features application cards with modal detail view.
 * 
 * @module components/ApplicationsPage
 */

import { useState, useCallback } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { applications } from '@/lib/materials-data'
import type { Application } from '@/lib/types'
import { PageHero } from '@/components/PageHero'
import NeuralCells from '@/assets/images/Neural_Cells.png'
import { ApplicationCard } from '@/components/applications/ApplicationCard'
import { ApplicationDialogContent } from '@/components/applications/ApplicationDialogContent'

/**
 * Props for the ApplicationsPage component.
 */
interface ApplicationsPageProps {
  /** Navigation handler */
  onNavigate: (page: string) => void
}

/**
 * Applications page component.
 * 
 * Features:
 * - Application cards with gradient backgrounds
 * - Modal with benefits, use cases, and related materials
 * - Contact CTA for application inquiries
 * 
 * @example
 * ```tsx
 * <ApplicationsPage onNavigate={handleNavigate} />
 * ```
 */
export function ApplicationsPage({ onNavigate }: ApplicationsPageProps) {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  const handleApplicationSelect = useCallback((application: Application) => {
    setSelectedApplication(application)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="Applications"
        description="Applications for healthcare and diagnostics. Polymer Bionics materials enable breakthrough medical technologies across diverse clinical applications—from peripheral nerve interfaces to continuous infant monitoring, our flexible bioelectronics platform supports innovation that improves patient outcomes."
        backgroundImage={NeuralCells}
        backgroundOpacity={0.5}
        breadcrumbs={[
          { label: 'Home', page: 'home' },
          { label: 'Applications' }
        ]}
        onNavigate={onNavigate}
      />

      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onSelect={handleApplicationSelect}
              />
            ))}
          </div>
        </div>
      </section>



      <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <ScrollArea className="max-h-[80vh] pr-4">
            {selectedApplication && (
              <ApplicationDialogContent application={selectedApplication} />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
