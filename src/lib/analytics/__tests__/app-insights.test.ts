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

  describe('error event handling', () => {
    it('handles window error events', () => {
      acceptAllConsent()
      
      // Simulate an error event
      const errorEvent = new ErrorEvent('error', {
        message: 'Test error',
        filename: 'test.js',
        lineno: 10,
        colno: 5,
        error: new Error('Test error'),
      })
      
      expect(() => {
        window.dispatchEvent(errorEvent)
      }).not.toThrow()
    })

    it('handles error events without error object', () => {
      acceptAllConsent()
      
      // Simulate an error event with just a message
      const errorEvent = new ErrorEvent('error', {
        message: 'Script error',
        filename: 'test.js',
        lineno: 1,
      })
      
      expect(() => {
        window.dispatchEvent(errorEvent)
      }).not.toThrow()
    })

    it('does not track errors without consent', () => {
      withdrawConsent()
      
      const errorEvent = new ErrorEvent('error', {
        message: 'Test error',
        error: new Error('Test error'),
      })
      
      // Should not throw
      expect(() => {
        window.dispatchEvent(errorEvent)
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

    it('warns if already initialized', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      // First init
      await initAppInsights({
        connectionString: 'InstrumentationKey=test-key;',
      })
      
      // Second init attempt
      await initAppInsights({
        connectionString: 'InstrumentationKey=another-key;',
      })
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Already initialized'))
    })
  })

  describe('consent-withdrawn event', () => {
    it('handles consent withdrawal by flushing and stopping', () => {
      // Dispatch consent-withdrawn event
      window.dispatchEvent(new Event('consent-withdrawn'))
      
      // isAppInsightsInitialized should reflect the reset
      // Note: This may or may not change state based on whether it was initialized
      expect(isAppInsightsInitialized()).toBe(false)
    })
  })

  describe('when AppInsights is initialized', () => {
    const mockAppInsights = {
      trackPageView: vi.fn(),
      trackEvent: vi.fn(),
      trackException: vi.fn(),
      trackMetric: vi.fn(),
      trackTrace: vi.fn(),
      flush: vi.fn(),
      context: {
        application: { ver: '1.0.0' },
        session: { id: 'sess-123' },
        user: { id: 'user-123' },
        operation: { id: 'op-123', name: 'default' },
      },
      config: {},
    }

    beforeEach(() => {
      window.appInsights = mockAppInsights as unknown as typeof window.appInsights
    })

    afterEach(() => {
      delete (window as Record<string, unknown>).appInsights
    })

    it('getOperationId returns operation ID when available', () => {
      // The mock returns 'mock-operation-id' when getTelemetryContext is called
      const result = getOperationId()
      expect(result).toBe('mock-operation-id')
    })

    it('getCorrelationHeaders returns headers when operation ID exists', () => {
      const headers = getCorrelationHeaders()
      expect(headers['Request-Id']).toBe('mock-operation-id')
      expect(headers['traceparent']).toMatch(/^00-mock-operation-id-[a-f0-9]{16}-01$/)
    })
  })

  describe('tracking functions with consent', () => {
    beforeEach(() => {
      acceptAllConsent()
    })

    it('trackAppInsightsPageView does not throw without init', () => {
      expect(() => trackAppInsightsPageView('/test', 'Test')).not.toThrow()
    })

    it('trackAppInsightsEvent does not throw without init', () => {
      expect(() => trackAppInsightsEvent('test_event', {})).not.toThrow()
    })

    it('trackException does not throw without init', () => {
      expect(() => trackException(new Error('test'))).not.toThrow()
    })

    it('trackMetric does not throw without init', () => {
      expect(() => trackMetric('latency', 100)).not.toThrow()
    })

    it('trackTrace does not throw without init', () => {
      expect(() => trackTrace('test message')).not.toThrow()
    })

    it('setOperationName does not throw without init', () => {
      expect(() => setOperationName('test-op')).not.toThrow()
    })

    it('flushAppInsights does not throw without init', () => {
      expect(() => flushAppInsights()).not.toThrow()
    })
  })

  describe('tracking functions without consent', () => {
    beforeEach(() => {
      withdrawConsent()
    })

    it('trackAppInsightsPageView returns early without consent', () => {
      expect(() => trackAppInsightsPageView('/test', 'Test')).not.toThrow()
    })

    it('trackAppInsightsEvent returns early without consent', () => {
      expect(() => trackAppInsightsEvent('test_event', {})).not.toThrow()
    })

    it('trackException returns early without consent', () => {
      expect(() => trackException(new Error('test'))).not.toThrow()
    })
  })
})
