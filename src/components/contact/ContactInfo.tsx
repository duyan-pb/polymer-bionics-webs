/**
 * Contact Info Component
 * 
 * Displays company contact information including email, address, and social links.
 * Extracted from ContactPage for better maintainability.
 * 
 * @module components/contact/ContactInfo
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EnvelopeSimple, MapPin, LinkedinLogo } from '@phosphor-icons/react'
import { contactConfig, getEmailUrl } from '@/lib/contact-config'

/**
 * Contact information display component.
 * 
 * Features:
 * - Email links for general and sales inquiries
 * - Physical address display
 * - LinkedIn social link
 * - Technical support info card
 * 
 * @example
 * ```tsx
 * <ContactInfo />
 * ```
 */
export function ContactInfo() {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">Contact Information</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Reach out to us through any of these channels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ContactInfoItem
            icon={<EnvelopeSimple size={24} className="text-primary" weight="bold" />}
            title="General Enquiries"
            href={getEmailUrl('general')}
            linkText={contactConfig.email.general}
          />

          <ContactInfoItem
            icon={<EnvelopeSimple size={24} className="text-primary" weight="bold" />}
            title="Quote Requests"
            href={getEmailUrl('sales')}
            linkText={contactConfig.email.sales}
          />

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <MapPin size={24} className="text-primary" weight="bold" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-1.5">Location</h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                {contactConfig.address.street}<br />
                {contactConfig.address.city} {contactConfig.address.postcode}<br />
                {contactConfig.address.country}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <LinkedinLogo size={24} className="text-primary" weight="bold" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-1.5">LinkedIn</h3>
              <a 
                href={contactConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                Connect with us on LinkedIn
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20 shadow-lg">
        <CardContent className="pt-6">
          <h3 className="font-bold text-foreground mb-3 text-xl">
            Looking for technical support?
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            For technical inquiries about our materials, datasheets, or custom applications, 
            please include relevant details in your message above.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Props for ContactInfoItem component.
 */
interface ContactInfoItemProps {
  /** Icon element to display */
  icon: React.ReactNode
  /** Title/label for the contact method */
  title: string
  /** URL for the link */
  href: string
  /** Text to display for the link */
  linkText: string
}

/**
 * Individual contact info item with icon and link.
 */
function ContactInfoItem({ icon, title, href, linkText }: ContactInfoItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-primary/10 p-3 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-foreground mb-1.5">{title}</h3>
        <a 
          href={href}
          onClick={(e) => {
            e.preventDefault()
            window.open(href, '_blank', 'noopener,noreferrer')
          }}
          className="text-muted-foreground hover:text-primary transition-colors cursor-pointer font-medium"
        >
          {linkText}
        </a>
      </div>
    </div>
  )
}
