import { memo, useCallback } from 'react'
import { EnvelopeSimple, WhatsappLogo, Copy } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { contactConfig, copyWhatsAppNumber, getEmailUrl } from '@/lib/contact-config'

export const Footer = memo(function Footer() {
  const handleWhatsAppClick = useCallback(async () => {
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
  }, [])

  const handleEmailClick = (type: 'general' | 'sales') => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.open(getEmailUrl(type), '_blank', 'noopener,noreferrer')
  }

  return (
    <footer className="bg-secondary/50 border-t border-border mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="text-center space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 md:gap-3">
            <Button variant="outline" size="default" className="font-semibold text-sm md:text-base" onClick={handleWhatsAppClick}>
              <WhatsappLogo className="mr-2" size={18} weight="fill" />
              WhatsApp
              <Copy className="ml-2" size={14} />
            </Button>
            <Button variant="outline" size="default" className="font-semibold text-sm md:text-base" asChild>
              <a 
                href={getEmailUrl('general')}
                onClick={handleEmailClick('general')}
              >
                <EnvelopeSimple className="mr-1 md:mr-2" size={18} weight="bold" />
                General Enquiry
              </a>
            </Button>
            <Button variant="outline" size="default" className="font-semibold text-sm md:text-base" asChild>
              <a 
                href={getEmailUrl('sales')}
                onClick={handleEmailClick('sales')}
              >
                <EnvelopeSimple className="mr-1 md:mr-2" size={18} weight="bold" />
                Quote Request
              </a>
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              {contactConfig.email.general}
            </p>
            <p className="text-sm text-muted-foreground">
              {contactConfig.address.street}, {contactConfig.address.city} {contactConfig.address.postcode}, {contactConfig.address.country}
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              Copyright © {new Date().getFullYear()} Polymer Bionics Limited. All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
})
