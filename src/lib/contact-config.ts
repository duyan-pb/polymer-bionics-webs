/**
 * Contact configuration for the website.
 * Update these values with your actual contact information.
 */

export const contactConfig = {
  // Email addresses
  email: {
    general: 'info@polymerbionics.com',
    sales: 'sales@polymerbionics.com',
  },

  // WhatsApp configuration
  // To get your WhatsApp number:
  // 1. Use your business phone number in international format (e.g., +447123456789)
  // 2. Do NOT include any spaces, dashes, or parentheses
  // 3. Include the country code (e.g., +44 for UK)
  whatsapp: {
    // Replace with your actual WhatsApp Business number
    number: '+447123456789',
    defaultMessage: 'Hello, I would like to enquire about Polymer Bionics products and services.',
  },

  // Physical address
  address: {
    street: 'Exhibition Rd, South Kensington',
    city: 'London',
    postcode: 'SW7 2AZ',
    country: 'United Kingdom',
  },

  // Social media
  social: {
    linkedin: 'https://www.linkedin.com/company/polymer-bionics',
  },
}

/**
 * Copies WhatsApp number to clipboard and returns success status
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
 * Generates a mailto URL
 */
export function getEmailUrl(type: 'general' | 'sales' = 'general', subject?: string): string {
  const email = contactConfig.email[type]
  if (subject) {
    return `mailto:${email}?subject=${encodeURIComponent(subject)}`
  }
  return `mailto:${email}`
}
