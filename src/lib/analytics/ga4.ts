/**
 * Google Analytics 4 Integration (Epic 4)
 * 
 * Integrates GA4 for:
 * - Page views
 * - Custom events
 * - Conversions
 * - Consent mode support
 */

import type { AnalyticsEvent } from './types'
import { canTrack } from './consent'
import { getIdentityWithFallback } from './identity'
import { registerDestination } from './tracker'

// =============================================================================
// TYPES
// =============================================================================

interface GA4Config {
  measurementId: string
  enableDebugMode?: boolean
  sendPageViews?: boolean
  customDimensions?: Record<string, string>
}

interface GtagCommand {
  (command: 'js', date: Date): void
  (command: 'config', targetId: string, config?: Record<string, unknown>): void
  (command: 'event', eventName: string, eventParams?: Record<string, unknown>): void
  (command: 'set', config: Record<string, unknown>): void
  (command: 'consent', action: 'default' | 'update', config: Record<string, string>): void
}

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: GtagCommand
  }
}

// =============================================================================
// STATE
// =============================================================================

let ga4Config: GA4Config | null = null
let isInitialized = false
let scriptLoaded = false

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize GA4 with consent mode
 * 
 * @param config - GA4 configuration
 */
export async function initGA4(config: GA4Config): Promise<void> {
  if (isInitialized) {
     
    console.warn('[GA4] Already initialized')
    return
  }
  
  if (!config.measurementId) {
     
    console.warn('[GA4] No measurement ID provided')
    return
  }
  
  ga4Config = config
  
  // Initialize dataLayer
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  } as GtagCommand
  
  // Set consent defaults BEFORE loading the script
  // This ensures GA4 respects consent from the start
  updateGA4Consent()
  
  // Listen for consent changes
  window.addEventListener('consent-changed', updateGA4Consent)
  
  // Only load script if analytics consent is granted
  if (canTrack('analytics')) {
    await loadGA4Script(config.measurementId)
    configureGA4()
  } else {
    // eslint-disable-next-line no-console
    console.log('[GA4] Waiting for analytics consent before loading')
    
    // Load script when consent is granted
    const handleConsent = async () => {
      if (canTrack('analytics') && !scriptLoaded) {
        await loadGA4Script(config.measurementId)
        configureGA4()
        window.removeEventListener('consent-changed', handleConsent)
      }
    }
    window.addEventListener('consent-changed', handleConsent)
  }
  
  isInitialized = true
  
  // Register as analytics destination
  registerDestination(handleAnalyticsEvent)
}

/**
 * Load the GA4 script dynamically
 */
function loadGA4Script(measurementId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (scriptLoaded) {
      resolve()
      return
    }
    
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    
    script.onload = () => {
      scriptLoaded = true
      // eslint-disable-next-line no-console
      console.log('[GA4] Script loaded')
      resolve()
    }
    
    script.onerror = () => {
      reject(new Error('[GA4] Failed to load script'))
    }
    
    document.head.appendChild(script)
  })
}

/**
 * Configure GA4 after script loads
 */
function configureGA4(): void {
  if (!ga4Config) {return}
  
  const identity = getIdentityWithFallback()
  
  window.gtag('js', new Date())
  
  window.gtag('config', ga4Config.measurementId, {
    // Disable automatic page view tracking (we handle this)
    send_page_view: ga4Config.sendPageViews ?? false,
    // Set client ID to our anonymous ID for consistency
    client_id: identity.anonymousId,
    // Custom dimensions
    ...ga4Config.customDimensions,
    // Debug mode
    debug_mode: ga4Config.enableDebugMode ?? false,
  })
  
  // Set user properties
  window.gtag('set', {
    user_properties: {
      session_id: identity.sessionId,
    },
  })
  
  // eslint-disable-next-line no-console
  console.log('[GA4] Configured with measurement ID:', ga4Config.measurementId)
}

// =============================================================================
// CONSENT MODE
// =============================================================================

/**
 * Update GA4 consent state based on our consent manager
 */
function updateGA4Consent(): void {
  const analyticsGranted = canTrack('analytics')
  const marketingGranted = canTrack('marketing')
  
  window.gtag('consent', 'update', {
    analytics_storage: analyticsGranted ? 'granted' : 'denied',
    ad_storage: marketingGranted ? 'granted' : 'denied',
    ad_user_data: marketingGranted ? 'granted' : 'denied',
    ad_personalization: marketingGranted ? 'granted' : 'denied',
    functionality_storage: 'granted', // Always allowed (necessary)
    personalization_storage: analyticsGranted ? 'granted' : 'denied',
    security_storage: 'granted', // Always allowed (necessary)
  })
  
  // eslint-disable-next-line no-console
  console.log('[GA4] Consent updated:', {
    analytics: analyticsGranted,
    marketing: marketingGranted,
  })
}

/**
 * Set default consent state (called before script loads)
 */
export function setGA4ConsentDefaults(): void {
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: '500', // Wait for consent update
  })
}

// =============================================================================
// TRACKING METHODS
// =============================================================================

/**
 * Track a page view in GA4
 */
export function trackGA4PageView(
  pagePath: string,
  pageTitle: string,
  properties: Record<string, unknown> = {}
): void {
  if (!canTrack('analytics')) {return}
  
  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: window.location.href,
    ...properties,
  })
}

/**
 * Track a custom event in GA4
 */
export function trackGA4Event(
  eventName: string,
  parameters: Record<string, unknown> = {}
): void {
  if (!canTrack('analytics')) {return}
  
  // GA4 event names should be snake_case, max 40 chars
  const sanitizedName = eventName
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .slice(0, 40)
  
  window.gtag('event', sanitizedName, parameters)
}

/**
 * Track a conversion in GA4
 */
export function trackGA4Conversion(
  conversionName: string,
  value?: number,
  currency?: string,
  transactionId?: string,
  properties: Record<string, unknown> = {}
): void {
  if (!canTrack('analytics')) {return}
  
  window.gtag('event', conversionName, {
    ...properties,
    value,
    currency,
    transaction_id: transactionId,
    send_to: ga4Config?.measurementId,
  })
}

// =============================================================================
// RECOMMENDED EVENTS
// =============================================================================

/**
 * Track form submission (recommended event)
 */
export function trackGA4FormSubmit(
  formId: string,
  formName: string,
  formDestination?: string
): void {
  trackGA4Event('generate_lead', {
    form_id: formId,
    form_name: formName,
    form_destination: formDestination,
  })
}

/**
 * Track file download (recommended event)
 */
export function trackGA4Download(
  fileName: string,
  fileExtension: string,
  linkUrl: string
): void {
  trackGA4Event('file_download', {
    file_name: fileName,
    file_extension: fileExtension,
    link_url: linkUrl,
  })
}

/**
 * Track video engagement
 */
export function trackGA4VideoStart(
  videoTitle: string,
  videoUrl: string,
  videoProvider?: string
): void {
  trackGA4Event('video_start', {
    video_title: videoTitle,
    video_url: videoUrl,
    video_provider: videoProvider || 'youtube',
  })
}

/**
 * Track search
 */
export function trackGA4Search(
  searchTerm: string,
  resultsCount?: number
): void {
  trackGA4Event('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  })
}

// =============================================================================
// ANALYTICS DESTINATION HANDLER
// =============================================================================

/**
 * Handle events from the analytics tracker
 */
function handleAnalyticsEvent(event: AnalyticsEvent): void {
  if (!canTrack('analytics')) {return}
  
  switch (event.type) {
    case 'page_view':
      window.gtag('event', 'page_view', {
        page_path: event.properties.page_path,
        page_title: event.properties.page_title,
        page_location: event.properties.page_url,
        page_name: event.properties.page_name,
      })
      break
      
    case 'track': {
      // Map to GA4 event name format
      const ga4EventName = event.event_name
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '_')
        .slice(0, 40)
      
      window.gtag('event', ga4EventName, event.properties as Record<string, unknown>)
      break
    }
      
    case 'conversion':
      // Conversions go to specific measurement ID
      window.gtag('event', event.event_name, {
        ...event.properties,
        transaction_id: event.event_id,
        send_to: ga4Config?.measurementId,
      })
      break
  }
}

// =============================================================================
// INTERNAL TRAFFIC FILTERING (Task 4.4)
// =============================================================================

/**
 * Mark current user as internal traffic
 * Call this for internal team members
 */
export function markAsInternalTraffic(): void {
  window.gtag('set', {
    user_properties: {
      traffic_type: 'internal',
    },
  })
  
  // Also set in localStorage for persistence
  try {
    localStorage.setItem('pb_internal_traffic', 'true')
  } catch {
    // Ignore errors
  }
}

/**
 * Check if current user is marked as internal
 */
export function isInternalTraffic(): boolean {
  try {
    return localStorage.getItem('pb_internal_traffic') === 'true'
  } catch {
    return false
  }
}

// =============================================================================
// LIFECYCLE
// =============================================================================

/**
 * Check if GA4 is initialized
 */
export function isGA4Initialized(): boolean {
  return isInitialized && scriptLoaded
}

/**
 * Reset GA4 state for testing
 * Only use in test environments
 */
export function resetGA4ForTesting(): void {
  ga4Config = null
  isInitialized = false
  scriptLoaded = false
}

// Handle consent withdrawal
if (typeof window !== 'undefined') {
  window.addEventListener('consent-withdrawn', () => {
    // GA4 will automatically stop tracking due to consent mode
    updateGA4Consent()
  })
}
