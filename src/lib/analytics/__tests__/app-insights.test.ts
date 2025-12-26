/**
 * Application Insights Integration Tests (Epic 2)
 * 
 * Tests Azure Application Insights tracking functions.
 * Uses the mock from src/test/mocks/applicationinsights-web.ts
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
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
} from '../app-insights'
import { acceptAllConsent, withdrawConsent } from '../consent'

describe('Application Insights', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
    acceptAllConsent()
    // Clear window.appInsights
    delete (window as Record<string, unknown>).appInsights
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Module Exports', () => {
    it('exports initAppInsights function', () => {
      expect(typeof initAppInsights).toBe('function')
    })

    it('exports trackAppInsightsPageView function', () => {
      expect(typeof trackAppInsightsPageView).toBe('function')
    })

    it('exports trackAppInsightsEvent function', () => {
      expect(typeof trackAppInsightsEvent).toBe('function')
    })

    it('exports trackException function', () => {
      expect(typeof trackException).toBe('function')
    })

    it('exports trackMetric function', () => {
      expect(typeof trackMetric).toBe('function')
    })

    it('exports trackTrace function', () => {
      expect(typeof trackTrace).toBe('function')
    })

    it('exports getOperationId function', () => {
      expect(typeof getOperationId).toBe('function')
    })

    it('exports setOperationName function', () => {
      expect(typeof setOperationName).toBe('function')
    })

    it('exports getCorrelationHeaders function', () => {
      expect(typeof getCorrelationHeaders).toBe('function')
    })

    it('exports flushAppInsights function', () => {
      expect(typeof flushAppInsights).toBe('function')
    })

    it('exports isAppInsightsInitialized function', () => {
      expect(typeof isAppInsightsInitialized).toBe('function')
    })
  })

  describe('trackAppInsightsPageView', () => {
    it('does not throw when called without initialization', () => {
      expect(() => {
        trackAppInsightsPageView('home')
      }).not.toThrow()
    })

    it('accepts properties', () => {
      expect(() => {
        trackAppInsightsPageView('products', { category: 'medical' })
      }).not.toThrow()
    })

    it('does not throw without consent', () => {
      withdrawConsent()
      
      expect(() => {
        trackAppInsightsPageView('test')
      }).not.toThrow()
    })
  })

  describe('trackAppInsightsEvent', () => {
    it('does not throw when called without initialization', () => {
      expect(() => {
        trackAppInsightsEvent('button_click')
      }).not.toThrow()
    })

    it('accepts properties', () => {
      expect(() => {
        trackAppInsightsEvent('form_submit', { form_id: 'contact' })
      }).not.toThrow()
    })

    it('does not throw without consent', () => {
      withdrawConsent()
      
      expect(() => {
        trackAppInsightsEvent('test')
      }).not.toThrow()
    })
  })

  describe('trackException', () => {
    it('does not throw when called without initialization', () => {
      expect(() => {
        trackException(new Error('Test error'))
      }).not.toThrow()
    })

    it('accepts properties', () => {
      expect(() => {
        trackException(new Error('API error'), { endpoint: '/api/data' })
      }).not.toThrow()
    })

    it('does not throw without consent', () => {
      withdrawConsent()
      
      expect(() => {
        trackException(new Error('test'))
      }).not.toThrow()
    })
  })

  describe('trackMetric', () => {
    it('does not throw when called without initialization', () => {
      expect(() => {
        trackMetric('api_latency', 250)
      }).not.toThrow()
    })

    it('accepts properties', () => {
      expect(() => {
        trackMetric('response_time', 100, { endpoint: '/health' })
      }).not.toThrow()
    })

    it('does not throw without consent', () => {
      withdrawConsent()
      
      expect(() => {
        trackMetric('test', 100)
      }).not.toThrow()
    })
  })

  describe('trackTrace', () => {
    it('does not throw when called without initialization', () => {
      expect(() => {
        trackTrace('Debug message')
      }).not.toThrow()
    })

    it('accepts severity levels', () => {
      expect(() => {
        trackTrace('Error message', 3)
        trackTrace('Info message', 1)
        trackTrace('Critical message', 4)
      }).not.toThrow()
    })

    it('accepts properties', () => {
      expect(() => {
        trackTrace('Operation completed', 1, { operation: 'data_sync' })
      }).not.toThrow()
    })

    it('does not throw without consent', () => {
      withdrawConsent()
      
      expect(() => {
        trackTrace('test')
      }).not.toThrow()
    })
  })

  describe('getOperationId', () => {
    it('returns null when not initialized', () => {
      const operationId = getOperationId()
      
      expect(operationId).toBeNull()
    })
  })

  describe('setOperationName', () => {
    it('does not throw when called without initialization', () => {
      expect(() => {
        setOperationName('custom-operation')
      }).not.toThrow()
    })
  })

  describe('getCorrelationHeaders', () => {
    it('returns empty object when not initialized', () => {
      const headers = getCorrelationHeaders()
      
      expect(headers).toEqual({})
    })
  })

  describe('flushAppInsights', () => {
    it('does not throw when called without initialization', () => {
      expect(() => {
        flushAppInsights()
      }).not.toThrow()
    })
  })

  describe('isAppInsightsInitialized', () => {
    it('returns false before initialization', () => {
      expect(isAppInsightsInitialized()).toBe(false)
    })
  })

  describe('initAppInsights', () => {
    it('warns when no credentials provided', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      await initAppInsights({})
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('No connection string'))
    })

    it('defers initialization without analytics consent', async () => {
      withdrawConsent()
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      await initAppInsights({
        connectionString: 'InstrumentationKey=test-key;',
      })
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('consent not granted'))
    })

    it('initializes with connection string when SDK available', async () => {
      await expect(initAppInsights({
        connectionString: 'InstrumentationKey=test-key;IngestionEndpoint=https://test.in.applicationinsights.azure.com/',
      })).resolves.not.toThrow()
    })
  })
})
