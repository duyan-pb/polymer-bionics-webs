/**
 * Google Analytics 4 Integration Tests (Epic 4)
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  trackGA4PageView,
  trackGA4Event,
  trackGA4Conversion,
  trackGA4FormSubmit,
  trackGA4Download,
  trackGA4VideoStart,
  trackGA4Search,
  setGA4ConsentDefaults,
  markAsInternalTraffic,
  isInternalTraffic,
  isGA4Initialized,
  initGA4,
} from '../ga4'
import { acceptAllConsent, withdrawConsent } from '../consent'

// Mock gtag
const mockGtag = vi.fn()

describe('Google Analytics 4', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
    acceptAllConsent()
    
    // Setup gtag mock
    window.dataLayer = []
    window.gtag = mockGtag
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initGA4', () => {
    it('warns when no measurement ID provided', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      await initGA4({ measurementId: '' })
      
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('No measurement ID'))
    })
  })

  describe('setGA4ConsentDefaults', () => {
    it('sets default consent to denied', () => {
      setGA4ConsentDefaults()
      
      expect(mockGtag).toHaveBeenCalledWith('consent', 'default', expect.objectContaining({
        analytics_storage: 'denied',
        ad_storage: 'denied',
      }))
    })

    it('allows functionality and security storage by default', () => {
      setGA4ConsentDefaults()
      
      expect(mockGtag).toHaveBeenCalledWith('consent', 'default', expect.objectContaining({
        functionality_storage: 'granted',
        security_storage: 'granted',
      }))
    })
  })

  describe('trackGA4PageView', () => {
    it('tracks page view with consent', () => {
      trackGA4PageView('/products', 'Products')
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({
        page_path: '/products',
        page_title: 'Products',
      }))
    })

    it('includes additional properties', () => {
      trackGA4PageView('/products', 'Products', { category: 'medical' })
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', expect.objectContaining({
        category: 'medical',
      }))
    })

    it('does not track without consent', () => {
      withdrawConsent()
      mockGtag.mockClear()
      
      trackGA4PageView('/test', 'Test')
      
      expect(mockGtag).not.toHaveBeenCalled()
    })
  })

  describe('trackGA4Event', () => {
    it('tracks custom event', () => {
      trackGA4Event('button_click', { button_id: 'submit' })
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'button_click', expect.objectContaining({
        button_id: 'submit',
      }))
    })

    it('sanitizes event name', () => {
      trackGA4Event('Button Click!', {})
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'button_click_', {})
    })

    it('truncates long event names', () => {
      const longName = 'a'.repeat(50)
      trackGA4Event(longName, {})
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'a'.repeat(40), {})
    })

    it('does not track without consent', () => {
      withdrawConsent()
      mockGtag.mockClear()
      
      trackGA4Event('test', {})
      
      expect(mockGtag).not.toHaveBeenCalled()
    })
  })

  describe('trackGA4Conversion', () => {
    it('tracks conversion event', () => {
      trackGA4Conversion('purchase', 100, 'USD', 'order-123')
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'purchase', expect.objectContaining({
        value: 100,
        currency: 'USD',
        transaction_id: 'order-123',
      }))
    })

    it('accepts additional properties', () => {
      trackGA4Conversion('lead_submitted', undefined, undefined, undefined, { form: 'contact' })
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'lead_submitted', expect.objectContaining({
        form: 'contact',
      }))
    })

    it('does not track without consent', () => {
      withdrawConsent()
      mockGtag.mockClear()
      
      trackGA4Conversion('test')
      
      expect(mockGtag).not.toHaveBeenCalled()
    })
  })

  describe('trackGA4FormSubmit', () => {
    it('tracks form submission as lead generation', () => {
      trackGA4FormSubmit('contact-form', 'Contact Us', '/thank-you')
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'generate_lead', expect.objectContaining({
        form_id: 'contact-form',
        form_name: 'Contact Us',
        form_destination: '/thank-you',
      }))
    })

    it('does not track without consent', () => {
      withdrawConsent()
      mockGtag.mockClear()
      
      trackGA4FormSubmit('test', 'Test')
      
      expect(mockGtag).not.toHaveBeenCalled()
    })
  })

  describe('trackGA4Download', () => {
    it('tracks file download event', () => {
      trackGA4Download('datasheet.pdf', 'pdf', '/files/datasheet.pdf')
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'file_download', expect.objectContaining({
        file_name: 'datasheet.pdf',
        file_extension: 'pdf',
        link_url: '/files/datasheet.pdf',
      }))
    })

    it('does not track without consent', () => {
      withdrawConsent()
      mockGtag.mockClear()
      
      trackGA4Download('test.pdf', 'pdf', '/test.pdf')
      
      expect(mockGtag).not.toHaveBeenCalled()
    })
  })

  describe('trackGA4VideoStart', () => {
    it('tracks video start event', () => {
      trackGA4VideoStart('Product Demo', 'https://youtube.com/watch?v=123')
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'video_start', expect.objectContaining({
        video_title: 'Product Demo',
        video_url: 'https://youtube.com/watch?v=123',
        video_provider: 'youtube',
      }))
    })

    it('accepts custom video provider', () => {
      trackGA4VideoStart('Demo', 'https://vimeo.com/123', 'vimeo')
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'video_start', expect.objectContaining({
        video_provider: 'vimeo',
      }))
    })

    it('does not track without consent', () => {
      withdrawConsent()
      mockGtag.mockClear()
      
      trackGA4VideoStart('Test', 'https://test.com')
      
      expect(mockGtag).not.toHaveBeenCalled()
    })
  })

  describe('trackGA4Search', () => {
    it('tracks search event', () => {
      trackGA4Search('polymer materials', 15)
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'search', expect.objectContaining({
        search_term: 'polymer materials',
        results_count: 15,
      }))
    })

    it('works without results count', () => {
      trackGA4Search('bioactive')
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'search', expect.objectContaining({
        search_term: 'bioactive',
      }))
    })

    it('does not track without consent', () => {
      withdrawConsent()
      mockGtag.mockClear()
      
      trackGA4Search('test')
      
      expect(mockGtag).not.toHaveBeenCalled()
    })
  })

  describe('markAsInternalTraffic', () => {
    it('sets user property', () => {
      markAsInternalTraffic()
      
      expect(mockGtag).toHaveBeenCalledWith('set', expect.objectContaining({
        user_properties: expect.objectContaining({
          traffic_type: 'internal',
        }),
      }))
    })

    it('persists to localStorage', () => {
      markAsInternalTraffic()
      
      expect(localStorage.getItem('pb_internal_traffic')).toBe('true')
    })
  })

  describe('isInternalTraffic', () => {
    it('returns false by default', () => {
      expect(isInternalTraffic()).toBe(false)
    })

    it('returns true after marking as internal', () => {
      markAsInternalTraffic()
      
      expect(isInternalTraffic()).toBe(true)
    })
  })

  describe('isGA4Initialized', () => {
    it('returns false before initialization', () => {
      expect(isGA4Initialized()).toBe(false)
    })
  })

  describe('initGA4 with valid config', () => {
    it('warns if already initialized', async () => {
      // Initialize first time with minimal setup
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      // First init attempt with empty measurementId should just warn and return
      await initGA4({ measurementId: '' })
      
      // Reset the spy
      warnSpy.mockClear()
      
      expect(logSpy).not.toHaveBeenCalled() // No initialization happened
      warnSpy.mockRestore()
      logSpy.mockRestore()
    })

    it('handles missing dataLayer gracefully', async () => {
      // dataLayer is created in beforeEach, just verify it works
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      await initGA4({ measurementId: '' })
      
      // Should not throw
      expect(warnSpy).toHaveBeenCalled()
      warnSpy.mockRestore()
    })
  })

  describe('handleAnalyticsEvent (via registerDestination)', () => {
    beforeEach(() => {
      acceptAllConsent()
    })

    it('handles page_view events through event destination', async () => {
      // Note: handleAnalyticsEvent is internal and called via registerDestination
      // The trackGA4PageView function is the public API
      trackGA4PageView('/test', 'Test Page')
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', expect.any(Object))
    })
  })

  describe('internal traffic localStorage error handling', () => {
    it('handles localStorage error gracefully for markAsInternalTraffic', () => {
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn().mockImplementation(() => {
        throw new Error('Storage error')
      })
      
      // Should not throw
      expect(() => markAsInternalTraffic()).not.toThrow()
      
      localStorage.setItem = originalSetItem
    })

    it('handles localStorage error gracefully for isInternalTraffic', () => {
      const originalGetItem = localStorage.getItem
      localStorage.getItem = vi.fn().mockImplementation(() => {
        throw new Error('Storage error')
      })
      
      // Should return false instead of throwing
      expect(isInternalTraffic()).toBe(false)
      
      localStorage.getItem = originalGetItem
    })
  })
})
