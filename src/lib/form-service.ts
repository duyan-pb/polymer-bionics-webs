/**
 * Form Submission Service
 * 
 * Handles newsletter subscriptions and contact form submissions.
 * Supports multiple backends:
 * - Formspree (default, works with static hosting)
 * - Custom API endpoint
 * - Mock mode for development
 * 
 * @module lib/form-service
 */

// =============================================================================
// TODO: CONFIGURE FORM SUBMISSION BACKEND
// =============================================================================
// For production, set one of these environment variables:
// - VITE_FORMSPREE_CONTACT_ID: Formspree form ID (free tier: https://formspree.io)
// - VITE_FORMSPREE_NEWSLETTER_ID: Formspree newsletter form ID
// - VITE_CONTACT_API_ENDPOINT: Custom API (e.g., Azure Functions)
// - VITE_NEWSLETTER_API_ENDPOINT: Custom newsletter API
//
// Without these, forms run in mock mode (console.log only).
// =============================================================================

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Form service configuration.
 * Set these environment variables to enable real form submissions:
 * 
 * - VITE_FORMSPREE_CONTACT_ID: Formspree form ID for contact form (e.g., "xyzabcde")
 * - VITE_FORMSPREE_NEWSLETTER_ID: Formspree form ID for newsletter (e.g., "xyzabcde")
 * - VITE_CONTACT_API_ENDPOINT: Custom API endpoint for contact form
 * - VITE_NEWSLETTER_API_ENDPOINT: Custom API endpoint for newsletter
 * 
 * If no environment variables are set, forms will use mock mode (console logging only).
 * 
 * @see https://formspree.io for free form backend
 */
export const formServiceConfig = {
  /** Formspree form ID for contact submissions */
  formspreeContactId: import.meta.env.VITE_FORMSPREE_CONTACT_ID ?? '',
  /** Formspree form ID for newsletter subscriptions */
  formspreeNewsletterId: import.meta.env.VITE_FORMSPREE_NEWSLETTER_ID ?? '',
  /** Custom API endpoint for contact form */
  contactApiEndpoint: import.meta.env.VITE_CONTACT_API_ENDPOINT ?? '',
  /** Custom API endpoint for newsletter */
  newsletterApiEndpoint: import.meta.env.VITE_NEWSLETTER_API_ENDPOINT ?? '',
}

// =============================================================================
// TYPES
// =============================================================================

/**
 * Contact form submission data.
 */
export interface ContactFormData {
  name: string
  email: string
  company?: string
  subject: string
  message: string
}

/**
 * Newsletter subscription data.
 */
export interface NewsletterData {
  email: string
}

/**
 * Form submission result.
 */
export interface FormResult {
  success: boolean
  message: string
  error?: string
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Checks if running in development/mock mode.
 */
function isMockMode(): boolean {
  const { formspreeContactId, formspreeNewsletterId, contactApiEndpoint, newsletterApiEndpoint } = formServiceConfig
  return !formspreeContactId && !formspreeNewsletterId && !contactApiEndpoint && !newsletterApiEndpoint
}

/**
 * Submits data to a Formspree form.
 */
async function submitToFormspree(formId: string, data: Record<string, unknown>): Promise<FormResult> {
  try {
    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      return { success: true, message: 'Submission successful' }
    }

    const errorData = await response.json().catch(() => ({}))
    return {
      success: false,
      message: 'Submission failed',
      error: errorData.error ?? `HTTP ${response.status}`,
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Submits data to a custom API endpoint.
 */
async function submitToApi(endpoint: string, data: Record<string, unknown>): Promise<FormResult> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      return { success: true, message: 'Submission successful' }
    }

    const errorData = await response.json().catch(() => ({}))
    return {
      success: false,
      message: 'Submission failed',
      error: errorData.error ?? `HTTP ${response.status}`,
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Mock submission for development mode.
 */
async function mockSubmit(type: string, data: Record<string, unknown>): Promise<FormResult> {
  const MOCK_SUBMIT_DELAY_MS = 800
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, MOCK_SUBMIT_DELAY_MS))
  
  // Log for debugging
  console.warn(`[Form Service - Mock Mode] ${type} submission:`, data)
  console.warn('[Form Service] To enable real submissions, set environment variables:')
  console.warn('  - VITE_FORMSPREE_CONTACT_ID for contact form')
  console.warn('  - VITE_FORMSPREE_NEWSLETTER_ID for newsletter')
  console.warn('  See https://formspree.io to create free forms')
  
  return { success: true, message: 'Mock submission successful (development mode)' }
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Submits a contact form.
 * 
 * Routes to:
 * 1. Custom API endpoint if VITE_CONTACT_API_ENDPOINT is set
 * 2. Formspree if VITE_FORMSPREE_CONTACT_ID is set
 * 3. Mock mode (console logging) if neither is configured
 * 
 * @param data - Contact form data
 * @returns Promise resolving to submission result
 * 
 * @example
 * ```tsx
 * const result = await submitContactForm({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   subject: 'Product Inquiry',
 *   message: 'I would like to learn more...'
 * })
 * if (result.success) {
 *   toast.success('Message sent!')
 * }
 * ```
 */
export async function submitContactForm(data: ContactFormData): Promise<FormResult> {
  const { formspreeContactId, contactApiEndpoint } = formServiceConfig

  // Custom API takes priority
  if (contactApiEndpoint) {
    return submitToApi(contactApiEndpoint, { ...data })
  }

  // Formspree as fallback
  if (formspreeContactId) {
    return submitToFormspree(formspreeContactId, {
      ...data,
      _subject: `[Contact] ${data.subject}`,
    })
  }

  // Mock mode
  return mockSubmit('Contact Form', { ...data })
}

/**
 * Submits a newsletter subscription.
 * 
 * Routes to:
 * 1. Custom API endpoint if VITE_NEWSLETTER_API_ENDPOINT is set
 * 2. Formspree if VITE_FORMSPREE_NEWSLETTER_ID is set
 * 3. Mock mode (console logging) if neither is configured
 * 
 * @param data - Newsletter subscription data
 * @returns Promise resolving to submission result
 * 
 * @example
 * ```tsx
 * const result = await submitNewsletterSubscription({ email: 'user@example.com' })
 * if (result.success) {
 *   toast.success('Subscribed!')
 * }
 * ```
 */
export async function submitNewsletterSubscription(data: NewsletterData): Promise<FormResult> {
  const { formspreeNewsletterId, newsletterApiEndpoint } = formServiceConfig

  // Custom API takes priority
  if (newsletterApiEndpoint) {
    return submitToApi(newsletterApiEndpoint, { ...data })
  }

  // Formspree as fallback
  if (formspreeNewsletterId) {
    return submitToFormspree(formspreeNewsletterId, {
      email: data.email,
      _subject: '[Newsletter] New Subscription',
    })
  }

  // Mock mode
  return mockSubmit('Newsletter', { ...data })
}

/**
 * Checks if form services are configured for production use.
 * Useful for showing development mode indicators in UI.
 */
export function isFormServiceConfigured(): boolean {
  return !isMockMode()
}
