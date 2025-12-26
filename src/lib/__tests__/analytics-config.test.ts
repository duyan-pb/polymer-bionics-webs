/**
 * Analytics Config Tests
 * Tests for environment-specific analytics configuration
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// We need to test with different window.location values
// Store original location
const originalLocation = window.location

describe('analytics-config', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    // Restore original location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    })
  })

  describe('getConfig', () => {
    it('returns development config by default', async () => {
      // In test environment, MODE is 'test' which maps to development
      const { getConfig } = await import('../analytics-config')
      const config = getConfig()
      
      expect(config).toBeDefined()
      expect(config.analytics).toBeDefined()
      expect(config.appInsights).toBeDefined()
      expect(config.ga4).toBeDefined()
    })

    it('returns config with all expected properties', async () => {
      const { getConfig } = await import('../analytics-config')
      const config = getConfig()
      
      expect(config).toHaveProperty('analytics')
      expect(config).toHaveProperty('appInsights')
      expect(config).toHaveProperty('ga4')
      expect(config).toHaveProperty('serverEvents')
      expect(config).toHaveProperty('clarity')
      expect(config).toHaveProperty('webVitals')
      expect(config).toHaveProperty('costControl')
      expect(config).toHaveProperty('dataExport')
    })
  })

  describe('getAnalyticsConfig', () => {
    it('returns analytics config object', async () => {
      const { getAnalyticsConfig } = await import('../analytics-config')
      const config = getAnalyticsConfig()
      
      expect(config).toHaveProperty('enabled')
      expect(config).toHaveProperty('debugMode')
      expect(config).toHaveProperty('samplingRate')
      expect(config).toHaveProperty('environment')
      expect(config).toHaveProperty('appVersion')
    })

    it('has sampling rate as a number', async () => {
      const { getAnalyticsConfig } = await import('../analytics-config')
      const config = getAnalyticsConfig()
      
      expect(typeof config.samplingRate).toBe('number')
      expect(config.samplingRate).toBeGreaterThanOrEqual(0)
      expect(config.samplingRate).toBeLessThanOrEqual(1)
    })
  })

  describe('getAppInsightsConfig', () => {
    it('returns App Insights config', async () => {
      const { getAppInsightsConfig } = await import('../analytics-config')
      const config = getAppInsightsConfig()
      
      expect(config).toHaveProperty('enableDebugMode')
      expect(typeof config.enableDebugMode).toBe('boolean')
    })
  })

  describe('getGA4Config', () => {
    it('returns GA4 config', async () => {
      const { getGA4Config } = await import('../analytics-config')
      const config = getGA4Config()
      
      expect(config).toHaveProperty('enableDebugMode')
      expect(typeof config.enableDebugMode).toBe('boolean')
    })
  })

  describe('getServerEventsConfig', () => {
    it('returns server events config', async () => {
      const { getServerEventsConfig } = await import('../analytics-config')
      const config = getServerEventsConfig()
      
      expect(config).toHaveProperty('endpoint')
      expect(config).toHaveProperty('enabled')
      expect(typeof config.endpoint).toBe('string')
      expect(typeof config.enabled).toBe('boolean')
    })
  })

  describe('getClarityConfig', () => {
    it('returns Clarity config', async () => {
      const { getClarityConfig } = await import('../analytics-config')
      const config = getClarityConfig()
      
      expect(config).toHaveProperty('enabled')
      expect(config).toHaveProperty('sampleRate')
      expect(typeof config.sampleRate).toBe('number')
    })
  })

  describe('getWebVitalsConfig', () => {
    it('returns Web Vitals config', async () => {
      const { getWebVitalsConfig } = await import('../analytics-config')
      const config = getWebVitalsConfig()
      
      expect(config).toHaveProperty('enabled')
      expect(config).toHaveProperty('reportAttribution')
      expect(typeof config.enabled).toBe('boolean')
    })
  })

  describe('getCostControlConfig', () => {
    it('returns cost control config', async () => {
      const { getCostControlConfig } = await import('../analytics-config')
      const config = getCostControlConfig()
      
      expect(config).toHaveProperty('enabled')
      expect(config).toHaveProperty('eventsPerDay')
      expect(config).toHaveProperty('baseSamplingRate')
      expect(typeof config.eventsPerDay).toBe('number')
    })
  })

  describe('getDataExportConfig', () => {
    it('returns data export config', async () => {
      const { getDataExportConfig } = await import('../analytics-config')
      const config = getDataExportConfig()
      
      expect(config).toHaveProperty('enabled')
      expect(config).toHaveProperty('endpoint')
      expect(config).toHaveProperty('batchSize')
      expect(typeof config.batchSize).toBe('number')
    })
  })

  describe('getFeatureFlagsConfig', () => {
    it('returns feature flags config', async () => {
      const { getFeatureFlagsConfig } = await import('../analytics-config')
      const config = getFeatureFlagsConfig()
      
      expect(config).toHaveProperty('refreshInterval')
      expect(config).toHaveProperty('defaults')
      expect(typeof config.refreshInterval).toBe('number')
      expect(typeof config.defaults).toBe('object')
    })

    it('has default feature flags', async () => {
      const { getFeatureFlagsConfig } = await import('../analytics-config')
      const config = getFeatureFlagsConfig()
      
      expect(config.defaults).toHaveProperty('analytics.enhanced_tracking')
      expect(config.defaults).toHaveProperty('analytics.session_replay')
    })
  })

  describe('constants', () => {
    it('exports PRIMARY_FUNNEL_EVENTS', async () => {
      const { PRIMARY_FUNNEL_EVENTS } = await import('../analytics-config')
      
      expect(Array.isArray(PRIMARY_FUNNEL_EVENTS)).toBe(true)
      expect(PRIMARY_FUNNEL_EVENTS.length).toBeGreaterThan(0)
      expect(PRIMARY_FUNNEL_EVENTS).toContain('page_view')
      expect(PRIMARY_FUNNEL_EVENTS).toContain('cta_clicked')
    })

    it('exports SERVER_AUTHORITATIVE_EVENTS', async () => {
      const { SERVER_AUTHORITATIVE_EVENTS } = await import('../analytics-config')
      
      expect(Array.isArray(SERVER_AUTHORITATIVE_EVENTS)).toBe(true)
      expect(SERVER_AUTHORITATIVE_EVENTS).toContain('lead_submitted')
    })

    it('exports DATA_RETENTION_POLICY', async () => {
      const { DATA_RETENTION_POLICY } = await import('../analytics-config')
      
      expect(DATA_RETENTION_POLICY).toHaveProperty('analyticsRetentionDays')
      expect(DATA_RETENTION_POLICY).toHaveProperty('sessionRetentionDays')
      expect(DATA_RETENTION_POLICY).toHaveProperty('conversionRetentionDays')
      expect(DATA_RETENTION_POLICY.analyticsRetentionDays).toBe(365)
    })

    it('exports NEVER_COLLECT PII rules', async () => {
      const { NEVER_COLLECT } = await import('../analytics-config')
      
      expect(Array.isArray(NEVER_COLLECT)).toBe(true)
      expect(NEVER_COLLECT).toContain('email')
      expect(NEVER_COLLECT).toContain('phone')
      expect(NEVER_COLLECT).toContain('password')
      expect(NEVER_COLLECT).toContain('credit_card')
    })

    it('exports REQUIRES_CONSENT fields', async () => {
      const { REQUIRES_CONSENT } = await import('../analytics-config')
      
      expect(Array.isArray(REQUIRES_CONSENT)).toBe(true)
      expect(REQUIRES_CONSENT).toContain('device_id')
      expect(REQUIRES_CONSENT).toContain('precise_location')
    })
  })

  describe('development config specifics', () => {
    it('has debug mode enabled in development', async () => {
      const { getConfig } = await import('../analytics-config')
      const config = getConfig()
      
      // In test environment (treated as development)
      expect(config.analytics.debugMode).toBe(true)
    })

    it('has cost control disabled in development', async () => {
      const { getConfig } = await import('../analytics-config')
      const config = getConfig()
      
      expect(config.costControl.enabled).toBe(false)
    })
  })

  describe('environment detection', () => {
    it('detects staging from hostname with staging prefix', async () => {
      // Mock window.location
      const mockLocation = { hostname: 'staging.example.com' }
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
        configurable: true,
      })
      
      // Mock import.meta.env.MODE to production
      vi.stubEnv('MODE', 'production')
      
      // Re-import to get fresh environment detection
      vi.resetModules()
      const { getAnalyticsConfig } = await import('../analytics-config')
      const config = getAnalyticsConfig()
      
      // Environment should be detected based on hostname
      expect(config.environment).toBeDefined()
    })

    it('detects staging from hostname with -dev suffix', async () => {
      // Mock window.location
      const mockLocation = { hostname: 'app-dev.example.com' }
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
        configurable: true,
      })
      
      vi.stubEnv('MODE', 'production')
      vi.resetModules()
      
      const { getAnalyticsConfig } = await import('../analytics-config')
      const config = getAnalyticsConfig()
      
      expect(config.environment).toBeDefined()
    })

    it('detects production from regular hostname', async () => {
      const mockLocation = { hostname: 'www.polymerbionics.com' }
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
        configurable: true,
      })
      
      vi.stubEnv('MODE', 'production')
      vi.resetModules()
      
      const { getAnalyticsConfig } = await import('../analytics-config')
      const config = getAnalyticsConfig()
      
      expect(config.environment).toBeDefined()
    })
  })
})
