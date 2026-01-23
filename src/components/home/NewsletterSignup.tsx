/**
 * Newsletter Signup
 * 
 * Controlled newsletter signup form for the home page.
 * 
 * @module components/home/NewsletterSignup
 */

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface NewsletterSignupProps {
  email: string
  isSubmitting: boolean
  onEmailChange: (email: string) => void
  onSubmit: () => void
}

export function NewsletterSignup({ email, isSubmitting, onEmailChange, onSubmit }: NewsletterSignupProps) {
  return (
    <div className="text-center px-4">
      <h2 className="text-2xl md:text-4xl mb-3 md:mb-4">Stay ahead with Polymer Bionics</h2>
      <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6">
        Join our newsletter for the latest breakthroughs, case studies, and clinical data drops.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <div className="flex-1 max-w-sm">
          <Label htmlFor="newsletter-email" className="sr-only">Email address</Label>
          <Input 
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Email address" 
            aria-label="Email address for newsletter subscription"
            className="h-12 text-base" 
            disabled={isSubmitting}
          />
        </div>
        <Button 
          className="h-12 px-6" 
          onClick={onSubmit}
          disabled={isSubmitting}
          aria-label="Subscribe to newsletter"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-2">We send 1-2 updates per month. No spam.</p>
    </div>
  )
}
