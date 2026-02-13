/**
 * Contact Form Component
 * 
 * Reusable contact form with validation and submission handling.
 * Extracted from ContactPage for better maintainability.
 * 
 * @module components/contact/ContactForm
 */

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { submitContactForm } from '@/lib/form-service'
import { SuccessDialog } from '@/components/SuccessDialog'

/**
 * Form data structure for contact form.
 */
interface ContactFormData {
  name: string
  email: string
  company: string
  subject: string
  message: string
}

/**
 * Form validation error state.
 */
interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const INITIAL_FORM_DATA: ContactFormData = {
  name: '',
  email: '',
  company: '',
  subject: '',
  message: ''
}

/**
 * Email validation regex pattern.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Contact form component with validation.
 * 
 * Features:
 * - Client-side form validation
 * - Error state management
 * - Submit handling with loading state
 * - Toast notifications for feedback
 * 
 * @example
 * ```tsx
 * <ContactForm />
 * ```
 */
export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const result = await submitContactForm({
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        subject: formData.subject,
        message: formData.message,
      })
      
      if (result.success) {
        setFormData(INITIAL_FORM_DATA)
        setErrors({})
        setShowSuccess(true)
      } else {
        toast.error('Failed to send message', {
          description: result.error ?? 'Please try again later.'
        })
      }
    } catch {
      toast.error('Something went wrong', {
        description: 'Please try again later.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [validateForm, formData])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    setErrors(prev => {
      if (prev[name as keyof FormErrors]) {
        return { ...prev, [name]: undefined }
      }
      return prev
    })
  }, [])

  return (
    <Card className="h-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl">Send us a message</CardTitle>
        <CardDescription className="text-sm md:text-base">
          Fill out the form below and we'll respond within 24 hours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-semibold">Full Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Smith"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className={cn("h-11", errors.name && "border-destructive")}
            />
            {errors.name && (
              <p id="name-error" className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-semibold">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={cn("h-11", errors.email && "border-destructive")}
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-base font-semibold">Company / Organization</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Your organization"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-base font-semibold">Subject *</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="What can we help you with?"
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? 'subject-error' : undefined}
              className={cn("h-11", errors.subject && "border-destructive")}
            />
            {errors.subject && (
              <p id="subject-error" className="text-sm text-destructive">{errors.subject}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-base font-semibold">Message *</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Tell us more about your inquiry..."
              rows={6}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-error' : undefined}
              className={cn("resize-none", errors.message && "border-destructive")}
            />
            {errors.message && (
              <p id="message-error" className="text-sm text-destructive">{errors.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full font-semibold" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </CardContent>

      <SuccessDialog
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title="Message Sent!"
        description="Thank you for reaching out. We'll get back to you within 24 hours."
      />
    </Card>
  )
}
