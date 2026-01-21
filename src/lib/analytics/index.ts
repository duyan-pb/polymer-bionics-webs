/**
 * Analytics Module
 * 
 * Centralized analytics infrastructure for the Polymer Bionics website.
 * 
 * Features:
 * - Consent management with GDPR compliance (Epic 1)
 * - Azure Application Insights integration (Epic 2)
 * - Single analytics wrapper with standard properties (Epic 3)
 * - Google Analytics 4 integration (Epic 4)
 * - Anonymous identity management (Epic 6)
 * - Event schema validation (Epic 7)
 * - UTM attribution tracking (Epic 8)
 * 
 * Usage:
 * ```tsx
 * import { analytics, useConsent, useAnalytics } from '@/lib/analytics'
 * 
 * // Initialize in App.tsx
 * analytics.init({ appInsightsConnectionString: '...' })
 * 
 * // In components
 * const { track, page } = useAnalytics()
 * track('button_clicked', { button_id: 'cta' })
 * ```
 */

// Types
export type {
  ConsentCategory,
  ConsentChoice,
  ConsentState,
  AnonymousIdentity,
  IdentityConfig,
  StandardEventProperties,
  PageViewEvent,
  TrackEvent,
  ConversionEvent,
  AnalyticsEvent,
  AnalyticsConfig,
  FeatureFlag,
  ExperimentAssignment,
  UTMParameters,
  ValidationResult,
  ValidatedEvent,
} from './types'

export {
  DEFAULT_CONSENT_STATE,
  DEFAULT_IDENTITY_CONFIG,
  DEFAULT_ANALYTICS_CONFIG,
} from './types'

// Consent Management (Epic 1)
export {
  getConsentState,
  saveConsentState,
  clearNonEssentialCookies,
  canTrack,
  hasAnyTrackingConsent,
  getConsentVersion,
  acceptAllConsent,
  acceptNecessaryOnly,
  updateConsent,
  withdrawConsent,
  getConsentAuditLog,
} from './consent'

// Identity Management (Epic 6)
export {
  getIdentity,
  getAnonymousId,
  getSessionId,
  refreshSession,
  resetSession,
  clearIdentity,
  isStorageAvailable,
  getIdentityWithFallback,
} from './identity'

// Attribution (Epic 8)
export {
  captureUTM,
  getUTM,
  clearUTM,
  getUTMForEvent,
  hasUTMInURL,
} from './attribution'
export type { AttributionPolicy } from './attribution'

// Analytics Tracker (Epic 3)
export {
  analytics,
  initAnalytics,
  getAnalyticsConfig,
  track,
  page,
  conversion,
  trackOnce,
  trackOnceWithKey,
  hasFired,
  resetFiredEvents,
  registerDestination,
  resetForTesting,
} from './tracker'

// React Hooks
export {
  useConsent,
  useAnalytics,
  usePageTracking,
  useAnalyticsInit,
  useTrackEvent,
  useConversionTracking,
} from './hooks'

// Application Insights (Epic 2)
export {
  initAppInsights,
  trackAppInsightsPageView,
  trackAppInsightsEvent,
  trackException,
  trackMetric,
  trackTrace,
  getOperationId,
  setOperationName,
  getCorrelationHeaders,
  flushAppInsights,
  isAppInsightsInitialized,
} from './app-insights'

// Google Analytics 4 (Epic 4)
export {
  initGA4,
  setGA4ConsentDefaults,
  trackGA4PageView,
  trackGA4Event,
  trackGA4Conversion,
  trackGA4FormSubmit,
  trackGA4Download,
  trackGA4VideoStart,
  trackGA4Search,
  markAsInternalTraffic,
  isInternalTraffic,
  isGA4Initialized,
} from './ga4'

// Schema Validation (Epic 7)
export {
  StandardEventPropertiesSchema,
  PageViewEventSchema,
  TrackEventSchema,
  ConversionEventSchema,
  AnalyticsEventSchema,
  CTAClickEventSchema,
  FormSubmitEventSchema,
  VideoPlayEventSchema,
  DownloadEventSchema,
  SearchEventSchema,
  LeadSubmittedEventSchema,
  EVENT_REGISTRY,
  validateEvent,
  validateSpecificEvent,
  validateAndWrap,
  getRequiredProperties,
  hasRequiredProperties,
} from './schemas'
export type { RegisteredEventName } from './schemas'

// Web Vitals Performance (Epic 14)
export {
  initWebVitals,
  useWebVitals,
  reportCustomMetric,
  reportLongTask,
  startLongTaskObserver,
  stopLongTaskObserver,
  getResourceTimings,
  reportSlowResources,
  getWebVitalsConfig,
  DEFAULT_THRESHOLDS,
  getRating,
} from './web-vitals'
export type { WebVitalsMetric, WebVitalsConfig } from './web-vitals'

// Session Replay (Epic 12)
export {
  initSessionReplay,
  initClarity,
  tagSession,
  markReplayEvent,
  identifyReplayUser,
  enableReplayOnError,
  getClaritySessionUrl,
  addMaskSelector,
  addBlockSelector,
  pauseReplay,
  resumeReplay,
  forceEnableReplay,
  getReplayConfig,
  getSessionReplayConfig,
  isReplayActive,
  resetSessionReplayForTesting,
  REPLAY_DATA_ATTRIBUTES,
  DEFAULT_REPLAY_CONFIG,
} from './session-replay'
export type { SessionReplayConfig, ClarityConfig } from './session-replay'

// SEO Infrastructure (Epic 13)
export {
  updatePageMeta,
  addStructuredData,
  addOrganizationSchema,
  addProductSchema,
  addArticleSchema,
  addBreadcrumbSchema,
  configureRedirects,
  checkRedirect,
  executeRedirect,
  trackPageIndexability,
  trackOutboundLink,
  setupOutboundLinkTracking,
  setPageMetadata,
  usePageSEO,
  PAGE_METADATA,
  DEFAULT_SEO_CONFIG,
} from './seo'
export type {
  PageMetadata,
  OpenGraphMeta,
  TwitterCardMeta,
  StructuredDataOrganization,
  StructuredDataProduct,
  StructuredDataArticle,
  RedirectRule,
} from './seo'

// Data Export for ADLS (Epic 9)
export {
  initDataExport,
  stopDataExport,
  bufferEvent,
  flushEvents,
  retryFailedBatches,
  transformEventForExport,
  getExportConfig,
  getBufferSize,
  ADLS_SCHEMA,
  ADLS_SCHEMA_VERSION,
} from './data-export'
export type { DataExportConfig, ExportEvent, ExportBatch } from './data-export'

// Cost Control (Epic 15)
export {
  initCostControls,
  updateCostControlConfig,
  shouldAllowEvent,
  recordEventSent,
  getUsageMetrics,
  getEstimatedCosts,
  getThrottlingStatus,
  resetSessionMetrics,
  getCostControlConfig,
  withCostControl,
} from './cost-control'
export type { CostControlConfig, UsageMetrics, ThrottleDecision } from './cost-control'

// Error Reporting (Epic 16)
export {
  initErrorReporting,
  cleanupErrorReporting,
  reportCustomError,
  reportReactError,
  reportNetworkError,
  getErrorMetrics,
  resetErrorCount,
} from './error-reporting'
export type { ErrorReport, ErrorReportingConfig } from './error-reporting'

// Performance Monitoring (Epic 17)
export {
  initPerformanceMonitor,
  cleanupPerformanceMonitor,
  markPerformance,
  measurePerformance,
  trackPerformanceMetric,
  getPerformanceMetrics,
  resetMetricsCount,
} from './performance-monitor'
export type {
  PerformanceMetric,
  ResourceTiming,
  LongTaskTiming,
  MemoryInfo,
  PerformanceMonitorConfig,
} from './performance-monitor'

// Monitoring Hooks (Epic 18)
export {
  useRenderTracking,
  useTrackedFetch,
  useInteractionTracking,
  useVisibilityTracking,
  useErrorHandler,
  usePageLoadTracking,
} from './monitoring-hooks'
