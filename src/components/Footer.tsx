/**
 * Footer Component
 * 
 * Site footer with contact information, social links, and legal links.
 * Includes consent management controls.
 * 
 * @module components/Footer
 */

import { memo, useCallback } from 'react'
import { EnvelopeSimple, WhatsappLogo } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { contactConfig, getEmailUrl, getWhatsAppUrl } from '@/lib/contact-config'
import { openExternal } from '@/lib/utils'
import { ManageCookiesLink, ConsentStatusIndicator } from '@/components/ConsentBanner'

/**
 * Site footer component.
 * 
 * Features:
 * - Contact action buttons (WhatsApp, Email)
 * - Company address and copyright
 * - Cookie consent management links
 * - Consent status indicator
 * 
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export const Footer = memo(() => {
  const handleWhatsAppClick = useCallback(() => {
    openExternal(getWhatsAppUrl())
  }, [])

  const handleEmailClick = (type: 'general' | 'sales') => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    openExternal(getEmailUrl(type))
  }

  return (
    <footer className="bg-secondary/50 border-t border-border mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="text-center space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 md:gap-3">
            <Button variant="outline" size="default" className="font-semibold text-sm md:text-base" onClick={handleWhatsAppClick}>
              <WhatsappLogo className="mr-2" size={18} weight="fill" />
              WhatsApp
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
            {/* Privacy & Cookie Links */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <ManageCookiesLink />
              <span className="text-muted-foreground">|</span>
              <ConsentStatusIndicator />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
})
