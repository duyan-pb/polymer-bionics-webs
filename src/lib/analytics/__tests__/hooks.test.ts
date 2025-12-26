/**
 * Analytics React Hooks Tests (Epic 3)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import {
  useConsent,
  useAnalytics,
  usePageTracking,
  useAnalyticsInit,
  useTrackEvent,
  useConversionTracking,
} from '../hooks'
import { acceptAllConsent, withdrawConsent, getConsentState } from '../consent'

// Mock the tracker module
vi.mock('../tracker', () => ({
  analytics: {
    track: vi.fn(),
    page: vi.fn(),
    conversion: vi.fn(() => true),
    trackOnce: vi.fn(),
    hasFired: vi.fn(() => false),
  },
  initAnalytics: vi.fn(),
}))

describe('Analytics Hooks', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
  })

  describe('useConsent', () => {
    it('returns initial consent state', () => {
      const { result } = renderHook(() => useConsent())
      
      expect(result.current.consent).toBeDefined()
      expect(typeof result.current.hasInteracted).toBe('boolean')
    })

    it('returns shouldShowBanner based on hasInteracted', () => {
      const { result } = renderHook(() => useConsent())
      
      // Initially not interacted, should show banner
      expect(result.current.shouldShowBanner).toBe(!result.current.hasInteracted)
    })

    it('provides acceptAll function that updates state', () => {
      const { result } = renderHook(() => useConsent())
      
      act(() => {
        result.current.acceptAll()
      })
      
      // Check the underlying consent state was updated
      const consent = getConsentState()
      expect(consent.choices.analytics).toBe(true)
      expect(consent.hasInteracted).toBe(true)
    })

    it('provides acceptNecessary function that updates state', () => {
      const { result } = renderHook(() => useConsent())
      
      act(() => {
        result.current.acceptNecessary()
      })
      
      const consent = getConsentState()
      expect(consent.choices.necessary).toBe(true)
      expect(consent.choices.analytics).toBe(false)
      expect(consent.hasInteracted).toBe(true)
    })

    it('provides withdraw function', () => {
      // First accept all
      acceptAllConsent()
      
      const { result } = renderHook(() => useConsent())
      
      act(() => {
        result.current.withdraw()
      })
      
      const consent = getConsentState()
      expect(consent.choices.analytics).toBe(false)
    })

    it('provides canTrack function', () => {
      acceptAllConsent()
      const { result } = renderHook(() => useConsent())
      
      expect(typeof result.current.canTrack).toBe('function')
      expect(result.current.canTrack('analytics')).toBe(true)
    })

    it('manages preferences modal state', () => {
      const { result } = renderHook(() => useConsent())
      
      expect(result.current.isPreferencesOpen).toBe(false)
      
      act(() => {
        result.current.openPreferences()
      })
      
      expect(result.current.isPreferencesOpen).toBe(true)
      
      act(() => {
        result.current.closePreferences()
      })
      
      expect(result.current.isPreferencesOpen).toBe(false)
    })

    it('provides updateCategories function', () => {
      const { result } = renderHook(() => useConsent())
      
      act(() => {
        result.current.updateCategories({ analytics: true, marketing: false })
      })
      
      const consent = getConsentState()
      expect(consent.choices.analytics).toBe(true)
      expect(consent.choices.marketing).toBe(false)
    })
  })

  describe('useAnalytics', () => {
    beforeEach(() => {
      acceptAllConsent()
    })

    it('provides track function', () => {
      const { result } = renderHook(() => useAnalytics())
      
      expect(typeof result.current.track).toBe('function')
    })

    it('provides page function', () => {
      const { result } = renderHook(() => useAnalytics())
      
      expect(typeof result.current.page).toBe('function')
    })

    it('provides conversion function', () => {
      const { result } = renderHook(() => useAnalytics())
      
      expect(typeof result.current.conversion).toBe('function')
    })

    it('provides trackOnce function', () => {
      const { result } = renderHook(() => useAnalytics())
      
      expect(typeof result.current.trackOnce).toBe('function')
    })

    it('reflects isEnabled state based on consent', () => {
      withdrawConsent()
      const { result } = renderHook(() => useAnalytics())
      
      expect(result.current.isEnabled).toBe(false)
    })

    it('updates isEnabled when consent changes', async () => {
      withdrawConsent()
      const { result } = renderHook(() => useAnalytics())
      
      expect(result.current.isEnabled).toBe(false)
      
      act(() => {
        acceptAllConsent()
        // Dispatch consent event
        window.dispatchEvent(new Event('consent-changed'))
      })
      
      await waitFor(() => {
        expect(result.current.isEnabled).toBe(true)
      })
    })
  })

  describe('usePageTracking', () => {
    beforeEach(() => {
      acceptAllConsent()
    })

    it('tracks page view on mount', async () => {
      const { analytics } = await import('../tracker')
      
      renderHook(() => usePageTracking('products'))
      
      expect(analytics.page).toHaveBeenCalledWith('products')
    })

    it('tracks page view when page name changes', async () => {
      const { analytics } = await import('../tracker')
      
      const { rerender } = renderHook(
        ({ pageName }) => usePageTracking(pageName),
        { initialProps: { pageName: 'home' } }
      )
      
      expect(analytics.page).toHaveBeenCalledWith('home')
      
      rerender({ pageName: 'products' })
      
      expect(analytics.page).toHaveBeenCalledWith('products')
    })
  })

  describe('useAnalyticsInit', () => {
    it('initializes analytics on mount', async () => {
      const { initAnalytics } = await import('../tracker')
      
      renderHook(() => useAnalyticsInit())
      
      expect(initAnalytics).toHaveBeenCalled()
    })

    it('only initializes once', async () => {
      const { initAnalytics } = await import('../tracker')
      
      const { rerender } = renderHook(() => useAnalyticsInit())
      
      rerender()
      rerender()
      
      expect(initAnalytics).toHaveBeenCalledTimes(1)
    })
  })

  describe('useTrackEvent', () => {
    beforeEach(() => {
      acceptAllConsent()
    })

    it('returns a stable callback', async () => {
      const { result, rerender } = renderHook(() => 
        useTrackEvent('button_clicked')
      )
      
      const firstCallback = result.current
      
      rerender()
      
      expect(result.current).toBe(firstCallback)
    })

    it('tracks event when called', async () => {
      const { analytics } = await import('../tracker')
      
      const { result } = renderHook(() => useTrackEvent('button_clicked'))
      
      act(() => {
        result.current({ button_id: 'submit' })
      })
      
      expect(analytics.track).toHaveBeenCalledWith('button_clicked', { button_id: 'submit' })
    })

    it('works without additional props', async () => {
      const { analytics } = await import('../tracker')
      
      const { result } = renderHook(() => useTrackEvent('button_clicked'))
      
      act(() => {
        result.current()
      })
      
      expect(analytics.track).toHaveBeenCalledWith('button_clicked', {})
    })
  })

  describe('useConversionTracking', () => {
    beforeEach(() => {
      acceptAllConsent()
    })

    it('returns trackConversion function', () => {
      const { result } = renderHook(() => useConversionTracking('lead_submitted'))
      
      expect(typeof result.current.trackConversion).toBe('function')
    })

    it('returns hasConverted state', () => {
      const { result } = renderHook(() => useConversionTracking('lead_submitted'))
      
      expect(typeof result.current.hasConverted).toBe('boolean')
    })

    it('tracks conversion when called', async () => {
      const { analytics } = await import('../tracker')
      
      const { result } = renderHook(() => useConversionTracking('lead_submitted'))
      
      act(() => {
        result.current.trackConversion({ lead_type: 'contact' })
      })
      
      expect(analytics.conversion).toHaveBeenCalled()
    })

    it('updates hasConverted after successful conversion', () => {
      const { result } = renderHook(() => useConversionTracking('lead_submitted'))
      
      expect(result.current.hasConverted).toBe(false)
      
      act(() => {
        result.current.trackConversion()
      })
      
      expect(result.current.hasConverted).toBe(true)
    })
  })
})
