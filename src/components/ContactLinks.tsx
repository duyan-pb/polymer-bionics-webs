/**
 * Contact Links Component
 * 
 * Reusable contact action buttons for WhatsApp and Email.
 * Handles clipboard copying for WhatsApp and opens email client for email contacts.
 * 
 * @module components/ContactLinks
 */

import { Button } from '@/components/ui/button'
import { EnvelopeSimple, WhatsappLogo, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { contactConfig, copyWhatsAppNumber, getEmailUrl } from '@/lib/contact-config'
import { openExternal } from '@/lib/utils'

/**
 * Props for the ContactLinks component.
 */
interface ContactLinksProps {
  /** Button variant style */
  variant?: 'default' | 'outline' | 'ghost'
  /** Button size */
  size?: 'default' | 'sm' | 'lg'
  /** Additional CSS classes */
  className?: string
  /** Show WhatsApp button (default: true) */
  showWhatsApp?: boolean
  /** Show Email button (default: true) */
  showEmail?: boolean
  /** Email type to use (general or sales) */
  emailType?: 'general' | 'sales'
}

/**
 * Contact action buttons component.
 * 
 * Provides WhatsApp and Email contact options.
 * 
 * @example
 * ```tsx
 * <ContactLinks 
 *   variant="outline" 
 *   showWhatsApp={true} 
 *   emailType="sales" 
 * />
 * ```
 */
export function ContactLinks({ 
  variant = 'default', 
  size = 'default',
  className = '',
  showWhatsApp = true,
  showEmail = true,
  emailType = 'general'
}: ContactLinksProps) {
  const handleWhatsAppClick = async () => {
    const success = await copyWhatsAppNumber()
    if (success) {
      toast.success('WhatsApp number copied!', {
        description: `${contactConfig.whatsapp.number} - Open WhatsApp and start a chat`,
      })
    } else {
      toast.error('Could not copy number', {
        description: `WhatsApp: ${contactConfig.whatsapp.number}`,
      })
    }
  }

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Trigger the mailto link
    e.preventDefault()
    openExternal(getEmailUrl(emailType))
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {showWhatsApp && (
        <Button 
          variant={variant} 
          size={size}
          onClick={handleWhatsAppClick}
        >
          <WhatsappLogo className="mr-2" size={18} weight="fill" />
          WhatsApp
          <Copy className="ml-2" size={14} />
        </Button>
      )}
      {showEmail && (
        <Button 
          variant={variant === 'default' ? 'outline' : variant} 
          size={size}
          asChild
        >
          <a 
            href={getEmailUrl(emailType)}
            onClick={handleEmailClick}
          >
            <EnvelopeSimple className="mr-2" size={18} />
            {emailType === 'sales' ? 'Email Sales' : 'Email Us'}
          </a>
        </Button>
      )}
    </div>
  )
}
