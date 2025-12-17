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
    <footer className="bg-secondary border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <a 
                href={getWhatsAppUrl()}
                onClick={handleWhatsAppClick}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappLogo className="mr-2" size={16} weight="fill" />
                WhatsApp
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a 
                href={getEmailUrl('general')}
                onClick={handleEmailClick('general')}
              >
                <EnvelopeSimple className="mr-2" size={16} />
                General Enquiry
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a 
                href={getEmailUrl('sales')}
                onClick={handleEmailClick('sales')}
              >
                <EnvelopeSimple className="mr-2" size={16} />
                Quote Request
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Copyright © 2021 Polymer Bionics Limited. All rights reserved
          </p>
          <p className="text-sm text-muted-foreground">
            {contactConfig.address.street}, {contactConfig.address.city} {contactConfig.address.postcode}, {contactConfig.address.country}
          </p>
        </div>
      </div>
    </footer>
  )
}
