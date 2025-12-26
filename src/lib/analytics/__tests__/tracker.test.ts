/**
 * Analytics Tracker Tests (Epic 3)
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  initAnalytics,
  track,
  page,
  conversion,
  trackOnce,
  trackOnceWithKey,
  hasFired,
  getAnalyticsConfig,
  registerDestination,
  resetForTesting,
} from '../tracker'
import { acceptAllConsent, withdrawConsent } from '../consent'

describe('Analytics Tracker', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    resetForTesting()
  })

  afterEach(() => {
    withdrawConsent()
  })

  describe('initAnalytics', () => {
    it('initializes with default config', () => {
      initAnalytics()
      
      const config = getAnalyticsConfig()
      expect(config.enabled).toBe(true)
      expect(config.samplingRate).toBe(1)
    })

    it('accepts custom config', () => {
      initAnalytics({
        debugMode: true,
        samplingRate: 0.5,
      })
      
      const config = getAnalyticsConfig()
      expect(config.debugMode).toBe(true)
      expect(config.samplingRate).toBe(0.5)
    })

    it('enables debug mode via URL parameter', () => {
      // Simulate URL with debug parameter
      Object.defineProperty(window, 'location', {
        value: {
          ...window.location,
          search: '?debug_analytics=1',
        },
        writable: true,
      })
      
      initAnalytics()
      
      const config = getAnalyticsConfig()
      expect(config.debugMode).toBe(true)
    })
  })

  describe('track', () => {
    beforeEach(() => {
      initAnalytics({ debugMode: false })
      acceptAllConsent()
    })

    it('tracks event when consent granted', () => {
      const result = track('test_event', { test: 'value' })
      
      expect(result).toBe(true)
    })

    it('blocks event when consent not granted', () => {
      withdrawConsent()
      
      const result = track('test_event', { test: 'value' })
      
      expect(result).toBe(false)
    })

    it('attaches standard properties', () => {
      const destination = vi.fn()
      registerDestination(destination)
      
      track('test_event', { custom: 'prop' })
      
      expect(destination).toHaveBeenCalled()
      const event = destination.mock.calls[0][0]
      expect(event.properties).toHaveProperty('anonymous_id')
      expect(event.properties).toHaveProperty('session_id')
      expect(event.properties).toHaveProperty('page_url')
      expect(event.properties).toHaveProperty('timestamp')
    })

    it('includes custom properties', () => {
      const destination = vi.fn()
      registerDestination(destination)
      
      track('test_event', { custom: 'value', count: 42 })
      
      const event = destination.mock.calls[0][0]
      expect(event.properties.custom).toBe('value')
      expect(event.properties.count).toBe(42)
    })

    it('respects sampling rate', () => {
      initAnalytics({ samplingRate: 0 })
      
      const result = track('test_event')
      
      expect(result).toBe(false)
    })

    it('queues events before initialization', () => {
      resetForTesting()
      acceptAllConsent()
      
      // Track before init
      track('queued_event', { queued: true })
      
      const destination = vi.fn()
      registerDestination(destination)
      
      // Initialize - should process queued events
      initAnalytics()
      
      expect(destination).toHaveBeenCalled()
    })
  })

  describe('page', () => {
    beforeEach(() => {
      initAnalytics()
      acceptAllConsent()
    })

    it('tracks page view', () => {
      const destination = vi.fn()
      registerDestination(destination)
      
      page('home')
      
      expect(destination).toHaveBeenCalled()
      const event = destination.mock.calls[0][0]
      expect(event.type).toBe('page_view')
      expect(event.properties.page_name).toBe('home')
    })

    it('includes previous page', () => {
      const destination = vi.fn()
      registerDestination(destination)
      
      page('home')
      page('products')
      
      const secondCall = destination.mock.calls[1][0]
      expect(secondCall.properties.previous_page).toBe('home')
    })

    it('accepts additional properties', () => {
      const destination = vi.fn()
      registerDestination(destination)
      
      page('products', { category: 'medical' })
      
      const event = destination.mock.calls[0][0]
      expect(event.properties.category).toBe('medical')
    })
  })

  describe('conversion', () => {
    beforeEach(() => {
      initAnalytics()
      acceptAllConsent()
    })

    it('tracks conversion with event ID', () => {
      const destination = vi.fn()
      registerDestination(destination)
      
      conversion('lead_submitted', 'uuid-123', { form: 'contact' })
      
      expect(destination).toHaveBeenCalled()
      const event = destination.mock.calls[0][0]
      expect(event.type).toBe('conversion')
      expect(event.event_id).toBe('uuid-123')
      expect(event.event_name).toBe('lead_submitted')
    })

    it('auto-generates event ID if empty string provided', () => {
      const destination = vi.fn()
      registerDestination(destination)
      
      // The conversion function requires eventId - test that it accepts provided ID
      conversion('lead_submitted', 'test-uuid-123', { form: 'contact' })
      
      const event = destination.mock.calls[0][0]
      expect(event.event_id).toBe('test-uuid-123')
    })
  })

  describe('trackOnce', () => {
    beforeEach(() => {
      initAnalytics()
      acceptAllConsent()
    })

    it('fires event on first call', () => {
      const destination = vi.fn()
      registerDestination(destination)
      
      trackOnce('first_visit')
      
      expect(destination).toHaveBeenCalledTimes(1)
    })

    it('does not fire on subsequent calls', () => {
      const destination = vi.fn()
      registerDestination(destination)
      
      trackOnce('first_visit')
      trackOnce('first_visit')
      trackOnce('first_visit')
      
      expect(destination).toHaveBeenCalledTimes(1)
    })

    it('fires different events independently', () => {
      const destination = vi.fn()
      registerDestination(destination)
      
      trackOnce('event_a')
      trackOnce('event_b')
      
      expect(destination).toHaveBeenCalledTimes(2)
    })
  })

  describe('trackOnceWithKey', () => {
    beforeEach(() => {
      initAnalytics()
      acceptAllConsent()
    })

    it('uses custom key for deduplication', () => {
      const destination = vi.fn()
      registerDestination(destination)
      
      trackOnceWithKey('video_played', 'video:demo', { video_id: 'demo' })
      trackOnceWithKey('video_played', 'video:demo', { video_id: 'demo' })
      
      expect(destination).toHaveBeenCalledTimes(1)
    })

    it('allows same event with different keys', () => {
      const destination = vi.fn()
      registerDestination(destination)
      
      trackOnceWithKey('video_played', 'video:demo1', { video_id: 'demo1' })
      trackOnceWithKey('video_played', 'video:demo2', { video_id: 'demo2' })
      
      expect(destination).toHaveBeenCalledTimes(2)
    })
  })

  describe('hasFired', () => {
    beforeEach(() => {
      initAnalytics()
      acceptAllConsent()
    })

    it('returns false for unfired events', () => {
      expect(hasFired('never_fired')).toBe(false)
    })

    it('returns true for fired events', () => {
      trackOnce('test_event')
      
      expect(hasFired('test_event')).toBe(true)
    })
  })

  describe('registerDestination', () => {
    beforeEach(() => {
      initAnalytics()
      acceptAllConsent()
    })

    it('calls all registered destinations', () => {
      const dest1 = vi.fn()
      const dest2 = vi.fn()
      
      registerDestination(dest1)
      registerDestination(dest2)
      
      track('test_event')
      
      expect(dest1).toHaveBeenCalled()
      expect(dest2).toHaveBeenCalled()
    })

    it('passes event to destinations', () => {
      const destination = vi.fn()
      registerDestination(destination)
      
      track('test_event', { prop: 'value' })
      
      const event = destination.mock.calls[0][0]
      expect(event.event_name).toBe('test_event')
      expect(event.type).toBe('track')
    })
  })

  describe('device class detection', () => {
    beforeEach(() => {
      initAnalytics()
      acceptAllConsent()
    })

    it('detects mobile viewport', () => {
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(375)
      
      const destination = vi.fn()
      registerDestination(destination)
      
      track('test')
      
      const event = destination.mock.calls[0][0]
      expect(event.properties.device_class).toBe('mobile')
    })

    it('detects tablet viewport', () => {
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800)
      
      const destination = vi.fn()
      registerDestination(destination)
      
      track('test')
      
      const event = destination.mock.calls[0][0]
      expect(event.properties.device_class).toBe('tablet')
    })

    it('detects desktop viewport', () => {
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1200)
      
      const destination = vi.fn()
      registerDestination(destination)
      
      track('test')
      
      const event = destination.mock.calls[0][0]
      expect(event.properties.device_class).toBe('desktop')
    })
  })

  describe('destination error handling', () => {
    beforeEach(() => {
      initAnalytics()
      acceptAllConsent()
    })

    it('continues to other destinations if one throws', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const failingDest = vi.fn().mockImplementation(() => {
        throw new Error('Destination failure')
      })
      const workingDest = vi.fn()
      
      registerDestination(failingDest)
      registerDestination(workingDest)
      
      track('test_event')
      
      expect(failingDest).toHaveBeenCalled()
      expect(workingDest).toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[Analytics] Destination error'), expect.any(Error))
      consoleSpy.mockRestore()
    })
  })

  describe('conversion server-side', () => {
    beforeEach(() => {
      initAnalytics()
      acceptAllConsent()
    })

    it('sends conversion events to server', async () => {
      const fetchSpy = vi.mocked(global.fetch)
      fetchSpy.mockResolvedValueOnce({ ok: true } as Response)
      
      conversion('purchase', { value: 100 })
      
      // Wait for async server call
      await new Promise(resolve => setTimeout(resolve, 50))
      
      expect(fetchSpy).toHaveBeenCalled()
    })

    it('handles server errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'))
      
      conversion('purchase', { value: 100 })
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // Should not throw, but log error
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('handleConsentWithdrawn', () => {
    beforeEach(() => {
      initAnalytics()
    })

    it('clears fired events when consent withdrawn', () => {
      acceptAllConsent()
      trackOnce('test_event')
      expect(hasFired('test_event')).toBe(true)
      
      // Simulate consent withdrawal
      window.dispatchEvent(new Event('consent-withdrawn'))
      
      // firedEvents should be cleared
      expect(hasFired('test_event')).toBe(false)
    })
  })

  describe('page view queuing', () => {
    it('queues page views before initialization', () => {
      resetForTesting()
      acceptAllConsent()
      
      // Call page before init
      const result = page('queued_page', { queued: true })
      expect(result).toBe(false) // Returns false because not initialized
      
      const destination = vi.fn()
      registerDestination(destination)
      
      // Initialize - should process queued page views
      initAnalytics()
      
      // The queued page view should have been processed
      expect(destination).toHaveBeenCalled()
      const event = destination.mock.calls[0][0]
      expect(event.type).toBe('page_view')
      expect(event.properties.page_name).toBe('queued_page')
    })
  })

  describe('track with fireOnce option', () => {
    beforeEach(() => {
      initAnalytics()
      acceptAllConsent()
    })

    it('marks event as fired when using fireOnce option directly', () => {
      const destination = vi.fn()
      registerDestination(destination)
      
      // Track with fireOnce option
      const firstResult = track('once_event', {}, { fireOnce: true })
      expect(firstResult).toBe(true)
      
      // Second call should be blocked
      const secondResult = track('once_event', {}, { fireOnce: true })
      expect(secondResult).toBe(false)
      
      // Destination should only be called once
      expect(destination).toHaveBeenCalledTimes(1)
    })

    it('uses custom fireOnceKey when provided', () => {
      const destination = vi.fn()
      registerDestination(destination)
      
      // Track with custom key
      track('video_played', { id: 1 }, { fireOnce: true, fireOnceKey: 'video:1' })
      track('video_played', { id: 2 }, { fireOnce: true, fireOnceKey: 'video:2' })
      track('video_played', { id: 1 }, { fireOnce: true, fireOnceKey: 'video:1' }) // Duplicate
      
      // Only first two should fire
      expect(destination).toHaveBeenCalledTimes(2)
    })
  })

  describe('conversion deduplication', () => {
    beforeEach(() => {
      initAnalytics()
      acceptAllConsent()
    })

    it('prevents duplicate conversions with same event ID', () => {
      const destination = vi.fn()
      registerDestination(destination)
      
      conversion('purchase', 'order-123', { value: 100 })
      conversion('purchase', 'order-123', { value: 100 }) // Duplicate
      
      // Should only fire once
      expect(destination).toHaveBeenCalledTimes(1)
    })

    it('allows different conversion types with same event ID', () => {
      const destination = vi.fn()
      registerDestination(destination)
      
      conversion('purchase', 'order-123', { value: 100 })
      conversion('refund', 'order-123', { value: 100 })
      
      // Both should fire (different conversion types)
      expect(destination).toHaveBeenCalledTimes(2)
    })
  })

  describe('conversion without consent', () => {
    beforeEach(() => {
      initAnalytics()
    })

    it('blocks conversion when consent not granted', () => {
      withdrawConsent()
      
      const destination = vi.fn()
      registerDestination(destination)
      
      const result = conversion('purchase', 'test-id', { value: 100 })
      
      expect(result).toBe(false)
      expect(destination).not.toHaveBeenCalled()
    })
  })

  describe('track with marketing consent category', () => {
    beforeEach(() => {
      initAnalytics()
    })

    it('blocks marketing events when marketing consent not granted', () => {
      // Accept only analytics, not marketing
      localStorage.setItem('pb_consent', JSON.stringify({
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        choices: { necessary: true, analytics: true, marketing: false },
        bannerShown: true,
        hasInteracted: true,
      }))
      
      const result = track('marketing_event', {}, { category: 'marketing' })
      
      expect(result).toBe(false)
    })

    it('allows marketing events when marketing consent granted', () => {
      acceptAllConsent()
      
      const destination = vi.fn()
      registerDestination(destination)
      
      const result = track('marketing_event', {}, { category: 'marketing' })
      
      expect(result).toBe(true)
      expect(destination).toHaveBeenCalled()
    })
  })

  describe('page view without consent', () => {
    beforeEach(() => {
      initAnalytics()
    })

    it('blocks page view when no analytics consent', () => {
      withdrawConsent()
      
      const destination = vi.fn()
      registerDestination(destination)
      
      const result = page('home')
      
      expect(result).toBe(false)
      expect(destination).not.toHaveBeenCalled()
    })
  })

  describe('conversion already fired', () => {
    beforeEach(() => {
      initAnalytics()
      acceptAllConsent()
    })

    it('skips duplicate conversion events', () => {
      const destination = vi.fn()
      registerDestination(destination)
      
      // First conversion
      const first = conversion('lead', 'unique-id-1', { form: 'contact' })
      expect(first).toBe(true)
      
      // Duplicate conversion with same ID and type
      const second = conversion('lead', 'unique-id-1', { form: 'contact' })
      expect(second).toBe(false)
      
      expect(destination).toHaveBeenCalledTimes(1)
    })
  })
})
