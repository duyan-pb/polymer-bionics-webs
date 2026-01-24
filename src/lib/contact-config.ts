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
    orderSubject: 'Product Enquiry - Request for Quotation',
    /** Default order enquiry body template */
    orderTemplate: `Dear Polymer Bionics Sales Team,\n\nI am writing to enquire about placing an order or requesting a quotation for your products.\n\nPlease find my requirements below:\n\nProduct of interest: [Please specify]\nQuantity required: [Please specify]\nOrganisation: [Company/Institution name]\nCountry: [Your country]\nIntended application: [Brief description]\nPreferred delivery timeframe: [e.g., Within 2 weeks]\n\nAdditional information or special requirements:\n[Any other details]\n\nKind regards,\n[Your full name]\n[Your position/title]\n[Contact telephone number]`,
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

export interface EmailContext {
  sourcePage?: string
  sourcePath?: string
  sourceProduct?: string
}

const formatPageLabel = (page?: string) => {
  if (!page) {
    return undefined
  }
  return page
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const getDefaultEmailContext = (): EmailContext => {
  if (typeof document === 'undefined') {
    return {}
  }

  const page = formatPageLabel(document.body?.dataset?.page)
  const path = window?.location?.pathname
  return {
    sourcePage: page,
    sourcePath: path && path !== '/' ? path : undefined,
  }
}

export const getOrderEmailBody = (context?: EmailContext) => {
  const resolvedContext = { ...getDefaultEmailContext(), ...context }
  const lines = [
    'Dear Polymer Bionics Sales Team,',
    '',
    'I am writing to enquire about placing an order or requesting a quotation for your products.',
    '',
    'Please find my requirements below:',
    '',
    `Product of interest: ${resolvedContext.sourceProduct ?? '[Please specify]'}`,
    'Quantity required: [Please specify]',
    'Organisation: [Company/Institution name]',
    'Country: [Your country]',
    'Intended application: [Brief description]',
    'Preferred delivery timeframe: [e.g., Within 2 weeks]',
    '',
    'Additional information or special requirements:',
    '[Any other details]',
  ]

  if (resolvedContext.sourcePage || resolvedContext.sourcePath) {
    lines.push('', '---')
    if (resolvedContext.sourcePage) {
      lines.push(`Enquiry source: ${resolvedContext.sourcePage}`)
    }
    if (resolvedContext.sourcePath) {
      lines.push(`Page: ${resolvedContext.sourcePath}`)
    }
  }

  lines.push('', 'Kind regards,', '[Your full name]', '[Your position/title]', '[Contact telephone number]')

  return lines.join('\n')
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
export function getEmailUrl(
  type: 'general' | 'sales' = 'general',
  subject?: string,
  body?: string,
  context?: EmailContext
): string {
  const email = contactConfig.email[type]
  const shouldUseDefaultTemplate = !subject && !body
  const resolvedSubject = subject ?? (shouldUseDefaultTemplate ? contactConfig.email.orderSubject : undefined)
  const resolvedBody = body ?? (shouldUseDefaultTemplate ? getOrderEmailBody(context) : undefined)
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
