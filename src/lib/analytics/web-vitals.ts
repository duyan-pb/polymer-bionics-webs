/**
 * Web Vitals Performance Tracking (Epic 14)
 * 
 * Tracks Core Web Vitals (CWV) metrics:
 * - LCP (Largest Contentful Paint) - loading performance
 * - INP (Interaction to Next Paint) - interactivity (replaced FID)
 * - CLS (Cumulative Layout Shift) - visual stability
 * - FCP (First Contentful Paint) - perceived load speed
 * - TTFB (Time to First Byte) - server response time
 * 
 * @see https://web.dev/vitals/
 */

import { canTrack } from './consent'
import { track } from './tracker'

// =============================================================================
// TYPES
// =============================================================================

export interface WebVitalsMetric {
  /** Metric name (LCP, INP, CLS, FCP, TTFB) */
  name: 'LCP' | 'INP' | 'CLS' | 'FCP' | 'TTFB'
  /** Metric value */
  value: number
  /** Rating based on thresholds: good, needs-improvement, poor */
  rating: 'good' | 'needs-improvement' | 'poor'
  /** Delta from previous value (for CLS) */
  delta: number
  /** Unique ID for the metric */
  id: string
  /** Navigation type */
  navigationType: 'navigate' | 'reload' | 'back-forward' | 'back-forward-cache' | 'prerender'
  /** Attribution data for debugging */
  attribution?: Record<string, unknown>
}

export interface WebVitalsConfig {
  /** Whether to enable Web Vitals tracking */
  enabled: boolean
  /** Whether to report attribution data (larger payload) */
  reportAttribution: boolean
  /** Report all changes or only final values */
  reportAllChanges: boolean
  /** Custom thresholds (optional) */
  thresholds?: {
    LCP?: { good: number; poor: number }
    INP?: { good: number; poor: number }
    CLS?: { good: number; poor: number }
    FCP?: { good: number; poor: number }
    TTFB?: { good: number; poor: number }
  }
  /** Callback for custom reporting */
  onMetric?: (metric: WebVitalsMetric) => void
}

// =============================================================================
// DEFAULT THRESHOLDS (from web.dev recommendations)
// =============================================================================

const DEFAULT_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },    // milliseconds
  INP: { good: 200, poor: 500 },       // milliseconds
  CLS: { good: 0.1, poor: 0.25 },      // unitless
  FCP: { good: 1800, poor: 3000 },     // milliseconds
  TTFB: { good: 800, poor: 1800 },     // milliseconds
}

// =============================================================================
// STATE
// =============================================================================

let config: WebVitalsConfig = {
  enabled: true,
  reportAttribution: false,
  reportAllChanges: false,
}

let isInitialized = false
const reportedMetrics = new Set<string>()

// =============================================================================
// RATING CALCULATION
// =============================================================================

/**
 * Calculate rating based on thresholds
 */
function getRating(
  name: WebVitalsMetric['name'],
  value: number
): WebVitalsMetric['rating'] {
  const thresholds = config.thresholds?.[name] ?? DEFAULT_THRESHOLDS[name]
  
  if (value <= thresholds.good) {
    return 'good'
  }
  if (value <= thresholds.poor) {
    return 'needs-improvement'
  }
  return 'poor'
}

// =============================================================================
// METRIC REPORTING
// =============================================================================

/**
 * Report a Web Vitals metric
 */
function reportMetric(metric: WebVitalsMetric): void {
  // Check consent
  if (!canTrack('analytics')) {
    return
  }
  
  // Skip if already reported (unless reportAllChanges is enabled)
  const metricKey = `${metric.name}-${metric.id}`
  if (!config.reportAllChanges && reportedMetrics.has(metricKey)) {
    return
  }
  reportedMetrics.add(metricKey)
  
  // Calculate rating
  const rating = getRating(metric.name, metric.value)
  
  // Build properties
  const properties: Record<string, unknown> = {
    metric_name: metric.name,
    metric_value: metric.value,
    metric_rating: rating,
    metric_delta: metric.delta,
    metric_id: metric.id,
    navigation_type: metric.navigationType,
  }
  
  // Add attribution if enabled
  if (config.reportAttribution && metric.attribution) {
    properties.attribution = metric.attribution
  }
  
  // Track the metric
  track('web_vitals', properties, {
    category: 'analytics',
    fireOnce: !config.reportAllChanges,
    fireOnceKey: metricKey,
  })
  
  // Call custom callback if provided
  config.onMetric?.(metric)
}

// =============================================================================
// WEB VITALS HANDLERS
// =============================================================================

/**
 * Handle LCP (Largest Contentful Paint)
 */
function handleLCP(metric: { value: number; delta: number; id: string; navigationType: string; attribution?: unknown }): void {
  reportMetric({
    name: 'LCP',
    value: metric.value,
    delta: metric.delta,
    id: metric.id,
    rating: getRating('LCP', metric.value),
    navigationType: metric.navigationType as WebVitalsMetric['navigationType'],
    attribution: metric.attribution as Record<string, unknown>,
  })
}

/**
 * Handle INP (Interaction to Next Paint)
 */
function handleINP(metric: { value: number; delta: number; id: string; navigationType: string; attribution?: unknown }): void {
  reportMetric({
    name: 'INP',
    value: metric.value,
    delta: metric.delta,
    id: metric.id,
    rating: getRating('INP', metric.value),
    navigationType: metric.navigationType as WebVitalsMetric['navigationType'],
    attribution: metric.attribution as Record<string, unknown>,
  })
}

/**
 * Handle CLS (Cumulative Layout Shift)
 */
function handleCLS(metric: { value: number; delta: number; id: string; navigationType: string; attribution?: unknown }): void {
  reportMetric({
    name: 'CLS',
    value: metric.value,
    delta: metric.delta,
    id: metric.id,
    rating: getRating('CLS', metric.value),
    navigationType: metric.navigationType as WebVitalsMetric['navigationType'],
    attribution: metric.attribution as Record<string, unknown>,
  })
}

/**
 * Handle FCP (First Contentful Paint)
 */
function handleFCP(metric: { value: number; delta: number; id: string; navigationType: string; attribution?: unknown }): void {
  reportMetric({
    name: 'FCP',
    value: metric.value,
    delta: metric.delta,
    id: metric.id,
    rating: getRating('FCP', metric.value),
    navigationType: metric.navigationType as WebVitalsMetric['navigationType'],
    attribution: metric.attribution as Record<string, unknown>,
  })
}

/**
 * Handle TTFB (Time to First Byte)
 */
function handleTTFB(metric: { value: number; delta: number; id: string; navigationType: string; attribution?: unknown }): void {
  reportMetric({
    name: 'TTFB',
    value: metric.value,
    delta: metric.delta,
    id: metric.id,
    rating: getRating('TTFB', metric.value),
    navigationType: metric.navigationType as WebVitalsMetric['navigationType'],
    attribution: metric.attribution as Record<string, unknown>,
  })
}

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize Web Vitals tracking
 * 
 * @param options - Configuration options
 */
export async function initWebVitals(options: Partial<WebVitalsConfig> = {}): Promise<void> {
  if (isInitialized) {
    return
  }
  
  config = { ...config, ...options }
  
  if (!config.enabled) {
    return
  }
  
  // Check consent before loading
  if (!canTrack('analytics')) {
    // Listen for consent changes
    window.addEventListener('consent-changed', () => {
      if (canTrack('analytics') && !isInitialized) {
        loadWebVitals()
      }
    })
    return
  }
  
  await loadWebVitals()
}

/**
 * Load web-vitals library dynamically
 */
async function loadWebVitals(): Promise<void> {
  try {
    // Dynamic import to avoid bundling if not used
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webVitals = await import('web-vitals' as any).catch(() => null)
    
    if (!webVitals) {
      console.warn('[WebVitals] Library not installed. Run: npm install web-vitals')
      return
    }
    
    const reportOptions = {
      reportAllChanges: config.reportAllChanges,
    }
    
    // Register handlers for each metric
    if (webVitals.onLCP) {
      webVitals.onLCP(handleLCP, reportOptions)
    }
    if (webVitals.onINP) {
      webVitals.onINP(handleINP, reportOptions)
    }
    if (webVitals.onCLS) {
      webVitals.onCLS(handleCLS, reportOptions)
    }
    if (webVitals.onFCP) {
      webVitals.onFCP(handleFCP, reportOptions)
    }
    if (webVitals.onTTFB) {
      webVitals.onTTFB(handleTTFB, reportOptions)
    }
    
    isInitialized = true
    
  } catch (error) {
    console.error('[WebVitals] Failed to load:', error)
  }
}

// =============================================================================
// MANUAL REPORTING
// =============================================================================

/**
 * Manually report a custom performance metric
 */
export function reportCustomMetric(
  name: string,
  value: number,
  properties: Record<string, unknown> = {}
): void {
  if (!canTrack('analytics')) {
    return
  }
  
  track('custom_performance_metric', {
    metric_name: name,
    metric_value: value,
    ...properties,
  })
}

/**
 * Report a long task (tasks > 50ms that block the main thread)
 */
export function reportLongTask(
  duration: number,
  properties: Record<string, unknown> = {}
): void {
  if (!canTrack('analytics')) {
    return
  }
  
  track('long_task', {
    duration,
    ...properties,
  })
}

// =============================================================================
// LONG TASK OBSERVER
// =============================================================================

let longTaskObserver: PerformanceObserver | null = null

/**
 * Start observing long tasks
 */
export function startLongTaskObserver(threshold = 50): void {
  if (typeof PerformanceObserver === 'undefined') {
    return
  }
  
  if (longTaskObserver) {
    return
  }
  
  try {
    longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > threshold) {
          reportLongTask(entry.duration, {
            entry_type: entry.entryType,
            start_time: entry.startTime,
          })
        }
      }
    })
    
    longTaskObserver.observe({ entryTypes: ['longtask'] })
  } catch {
    // Long task observation not supported
  }
}

/**
 * Stop observing long tasks
 */
export function stopLongTaskObserver(): void {
  if (longTaskObserver) {
    longTaskObserver.disconnect()
    longTaskObserver = null
  }
}

// =============================================================================
// RESOURCE TIMING
// =============================================================================

/**
 * Get resource timing data for analysis
 */
export function getResourceTimings(): PerformanceResourceTiming[] {
  if (typeof performance === 'undefined') {
    return []
  }
  
  return performance.getEntriesByType('resource') as PerformanceResourceTiming[]
}

/**
 * Report slow resources (resources that took longer than threshold)
 */
export function reportSlowResources(thresholdMs = 1000): void {
  if (!canTrack('analytics')) {
    return
  }
  
  const resources = getResourceTimings()
  const slowResources = resources.filter(r => r.duration > thresholdMs)
  
  for (const resource of slowResources.slice(0, 10)) { // Limit to 10
    track('slow_resource', {
      resource_url: resource.name,
      resource_type: resource.initiatorType,
      duration: resource.duration,
      transfer_size: resource.transferSize,
      encoded_body_size: resource.encodedBodySize,
      decoded_body_size: resource.decodedBodySize,
    })
  }
}

// =============================================================================
// REACT HOOK
// =============================================================================

/**
 * React hook for Web Vitals tracking
 */
export function useWebVitals(options: Partial<WebVitalsConfig> = {}): void {
  // Initialize on mount
  if (typeof window !== 'undefined') {
    initWebVitals(options).catch(console.error)
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Get current Web Vitals configuration
 */
export function getWebVitalsConfig(): WebVitalsConfig {
  return { ...config }
}

export {
  DEFAULT_THRESHOLDS,
  getRating,
}
