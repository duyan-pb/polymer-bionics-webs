/**
 * Performance Monitoring
 * 
 * Real-time performance monitoring and reporting for Azure Application Insights.
 * Tracks:
 * - Resource loading times (scripts, styles, images)
 * - Long tasks (blocking the main thread)
 * - Memory usage
 * - Frame rate / jank detection
 * - Custom performance marks and measures
 * 
 * @module lib/analytics/performance-monitor
 */

import { canTrack } from './consent'
import { track } from './tracker'

// =============================================================================
// TYPES
// =============================================================================

export interface PerformanceMetric {
  /** Metric name */
  name: string
  /** Metric value (usually in milliseconds) */
  value: number
  /** Metric category */
  category: 'resource' | 'long-task' | 'memory' | 'frame-rate' | 'custom'
  /** Additional metadata */
  metadata?: Record<string, unknown>
  /** Timestamp */
  timestamp: number
}

export interface ResourceTiming {
  name: string
  initiatorType: string
  duration: number
  transferSize: number
  decodedBodySize: number
  startTime: number
  responseStart: number
  responseEnd: number
}

export interface LongTaskTiming {
  duration: number
  startTime: number
  name: string
  attribution: string[]
}

export interface MemoryInfo {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
  usagePercent: number
}

export interface PerformanceMonitorConfig {
  /** Enable performance monitoring */
  enabled: boolean
  /** Track resource loading times */
  trackResources: boolean
  /** Minimum resource duration to report (ms) */
  resourceThresholdMs: number
  /** Track long tasks (> 50ms) */
  trackLongTasks: boolean
  /** Track memory usage */
  trackMemory: boolean
  /** Memory check interval (ms) */
  memoryCheckIntervalMs: number
  /** Memory usage threshold to report (0-1) */
  memoryThresholdPercent: number
  /** Track frame rate */
  trackFrameRate: boolean
  /** Frame rate check interval (ms) */
  frameRateCheckIntervalMs: number
  /** Low frame rate threshold */
  lowFrameRateThreshold: number
  /** Maximum metrics per session */
  maxMetricsPerSession: number
  /** Sampling rate */
  samplingRate: number
}

// =============================================================================
// STATE
// =============================================================================

const DEFAULT_CONFIG: PerformanceMonitorConfig = {
  enabled: true,
  trackResources: true,
  resourceThresholdMs: 500, // Only report resources taking > 500ms
  trackLongTasks: true,
  trackMemory: true,
  memoryCheckIntervalMs: 30000, // Check every 30 seconds
  memoryThresholdPercent: 0.8, // Report when > 80% memory used
  trackFrameRate: true,
  frameRateCheckIntervalMs: 5000, // Check every 5 seconds
  lowFrameRateThreshold: 30, // Report if FPS drops below 30
  maxMetricsPerSession: 200,
  samplingRate: 1.0,
}

let config: PerformanceMonitorConfig = { ...DEFAULT_CONFIG }
let metricsThisSession = 0
let isInitialized = false
let memoryCheckInterval: ReturnType<typeof setInterval> | null = null
let frameRateCheckInterval: ReturnType<typeof setInterval> | null = null
let longTaskObserver: PerformanceObserver | null = null
let resourceObserver: PerformanceObserver | null = null

// Frame rate tracking state
let lastFrameTime = 0
let frameCount = 0
let lowFrameRateCount = 0

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Check if we should sample this metric
 */
function shouldSample(): boolean {
  return Math.random() < config.samplingRate
}

/**
 * Check if we can report more metrics
 */
function canReportMetric(): boolean {
  return metricsThisSession < config.maxMetricsPerSession
}

/**
 * Report a performance metric
 */
function reportMetric(metric: PerformanceMetric): void {
  if (!canTrack('analytics') || !canReportMetric() || !shouldSample()) {
    return
  }
  
  metricsThisSession++
  
  track('performance', {
    perf_name: metric.name,
    perf_value: metric.value,
    perf_category: metric.category,
    perf_metadata: metric.metadata,
    session_perf_count: metricsThisSession,
  }, {
    category: 'analytics',
  })
  
  // Also report to App Insights if available
  if (typeof window !== 'undefined' && window.appInsights) {
    window.appInsights.trackMetric({
      name: `perf.${metric.category}.${metric.name}`,
      average: metric.value,
      properties: metric.metadata,
    })
  }
}

// =============================================================================
// RESOURCE TIMING
// =============================================================================

/**
 * Start observing resource timing
 */
function startResourceObserver(): void {
  if (!('PerformanceObserver' in window)) {return}
  
  try {
    resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[]
      
      for (const entry of entries) {
        // Only report slow resources
        if (entry.duration < config.resourceThresholdMs) {continue}
        
        // Skip data URLs and extensions
        if (entry.name.startsWith('data:') || entry.name.includes('chrome-extension')) {
          continue
        }
        
        const resourceTiming: ResourceTiming = {
          name: new URL(entry.name).pathname,
          initiatorType: entry.initiatorType,
          duration: Math.round(entry.duration),
          transferSize: entry.transferSize,
          decodedBodySize: entry.decodedBodySize,
          startTime: Math.round(entry.startTime),
          responseStart: Math.round(entry.responseStart),
          responseEnd: Math.round(entry.responseEnd),
        }
        
        reportMetric({
          name: 'slow_resource',
          value: resourceTiming.duration,
          category: 'resource',
          metadata: resourceTiming as unknown as Record<string, unknown>,
          timestamp: Date.now(),
        })
      }
    })
    
    resourceObserver.observe({ entryTypes: ['resource'] })
  } catch {
    // PerformanceObserver might not be available
  }
}

// =============================================================================
// LONG TASK TRACKING
// =============================================================================

/**
 * Start observing long tasks
 */
function startLongTaskObserver(): void {
  if (!('PerformanceObserver' in window)) {return}
  
  try {
    longTaskObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      for (const entry of entries) {
        const taskEntry = entry as PerformanceEntry & { attribution?: Array<{ name: string }> }
        
        const longTask: LongTaskTiming = {
          duration: Math.round(entry.duration),
          startTime: Math.round(entry.startTime),
          name: entry.name,
          attribution: taskEntry.attribution?.map(a => a.name) ?? [],
        }
        
        reportMetric({
          name: 'long_task',
          value: longTask.duration,
          category: 'long-task',
          metadata: longTask as unknown as Record<string, unknown>,
          timestamp: Date.now(),
        })
      }
    })
    
    longTaskObserver.observe({ entryTypes: ['longtask'] })
  } catch {
    // Long task observer might not be available
  }
}

// =============================================================================
// MEMORY MONITORING
// =============================================================================

/**
 * Get current memory info
 */
function getMemoryInfo(): MemoryInfo | null {
  // @ts-expect-error - memory is not in the standard type
  const memory = performance.memory as {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  } | undefined
  
  if (!memory) {return null}
  
  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    usagePercent: memory.usedJSHeapSize / memory.jsHeapSizeLimit,
  }
}

/**
 * Check memory usage
 */
function checkMemory(): void {
  const info = getMemoryInfo()
  if (!info) {return}
  
  // Only report if above threshold
  if (info.usagePercent >= config.memoryThresholdPercent) {
    reportMetric({
      name: 'high_memory_usage',
      value: info.usagePercent * 100,
      category: 'memory',
      metadata: {
        usedMB: Math.round(info.usedJSHeapSize / 1024 / 1024),
        totalMB: Math.round(info.totalJSHeapSize / 1024 / 1024),
        limitMB: Math.round(info.jsHeapSizeLimit / 1024 / 1024),
      },
      timestamp: Date.now(),
    })
  }
}

/**
 * Start memory monitoring
 */
function startMemoryMonitor(): void {
  if (memoryCheckInterval) {return}
  
  // Check if memory API is available
  // @ts-expect-error - memory is not in the standard type
  if (!performance.memory) {return}
  
  memoryCheckInterval = setInterval(checkMemory, config.memoryCheckIntervalMs)
}

// =============================================================================
// FRAME RATE MONITORING
// =============================================================================

/**
 * Frame rate monitoring loop
 */
function measureFrameRate(timestamp: number): void {
  if (lastFrameTime === 0) {
    lastFrameTime = timestamp
    frameCount = 0
    requestAnimationFrame(measureFrameRate)
    return
  }
  
  frameCount++
  const elapsed = timestamp - lastFrameTime
  
  // Calculate FPS every second
  if (elapsed >= 1000) {
    const fps = Math.round((frameCount * 1000) / elapsed)
    
    // Report if FPS is low
    if (fps < config.lowFrameRateThreshold) {
      lowFrameRateCount++
      
      // Only report every 3rd occurrence to avoid spam
      if (lowFrameRateCount % 3 === 0) {
        reportMetric({
          name: 'low_frame_rate',
          value: fps,
          category: 'frame-rate',
          metadata: {
            consecutiveLowFrameEvents: lowFrameRateCount,
          },
          timestamp: Date.now(),
        })
      }
    } else {
      lowFrameRateCount = 0
    }
    
    // Reset for next measurement
    lastFrameTime = timestamp
    frameCount = 0
  }
  
  requestAnimationFrame(measureFrameRate)
}

/**
 * Start frame rate monitoring
 */
function startFrameRateMonitor(): void {
  if (frameRateCheckInterval) {return}
  
  // Use requestAnimationFrame for accurate FPS measurement
  requestAnimationFrame(measureFrameRate)
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitor(userConfig: Partial<PerformanceMonitorConfig> = {}): void {
  if (isInitialized) {
    console.warn('[PerformanceMonitor] Already initialized')
    return
  }
  
  config = { ...DEFAULT_CONFIG, ...userConfig }
  
  if (!config.enabled) {
    return
  }
  
  if (typeof window === 'undefined') {
    return
  }
  
  if (config.trackResources) {
    startResourceObserver()
  }
  
  if (config.trackLongTasks) {
    startLongTaskObserver()
  }
  
  if (config.trackMemory) {
    startMemoryMonitor()
  }
  
  if (config.trackFrameRate) {
    startFrameRateMonitor()
  }
  
  isInitialized = true
}

/**
 * Cleanup performance monitoring
 */
export function cleanupPerformanceMonitor(): void {
  resourceObserver?.disconnect()
  resourceObserver = null
  
  longTaskObserver?.disconnect()
  longTaskObserver = null
  
  if (memoryCheckInterval) {
    clearInterval(memoryCheckInterval)
    memoryCheckInterval = null
  }
  
  if (frameRateCheckInterval) {
    clearInterval(frameRateCheckInterval)
    frameRateCheckInterval = null
  }
  
  isInitialized = false
  metricsThisSession = 0
}

/**
 * Create a custom performance mark
 */
export function markPerformance(name: string): void {
  if (typeof performance === 'undefined') {return}
  
  performance.mark(`pb_${name}`)
}

/**
 * Measure time between two marks
 */
export function measurePerformance(name: string, startMark: string, endMark?: string): number | null {
  if (typeof performance === 'undefined') {return null}
  
  try {
    const start = `pb_${startMark}`
    const end = endMark ? `pb_${endMark}` : undefined
    
    if (!end) {
      performance.mark(`pb_${name}_end`)
    }
    
    performance.measure(`pb_${name}`, start, end ?? `pb_${name}_end`)
    
    const entries = performance.getEntriesByName(`pb_${name}`)
    const entry = entries[entries.length - 1]
    
    if (entry) {
      const duration = Math.round(entry.duration)
      
      reportMetric({
        name,
        value: duration,
        category: 'custom',
        metadata: {
          startMark,
          endMark: endMark ?? `${name}_end`,
        },
        timestamp: Date.now(),
      })
      
      return duration
    }
  } catch {
    // Measurement failed
  }
  
  return null
}

/**
 * Track a custom performance metric
 */
export function trackPerformanceMetric(
  name: string,
  value: number,
  metadata?: Record<string, unknown>
): void {
  if (!config.enabled) {return}
  
  reportMetric({
    name,
    value,
    category: 'custom',
    metadata,
    timestamp: Date.now(),
  })
}

/**
 * Get current performance metrics summary
 */
export function getPerformanceMetrics(): {
  metricsThisSession: number
  maxMetrics: number
  memory: MemoryInfo | null
} {
  return {
    metricsThisSession,
    maxMetrics: config.maxMetricsPerSession,
    memory: getMemoryInfo(),
  }
}

/**
 * Reset metrics count (useful for testing)
 */
export function resetMetricsCount(): void {
  metricsThisSession = 0
}
