import { Button } from '@/components/ui/button'
import { EnvelopeSimple, WhatsappLogo } from '@phosphor-icons/react'

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
  const email = emailType === 'sales' ? 'sales@polymerbionics.com' : 'info@polymerbionics.com'
  const whatsappNumber = '+447000000000'
  const whatsappMessage = 'Hello, I would like to enquire about Polymer Bionics products and services.'
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {showWhatsApp && (
        <Button 
          variant={variant} 
          size={size}
          asChild
        >
          <a 
            href={`https://wa.me/${whatsappNumber.replace(/\+/g, '')}?text=${encodeURIComponent(whatsappMessage)}`}
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
          <a href={`mailto:${email}`}>
            <EnvelopeSimple className="mr-2" size={18} />
            {emailType === 'sales' ? 'Email Sales' : 'Email Us'}
          </a>
        </Button>
      )}
    </div>
  )
}
