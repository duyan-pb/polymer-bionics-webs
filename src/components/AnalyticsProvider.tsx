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

/**
 * Initialize analytics on app mount
 */
export const AnalyticsProvider = memo(({ 
  children 
}: AnalyticsProviderProps) => {
  useEffect(() => {
    // Wrap entire initialization in try-catch
    const initializeAnalytics = async () => {
      try {
        // Capture UTM parameters immediately (before any consent)
        captureUTM('first-touch')
        
        // Initialize core analytics tracker
        const analyticsConfig = getAnalyticsConfig()
        initAnalytics(analyticsConfig)
        
        // Initialize Cost Controls (Epic 15) - should be early to gate other tracking
        const costControlConfig = getCostControlConfig()
        if (costControlConfig.enabled) {
          try {
            initCostControls({
              eventsPerDay: costControlConfig.eventsPerDay,
              baseSamplingRate: costControlConfig.baseSamplingRate,
            })
          } catch (err) {
            console.warn('[Analytics] Failed to initialize cost controls:', err)
          }
        }
        
        // Initialize Application Insights (consent-gated internally)
        const appInsightsConfig = getAppInsightsConfig()
        if (appInsightsConfig.connectionString || appInsightsConfig.instrumentationKey) {
          try {
            await initAppInsights({
              connectionString: appInsightsConfig.connectionString,
              instrumentationKey: appInsightsConfig.instrumentationKey,
              enableAutoRouteTracking: false,
              enableCorsCorrelation: true,
            })
          } catch (err) {
            console.warn('[Analytics] Failed to initialize App Insights:', err)
          }
        }
        
        // Initialize GA4 (consent-gated internally)
        const ga4Config = getGA4Config()
        if (ga4Config.measurementId) {
          try {
            await initGA4({
              measurementId: ga4Config.measurementId,
              enableDebugMode: ga4Config.enableDebugMode,
              sendPageViews: false,
            })
          } catch (err) {
            console.warn('[Analytics] Failed to initialize GA4:', err)
          }
        }
        
        // Initialize Web Vitals (Epic 14)
        const webVitalsConfig = getWebVitalsConfig()
        if (webVitalsConfig.enabled) {
          try {
            await initWebVitals({
              enabled: webVitalsConfig.enabled,
              reportAttribution: webVitalsConfig.reportAttribution,
              reportAllChanges: false,
            })
          } catch (err) {
            console.warn('[Analytics] Failed to initialize Web Vitals:', err)
          }
        }
        
        // Initialize Session Replay / Clarity (Epic 12)
        const clarityConfig = getClarityConfig()
        if (clarityConfig.enabled && clarityConfig.projectId) {
          try {
            initClarity({
              projectId: clarityConfig.projectId,
            })
          } catch (err) {
            console.warn('[Analytics] Failed to initialize Clarity:', err)
          }
        }
        
        // Initialize Data Export (Epic 9)
        const dataExportConfig = getDataExportConfig()
        if (dataExportConfig.enabled) {
          try {
            initDataExport({
              enabled: dataExportConfig.enabled,
              endpoint: dataExportConfig.endpoint,
              batchSize: dataExportConfig.batchSize,
            })
          } catch (err) {
            console.warn('[Analytics] Failed to initialize data export:', err)
          }
        }
        
        // Log initialization in debug mode
        if (analyticsConfig.debugMode) {
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
          })
        }
      } catch (error) {
        console.error('[Analytics] Failed to initialize analytics provider:', error)
      }
    }
    
    initializeAnalytics()
  }, [])
  
  return <>{children}</>
})
