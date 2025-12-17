import { EnvelopeSimple, WhatsappLogo } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { contactConfig, getWhatsAppUrl, getEmailUrl } from '@/lib/contact-config'

export function Footer() {
  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.open(getWhatsAppUrl(), '_blank', 'noopener,noreferrer')
  }

  const handleEmailClick = (type: 'general' | 'sales') => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.location.href = getEmailUrl(type)
  }

  return (
    <footer className="bg-secondary/50 border-t border-border mt-auto">
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <div className="text-center space-y-6">
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="default" className="font-semibold" asChild>
              <a 
                href={getWhatsAppUrl()}
                onClick={handleWhatsAppClick}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappLogo className="mr-2" size={18} weight="fill" />
                WhatsApp
              </a>
            </Button>
            <Button variant="outline" size="default" className="font-semibold" asChild>
              <a 
                href={getEmailUrl('general')}
                onClick={handleEmailClick('general')}
              >
                <EnvelopeSimple className="mr-2" size={18} weight="bold" />
                General Enquiry
              </a>
            </Button>
            <Button variant="outline" size="default" className="font-semibold" asChild>
              <a 
                href={getEmailUrl('sales')}
                onClick={handleEmailClick('sales')}
              >
                <EnvelopeSimple className="mr-2" size={18} weight="bold" />
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
              Copyright © 2021 Polymer Bionics Limited. All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
