/**
 * Application Insights Integration (Epic 2)
 * 
 * Integrates Azure Application Insights for:
 * - Page views and exceptions tracking
 * - Performance metrics
 * - Custom telemetry
 * - Correlation ID propagation
 */

import type { AnalyticsEvent } from './types'
import { canTrack } from './consent'
import { getIdentityWithFallback } from './identity'
import { registerDestination } from './tracker'

// =============================================================================
// TYPES
// =============================================================================

interface AppInsightsConfig {
  connectionString?: string
  instrumentationKey?: string
  enableAutoRouteTracking?: boolean
  enableCorsCorrelation?: boolean
  enableRequestHeaderTracking?: boolean
  enableResponseHeaderTracking?: boolean
  disableFetchTracking?: boolean
  disableAjaxTracking?: boolean
  maxBatchInterval?: number
  disableExceptionTracking?: boolean
}

// Application Insights SDK types (simplified)
interface IAppInsights {
  trackPageView: (pageView: { name?: string; uri?: string; properties?: Record<string, unknown> }) => void
  trackEvent: (event: { name: string; properties?: Record<string, unknown> }) => void
  trackException: (exception: { exception: Error; properties?: Record<string, unknown> }) => void
  trackMetric: (metric: { name: string; average: number; properties?: Record<string, unknown> }) => void
  trackTrace: (trace: { message: string; severityLevel?: number; properties?: Record<string, unknown> }) => void
  setAuthenticatedUserContext: (authenticatedUserId: string, accountId?: string, storeInCookie?: boolean) => void
  clearAuthenticatedUserContext: () => void
  flush: () => void
  context: {
    application: { ver: string }
    session: { id: string }
    user: { id: string }
    operation: { id: string; name: string }
  }
  config: AppInsightsConfig
}

declare global {
  interface Window {
    appInsights?: IAppInsights
  }
}

// =============================================================================
// STATE
// =============================================================================

let appInsightsInstance: IAppInsights | null = null
let isInitialized = false

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize Application Insights
 * 
 * @param config - App Insights configuration
 */
export async function initAppInsights(config: AppInsightsConfig): Promise<void> {
  if (isInitialized) {
     
    console.warn('[AppInsights] Already initialized')
    return
  }
  
  if (!config.connectionString && !config.instrumentationKey) {
     
    console.warn('[AppInsights] No connection string or instrumentation key provided')
    return
  }
  
  // Check consent before loading
  if (!canTrack('analytics')) {
    // eslint-disable-next-line no-console
    console.log('[AppInsights] Analytics consent not granted, deferring initialization')
    
    // Listen for consent changes
    window.addEventListener('consent-changed', () => {
      if (canTrack('analytics') && !isInitialized) {
        loadAppInsights(config)
      }
    })
    return
  }
  
  await loadAppInsights(config)
}

/**
 * Load Application Insights SDK
 */
async function loadAppInsights(config: AppInsightsConfig): Promise<void> {
  try {
    // Dynamically import the SDK (tree-shaking friendly)
    // Note: @microsoft/applicationinsights-web must be installed separately
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const module = await import('@microsoft/applicationinsights-web' as any).catch(() => null)
    
    if (!module) {
       
      console.warn('[AppInsights] SDK not installed. Run: npm install @microsoft/applicationinsights-web')
      return
    }
    
    const { ApplicationInsights } = module
    const identity = getIdentityWithFallback()
    
    const appInsights = new ApplicationInsights({
      config: {
        connectionString: config.connectionString,
        instrumentationKey: config.instrumentationKey,
        enableAutoRouteTracking: config.enableAutoRouteTracking ?? false, // We handle this ourselves
        enableCorsCorrelation: config.enableCorsCorrelation ?? true,
        enableRequestHeaderTracking: config.enableRequestHeaderTracking ?? true,
        enableResponseHeaderTracking: config.enableResponseHeaderTracking ?? true,
        disableFetchTracking: config.disableFetchTracking ?? false,
        disableAjaxTracking: config.disableAjaxTracking ?? false,
        maxBatchInterval: config.maxBatchInterval ?? 15000,
        disableExceptionTracking: config.disableExceptionTracking ?? false,
        // Set session and user IDs
        namePrefix: 'pb_',
      },
    })
    
    appInsights.loadAppInsights()
    
    // Set anonymous user context
    appInsights.context.user.id = identity.anonymousId
    appInsights.context.session.id = identity.sessionId
    
    appInsightsInstance = appInsights as unknown as IAppInsights
    window.appInsights = appInsightsInstance
    isInitialized = true
    
    // Register as analytics destination
    registerDestination(handleAnalyticsEvent)
    
    // Set up global error handler
    setupErrorTracking()
    
    // eslint-disable-next-line no-console
    console.log('[AppInsights] Initialized successfully')
    
  } catch (error) {
     
    console.error('[AppInsights] Failed to load:', error)
  }
}

// =============================================================================
// ERROR TRACKING
// =============================================================================

/**
 * Set up global error and unhandled rejection tracking
 */
function setupErrorTracking(): void {
  // Track unhandled errors
  window.addEventListener('error', (event) => {
    if (!canTrack('analytics')) {return}
    
    trackException(event.error || new Error(event.message), {
      source: 'window.onerror',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    })
  })
  
  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (!canTrack('analytics')) {return}
    
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason))
    
    trackException(error, {
      source: 'unhandledrejection',
    })
  })
}

// =============================================================================
// TRACKING METHODS
// =============================================================================

/**
 * Track a page view in App Insights
 */
export function trackAppInsightsPageView(
  name: string,
  properties: Record<string, unknown> = {}
): void {
  if (!appInsightsInstance || !canTrack('analytics')) {return}
  
  appInsightsInstance.trackPageView({
    name,
    uri: window.location.href,
    properties: {
      ...properties,
      page_path: window.location.pathname,
    },
  })
}

/**
 * Track a custom event in App Insights
 */
export function trackAppInsightsEvent(
  name: string,
  properties: Record<string, unknown> = {}
): void {
  if (!appInsightsInstance || !canTrack('analytics')) {return}
  
  appInsightsInstance.trackEvent({
    name,
    properties,
  })
}

/**
 * Track an exception in App Insights
 */
export function trackException(
  error: Error,
  properties: Record<string, unknown> = {}
): void {
  if (!appInsightsInstance || !canTrack('analytics')) {return}
  
  appInsightsInstance.trackException({
    exception: error,
    properties: {
      ...properties,
      page_url: window.location.href,
      page_path: window.location.pathname,
    },
  })
}

/**
 * Track a custom metric in App Insights
 */
export function trackMetric(
  name: string,
  value: number,
  properties: Record<string, unknown> = {}
): void {
  if (!appInsightsInstance || !canTrack('analytics')) {return}
  
  appInsightsInstance.trackMetric({
    name,
    average: value,
    properties,
  })
}

/**
 * Track a trace message in App Insights
 */
export function trackTrace(
  message: string,
  severityLevel: 0 | 1 | 2 | 3 | 4 = 1, // Verbose, Information, Warning, Error, Critical
  properties: Record<string, unknown> = {}
): void {
  if (!appInsightsInstance || !canTrack('analytics')) {return}
  
  appInsightsInstance.trackTrace({
    message,
    severityLevel,
    properties,
  })
}

// =============================================================================
// CORRELATION
// =============================================================================

/**
 * Get the current operation ID for correlation
 */
export function getOperationId(): string | null {
  return appInsightsInstance?.context.operation.id || null
}

/**
 * Set the operation name for the current context
 */
export function setOperationName(name: string): void {
  if (appInsightsInstance) {
    appInsightsInstance.context.operation.name = name
  }
}

/**
 * Get correlation headers for API requests
 */
export function getCorrelationHeaders(): Record<string, string> {
  const operationId = getOperationId()
  if (!operationId) {return {}}
  
  return {
    'Request-Id': operationId,
    'traceparent': `00-${operationId}-${generateSpanId()}-01`,
  }
}

function generateSpanId(): string {
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

// =============================================================================
// ANALYTICS DESTINATION HANDLER
// =============================================================================

/**
 * Handle events from the analytics tracker
 */
function handleAnalyticsEvent(event: AnalyticsEvent): void {
  if (!appInsightsInstance || !canTrack('analytics')) {return}
  
  switch (event.type) {
    case 'page_view':
      appInsightsInstance.trackPageView({
        name: event.properties.page_name,
        uri: event.properties.page_url,
        properties: event.properties as unknown as Record<string, unknown>,
      })
      break
      
    case 'track':
      appInsightsInstance.trackEvent({
        name: event.event_name,
        properties: event.properties as unknown as Record<string, unknown>,
      })
      break
      
    case 'conversion':
      // Track conversions as both events and metrics
      appInsightsInstance.trackEvent({
        name: event.event_name,
        properties: {
          ...event.properties,
          event_id: event.event_id,
        } as unknown as Record<string, unknown>,
      })
      
      // Track conversion value as metric if present
      if (event.properties.conversion_value) {
        appInsightsInstance.trackMetric({
          name: `conversion_value_${event.properties.conversion_type}`,
          average: event.properties.conversion_value,
          properties: {
            conversion_type: event.properties.conversion_type,
            currency: event.properties.currency,
          },
        })
      }
      break
  }
}

// =============================================================================
// LIFECYCLE
// =============================================================================

/**
 * Flush pending telemetry
 */
export function flushAppInsights(): void {
  appInsightsInstance?.flush()
}

/**
 * Check if App Insights is initialized
 */
export function isAppInsightsInitialized(): boolean {
  return isInitialized
}

// Handle consent withdrawal
if (typeof window !== 'undefined') {
  window.addEventListener('consent-withdrawn', () => {
    // Flush any pending data and stop tracking
    flushAppInsights()
    isInitialized = false
    appInsightsInstance = null
    window.appInsights = undefined
  })
}
