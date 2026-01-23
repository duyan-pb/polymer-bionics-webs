/**
 * Analytics Provider Component
 * 
 * Initializes all analytics services and provides context to the app.
 * This should wrap the entire application in App.tsx.
 */

import { useEffect, memo, type ReactNode } from 'react'
import { initAnalytics } from '@/lib/analytics'
import { initAppInsights } from '@/lib/analytics/app-insights'
import { initGA4 } from '@/lib/analytics/ga4'
import { initWebVitals } from '@/lib/analytics/web-vitals'
import { initClarity } from '@/lib/analytics/session-replay'
import { initCostControls } from '@/lib/analytics/cost-control'
import { initDataExport } from '@/lib/analytics/data-export'
import { initErrorReporting, cleanupErrorReporting } from '@/lib/analytics/error-reporting'
import { initPerformanceMonitor, cleanupPerformanceMonitor } from '@/lib/analytics/performance-monitor'
import { captureUTM } from '@/lib/analytics/attribution'
import { 
  getAnalyticsConfig, 
  getAppInsightsConfig, 
  getGA4Config,
  getClarityConfig,
  getWebVitalsConfig,
  getCostControlConfig,
  getDataExportConfig,
} from '@/lib/analytics-config'

interface AnalyticsProviderProps {
  children: ReactNode
}

// =============================================================================
// INITIALIZATION HELPERS (extracted to reduce complexity)
// =============================================================================

/** Initialize cost controls if enabled */
const initCostControlsIfEnabled = () => {
  const config = getCostControlConfig()
  if (!config.enabled) {return}
  
  try {
    initCostControls({
      eventsPerDay: config.eventsPerDay,
      baseSamplingRate: config.baseSamplingRate,
    })
  } catch (err) {
    console.warn('[Analytics] Failed to initialize cost controls:', err)
  }
}

/** Initialize Application Insights if configured */
const initAppInsightsIfConfigured = async () => {
  const config = getAppInsightsConfig()
  if (!config.connectionString && !config.instrumentationKey) {return}
  
  try {
    await initAppInsights({
      connectionString: config.connectionString,
      instrumentationKey: config.instrumentationKey,
      enableAutoRouteTracking: false,
      enableCorsCorrelation: true,
    })
  } catch (err) {
    console.warn('[Analytics] Failed to initialize App Insights:', err)
  }
}

/** Initialize GA4 if configured */
const initGA4IfConfigured = async () => {
  const config = getGA4Config()
  if (!config.measurementId) {return}
  
  try {
    await initGA4({
      measurementId: config.measurementId,
      enableDebugMode: config.enableDebugMode,
      sendPageViews: false,
    })
  } catch (err) {
    console.warn('[Analytics] Failed to initialize GA4:', err)
  }
}

/** Initialize Web Vitals if enabled */
const initWebVitalsIfEnabled = async () => {
  const config = getWebVitalsConfig()
  if (!config.enabled) {return}
  
  try {
    await initWebVitals({
      enabled: config.enabled,
      reportAttribution: config.reportAttribution,
      reportAllChanges: false,
    })
  } catch (err) {
    console.warn('[Analytics] Failed to initialize Web Vitals:', err)
  }
}

/** Initialize Clarity session replay if enabled */
const initClarityIfEnabled = () => {
  const config = getClarityConfig()
  if (!config.enabled || !config.projectId) {return}
  
  try {
    initClarity({ projectId: config.projectId })
  } catch (err) {
    console.warn('[Analytics] Failed to initialize Clarity:', err)
  }
}

/** Initialize data export if enabled */
const initDataExportIfEnabled = () => {
  const config = getDataExportConfig()
  if (!config.enabled) {return}
  
  try {
    initDataExport({
      enabled: config.enabled,
      endpoint: config.endpoint,
      batchSize: config.batchSize,
    })
  } catch (err) {
    console.warn('[Analytics] Failed to initialize data export:', err)
  }
}

/** Initialize error reporting */
const initErrorReportingService = () => {
  try {
    initErrorReporting({
      enabled: true,
      captureUnhandledExceptions: true,
      captureUnhandledRejections: true,
      captureConsoleErrors: false,
      maxErrorsPerSession: 50,
      samplingRate: 1.0,
    })
  } catch (err) {
    console.warn('[Analytics] Failed to initialize error reporting:', err)
  }
}

/** Initialize performance monitoring */
const initPerformanceMonitorService = () => {
  try {
    initPerformanceMonitor({
      enabled: true,
      trackResources: true,
      resourceThresholdMs: 500,
      trackLongTasks: true,
      trackMemory: true,
      trackFrameRate: false,
      maxMetricsPerSession: 200,
      samplingRate: 1.0,
    })
  } catch (err) {
    console.warn('[Analytics] Failed to initialize performance monitor:', err)
  }
}

/** Log initialization status in debug mode */
const logInitializationStatus = (debugMode: boolean) => {
  if (!debugMode) {return}
  
  const appInsightsConfig = getAppInsightsConfig()
  const ga4Config = getGA4Config()
  const clarityConfig = getClarityConfig()
  const webVitalsConfig = getWebVitalsConfig()
  const costControlConfig = getCostControlConfig()
  const dataExportConfig = getDataExportConfig()
  const analyticsConfig = getAnalyticsConfig()
  
  // eslint-disable-next-line no-console
  console.log('[Analytics] Provider initialized', {
    environment: analyticsConfig.environment,
    appVersion: analyticsConfig.appVersion,
    appInsights: !!appInsightsConfig.connectionString,
    ga4: !!ga4Config.measurementId,
    clarity: clarityConfig.enabled && !!clarityConfig.projectId,
    webVitals: webVitalsConfig.enabled,
    costControl: costControlConfig.enabled,
    dataExport: dataExportConfig.enabled,
    errorReporting: true,
    performanceMonitor: true,
  })
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Initialize analytics on app mount
 */
export const AnalyticsProvider = memo(({ 
  children 
}: AnalyticsProviderProps) => {
  useEffect(() => {
    const initializeAnalytics = async () => {
      try {
        // Capture UTM parameters immediately (before any consent)
        captureUTM('first-touch')
        
        // Initialize core analytics tracker
        const analyticsConfig = getAnalyticsConfig()
        initAnalytics(analyticsConfig)
        
        // Initialize services in order
        initCostControlsIfEnabled()
        await initAppInsightsIfConfigured()
        await initGA4IfConfigured()
        await initWebVitalsIfEnabled()
        initClarityIfEnabled()
        initDataExportIfEnabled()
        initErrorReportingService()
        initPerformanceMonitorService()
        
        // Log status in debug mode
        logInitializationStatus(analyticsConfig.debugMode)
      } catch (error) {
        console.error('[Analytics] Failed to initialize analytics provider:', error)
      }
    }
    
    initializeAnalytics()
    
    return () => {
      cleanupErrorReporting()
      cleanupPerformanceMonitor()
    }
  }, [])
  
  return <>{children}</>
})
