/**
 * Form Submission Service
 * 
 * Handles contact, newsletter, and order form submissions.
 * 
 * Backends (in priority order):
 * 1. Netlify Forms — auto-detected from hidden forms in index.html (default on Netlify)
 * 2. Custom API endpoint — set VITE_CONTACT_API_ENDPOINT etc.
 * 3. Mock mode — local development fallback (console.log only)
 * 
 * @module lib/form-service
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Optional custom API endpoints.
 * If set, these take priority over Netlify Forms.
 * If neither is set, Netlify Forms is used on Netlify, mock mode locally.
 */
export const formServiceConfig = {
  /** Custom API endpoint for contact form */
  contactApiEndpoint: import.meta.env.VITE_CONTACT_API_ENDPOINT ?? '',
  /** Custom API endpoint for newsletter */
  newsletterApiEndpoint: import.meta.env.VITE_NEWSLETTER_API_ENDPOINT ?? '',
  /** Custom API endpoint for order form */
  orderApiEndpoint: import.meta.env.VITE_ORDER_API_ENDPOINT ?? '',
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
 * Order enquiry form data.
 */
export interface OrderFormData {
  email: string
  phone: string
  item: string
  itemType: string
  quantity: string
  comments?: string
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
 * Submits data to a Netlify Form using the POST-to-self pattern.
 * Netlify intercepts POSTs with a `form-name` field that matches
 * a form declared in the static HTML (index.html).
 * 
 * @see https://docs.netlify.com/forms/setup/#javascript-forms
 */
async function submitToNetlify(formName: string, data: Record<string, string>): Promise<FormResult> {
  try {
    const body = new URLSearchParams({ 'form-name': formName, ...data })

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })

    if (response.ok) {
      return { success: true, message: 'Submission successful' }
    }

    return {
      success: false,
      message: 'Submission failed',
      error: `HTTP ${response.status}`,
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
 * Checks if running on Netlify (production/deploy-preview).
 * Netlify sets the CONTEXT env var during builds, but we can also
 * detect it at runtime by checking the hostname.
 */
function isNetlifyEnvironment(): boolean {
  if (typeof window === 'undefined') { return false }
  const host = window.location.hostname
  return host.endsWith('.netlify.app') || host === 'polymerbionics.com' || host.endsWith('.polymerbionics.com')
}

/**
 * Mock submission for local development.
 */
async function mockSubmit(type: string, data: Record<string, unknown>): Promise<FormResult> {
  const MOCK_SUBMIT_DELAY_MS = 800
  await new Promise(resolve => setTimeout(resolve, MOCK_SUBMIT_DELAY_MS))
  
  console.warn(`[Form Service - Mock Mode] ${type} submission:`, data)
  console.warn('[Form Service] Forms will submit to Netlify automatically when deployed.')
  console.warn('[Form Service] For local testing, set VITE_CONTACT_API_ENDPOINT etc.')
  
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
 * 2. Netlify Forms if running on Netlify
 * 3. Mock mode (console logging) otherwise
 */
export async function submitContactForm(data: ContactFormData): Promise<FormResult> {
  const { contactApiEndpoint } = formServiceConfig

  if (contactApiEndpoint) {
    return submitToApi(contactApiEndpoint, { ...data })
  }

  if (isNetlifyEnvironment()) {
    return submitToNetlify('contact', {
      name: data.name,
      email: data.email,
      company: data.company ?? '',
      subject: data.subject,
      message: data.message,
    })
  }

  return mockSubmit('Contact Form', { ...data })
}

/**
 * Submits a newsletter subscription.
 * 
 * Routes to:
 * 1. Custom API endpoint if VITE_NEWSLETTER_API_ENDPOINT is set
 * 2. Netlify Forms if running on Netlify
 * 3. Mock mode (console logging) otherwise
 */
export async function submitNewsletterSubscription(data: NewsletterData): Promise<FormResult> {
  const { newsletterApiEndpoint } = formServiceConfig

  if (newsletterApiEndpoint) {
    return submitToApi(newsletterApiEndpoint, { ...data })
  }

  if (isNetlifyEnvironment()) {
    return submitToNetlify('newsletter', {
      email: data.email,
    })
  }

  return mockSubmit('Newsletter', { ...data })
}

/**
 * Submits an order enquiry form.
 * 
 * Routes to:
 * 1. Custom API endpoint if VITE_ORDER_API_ENDPOINT is set
 * 2. Netlify Forms if running on Netlify
 * 3. Mock mode (console logging) otherwise
 */
export async function submitOrderForm(data: OrderFormData): Promise<FormResult> {
  const { orderApiEndpoint } = formServiceConfig

  if (orderApiEndpoint) {
    return submitToApi(orderApiEndpoint, { ...data })
  }

  if (isNetlifyEnvironment()) {
    return submitToNetlify('order', {
      email: data.email,
      phone: data.phone,
      item: data.item,
      item_type: data.itemType,
      quantity: data.quantity,
      comments: data.comments ?? '',
    })
  }

  return mockSubmit('Order Enquiry', { ...data })
}

/**
 * Checks if form services are configured for production use.
 */
export function isFormServiceConfigured(): boolean {
  const { contactApiEndpoint, newsletterApiEndpoint, orderApiEndpoint } = formServiceConfig
  return isNetlifyEnvironment() || !!contactApiEndpoint || !!newsletterApiEndpoint || !!orderApiEndpoint
}
