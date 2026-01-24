/**
 * Analytics Configuration (Epic 2, 3, 4)
 * 
 * Environment-specific configuration for analytics services.
 * In production, these values should be loaded from Azure App Configuration.
 * 
 * Configuration hierarchy:
 * 1. Environment variables (VITE_*)
 * 2. Azure App Configuration (if available)
 * 3. Default values
 */

// =============================================================================
// TODO: CONFIGURE ANALYTICS SERVICES FOR PRODUCTION
// =============================================================================
// Set these environment variables in production:
// - VITE_GA4_MEASUREMENT_ID: Google Analytics 4 measurement ID (G-XXXXXXXXXX)
// - VITE_APPINSIGHTS_CONNECTION_STRING: Azure Application Insights connection string
// - VITE_CLARITY_PROJECT_ID: Microsoft Clarity project ID
// =============================================================================

import type { AnalyticsConfig } from './analytics/types'

// =============================================================================
// ENVIRONMENT DETECTION
// =============================================================================

type Environment = 'development' | 'staging' | 'production'

function getEnvironment(): Environment {
  // Check build-time environment
  const mode = import.meta.env.MODE
  if (mode === 'production') {
    // Further distinguish staging vs production by hostname
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      if (hostname.includes('staging') || hostname.includes('-dev')) {
        return 'staging'
      }
    }
    return 'production'
  }
  return 'development'
}

// =============================================================================
// CONFIGURATION BY ENVIRONMENT
// =============================================================================

interface EnvironmentConfig {
  analytics: AnalyticsConfig
  appInsights: {
    connectionString?: string
    instrumentationKey?: string
    enableDebugMode: boolean
  }
  ga4: {
    measurementId?: string
    enableDebugMode: boolean
  }
  serverEvents: {
    endpoint: string
    enabled: boolean
  }
  clarity: {
    projectId?: string
    enabled: boolean
    sampleRate: number
  }
  webVitals: {
    enabled: boolean
    reportAttribution: boolean
  }
  costControl: {
    enabled: boolean
    eventsPerDay: number
    baseSamplingRate: number
  }
  dataExport: {
    enabled: boolean
    endpoint: string
    batchSize: number
  }
}

const developmentConfig: EnvironmentConfig = {
  analytics: {
    enabled: true,
    debugMode: true,
    samplingRate: 1.0,
    environment: 'development',
    appVersion: import.meta.env.VITE_BUILD_SHA?.slice(0, 7) || 'dev',
  },
  appInsights: {
    // Development App Insights - set via VITE_APPINSIGHTS_CONNECTION_STRING
    connectionString: import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING,
    enableDebugMode: true,
  },
  ga4: {
    // Development GA4 - set via VITE_GA4_MEASUREMENT_ID
    measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID,
    enableDebugMode: true,
  },
  serverEvents: {
    endpoint: 'http://localhost:7071/api/events/collect',
    enabled: false,
  },
  clarity: {
    projectId: import.meta.env.VITE_CLARITY_PROJECT_ID,
    enabled: false, // Disabled in dev by default
    sampleRate: 1.0,
  },
  webVitals: {
    enabled: true,
    reportAttribution: true, // More details in dev
  },
  costControl: {
    enabled: false, // Disabled in dev
    eventsPerDay: 100000,
    baseSamplingRate: 1.0,
  },
  dataExport: {
    enabled: false,
    endpoint: 'http://localhost:7071/api/events/export',
    batchSize: 10,
  },
}

const stagingConfig: EnvironmentConfig = {
  analytics: {
    enabled: true,
    debugMode: true,
    samplingRate: 1.0,
    environment: 'staging',
    appVersion: import.meta.env.VITE_BUILD_SHA?.slice(0, 7) || 'staging',
  },
  appInsights: {
    connectionString: import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING,
    enableDebugMode: true,
  },
  ga4: {
    measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID,
    enableDebugMode: true,
  },
  serverEvents: {
    endpoint: import.meta.env.VITE_EVENTS_ENDPOINT || '/api/events/collect',
    enabled: true,
  },
  clarity: {
    projectId: import.meta.env.VITE_CLARITY_PROJECT_ID,
    enabled: true,
    sampleRate: 0.5, // 50% in staging
  },
  webVitals: {
    enabled: true,
    reportAttribution: true,
  },
  costControl: {
    enabled: true,
    eventsPerDay: 50000,
    baseSamplingRate: 1.0,
  },
  dataExport: {
    enabled: true,
    endpoint: import.meta.env.VITE_EVENTS_ENDPOINT || '/api/events/export',
    batchSize: 20,
  },
}

const productionConfig: EnvironmentConfig = {
  analytics: {
    enabled: true,
    debugMode: false,
    samplingRate: 1.0, // Full sampling in production
    environment: 'production',
    appVersion: import.meta.env.VITE_BUILD_SHA?.slice(0, 7) || '1.0.0',
  },
  appInsights: {
    connectionString: import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING,
    enableDebugMode: false,
  },
  ga4: {
    measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID,
    enableDebugMode: false,
  },
  serverEvents: {
    endpoint: import.meta.env.VITE_EVENTS_ENDPOINT || '/api/events/collect',
    enabled: true,
  },
  clarity: {
    projectId: import.meta.env.VITE_CLARITY_PROJECT_ID,
    enabled: true,
    sampleRate: 0.1, // 10% in production
  },
  webVitals: {
    enabled: true,
    reportAttribution: false, // Smaller payload in production
  },
  costControl: {
    enabled: true,
    eventsPerDay: 100000,
    baseSamplingRate: 1.0,
  },
  dataExport: {
    enabled: true,
    endpoint: import.meta.env.VITE_EVENTS_ENDPOINT || '/api/events/export',
    batchSize: 50,
  },
}

// =============================================================================
// CONFIGURATION GETTER
// =============================================================================

/**
 * Get configuration for current environment
 */
export function getConfig(): EnvironmentConfig {
  const env = getEnvironment()
  
  switch (env) {
    case 'production':
      return productionConfig
    case 'staging':
      return stagingConfig
    default:
      return developmentConfig
  }
}

/**
 * Get analytics config
 */
export function getAnalyticsConfig(): AnalyticsConfig {
  return getConfig().analytics
}

/**
 * Get App Insights config
 */
export function getAppInsightsConfig() {
  return getConfig().appInsights
}

/**
 * Get GA4 config
 */
export function getGA4Config() {
  return getConfig().ga4
}

/**
 * Get server events config
 */
export function getServerEventsConfig() {
  return getConfig().serverEvents
}

/**
 * Get Clarity (session replay) config
 */
export function getClarityConfig() {
  return getConfig().clarity
}

/**
 * Get Web Vitals config
 */
export function getWebVitalsConfig() {
  return getConfig().webVitals
}

/**
 * Get Cost Control config
 */
export function getCostControlConfig() {
  return getConfig().costControl
}

/**
 * Get Data Export config
 */
export function getDataExportConfig() {
  return getConfig().dataExport
}

// =============================================================================
// FEATURE FLAGS CONFIGURATION (Epic 11)
// =============================================================================

interface FeatureFlagsConfig {
  /** Azure App Configuration endpoint */
  endpoint?: string
  /** Polling interval in seconds */
  refreshInterval: number
  /** Default feature flags */
  defaults: Record<string, boolean>
}

export function getFeatureFlagsConfig(): FeatureFlagsConfig {
  return {
    endpoint: import.meta.env.VITE_APP_CONFIG_ENDPOINT,
    refreshInterval: 300, // 5 minutes
    defaults: {
      // Default feature flags (overridden by Azure App Configuration)
      'analytics.enhanced_tracking': true,
      'analytics.session_replay': false,
      'marketing.personalization': false,
    },
  }
}

// =============================================================================
// TRACKING PLAN CONFIGURATION
// =============================================================================

/**
 * Primary funnel events that must be tracked
 * Used for E2E tests and monitoring
 */
export const PRIMARY_FUNNEL_EVENTS = [
  'page_view',
  'cta_clicked',
  'form_submitted',
  'lead_submitted',
] as const

/**
 * Server-authoritative events (Epic 5)
 * These events are also sent server-side for reliability
 */
export const SERVER_AUTHORITATIVE_EVENTS = [
  'lead_submitted',
  'contact_form_submitted',
  'newsletter_subscribed',
  'demo_requested',
] as const

// =============================================================================
// RETENTION & PII RULES (Task 1.6)
// =============================================================================

export const DATA_RETENTION_POLICY = {
  /** Maximum retention period for analytics data */
  analyticsRetentionDays: 365,
  /** Maximum retention period for session data */
  sessionRetentionDays: 30,
  /** Maximum retention period for conversion data */
  conversionRetentionDays: 730, // 2 years
}

/**
 * Fields that are NEVER collected (PII rules)
 */
export const NEVER_COLLECT = [
  'email',
  'phone',
  'address',
  'name',
  'ip_address', // Masked at infrastructure level
  'social_security',
  'credit_card',
  'password',
  'date_of_birth',
] as const

/**
 * Fields that require explicit consent
 */
export const REQUIRES_CONSENT = [
  'device_id',
  'precise_location',
  'browsing_history',
] as const
