import { EnvelopeSimple, WhatsappLogo } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

export function Footer() {
  const whatsappNumber = '+447000000000'
  const whatsappMessage = 'Hello, I would like to enquire about Polymer Bionics products and services.'
  
  return (
    <footer className="bg-secondary border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <a 
                href={`https://wa.me/${whatsappNumber.replace(/\+/g, '')}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappLogo className="mr-2" size={16} weight="fill" />
                WhatsApp
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="mailto:info@polymerbionics.com">
                <EnvelopeSimple className="mr-2" size={16} />
                General Enquiry
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="mailto:sales@polymerbionics.com">
                <EnvelopeSimple className="mr-2" size={16} />
                Quote Request
              </a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Copyright © 2021 Polymer Bionics Limited. All rights reserved
          </p>
          <p className="text-sm text-muted-foreground">
            Exhibition Rd, South Kensington, London SW7 2AZ, United Kingdom
          </p>
        </div>
      </div>
    </footer>
  )
}
