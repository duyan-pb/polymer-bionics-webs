import { Button } from '@/components/ui/button'
import { EnvelopeSimple, WhatsappLogo } from '@phosphor-icons/react'
import { contactConfig, getWhatsAppUrl, getEmailUrl } from '@/lib/contact-config'

interface ContactLinksProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  showWhatsApp?: boolean
  showEmail?: boolean
  emailType?: 'general' | 'sales'
}

export function ContactLinks({ 
  variant = 'default', 
  size = 'default',
  className = '',
  showWhatsApp = true,
  showEmail = true,
  emailType = 'general'
}: ContactLinksProps) {
  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Open WhatsApp in a new window/tab
    e.preventDefault()
    window.open(getWhatsAppUrl(), '_blank', 'noopener,noreferrer')
  }

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Trigger the mailto link
    e.preventDefault()
    window.location.href = getEmailUrl(emailType)
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {showWhatsApp && (
        <Button 
          variant={variant} 
          size={size}
          asChild
        >
          <a 
            href={getWhatsAppUrl()}
            onClick={handleWhatsAppClick}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsappLogo className="mr-2" size={18} weight="fill" />
            WhatsApp Enquiry
          </a>
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
