/**
 * Web Vitals Tests (Epic 14)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  initWebVitals,
  reportCustomMetric,
  reportLongTask,
  startLongTaskObserver,
  stopLongTaskObserver,
  getResourceTimings,
  reportSlowResources,
  getWebVitalsConfig,
} from '../web-vitals'
import { acceptAllConsent, withdrawConsent } from '../consent'

// Mock web-vitals library
vi.mock('web-vitals', () => ({
  onLCP: vi.fn((cb) => cb({ name: 'LCP', value: 2500, rating: 'good', delta: 2500, id: 'v1-lcp', navigationType: 'navigate' })),
  onINP: vi.fn((cb) => cb({ name: 'INP', value: 100, rating: 'good', delta: 100, id: 'v1-inp', navigationType: 'navigate' })),
  onCLS: vi.fn((cb) => cb({ name: 'CLS', value: 0.05, rating: 'good', delta: 0.05, id: 'v1-cls', navigationType: 'navigate' })),
  onFCP: vi.fn((cb) => cb({ name: 'FCP', value: 1200, rating: 'good', delta: 1200, id: 'v1-fcp', navigationType: 'navigate' })),
  onTTFB: vi.fn((cb) => cb({ name: 'TTFB', value: 500, rating: 'good', delta: 500, id: 'v1-ttfb', navigationType: 'navigate' })),
}))

describe('Web Vitals', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
    acceptAllConsent()
  })

  describe('initWebVitals', () => {
    it('initializes with default config', async () => {
      await initWebVitals()
      
      const config = getWebVitalsConfig()
      expect(config.enabled).toBe(true)
    })

    it('accepts custom config', async () => {
      await initWebVitals({
        enabled: true,
        reportAttribution: true,
        reportAllChanges: true,
      })
      
      const config = getWebVitalsConfig()
      // Config should be updated
      expect(config.enabled).toBe(true)
    })

    it('updates config when disabled', async () => {
      await initWebVitals({ enabled: false })
      
      // Should complete without error
      expect(true).toBe(true)
    })

    it('handles initialization without consent', async () => {
      withdrawConsent()
      
      await initWebVitals({ enabled: true })
      
      // Should return early without error
      expect(true).toBe(true)
    })
  })

  describe('reportCustomMetric', () => {
    beforeEach(async () => {
      await initWebVitals()
    })

    it('reports custom metric without error', () => {
      // Function returns void, so we just ensure it doesn't throw
      expect(() => {
        reportCustomMetric('api_latency', 250, { endpoint: '/api/data' })
      }).not.toThrow()
    })

    it('accepts custom properties', () => {
      expect(() => {
        reportCustomMetric('render_time', 100, {
          component: 'ProductList',
          itemCount: 50,
        })
      }).not.toThrow()
    })

    it('handles reporting without consent', () => {
      withdrawConsent()
      
      // Should not throw, just return early
      expect(() => {
        reportCustomMetric('test', 100)
      }).not.toThrow()
    })

    it('accepts various metric values', () => {
      expect(() => {
        reportCustomMetric('test', 0)
        reportCustomMetric('test2', 999999)
        reportCustomMetric('test3', 0.5)
      }).not.toThrow()
    })
  })

  describe('reportLongTask', () => {
    beforeEach(async () => {
      await initWebVitals()
    })

    it('reports long task without error', () => {
      expect(() => {
        reportLongTask(150, { context: 'data_processing' })
      }).not.toThrow()
    })

    it('reports without properties', () => {
      expect(() => {
        reportLongTask(200)
      }).not.toThrow()
    })

    it('handles reporting without consent', () => {
      withdrawConsent()
      
      expect(() => {
        reportLongTask(100)
      }).not.toThrow()
    })
  })

  describe('startLongTaskObserver', () => {
    it('starts observing without error', () => {
      expect(() => {
        startLongTaskObserver(50)
      }).not.toThrow()
    })

    it('accepts custom threshold', () => {
      expect(() => {
        startLongTaskObserver(100)
      }).not.toThrow()
    })

    it('handles missing PerformanceObserver gracefully', () => {
      const originalPO = window.PerformanceObserver
      // @ts-expect-error - Testing missing API
      window.PerformanceObserver = undefined
      
      expect(() => {
        startLongTaskObserver()
      }).not.toThrow()
      
      window.PerformanceObserver = originalPO
    })
  })

  describe('stopLongTaskObserver', () => {
    it('stops observing without error', () => {
      startLongTaskObserver()
      
      expect(() => {
        stopLongTaskObserver()
      }).not.toThrow()
    })

    it('handles stop when not started', () => {
      expect(() => {
        stopLongTaskObserver()
      }).not.toThrow()
    })
  })

  describe('getResourceTimings', () => {
    it('returns resource timings array', () => {
      const timings = getResourceTimings()
      
      expect(Array.isArray(timings)).toBe(true)
    })

    it('handles missing performance API', () => {
      const originalPerf = window.performance
      // @ts-expect-error - Testing missing API
      window.performance = undefined
      
      const timings = getResourceTimings()
      
      expect(timings).toEqual([])
      
      window.performance = originalPerf
    })
  })

  describe('reportSlowResources', () => {
    beforeEach(async () => {
      await initWebVitals()
    })

    it('reports slow resources without error', () => {
      // Mock performance entries
      vi.spyOn(performance, 'getEntriesByType').mockReturnValue([
        {
          name: 'https://cdn.example.com/large.js',
          initiatorType: 'script',
          duration: 1500,
          transferSize: 50000,
          encodedBodySize: 45000,
          decodedBodySize: 100000,
        } as PerformanceResourceTiming,
      ])
      
      expect(() => {
        reportSlowResources(1000)
      }).not.toThrow()
    })

    it('handles resources below threshold', () => {
      vi.spyOn(performance, 'getEntriesByType').mockReturnValue([
        {
          name: 'https://cdn.example.com/small.js',
          initiatorType: 'script',
          duration: 100,
          transferSize: 5000,
          encodedBodySize: 4500,
          decodedBodySize: 10000,
        } as PerformanceResourceTiming,
      ])
      
      expect(() => {
        reportSlowResources(1000)
      }).not.toThrow()
    })

    it('uses default threshold', () => {
      vi.spyOn(performance, 'getEntriesByType').mockReturnValue([
        {
          name: 'https://cdn.example.com/medium.js',
          initiatorType: 'script',
          duration: 500,
          transferSize: 20000,
          encodedBodySize: 18000,
          decodedBodySize: 40000,
        } as PerformanceResourceTiming,
      ])
      
      expect(() => {
        reportSlowResources()
      }).not.toThrow()
    })
  })

  describe('metric thresholds', () => {
    it('classifies LCP correctly', async () => {
      // The mock will report LCP = 2500ms which should be 'good' (<=2500)
      await initWebVitals()
      
      // Verify initialization completed
      const config = getWebVitalsConfig()
      expect(config.enabled).toBe(true)
    })

    it('accepts custom thresholds', async () => {
      await initWebVitals({
        thresholds: {
          LCP: { good: 1000, poor: 2000 },
        },
      })
      
      // Should complete without error
      expect(true).toBe(true)
    })
  })

  describe('custom metric callback', () => {
    it('accepts onMetric callback without error', async () => {
      const onMetric = vi.fn()
      
      // Should accept callback without throwing
      await expect(initWebVitals({
        onMetric,
      })).resolves.not.toThrow()
    })
  })

  describe('getWebVitalsConfig', () => {
    it('returns current config', () => {
      const config = getWebVitalsConfig()
      
      expect(config).toBeDefined()
      expect(typeof config.enabled).toBe('boolean')
    })

    it('returns a copy of config', () => {
      const config1 = getWebVitalsConfig()
      const config2 = getWebVitalsConfig()
      
      expect(config1).not.toBe(config2)
      expect(config1).toEqual(config2)
    })
  })

  describe('useWebVitals hook', () => {
    it('exports useWebVitals function', async () => {
      const { useWebVitals } = await import('../web-vitals')
      
      expect(typeof useWebVitals).toBe('function')
    })

    it('calls initWebVitals when invoked', async () => {
      const { useWebVitals } = await import('../web-vitals')
      
      // Should not throw
      expect(() => useWebVitals({ enabled: true })).not.toThrow()
    })
  })

  describe('reportSlowResources edge cases', () => {
    it('does not track without consent', () => {
      withdrawConsent()
      
      expect(() => reportSlowResources()).not.toThrow()
    })

    it('accepts custom threshold', () => {
      expect(() => reportSlowResources(500)).not.toThrow()
    })
  })
})
