/**
 * Form Submission Service
 * 
 * Handles contact, newsletter, and order form submissions.
 * 
 * Backends (in priority order):
 * 1. Custom API endpoint — set VITE_CONTACT_API_ENDPOINT etc.
 * 2. Formspree — set VITE_FORMSPREE_CONTACT_ID etc.
 * 3. Netlify Forms — auto-detected on Netlify hosts (hidden forms in index.html)
 * 4. Development only: mock mode (console.log, returns success)
 * 5. Production with no config: returns explicit failure
 * 
 * @module lib/form-service
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Formspree form IDs.
 * Each form on Formspree has a unique ID (e.g. "xpznqkdl").
 * Set these env vars to enable Formspree submission.
 */
export const formspreeConfig = {
  /** Formspree form ID for contact form */
  contactFormId: import.meta.env.VITE_FORMSPREE_CONTACT_ID ?? '',
  /** Formspree form ID for newsletter */
  newsletterFormId: import.meta.env.VITE_FORMSPREE_NEWSLETTER_ID ?? '',
  /** Formspree form ID for order form */
  orderFormId: import.meta.env.VITE_FORMSPREE_ORDER_ID ?? '',
}

/**
 * Optional custom API endpoints.
 * If set, these take priority over Formspree.
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
 * Submits data to a Formspree form endpoint.
 * 
 * @see https://formspree.io/docs/
 */
async function submitToFormspree(formId: string, data: Record<string, string>): Promise<FormResult> {
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

    const errorData = await response.json().catch((parseError) => {
      console.warn('[Form Service] Failed to parse Formspree error response:', parseError)
      return { error: response.statusText || `HTTP ${response.status}` }
    })
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

    const errorData = await response.json().catch((parseError) => {
      console.warn('[Form Service] Failed to parse API error response:', parseError)
      return { error: response.statusText || `HTTP ${response.status}` }
    })
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
 * Checks if running on Netlify (production/deploy-preview).
 * Detects Netlify at runtime by checking the hostname.
 */
export function isNetlifyEnvironment(): boolean {
  if (typeof window === 'undefined') { return false }
  const host = window.location.hostname
  return host.endsWith('.netlify.app') || host === 'polymerbionics.com' || host.endsWith('.polymerbionics.com')
}

/**
 * Checks if Formspree is configured for a given form type.
 */
function hasFormspreeId(formId: string): boolean {
  return formId.length > 0
}

/**
 * Runtime environment check, exposed for test overrides.
 * Tests can set `envCheck.isDev = false` to simulate production.
 */
export const envCheck = {
  isDev: import.meta.env.DEV === true,
}

/**
 * Handles the unconfigured fallback.
 * 
 * - **Development**: returns mock success with console warnings so
 *   local dev is not blocked.
 * - **Production**: returns an explicit failure so submissions are
 *   never silently dropped when env vars are missing.
 */
async function unconfiguredFallback(type: string, data: Record<string, unknown>): Promise<FormResult> {
  if (envCheck.isDev) {
    const MOCK_SUBMIT_DELAY_MS = 800
    await new Promise(resolve => setTimeout(resolve, MOCK_SUBMIT_DELAY_MS))

    console.warn(`[Form Service - Mock Mode] ${type} submission:`, data)
    console.warn('[Form Service] Set VITE_FORMSPREE_CONTACT_ID etc. for Formspree submissions.')
    console.warn('[Form Service] Or set VITE_CONTACT_API_ENDPOINT etc. for custom API.')

    return { success: true, message: 'Mock submission successful (development mode)' }
  }

  // Production with no backend configured — fail loudly so leads are not lost.
  console.error(`[Form Service] ${type} submission failed: no form backend configured.`)
  return {
    success: false,
    message: 'Form service is not configured. Please contact us directly.',
    error: 'NO_FORM_BACKEND',
  }
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
 * 3. Netlify Forms if running on Netlify
 * 4. Dev: mock success / Prod: explicit failure
 */
export async function submitContactForm(data: ContactFormData): Promise<FormResult> {
  const { contactApiEndpoint } = formServiceConfig
  const { contactFormId } = formspreeConfig

  if (contactApiEndpoint) {
    return submitToApi(contactApiEndpoint, { ...data })
  }

  if (hasFormspreeId(contactFormId)) {
    return submitToFormspree(contactFormId, {
      name: data.name,
      email: data.email,
      company: data.company ?? '',
      subject: data.subject,
      message: data.message,
    })
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

  return unconfiguredFallback('Contact Form', { ...data })
}

/**
 * Submits a newsletter subscription.
 * 
 * Routes to:
 * 1. Custom API endpoint if VITE_NEWSLETTER_API_ENDPOINT is set
 * 2. Formspree if VITE_FORMSPREE_NEWSLETTER_ID is set
 * 3. Netlify Forms if running on Netlify
 * 4. Dev: mock success / Prod: explicit failure
 */
export async function submitNewsletterSubscription(data: NewsletterData): Promise<FormResult> {
  const { newsletterApiEndpoint } = formServiceConfig
  const { newsletterFormId } = formspreeConfig

  if (newsletterApiEndpoint) {
    return submitToApi(newsletterApiEndpoint, { ...data })
  }

  if (hasFormspreeId(newsletterFormId)) {
    return submitToFormspree(newsletterFormId, {
      email: data.email,
    })
  }

  if (isNetlifyEnvironment()) {
    return submitToNetlify('newsletter', {
      email: data.email,
    })
  }

  return unconfiguredFallback('Newsletter', { ...data })
}

/**
 * Submits an order enquiry form.
 * 
 * Routes to:
 * 1. Custom API endpoint if VITE_ORDER_API_ENDPOINT is set
 * 2. Formspree if VITE_FORMSPREE_ORDER_ID is set
 * 3. Netlify Forms if running on Netlify
 * 4. Dev: mock success / Prod: explicit failure
 */
export async function submitOrderForm(data: OrderFormData): Promise<FormResult> {
  const { orderApiEndpoint } = formServiceConfig
  const { orderFormId } = formspreeConfig

  if (orderApiEndpoint) {
    return submitToApi(orderApiEndpoint, { ...data })
  }

  if (hasFormspreeId(orderFormId)) {
    return submitToFormspree(orderFormId, {
      email: data.email,
      phone: data.phone,
      item: data.item,
      item_type: data.itemType,
      quantity: data.quantity,
      comments: data.comments ?? '',
    })
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

  return unconfiguredFallback('Order Enquiry', { ...data })
}

/**
 * Checks if form services are configured for production use.
 */
export function isFormServiceConfigured(): boolean {
  const { contactApiEndpoint, newsletterApiEndpoint, orderApiEndpoint } = formServiceConfig
  const { contactFormId, newsletterFormId, orderFormId } = formspreeConfig
  return !!contactFormId || !!newsletterFormId || !!orderFormId
    || !!contactApiEndpoint || !!newsletterApiEndpoint || !!orderApiEndpoint
    || isNetlifyEnvironment()
}
