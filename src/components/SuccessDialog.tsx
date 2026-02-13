/**
 * Success Dialog Component
 *
 * Reusable confirmation popup shown after a form is successfully submitted.
 * Provides clear visual feedback with a checkmark animation and a summary message.
 *
 * @module components/SuccessDialog
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle } from '@phosphor-icons/react'

export interface SuccessDialogProps {
  /** Whether the dialog is visible */
  open: boolean
  /** Handler to close the dialog */
  onOpenChange: (open: boolean) => void
  /** Heading text (e.g. "Message Sent!") */
  title: string
  /** Supporting description */
  description?: string
  /** Label for the dismiss button */
  buttonLabel?: string
}

/**
 * Modal dialog confirming a successful form submission.
 *
 * @example
 * ```tsx
 * <SuccessDialog
 *   open={showSuccess}
 *   onOpenChange={setShowSuccess}
 *   title="Order Submitted!"
 *   description="We'll get back to you within 24 hours."
 * />
 * ```
 */
export function SuccessDialog({
  open,
  onOpenChange,
  title,
  description,
  buttonLabel = 'OK',
}: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader className="flex flex-col items-center gap-3 pt-2">
          <div className="flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 p-3">
            <CheckCircle size={48} weight="fill" className="text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          )}
        </DialogHeader>
        <Button className="w-full mt-2" onClick={() => onOpenChange(false)}>
          {buttonLabel}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
