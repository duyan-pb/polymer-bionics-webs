/**
 * Analytics Types
 * Centralized type definitions for the analytics infrastructure.
 * Covers consent management, identity, events, and configuration.
 */

// =============================================================================
// CONSENT TYPES (Epic 1)
// =============================================================================

/**
 * Consent categories as defined by GDPR/privacy requirements
 */
export type ConsentCategory = 'necessary' | 'analytics' | 'marketing'

/**
 * Consent state for a single category
 */
export interface ConsentChoice {
  category: ConsentCategory
  granted: boolean
  timestamp: number
}

/**
 * Full consent state including version tracking for compliance
 */
export interface ConsentState {
  /** Semantic version of consent schema (for migration) */
  version: string
  /** ISO timestamp when consent was last modified */
  timestamp: string
  /** Individual category choices */
  choices: Record<ConsentCategory, boolean>
  /** Region for geo-specific rules (optional) */
  region?: string
  /** Whether consent banner has been shown */
  bannerShown: boolean
  /** Whether user has made an explicit choice */
  hasInteracted: boolean
}

/**
 * Default consent state - necessary cookies only
 */
export const DEFAULT_CONSENT_STATE: ConsentState = {
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  choices: {
    necessary: true,
    analytics: false,
    marketing: false,
  },
  bannerShown: false,
  hasInteracted: false,
}

// =============================================================================
// IDENTITY TYPES (Epic 6)
// =============================================================================

/**
 * Anonymous identity state (no PII)
 */
export interface AnonymousIdentity {
  /** Random anonymous ID (persisted in cookie/localStorage) */
  anonymousId: string
  /** Session ID (rotates on inactivity/daily) */
  sessionId: string
  /** When the anonymous ID was created */
  anonymousIdCreatedAt: string
  /** When the session started */
  sessionStartedAt: string
  /** Last activity timestamp for session timeout */
  lastActivityAt: string
}

/**
 * Identity configuration
 */
export interface IdentityConfig {
  /** Anonymous ID expiry in days (default: 365) */
  anonymousIdExpiryDays: number
  /** Session timeout in minutes (default: 30) */
  sessionTimeoutMinutes: number
  /** Whether to reset session daily */
  dailySessionReset: boolean
}

export const DEFAULT_IDENTITY_CONFIG: IdentityConfig = {
  anonymousIdExpiryDays: 365,
  sessionTimeoutMinutes: 30,
  dailySessionReset: true,
}

// =============================================================================
// EVENT TYPES (Epic 3 & 7)
// =============================================================================

/**
 * Standard event properties attached to all events
 */
export interface StandardEventProperties {
  // Identity
  anonymous_id: string
  session_id: string
  
  // Page context
  page_url: string
  page_path: string
  page_title: string
  referrer: string
  
  // UTM parameters
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  
  // Device/browser
  device_class: 'mobile' | 'tablet' | 'desktop'
  locale: string
  timezone: string
  viewport_width: number
  viewport_height: number
  user_agent: string
  
  // App context
  env: 'development' | 'staging' | 'production'
  app_version: string
  consent_state_version: string
  
  // Timestamp
  timestamp: string
  client_timestamp: number
}

/**
 * Page view event
 */
export interface PageViewEvent {
  type: 'page_view'
  properties: StandardEventProperties & {
    page_name: string
    previous_page?: string
  }
}

/**
 * Custom track event
 */
export interface TrackEvent {
  type: 'track'
  event_name: string
  properties: StandardEventProperties & Record<string, unknown>
}

/**
 * Conversion event (server-authoritative)
 */
export interface ConversionEvent {
  type: 'conversion'
  event_name: string
  event_id: string // For idempotency
  properties: StandardEventProperties & {
    conversion_type: string
    conversion_value?: number
    currency?: string
  }
}

/**
 * All event types union
 */
export type AnalyticsEvent = PageViewEvent | TrackEvent | ConversionEvent

// =============================================================================
// CONFIGURATION TYPES (Epic 2, 3, 11)
// =============================================================================

/**
 * Analytics configuration (can be loaded from Azure App Configuration)
 */
export interface AnalyticsConfig {
  /** Enable/disable all analytics */
  enabled: boolean
  /** Debug mode - logs events to console */
  debugMode: boolean
  /** Sampling rate for events (0-1) */
  samplingRate: number
  /** Application Insights connection string */
  appInsightsConnectionString?: string
  /** GA4 measurement ID */
  ga4MeasurementId?: string
  /** Environment identifier */
  environment: 'development' | 'staging' | 'production'
  /** App version */
  appVersion: string
}

export const DEFAULT_ANALYTICS_CONFIG: AnalyticsConfig = {
  enabled: true,
  debugMode: false,
  samplingRate: 1.0,
  environment: 'development',
  appVersion: '1.0.0',
}

/**
 * Feature flag definition (Epic 11)
 */
export interface FeatureFlag {
  name: string
  enabled: boolean
  variant?: string
  targetingRules?: Record<string, unknown>
}

/**
 * Experiment assignment (Epic 11)
 */
export interface ExperimentAssignment {
  experimentId: string
  variant: string
  assignedAt: string
  sessionId: string
}

// =============================================================================
// UTM TYPES (Epic 8)
// =============================================================================

/**
 * UTM parameters for attribution
 */
export interface UTMParameters {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  captured_at: string
  landing_page: string
  referrer: string
}

// =============================================================================
// VALIDATION TYPES (Epic 7)
// =============================================================================

/**
 * Event validation result
 */
export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Event with validation metadata
 */
export interface ValidatedEvent {
  event: AnalyticsEvent
  validation: ValidationResult
  rejected: boolean
}
