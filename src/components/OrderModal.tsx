/**
 * Order Capture Modal
 *
 * Reusable order enquiry modal for products, devices, and custom solutions.
 * Collects customer details and submits via the configured form backend.
 *
 * @module components/OrderModal
 */

import { useState, useCallback, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ShoppingCart, EnvelopeSimple, Phone, Package, HashStraight, ChatText, Info } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { submitContactForm } from '@/lib/form-service'

export interface OrderModalProps {
  /** Whether the modal is open */
  open: boolean
  /** Handler to close the modal */
  onOpenChange: (open: boolean) => void
  /** Pre-populated product/device/solution name */
  itemName?: string
  /** Category label shown in the modal (e.g. "Device", "Product", "Custom Solution") */
  itemType?: string
}

interface OrderFormData {
  email: string
  phone: string
  item: string
  quantity: string
  comments: string
}

/**
 * Order capture modal with customer details form.
 *
 * Fields:
 * - Customer email (required)
 * - Customer phone number (required)
 * - Item name (pre-populated)
 * - Order quantity
 * - Comments (optional)
 */
export function OrderModal({ open, onOpenChange, itemName = '', itemType = 'Product' }: OrderModalProps) {
  const [form, setForm] = useState<OrderFormData>({
    email: '',
    phone: '',
    item: itemName,
    quantity: '1',
    comments: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sync itemName prop with form when it changes
  useEffect(() => {
    setForm(prev => ({ ...prev, item: itemName }))
  }, [itemName])

  const handleChange = useCallback((field: keyof OrderFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    if (!form.phone.trim()) {
      toast.error('Please enter your phone number')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await submitContactForm({
        name: '',
        email: form.email,
        subject: `Order Enquiry – ${form.item || 'General'}`,
        message: [
          `Item: ${form.item || 'Not specified'}`,
          `Type: ${itemType}`,
          `Quantity: ${form.quantity}`,
          `Phone: ${form.phone}`,
          form.comments ? `Comments: ${form.comments}` : '',
        ].filter(Boolean).join('\n'),
      })

      if (result.success) {
        toast.success('Order enquiry submitted!', {
          description: 'We will respond within 24 hours.',
        })
        onOpenChange(false)
        setForm({ email: '', phone: '', item: itemName, quantity: '1', comments: '' })
      } else {
        toast.error('Submission failed', {
          description: result.error ?? 'Please try again later.',
        })
      }
    } catch {
      toast.error('Something went wrong', {
        description: 'Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [form, itemName, itemType, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShoppingCart size={24} weight="duotone" className="text-primary" />
            Order Enquiry
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Complete the form below and we will get back to you with a quote.
          </p>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="order-email" className="flex items-center gap-1.5 text-sm font-medium">
              <EnvelopeSimple size={16} className="text-muted-foreground" /> Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="order-email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="order-phone" className="flex items-center gap-1.5 text-sm font-medium">
              <Phone size={16} className="text-muted-foreground" /> Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="order-phone"
              type="tel"
              placeholder="+44 7123 456789"
              value={form.phone}
              onChange={e => handleChange('phone', e.target.value)}
              required
            />
          </div>

          {/* Item (pre-populated) */}
          <div className="space-y-1.5">
            <Label htmlFor="order-item" className="flex items-center gap-1.5 text-sm font-medium">
              <Package size={16} className="text-muted-foreground" /> Item
            </Label>
            <Input
              id="order-item"
              value={form.item}
              onChange={e => handleChange('item', e.target.value)}
              placeholder="Product or device name"
            />
          </div>

          {/* Quantity */}
          <div className="space-y-1.5">
            <Label htmlFor="order-qty" className="flex items-center gap-1.5 text-sm font-medium">
              <HashStraight size={16} className="text-muted-foreground" /> Quantity
            </Label>
            <Input
              id="order-qty"
              type="number"
              min="1"
              value={form.quantity}
              onChange={e => handleChange('quantity', e.target.value)}
            />
          </div>

          {/* Comments */}
          <div className="space-y-1.5">
            <Label htmlFor="order-comments" className="flex items-center gap-1.5 text-sm font-medium">
              <ChatText size={16} className="text-muted-foreground" /> Comments <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              id="order-comments"
              placeholder="Any additional requirements or questions…"
              rows={3}
              value={form.comments}
              onChange={e => handleChange('comments', e.target.value)}
            />
          </div>

          {/* Note */}
          <div className="flex items-start gap-2 rounded-md bg-muted/60 px-3 py-2.5 text-xs text-muted-foreground">
            <Info size={16} className="mt-0.5 flex-shrink-0 text-primary" weight="fill" />
            <span>We will respond within 24 hours with a quotation or to confirm your order.</span>
          </div>

          {/* Submit */}
          <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Submit Order Enquiry'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
