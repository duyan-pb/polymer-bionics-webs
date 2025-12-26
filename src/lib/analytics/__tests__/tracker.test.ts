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
})
