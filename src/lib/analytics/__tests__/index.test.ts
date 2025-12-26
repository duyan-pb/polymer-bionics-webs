/**
 * Analytics Index Module Tests
 * 
 * Tests that all exports from the analytics module are properly re-exported
 */

import { describe, it, expect } from 'vitest'
import * as Analytics from '../index'

describe('Analytics Module Exports', () => {
  describe('Types', () => {
    it('exports DEFAULT_CONSENT_STATE', () => {
      expect(Analytics.DEFAULT_CONSENT_STATE).toBeDefined()
    })

    it('exports DEFAULT_IDENTITY_CONFIG', () => {
      expect(Analytics.DEFAULT_IDENTITY_CONFIG).toBeDefined()
    })

    it('exports DEFAULT_ANALYTICS_CONFIG', () => {
      expect(Analytics.DEFAULT_ANALYTICS_CONFIG).toBeDefined()
    })
  })

  describe('Consent Management', () => {
    it('exports getConsentState', () => {
      expect(typeof Analytics.getConsentState).toBe('function')
    })

    it('exports saveConsentState', () => {
      expect(typeof Analytics.saveConsentState).toBe('function')
    })

    it('exports clearNonEssentialCookies', () => {
      expect(typeof Analytics.clearNonEssentialCookies).toBe('function')
    })

    it('exports canTrack', () => {
      expect(typeof Analytics.canTrack).toBe('function')
    })

    it('exports hasAnyTrackingConsent', () => {
      expect(typeof Analytics.hasAnyTrackingConsent).toBe('function')
    })

    it('exports getConsentVersion', () => {
      expect(typeof Analytics.getConsentVersion).toBe('function')
    })

    it('exports acceptAllConsent', () => {
      expect(typeof Analytics.acceptAllConsent).toBe('function')
    })

    it('exports acceptNecessaryOnly', () => {
      expect(typeof Analytics.acceptNecessaryOnly).toBe('function')
    })

    it('exports updateConsent', () => {
      expect(typeof Analytics.updateConsent).toBe('function')
    })

    it('exports withdrawConsent', () => {
      expect(typeof Analytics.withdrawConsent).toBe('function')
    })

    it('exports getConsentAuditLog', () => {
      expect(typeof Analytics.getConsentAuditLog).toBe('function')
    })
  })

  describe('Identity Management', () => {
    it('exports getIdentity', () => {
      expect(typeof Analytics.getIdentity).toBe('function')
    })

    it('exports getAnonymousId', () => {
      expect(typeof Analytics.getAnonymousId).toBe('function')
    })

    it('exports getSessionId', () => {
      expect(typeof Analytics.getSessionId).toBe('function')
    })

    it('exports refreshSession', () => {
      expect(typeof Analytics.refreshSession).toBe('function')
    })

    it('exports resetSession', () => {
      expect(typeof Analytics.resetSession).toBe('function')
    })

    it('exports clearIdentity', () => {
      expect(typeof Analytics.clearIdentity).toBe('function')
    })

    it('exports isStorageAvailable', () => {
      expect(typeof Analytics.isStorageAvailable).toBe('function')
    })

    it('exports getIdentityWithFallback', () => {
      expect(typeof Analytics.getIdentityWithFallback).toBe('function')
    })
  })

  describe('Attribution', () => {
    it('exports captureUTM', () => {
      expect(typeof Analytics.captureUTM).toBe('function')
    })

    it('exports getUTM', () => {
      expect(typeof Analytics.getUTM).toBe('function')
    })

    it('exports clearUTM', () => {
      expect(typeof Analytics.clearUTM).toBe('function')
    })

    it('exports getUTMForEvent', () => {
      expect(typeof Analytics.getUTMForEvent).toBe('function')
    })

    it('exports hasUTMInURL', () => {
      expect(typeof Analytics.hasUTMInURL).toBe('function')
    })
  })

  describe('Analytics Tracker', () => {
    it('exports analytics object', () => {
      expect(Analytics.analytics).toBeDefined()
    })

    it('exports initAnalytics', () => {
      expect(typeof Analytics.initAnalytics).toBe('function')
    })

    it('exports getAnalyticsConfig', () => {
      expect(typeof Analytics.getAnalyticsConfig).toBe('function')
    })

    it('exports track', () => {
      expect(typeof Analytics.track).toBe('function')
    })

    it('exports page', () => {
      expect(typeof Analytics.page).toBe('function')
    })

    it('exports conversion', () => {
      expect(typeof Analytics.conversion).toBe('function')
    })

    it('exports trackOnce', () => {
      expect(typeof Analytics.trackOnce).toBe('function')
    })

    it('exports trackOnceWithKey', () => {
      expect(typeof Analytics.trackOnceWithKey).toBe('function')
    })

    it('exports hasFired', () => {
      expect(typeof Analytics.hasFired).toBe('function')
    })

    it('exports resetFiredEvents', () => {
      expect(typeof Analytics.resetFiredEvents).toBe('function')
    })

    it('exports registerDestination', () => {
      expect(typeof Analytics.registerDestination).toBe('function')
    })

    it('exports resetForTesting', () => {
      expect(typeof Analytics.resetForTesting).toBe('function')
    })
  })

  describe('React Hooks', () => {
    it('exports useConsent', () => {
      expect(typeof Analytics.useConsent).toBe('function')
    })

    it('exports useAnalytics', () => {
      expect(typeof Analytics.useAnalytics).toBe('function')
    })

    it('exports usePageTracking', () => {
      expect(typeof Analytics.usePageTracking).toBe('function')
    })

    it('exports useAnalyticsInit', () => {
      expect(typeof Analytics.useAnalyticsInit).toBe('function')
    })

    it('exports useTrackEvent', () => {
      expect(typeof Analytics.useTrackEvent).toBe('function')
    })

    it('exports useConversionTracking', () => {
      expect(typeof Analytics.useConversionTracking).toBe('function')
    })
  })

  describe('Application Insights', () => {
    it('exports initAppInsights', () => {
      expect(typeof Analytics.initAppInsights).toBe('function')
    })

    it('exports trackAppInsightsPageView', () => {
      expect(typeof Analytics.trackAppInsightsPageView).toBe('function')
    })

    it('exports trackAppInsightsEvent', () => {
      expect(typeof Analytics.trackAppInsightsEvent).toBe('function')
    })

    it('exports trackException', () => {
      expect(typeof Analytics.trackException).toBe('function')
    })

    it('exports trackMetric', () => {
      expect(typeof Analytics.trackMetric).toBe('function')
    })

    it('exports trackTrace', () => {
      expect(typeof Analytics.trackTrace).toBe('function')
    })

    it('exports getOperationId', () => {
      expect(typeof Analytics.getOperationId).toBe('function')
    })

    it('exports setOperationName', () => {
      expect(typeof Analytics.setOperationName).toBe('function')
    })

    it('exports getCorrelationHeaders', () => {
      expect(typeof Analytics.getCorrelationHeaders).toBe('function')
    })

    it('exports flushAppInsights', () => {
      expect(typeof Analytics.flushAppInsights).toBe('function')
    })

    it('exports isAppInsightsInitialized', () => {
      expect(typeof Analytics.isAppInsightsInitialized).toBe('function')
    })
  })

  describe('Google Analytics 4', () => {
    it('exports initGA4', () => {
      expect(typeof Analytics.initGA4).toBe('function')
    })

    it('exports setGA4ConsentDefaults', () => {
      expect(typeof Analytics.setGA4ConsentDefaults).toBe('function')
    })

    it('exports trackGA4PageView', () => {
      expect(typeof Analytics.trackGA4PageView).toBe('function')
    })

    it('exports trackGA4Event', () => {
      expect(typeof Analytics.trackGA4Event).toBe('function')
    })

    it('exports trackGA4Conversion', () => {
      expect(typeof Analytics.trackGA4Conversion).toBe('function')
    })

    it('exports trackGA4FormSubmit', () => {
      expect(typeof Analytics.trackGA4FormSubmit).toBe('function')
    })

    it('exports trackGA4Download', () => {
      expect(typeof Analytics.trackGA4Download).toBe('function')
    })

    it('exports trackGA4VideoStart', () => {
      expect(typeof Analytics.trackGA4VideoStart).toBe('function')
    })

    it('exports trackGA4Search', () => {
      expect(typeof Analytics.trackGA4Search).toBe('function')
    })

    it('exports markAsInternalTraffic', () => {
      expect(typeof Analytics.markAsInternalTraffic).toBe('function')
    })

    it('exports isInternalTraffic', () => {
      expect(typeof Analytics.isInternalTraffic).toBe('function')
    })

    it('exports isGA4Initialized', () => {
      expect(typeof Analytics.isGA4Initialized).toBe('function')
    })
  })

  describe('Schema Validation', () => {
    it('exports StandardEventPropertiesSchema', () => {
      expect(Analytics.StandardEventPropertiesSchema).toBeDefined()
    })

    it('exports PageViewEventSchema', () => {
      expect(Analytics.PageViewEventSchema).toBeDefined()
    })

    it('exports TrackEventSchema', () => {
      expect(Analytics.TrackEventSchema).toBeDefined()
    })

    it('exports ConversionEventSchema', () => {
      expect(Analytics.ConversionEventSchema).toBeDefined()
    })

    it('exports validateEvent', () => {
      expect(typeof Analytics.validateEvent).toBe('function')
    })

    it('exports validateSpecificEvent', () => {
      expect(typeof Analytics.validateSpecificEvent).toBe('function')
    })

    it('exports validateAndWrap', () => {
      expect(typeof Analytics.validateAndWrap).toBe('function')
    })

    it('exports EVENT_REGISTRY', () => {
      expect(Analytics.EVENT_REGISTRY).toBeDefined()
    })
  })

  describe('Web Vitals', () => {
    it('exports initWebVitals', () => {
      expect(typeof Analytics.initWebVitals).toBe('function')
    })

    it('exports useWebVitals', () => {
      expect(typeof Analytics.useWebVitals).toBe('function')
    })

    it('exports reportCustomMetric', () => {
      expect(typeof Analytics.reportCustomMetric).toBe('function')
    })

    it('exports DEFAULT_THRESHOLDS', () => {
      expect(Analytics.DEFAULT_THRESHOLDS).toBeDefined()
    })

    it('exports getRating', () => {
      expect(typeof Analytics.getRating).toBe('function')
    })
  })

  describe('Session Replay', () => {
    it('exports initSessionReplay', () => {
      expect(typeof Analytics.initSessionReplay).toBe('function')
    })

    it('exports initClarity', () => {
      expect(typeof Analytics.initClarity).toBe('function')
    })

    it('exports tagSession', () => {
      expect(typeof Analytics.tagSession).toBe('function')
    })

    it('exports markReplayEvent', () => {
      expect(typeof Analytics.markReplayEvent).toBe('function')
    })

    it('exports pauseReplay', () => {
      expect(typeof Analytics.pauseReplay).toBe('function')
    })

    it('exports resumeReplay', () => {
      expect(typeof Analytics.resumeReplay).toBe('function')
    })
  })

  describe('Cost Control', () => {
    it('exports initCostControls', () => {
      expect(typeof Analytics.initCostControls).toBe('function')
    })

    it('exports getCostControlConfig', () => {
      expect(typeof Analytics.getCostControlConfig).toBe('function')
    })

    it('exports shouldAllowEvent', () => {
      expect(typeof Analytics.shouldAllowEvent).toBe('function')
    })

    it('exports recordEventSent', () => {
      expect(typeof Analytics.recordEventSent).toBe('function')
    })

    it('exports getUsageMetrics', () => {
      expect(typeof Analytics.getUsageMetrics).toBe('function')
    })
  })

  describe('Data Export', () => {
    it('exports initDataExport', () => {
      expect(typeof Analytics.initDataExport).toBe('function')
    })

    it('exports bufferEvent', () => {
      expect(typeof Analytics.bufferEvent).toBe('function')
    })

    it('exports flushEvents', () => {
      expect(typeof Analytics.flushEvents).toBe('function')
    })

    it('exports stopDataExport', () => {
      expect(typeof Analytics.stopDataExport).toBe('function')
    })
  })

  describe('SEO', () => {
    it('exports updatePageMeta', () => {
      expect(typeof Analytics.updatePageMeta).toBe('function')
    })

    it('exports addStructuredData', () => {
      expect(typeof Analytics.addStructuredData).toBe('function')
    })

    it('exports addOrganizationSchema', () => {
      expect(typeof Analytics.addOrganizationSchema).toBe('function')
    })

    it('exports addBreadcrumbSchema', () => {
      expect(typeof Analytics.addBreadcrumbSchema).toBe('function')
    })

    it('exports setPageMetadata', () => {
      expect(typeof Analytics.setPageMetadata).toBe('function')
    })
  })
})
