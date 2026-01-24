/**
 * Payment Page Component
 * 
 * Placeholder payment and order flow page.
 * 
 * @module components/PaymentPage
 */

// =============================================================================
// TODO: IMPLEMENT REAL PAYMENT FLOW
// =============================================================================
// Current state: Order request form only (sends email enquiry)
// Future implementation:
// - Integrate Stripe/PayPal for payment processing
// - Add shopping cart functionality
// - Implement inventory checking
// - Add order confirmation emails
// - Add order tracking/history
// =============================================================================

import { useCallback, useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLayout } from '@/components/layout/PageLayout'
import { ContactCTA } from '@/components/ContactCTA'
import { CreditCard, ShoppingCart } from '@phosphor-icons/react'
import BackgroundCover from '@/assets/images/optimized/Background_Cover.webp'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { submitContactForm } from '@/lib/form-service'
import type { PaymentOrderDraft, Product } from '@/lib/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface PaymentPageProps {
  onNavigate: (page: string) => void
  products: Product[]
}

interface OrderFormData {
  name: string
  email: string
  company: string
  product: string
  quantity: string
  country: string
  notes: string
}

interface OrderFormErrors {
  name?: string
  email?: string
  product?: string
  quantity?: string
  country?: string
}

const INITIAL_ORDER_FORM: OrderFormData = {
  name: '',
  email: '',
  company: '',
  product: '',
  quantity: '',
  country: '',
  notes: '',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function PaymentPage({ onNavigate, products }: PaymentPageProps) {
  const [paymentDraft, setPaymentDraft] = useKV<PaymentOrderDraft>('paymentDraft', INITIAL_ORDER_FORM)
  const [formData, setFormData] = useState<OrderFormData>(INITIAL_ORDER_FORM)
  const [errors, setErrors] = useState<OrderFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!paymentDraft) {
      return
    }
    setFormData(prev => ({
      ...prev,
      product: prev.product || paymentDraft.product,
      quantity: prev.quantity || paymentDraft.quantity,
    }))
  }, [paymentDraft])

  const hero = {
    title: 'Payments & Orders',
    description: 'Secure checkout for Polymer Bionics products. Online payments are coming soon—contact sales to place an order or request an invoice today.',
    backgroundImage: BackgroundCover,
    backgroundOpacity: 0.6,
    breadcrumbs: [
      { label: 'Home', page: 'home' },
      { label: 'Payment' },
    ],
    onNavigate,
  }

  const validateForm = useCallback(() => {
    const nextErrors: OrderFormErrors = {}

    if (!formData.name.trim()) {
      nextErrors.name = 'Name is required'
    }
    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required'
    } else if (!EMAIL_REGEX.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email address'
    }
    if (!formData.product.trim()) {
      nextErrors.product = 'Product is required'
    }
    if (!formData.quantity.trim()) {
      nextErrors.quantity = 'Quantity is required'
    }
    if (!formData.country.trim()) {
      nextErrors.country = 'Country is required'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }, [formData])

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => (prev[name as keyof OrderFormErrors] ? { ...prev, [name]: undefined } : prev))
  }, [])

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setIsSubmitting(true)

    try {
      const messageLines = [
        `Product: ${formData.product}`,
        `Quantity: ${formData.quantity}`,
        `Country: ${formData.country}`,
        formData.company ? `Company: ${formData.company}` : null,
        formData.notes ? `Notes: ${formData.notes}` : null,
      ].filter(Boolean)

      const result = await submitContactForm({
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        subject: 'Order request',
        message: messageLines.join('\n'),
      })

      if (result.success) {
        toast.success('Order request sent', {
          description: 'Our sales team will contact you shortly with a quote and payment options.',
        })
        setFormData(INITIAL_ORDER_FORM)
        setErrors({})
        setPaymentDraft(INITIAL_ORDER_FORM)
      } else {
        toast.error('Failed to send order request', {
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
  }, [formData, validateForm, setPaymentDraft])

  return (
    <PageLayout hero={hero}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CreditCard size={24} className="text-primary" weight="duotone" />
              <CardTitle>Checkout</CardTitle>
              <Badge variant="outline">Coming soon</Badge>
            </div>
            <CardDescription>
              We are finalizing secure Stripe checkout for direct online orders. Until then, place an order via the form below or contact sales.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'order-name-error' : undefined}
                    className={cn(errors.name && 'border-destructive')}
                  />
                  {errors.name && (
                    <p id="order-name-error" className="text-xs text-destructive">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@company.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'order-email-error' : undefined}
                    className={cn(errors.email && 'border-destructive')}
                  />
                  {errors.email && (
                    <p id="order-email-error" className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-semibold">Company / Organization</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your organization"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-semibold">Country *</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="United Kingdom"
                    aria-invalid={!!errors.country}
                    aria-describedby={errors.country ? 'order-country-error' : undefined}
                    className={cn(errors.country && 'border-destructive')}
                  />
                  {errors.country && (
                    <p id="order-country-error" className="text-xs text-destructive">{errors.country}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product" className="text-sm font-semibold">Product *</Label>
                  <Select
                    value={formData.product}
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, product: value }))
                      setErrors(prev => (prev.product ? { ...prev, product: undefined } : prev))
                    }}
                  >
                    <SelectTrigger
                      id="product"
                      aria-invalid={!!errors.product}
                      aria-describedby={errors.product ? 'order-product-error' : undefined}
                      className={cn(errors.product && 'border-destructive')}
                    >
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.name}>
                          {product.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other (specify in notes)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.product && (
                    <p id="order-product-error" className="text-xs text-destructive">{errors.product}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm font-semibold">Quantity *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="1"
                    aria-invalid={!!errors.quantity}
                    aria-describedby={errors.quantity ? 'order-quantity-error' : undefined}
                    className={cn(errors.quantity && 'border-destructive')}
                  />
                  {errors.quantity && (
                    <p id="order-quantity-error" className="text-xs text-destructive">{errors.quantity}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-semibold">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Delivery timeline, product configuration, or any special requirements."
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending request…' : 'Request quote'}
                </Button>
                <Button variant="outline" onClick={() => onNavigate('products')}>
                  <ShoppingCart className="mr-2" size={18} weight="duotone" /> Back to products
                </Button>
                <Button disabled>
                  Stripe checkout coming soon
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Place an order now</CardTitle>
            <CardDescription>
              Contact sales to request a quote, invoice, or purchase order.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactCTA emailType="sales" variant="outline" />
            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              <p>Typical lead time: X–Y weeks (product dependent).</p>
              <p>Payment options: invoice, bank transfer, or card via Stripe.</p>
              <p>Shipping: global, with VAT/tax handled by region.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
