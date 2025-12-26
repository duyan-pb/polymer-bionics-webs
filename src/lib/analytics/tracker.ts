/**
 * Analytics Instrumentation Layer (Epic 3)
 * 
 * Single wrapper for all analytics tracking with:
 * - Consent gating (integrated, not duplicated)
 * - Standard properties auto-attached
 * - Debug mode support
 * - "Fire once" utilities for deduplication
 * 
 * This is the ONE place to change tracking behavior for the whole site.
 */

import { 
  DEFAULT_ANALYTICS_CONFIG,
  type AnalyticsConfig, 
  type StandardEventProperties, 
  type AnalyticsEvent,
  type ConsentCategory 
} from './types'
import { canTrack, getConsentVersion } from './consent'
import { getIdentityWithFallback } from './identity'
import { captureUTM, getUTMForEvent } from './attribution'

// =============================================================================
// STATE
// =============================================================================

let config: AnalyticsConfig = { ...DEFAULT_ANALYTICS_CONFIG }
let initialized = false
let previousPage: string | undefined

// Track which events have been fired (for "fire once" logic)
const firedEvents = new Set<string>()

// Event queue for events fired before initialization
const eventQueue: Array<{ method: 'track' | 'page'; args: unknown[] }> = []

/**
 * Debug logger that only logs in debug mode
 * eslint-disable-next-line no-console -- Intentional debug logging
 */
function debugLog(...args: unknown[]): void {
  if (config.debugMode) {
    // eslint-disable-next-line no-console -- Intentional debug logging
    console.log('[Analytics]', ...args)
  }
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Initialize analytics with configuration
 */
export function initAnalytics(userConfig: Partial<AnalyticsConfig> = {}): void {
  config = { ...DEFAULT_ANALYTICS_CONFIG, ...userConfig }
  
  // Check for debug mode in URL
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    if (params.get('debug_analytics') === '1') {
      config.debugMode = true
    }
    
    // Set environment from build
    config.environment = (import.meta.env.MODE as 'development' | 'staging' | 'production') || 'development'
    config.appVersion = import.meta.env.VITE_BUILD_SHA?.slice(0, 7) || '1.0.0'
  }
  
  // Capture UTM on init
  captureUTM('first-touch')
  
  initialized = true
  
  // Process queued events
  while (eventQueue.length > 0) {
    const event = eventQueue.shift()
    if (event) {
      if (event.method === 'track') {
        track(event.args[0] as string, event.args[1] as Record<string, unknown>)
      } else if (event.method === 'page') {
        page(event.args[0] as string, event.args[1] as Record<string, unknown>)
      }
    }
  }
  
  debugLog('Initialized with config:', config)
}

/**
 * Get current analytics config
 */
export function getAnalyticsConfig(): AnalyticsConfig {
  return { ...config }
}

// =============================================================================
// STANDARD PROPERTIES
// =============================================================================

/**
 * Detect device class from viewport width
 */
function getDeviceClass(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth
  if (width < 768) {return 'mobile'}
  if (width < 1024) {return 'tablet'}
  return 'desktop'
}

/**
 * Build standard properties attached to all events
 */
function getStandardProperties(): StandardEventProperties {
  const identity = getIdentityWithFallback()
  const utm = getUTMForEvent()
  
  return {
    // Identity
    anonymous_id: identity.anonymousId,
    session_id: identity.sessionId,
    
    // Page context
    page_url: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
    referrer: document.referrer,
    
    // UTM parameters
    ...utm,
    
    // Device/browser
    device_class: getDeviceClass(),
    locale: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    user_agent: navigator.userAgent,
    
    // App context
    env: config.environment,
    app_version: config.appVersion,
    consent_state_version: getConsentVersion(),
    
    // Timestamp
    timestamp: new Date().toISOString(),
    client_timestamp: Date.now(),
  }
}

// =============================================================================
// TRACKING API (Tasks 3.1, 3.2)
// =============================================================================

/**
 * Track a custom event
 * 
 * @param eventName - Name of the event (e.g., 'button_clicked', 'form_submitted')
 * @param properties - Additional event properties
 * @param options - Tracking options
 * 
 * @example
 * analytics.track('cta_clicked', { button_id: 'hero-contact', button_text: 'Contact Us' })
 */
export function track(
  eventName: string, 
  properties: Record<string, unknown> = {},
  options: { 
    category?: ConsentCategory
    fireOnce?: boolean
    fireOnceKey?: string
  } = {}
): boolean {
  // Queue if not initialized
  if (!initialized) {
    eventQueue.push({ method: 'track', args: [eventName, properties, options] })
    return false
  }
  
  // Check consent
  const category = options.category || 'analytics'
  if (!canTrack(category)) {
    debugLog(`Blocked (no ${category} consent):`, eventName)
    return false
  }
  
  // Check "fire once" (Task 3.3)
  const fireOnceKey = options.fireOnceKey || eventName
  if (options.fireOnce && firedEvents.has(fireOnceKey)) {
    debugLog('Skipped (already fired):', eventName)
    return false
  }
  
  // Check sampling
  if (config.samplingRate < 1 && Math.random() > config.samplingRate) {
    debugLog('Sampled out:', eventName)
    return false
  }
  
  // Build event
  const event: AnalyticsEvent = {
    type: 'track',
    event_name: eventName,
    properties: {
      ...getStandardProperties(),
      ...properties,
    },
  }
  
  // Mark as fired
  if (options.fireOnce) {
    firedEvents.add(fireOnceKey)
  }
  
  // Debug mode (Task 3.4)
  debugLog('Track:', eventName, event.properties)
  
  // Send to destinations
  sendToDestinations(event)
  
  return true
}

/**
 * Track a page view
 * 
 * @param pageName - Name of the page (e.g., 'home', 'products', 'contact')
 * @param properties - Additional page properties
 * 
 * @example
 * analytics.page('products', { category: 'medical-devices' })
 */
export function page(
  pageName: string,
  properties: Record<string, unknown> = {}
): boolean {
  // Queue if not initialized
  if (!initialized) {
    eventQueue.push({ method: 'page', args: [pageName, properties] })
    return false
  }
  
  // Check consent
  if (!canTrack('analytics')) {
    debugLog('Blocked page view (no analytics consent):', pageName)
    return false
  }
  
  // Build event
  const event: AnalyticsEvent = {
    type: 'page_view',
    properties: {
      ...getStandardProperties(),
      page_name: pageName,
      previous_page: previousPage,
      ...properties,
    },
  }
  
  // Update previous page
  previousPage = pageName
  
  // Debug mode
  debugLog('Page View:', pageName, event.properties)
  
  // Send to destinations
  sendToDestinations(event)
  
  return true
}

/**
 * Track a conversion event (typically server-authoritative)
 * 
 * @param conversionType - Type of conversion (e.g., 'lead_submitted', 'booking_requested')
 * @param eventId - Unique ID for idempotency
 * @param properties - Additional conversion properties
 */
export function conversion(
  conversionType: string,
  eventId: string,
  properties: Record<string, unknown> = {}
): boolean {
  // Check consent
  if (!canTrack('analytics')) {
    debugLog('Blocked conversion (no analytics consent):', conversionType)
    return false
  }
  
  // Check if already fired (conversions should fire once)
  const fireOnceKey = `conversion:${conversionType}:${eventId}`
  if (firedEvents.has(fireOnceKey)) {
    debugLog('Skipped duplicate conversion:', conversionType, eventId)
    return false
  }
  
  // Build event
  const event: AnalyticsEvent = {
    type: 'conversion',
    event_name: conversionType,
    event_id: eventId,
    properties: {
      ...getStandardProperties(),
      conversion_type: conversionType,
      ...properties,
    },
  }
  
  // Mark as fired
  firedEvents.add(fireOnceKey)
  
  // Debug mode
  debugLog('Conversion:', conversionType, eventId, event.properties)
  
  // Send to destinations (including server-side)
  sendToDestinations(event)
  sendToServer(event)
  
  return true
}

// =============================================================================
// FIRE ONCE UTILITIES (Task 3.3)
// =============================================================================

/**
 * Track an event only once per session
 */
export function trackOnce(
  eventName: string,
  properties: Record<string, unknown> = {}
): boolean {
  return track(eventName, properties, { fireOnce: true })
}

/**
 * Track an event only once per session with a custom key
 */
export function trackOnceWithKey(
  eventName: string,
  key: string,
  properties: Record<string, unknown> = {}
): boolean {
  return track(eventName, properties, { fireOnce: true, fireOnceKey: key })
}

/**
 * Check if an event has been fired
 */
export function hasFired(eventName: string): boolean {
  return firedEvents.has(eventName)
}

/**
 * Reset fired events (useful for testing)
 */
export function resetFiredEvents(): void {
  firedEvents.clear()
}

/**
 * Reset all state for testing
 */
export function resetForTesting(): void {
  config = { ...DEFAULT_ANALYTICS_CONFIG }
  initialized = false
  previousPage = undefined
  firedEvents.clear()
  eventQueue.length = 0
  destinations.length = 0
}

// =============================================================================
// DESTINATIONS
// =============================================================================

type DestinationHandler = (event: AnalyticsEvent) => void
const destinations: DestinationHandler[] = []

/**
 * Register a destination handler (e.g., GA4, App Insights)
 */
export function registerDestination(handler: DestinationHandler): void {
  destinations.push(handler)
}

/**
 * Send event to all registered destinations
 */
function sendToDestinations(event: AnalyticsEvent): void {
  for (const handler of destinations) {
    try {
      handler(event)
    } catch (error) {
       
      console.error('[Analytics] Destination error:', error)
    }
  }
}

/**
 * Send conversion event to server (Epic 5)
 */
async function sendToServer(event: AnalyticsEvent): Promise<void> {
  if (event.type !== 'conversion') {return}
  
  try {
    // Uses Azure Function endpoint configured via VITE_EVENTS_ENDPOINT
    const endpoint = import.meta.env.VITE_EVENTS_ENDPOINT || '/api/events/collect'
    
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_id: event.event_id,
        event_name: event.event_name,
        event_type: event.type,
        properties: event.properties,
        timestamp: new Date().toISOString(),
      }),
      keepalive: true, // Ensure request completes even if page unloads
    })
  } catch (error) {
     
    console.error('[Analytics] Server-side tracking error:', error)
  }
}

// =============================================================================
// LIFECYCLE
// =============================================================================

/**
 * Handle consent withdrawal - stop all tracking immediately
 */
export function handleConsentWithdrawn(): void {
  // Clear fired events
  firedEvents.clear()
  
  debugLog('Consent withdrawn - tracking stopped')
}

// Listen for consent changes
if (typeof window !== 'undefined') {
  window.addEventListener('consent-withdrawn', handleConsentWithdrawn)
}

// =============================================================================
// EXPORT NAMESPACE
// =============================================================================

export const analytics = {
  init: initAnalytics,
  track,
  page,
  conversion,
  trackOnce,
  trackOnceWithKey,
  hasFired,
  resetFiredEvents,
  registerDestination,
  getConfig: getAnalyticsConfig,
}
