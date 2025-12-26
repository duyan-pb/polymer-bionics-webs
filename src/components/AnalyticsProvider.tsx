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
import { captureUTM } from '@/lib/analytics/attribution'
import { 
  getAnalyticsConfig, 
  getAppInsightsConfig, 
  getGA4Config 
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
    // Capture UTM parameters immediately (before any consent)
    captureUTM('first-touch')
    
    // Initialize core analytics tracker
    const analyticsConfig = getAnalyticsConfig()
    initAnalytics(analyticsConfig)
    
    // Initialize Application Insights (consent-gated internally)
    const appInsightsConfig = getAppInsightsConfig()
    if (appInsightsConfig.connectionString || appInsightsConfig.instrumentationKey) {
      initAppInsights({
        connectionString: appInsightsConfig.connectionString,
        instrumentationKey: appInsightsConfig.instrumentationKey,
        enableAutoRouteTracking: false,
        enableCorsCorrelation: true,
      }).catch(console.error)
    }
    
    // Initialize GA4 (consent-gated internally)
    const ga4Config = getGA4Config()
    if (ga4Config.measurementId) {
      initGA4({
        measurementId: ga4Config.measurementId,
        enableDebugMode: ga4Config.enableDebugMode,
        sendPageViews: false, // We handle page views ourselves
      }).catch(console.error)
    }
    
    // Log initialization in debug mode
    if (analyticsConfig.debugMode) {
      // eslint-disable-next-line no-console
      console.log('[Analytics] Provider initialized', {
        environment: analyticsConfig.environment,
        appVersion: analyticsConfig.appVersion,
        appInsights: !!appInsightsConfig.connectionString,
        ga4: !!ga4Config.measurementId,
      })
    }
  }, [])
  
  return <>{children}</>
})

export default AnalyticsProvider
