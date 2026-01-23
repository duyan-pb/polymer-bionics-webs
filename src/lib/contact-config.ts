/**
 * Contact Configuration
 * 
 * Centralized contact information for the website.
 * Update these values with your actual business contact details.
 * 
 * @module lib/contact-config
 */

/**
 * Contact configuration object.
 * Contains all contact details used throughout the application.
 */
export const contactConfig = {
  /**
   * Email addresses for different departments.
   */
  email: {
    /** General enquiries email */
    general: 'info@polymerbionics.com',
    /** Sales and business development email */
    sales: 'sales@polymerbionics.com',
    /** Default order enquiry subject */
    orderSubject: 'Order enquiry',
    /** Default order enquiry body template */
    orderTemplate: `Hello Polymer Bionics team,\n\nI would like to place an order or request a quote. Please find the details below:\n\n- Product: \n- Quantity: \n- Company / Organization: \n- Country: \n- Intended application: \n- Preferred delivery timeframe: \n- Additional notes: \n\nThank you,\n[Your name]`,
  },

  /**
   * WhatsApp Business configuration.
   * 
   * Note: In GitHub Spark, direct WhatsApp links are blocked.
   * Use copyWhatsAppNumber() to copy to clipboard instead.
   */
  whatsapp: {
    /** WhatsApp number in international format (e.g., +447123456789) */
    number: '+447123456789',
    /** Default message template for enquiries */
    defaultMessage: 'Hello, I would like to enquire about Polymer Bionics products and services.',
  },

  /**
   * Physical office address.
   */
  address: {
    street: 'Exhibition Rd, South Kensington',
    city: 'London',
    postcode: 'SW7 2AZ',
    country: 'United Kingdom',
  },

  /**
   * Social media profile URLs.
   */
  social: {
    linkedin: 'https://www.linkedin.com/company/polymer-bionics',
  },
}

/**
 * Copies the WhatsApp number to the clipboard.
 * 
 * Use this instead of direct WhatsApp links in GitHub Spark environment
 * where tel: and whatsapp: links are blocked.
 * 
 * @returns Promise resolving to `true` if copy succeeded, `false` otherwise
 * 
 * @example
 * ```tsx
 * const success = await copyWhatsAppNumber()
 * if (success) {
 *   toast.success('Number copied!')
 * }
 * ```
 */
export async function copyWhatsAppNumber(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(contactConfig.whatsapp.number)
    return true
  } catch {
    return false
  }
}

/**
 * Generates a mailto URL for opening the email client.
 * 
 * @param type - Email type ('general' or 'sales')
 * @param subject - Optional email subject line
 * @param body - Optional email body
 * @returns Formatted mailto URL
 * 
 * @example
 * ```tsx
 * // Open general enquiry with subject and body
 * window.open(getEmailUrl('general', 'Product Inquiry', 'Details...'), '_blank')
 * ```
 */
export function getEmailUrl(type: 'general' | 'sales' = 'general', subject?: string, body?: string): string {
  const email = contactConfig.email[type]
  const shouldUseDefaultTemplate = !subject && !body
  const resolvedSubject = subject ?? (shouldUseDefaultTemplate ? contactConfig.email.orderSubject : undefined)
  const resolvedBody = body ?? (shouldUseDefaultTemplate ? contactConfig.email.orderTemplate : undefined)
  const params = new URLSearchParams()

  if (resolvedSubject) {
    params.set('subject', resolvedSubject)
  }

  if (resolvedBody) {
    params.set('body', resolvedBody)
  }

  const query = params.toString()
  return query ? `mailto:${email}?${query}` : `mailto:${email}`
}
