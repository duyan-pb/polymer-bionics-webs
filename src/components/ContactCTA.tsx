/**
 * Contact CTA
 * 
 * Thin wrapper around ContactLinks with common defaults.
 * 
 * @module components/ContactCTA
 */

import type { ComponentProps } from 'react'
import { ContactLinks } from '@/components/ContactLinks'

interface ContactCTAProps {
  emailType?: 'general' | 'sales'
  variant?: ComponentProps<typeof ContactLinks>['variant']
  size?: ComponentProps<typeof ContactLinks>['size']
  className?: string
}

export function ContactCTA({
  emailType = 'general',
  variant = 'default',
  size = 'default',
  className,
}: ContactCTAProps) {
  return (
    <ContactLinks
      emailType={emailType}
      variant={variant}
      size={size}
      className={className}
      showWhatsApp={true}
      showEmail={true}
    />
  )
}
