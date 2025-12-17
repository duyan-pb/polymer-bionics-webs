import { Button } from '@/components/ui/button'
import { EnvelopeSimple, WhatsappLogo, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { contactConfig, copyWhatsAppNumber, getEmailUrl } from '@/lib/contact-config'

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
    window.open(getEmailUrl(emailType), '_blank', 'noopener,noreferrer')
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
