/**
 * Application Dialog Content
 * 
 * Displays full application details in a dialog.
 * 
 * @module components/applications/ApplicationDialogContent
 */

import { Badge } from '@/components/ui/badge'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ContactCTA } from '@/components/ContactCTA'
import { CheckCircle } from '@phosphor-icons/react'
import type { Application } from '@/lib/types'

interface ApplicationDialogContentProps {
  application: Application
}

export function ApplicationDialogContent({ application }: ApplicationDialogContentProps) {
  return (
    <>
      <DialogHeader>
        <div className="h-40 -mx-6 -mt-6 mb-6 overflow-hidden bg-muted">
          {application.imageUrl ? (
            <img src={application.imageUrl} alt={application.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
          ) : (
            <div className={`w-full h-full ${application.imageClass || 'bg-gradient-to-br from-accent/20 to-primary/10'}`}></div>
          )}
        </div>
        <DialogTitle className="text-3xl mb-2">{application.name}</DialogTitle>
        <p className="text-base text-muted-foreground">{application.description}</p>
      </DialogHeader>

      <div className="space-y-6 mt-6">
        <div>
          <h4 className="text-lg font-semibold mb-3">
            Key Benefits
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {application.benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle size={16} className="text-accent mt-1 flex-shrink-0" weight="fill" />
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-lg font-semibold mb-3">
            Clinical Use Cases
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {application.useCases.map((useCase, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle size={16} className="text-accent mt-1 flex-shrink-0" weight="fill" />
                <span className="text-muted-foreground">{useCase}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-lg font-semibold mb-3">Relevant Materials</h4>
          <div className="flex flex-wrap gap-2">
            {application.relevantMaterials.map((material, idx) => (
              <Badge key={idx} variant="secondary" className="text-sm">
                {material}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <ContactCTA emailType="sales" />
        </div>
      </div>
    </>
  )
}
