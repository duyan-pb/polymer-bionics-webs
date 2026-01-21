/**
 * Error Reporting & Monitoring
 * 
 * Centralized error tracking and reporting to Azure Application Insights.
 * Captures:
 * - Unhandled exceptions
 * - React error boundaries
 * - Promise rejections
 * - Console errors (optional)
 * - Custom error events
 * 
 * @module lib/analytics/error-reporting
 */

import { canTrack } from './consent'
import { track } from './tracker'

// =============================================================================
// TYPES
// =============================================================================

export interface ErrorReport {
  /** Error message */
  message: string
  /** Error name/type */
  name: string
  /** Stack trace */
  stack?: string
  /** Component where error occurred (for React errors) */
  componentStack?: string
  /** Error severity level */
  severity: 'error' | 'warning' | 'info'
  /** Error source */
  source: 'runtime' | 'react' | 'promise' | 'network' | 'custom'
  /** Additional context */
  context?: Record<string, unknown>
  /** URL where error occurred */
  url: string
  /** User agent */
  userAgent: string
  /** Timestamp */
  timestamp: string
}

export interface ErrorReportingConfig {
  /** Enable error reporting */
  enabled: boolean
  /** Capture unhandled exceptions */
  captureUnhandledExceptions: boolean
  /** Capture unhandled promise rejections */
  captureUnhandledRejections: boolean
  /** Capture console.error calls */
  captureConsoleErrors: boolean
  /** Maximum errors to report per session */
  maxErrorsPerSession: number
  /** Ignore errors matching these patterns */
  ignorePatterns: RegExp[]
  /** Sampling rate for errors (1 = 100%) */
  samplingRate: number
  /** Custom error handler callback */
  onError?: (report: ErrorReport) => void
}

// =============================================================================
// STATE
// =============================================================================

const DEFAULT_CONFIG: ErrorReportingConfig = {
  enabled: true,
  captureUnhandledExceptions: true,
  captureUnhandledRejections: true,
  captureConsoleErrors: false,
  maxErrorsPerSession: 50,
  ignorePatterns: [
    /ResizeObserver loop/i,
    /Loading chunk .* failed/i,
    /Script error/i,
    /Network request failed/i,
  ],
  samplingRate: 1.0,
}

let config: ErrorReportingConfig = { ...DEFAULT_CONFIG }
let errorsThisSession = 0
let isInitialized = false
let originalConsoleError: typeof console.error | null = null

// =============================================================================
// ERROR PROCESSING
// =============================================================================

/**
 * Check if error should be ignored
 */
function shouldIgnoreError(message: string): boolean {
  return config.ignorePatterns.some(pattern => pattern.test(message))
}

/**
 * Apply sampling to error reporting
 */
function shouldSampleError(): boolean {
  return Math.random() < config.samplingRate
}

/**
 * Create an error report from an Error object
 */
function createErrorReport(
  error: Error | string,
  source: ErrorReport['source'],
  context?: Record<string, unknown>
): ErrorReport {
  const err = typeof error === 'string' ? new Error(error) : error
  
  return {
    message: err.message || String(error),
    name: err.name || 'Error',
    stack: err.stack,
    severity: 'error',
    source,
    context,
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    timestamp: new Date().toISOString(),
  }
}

/**
 * Report an error to analytics
 */
function reportError(report: ErrorReport): void {
  // Check if tracking is allowed
  if (!canTrack('analytics')) {
    return
  }
  
  // Check session limit
  if (errorsThisSession >= config.maxErrorsPerSession) {
    return
  }
  
  // Check ignore patterns
  if (shouldIgnoreError(report.message)) {
    return
  }
  
  // Apply sampling
  if (!shouldSampleError()) {
    return
  }
  
  errorsThisSession++
  
  // Track the error
  track('error', {
    error_message: report.message,
    error_name: report.name,
    error_stack: report.stack?.substring(0, 1000), // Truncate stack
    error_severity: report.severity,
    error_source: report.source,
    error_url: report.url,
    error_context: report.context,
    session_error_count: errorsThisSession,
  }, {
    category: 'analytics',
  })
  
  // Also report to App Insights if available
  if (typeof window !== 'undefined' && window.appInsights) {
    const actualError = new Error(report.message)
    actualError.name = report.name
    actualError.stack = report.stack
    
    window.appInsights.trackException({
      exception: actualError,
      properties: {
        source: report.source,
        severity: report.severity,
        url: report.url,
        context: report.context,
      },
    })
  }
  
  // Call custom handler
  config.onError?.(report)
}

// =============================================================================
// GLOBAL ERROR HANDLERS
// =============================================================================

/**
 * Handle uncaught exceptions
 */
function handleUncaughtError(event: ErrorEvent): void {
  const report = createErrorReport(event.error || event.message, 'runtime', {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  })
  reportError(report)
}

/**
 * Handle unhandled promise rejections
 */
function handleUnhandledRejection(event: PromiseRejectionEvent): void {
  const error = event.reason instanceof Error 
    ? event.reason 
    : new Error(String(event.reason))
  
  const report = createErrorReport(error, 'promise')
  reportError(report)
}

/**
 * Wrap console.error to capture errors
 */
function wrapConsoleError(): void {
  if (originalConsoleError) return
  
  originalConsoleError = console.error
  
  console.error = (...args: unknown[]) => {
    // Call original
    originalConsoleError?.apply(console, args)
    
    // Report the error
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ')
    
    const report = createErrorReport(message, 'custom')
    report.severity = 'error'
    reportError(report)
  }
}

/**
 * Restore original console.error
 */
function unwrapConsoleError(): void {
  if (originalConsoleError) {
    console.error = originalConsoleError
    originalConsoleError = null
  }
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Initialize error reporting
 */
export function initErrorReporting(userConfig: Partial<ErrorReportingConfig> = {}): void {
  if (isInitialized) {
    console.warn('[ErrorReporting] Already initialized')
    return
  }
  
  config = { ...DEFAULT_CONFIG, ...userConfig }
  
  if (!config.enabled) {
    return
  }
  
  if (typeof window !== 'undefined') {
    if (config.captureUnhandledExceptions) {
      window.addEventListener('error', handleUncaughtError)
    }
    
    if (config.captureUnhandledRejections) {
      window.addEventListener('unhandledrejection', handleUnhandledRejection)
    }
    
    if (config.captureConsoleErrors) {
      wrapConsoleError()
    }
  }
  
  isInitialized = true
}

/**
 * Cleanup error reporting
 */
export function cleanupErrorReporting(): void {
  if (typeof window !== 'undefined') {
    window.removeEventListener('error', handleUncaughtError)
    window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    unwrapConsoleError()
  }
  
  isInitialized = false
  errorsThisSession = 0
}

/**
 * Report a custom error
 */
export function reportCustomError(
  error: Error | string,
  context?: Record<string, unknown>
): void {
  if (!config.enabled) return
  
  const report = createErrorReport(error, 'custom', context)
  reportError(report)
}

/**
 * Report a React error boundary error
 */
export function reportReactError(
  error: Error,
  componentStack: string,
  context?: Record<string, unknown>
): void {
  if (!config.enabled) return
  
  const report = createErrorReport(error, 'react', context)
  report.componentStack = componentStack
  reportError(report)
}

/**
 * Report a network error
 */
export function reportNetworkError(
  url: string,
  status: number,
  statusText: string,
  context?: Record<string, unknown>
): void {
  if (!config.enabled) return
  
  const error = new Error(`Network error: ${status} ${statusText} for ${url}`)
  error.name = 'NetworkError'
  
  const report = createErrorReport(error, 'network', {
    requestUrl: url,
    status,
    statusText,
    ...context,
  })
  reportError(report)
}

/**
 * Get current error metrics
 */
export function getErrorMetrics(): { errorsThisSession: number; maxErrors: number } {
  return {
    errorsThisSession,
    maxErrors: config.maxErrorsPerSession,
  }
}

/**
 * Reset error count (useful for testing)
 */
export function resetErrorCount(): void {
  errorsThisSession = 0
}
