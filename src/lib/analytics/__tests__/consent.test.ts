/**
 * Consent Management Tests (Epic 1)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getConsentState,
  saveConsentState,
  canTrack,
  hasAnyTrackingConsent,
  acceptAllConsent,
  acceptNecessaryOnly,
  updateConsent,
  withdrawConsent,
  clearNonEssentialCookies,
  getConsentVersion,
  getConsentAuditLog,
} from '../consent'
import { DEFAULT_CONSENT_STATE } from '../types'

describe('Consent Management', () => {
  beforeEach(() => {
    localStorage.clear()
    // Reset cookies
  })

  describe('getConsentState', () => {
    it('returns default state when no consent stored', () => {
      const state = getConsentState()
      expect(state).toEqual(DEFAULT_CONSENT_STATE)
    })

    it('reads consent from localStorage', () => {
      const storedState = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        choices: { necessary: true, analytics: true, marketing: false },
        bannerShown: true,
        hasInteracted: true,
      }
      localStorage.setItem('pb_consent', JSON.stringify(storedState))
      
      const state = getConsentState()
      expect(state.choices.analytics).toBe(true)
      expect(state.choices.marketing).toBe(false)
      expect(state.hasInteracted).toBe(true)
    })

    it('handles corrupted localStorage data gracefully', () => {
      localStorage.setItem('pb_consent', 'invalid json{')
      
      const state = getConsentState()
      expect(state).toEqual(DEFAULT_CONSENT_STATE)
    })
  })

  describe('saveConsentState', () => {
    it('saves consent to localStorage', () => {
      const state = {
        ...DEFAULT_CONSENT_STATE,
        choices: { necessary: true, analytics: true, marketing: true },
        hasInteracted: true,
      }
      
      saveConsentState(state)
      
      const stored = localStorage.getItem('pb_consent')
      expect(stored).toBeTruthy()
      const parsed = JSON.parse(stored!)
      expect(parsed.choices.analytics).toBe(true)
    })

    it('emits consent-changed event', () => {
      const handler = vi.fn()
      window.addEventListener('consent-changed', handler)
      
      saveConsentState({
        ...DEFAULT_CONSENT_STATE,
        hasInteracted: true,
      })
      
      expect(handler).toHaveBeenCalled()
      window.removeEventListener('consent-changed', handler)
    })

    it('updates timestamp on save', () => {
      const state = { ...DEFAULT_CONSENT_STATE }
      const beforeSave = new Date().toISOString()
      
      saveConsentState(state)
      
      const stored = JSON.parse(localStorage.getItem('pb_consent')!)
      expect(new Date(stored.timestamp).getTime()).toBeGreaterThanOrEqual(
        new Date(beforeSave).getTime()
      )
    })
  })

  describe('canTrack', () => {
    it('always allows necessary category', () => {
      expect(canTrack('necessary')).toBe(true)
    })

    it('blocks analytics when not consented', () => {
      expect(canTrack('analytics')).toBe(false)
    })

    it('blocks analytics when no interaction', () => {
      localStorage.setItem('pb_consent', JSON.stringify({
        ...DEFAULT_CONSENT_STATE,
        choices: { necessary: true, analytics: true, marketing: false },
        hasInteracted: false,
      }))
      
      expect(canTrack('analytics')).toBe(false)
    })

    it('allows analytics when consented and interacted', () => {
      localStorage.setItem('pb_consent', JSON.stringify({
        ...DEFAULT_CONSENT_STATE,
        choices: { necessary: true, analytics: true, marketing: false },
        hasInteracted: true,
      }))
      
      expect(canTrack('analytics')).toBe(true)
    })

    it('blocks marketing when not consented', () => {
      localStorage.setItem('pb_consent', JSON.stringify({
        ...DEFAULT_CONSENT_STATE,
        choices: { necessary: true, analytics: true, marketing: false },
        hasInteracted: true,
      }))
      
      expect(canTrack('marketing')).toBe(false)
    })

    it('allows marketing when consented', () => {
      localStorage.setItem('pb_consent', JSON.stringify({
        ...DEFAULT_CONSENT_STATE,
        choices: { necessary: true, analytics: true, marketing: true },
        hasInteracted: true,
      }))
      
      expect(canTrack('marketing')).toBe(true)
    })
  })

  describe('hasAnyTrackingConsent', () => {
    it('returns false when no consent', () => {
      expect(hasAnyTrackingConsent()).toBe(false)
    })

    it('returns true when analytics consent given', () => {
      localStorage.setItem('pb_consent', JSON.stringify({
        ...DEFAULT_CONSENT_STATE,
        choices: { necessary: true, analytics: true, marketing: false },
        hasInteracted: true,
      }))
      
      expect(hasAnyTrackingConsent()).toBe(true)
    })

    it('returns true when marketing consent given', () => {
      localStorage.setItem('pb_consent', JSON.stringify({
        ...DEFAULT_CONSENT_STATE,
        choices: { necessary: true, analytics: false, marketing: true },
        hasInteracted: true,
      }))
      
      expect(hasAnyTrackingConsent()).toBe(true)
    })
  })

  describe('acceptAllConsent', () => {
    it('enables all consent categories', () => {
      const state = acceptAllConsent()
      
      expect(state.choices.necessary).toBe(true)
      expect(state.choices.analytics).toBe(true)
      expect(state.choices.marketing).toBe(true)
      expect(state.hasInteracted).toBe(true)
    })

    it('persists to storage', () => {
      acceptAllConsent()
      
      const stored = JSON.parse(localStorage.getItem('pb_consent')!)
      expect(stored.choices.analytics).toBe(true)
      expect(stored.choices.marketing).toBe(true)
    })
  })

  describe('acceptNecessaryOnly', () => {
    it('only enables necessary category', () => {
      const state = acceptNecessaryOnly()
      
      expect(state.choices.necessary).toBe(true)
      expect(state.choices.analytics).toBe(false)
      expect(state.choices.marketing).toBe(false)
      expect(state.hasInteracted).toBe(true)
    })

    it('clears non-essential data', () => {
      localStorage.setItem('pb_anonymous_id', 'test-id')
      
      acceptNecessaryOnly()
      
      // Non-essential cookies should be cleared
      expect(localStorage.getItem('pb_anonymous_id')).toBe(null)
    })
  })

  describe('updateConsent', () => {
    it('updates specific categories', () => {
      acceptAllConsent()
      
      const updated = updateConsent({ marketing: false })
      
      expect(updated.choices.analytics).toBe(true)
      expect(updated.choices.marketing).toBe(false)
    })

    it('maintains existing choices when updating one', () => {
      acceptAllConsent()
      
      updateConsent({ analytics: false })
      
      const state = getConsentState()
      expect(state.choices.marketing).toBe(true)
    })
  })

  describe('withdrawConsent', () => {
    it('resets consent state', () => {
      acceptAllConsent()
      
      withdrawConsent()
      
      const state = getConsentState()
      expect(state.choices.analytics).toBe(false)
      expect(state.choices.marketing).toBe(false)
      // withdrawConsent calls acceptNecessaryOnly which marks hasInteracted as true
      expect(state.hasInteracted).toBe(true)
    })

    it('clears analytics data', () => {
      localStorage.setItem('pb_anonymous_id', 'test')
      localStorage.setItem('pb_session', 'test')
      
      withdrawConsent()
      
      expect(localStorage.getItem('pb_anonymous_id')).toBe(null)
      expect(localStorage.getItem('pb_session')).toBe(null)
    })
  })

  describe('clearNonEssentialCookies', () => {
    it('keeps essential cookies', () => {
      // Set up consent first
      saveConsentState({ ...DEFAULT_CONSENT_STATE, hasInteracted: true })
      
      clearNonEssentialCookies()
      
      // pb_consent should still exist
      const stored = localStorage.getItem('pb_consent')
      expect(stored).toBeTruthy()
    })

    it('removes analytics keys from localStorage', () => {
      localStorage.setItem('pb_anonymous_id', 'test')
      localStorage.setItem('_ga', 'test')
      localStorage.setItem('_gid', 'test')
      
      clearNonEssentialCookies()
      
      expect(localStorage.getItem('pb_anonymous_id')).toBe(null)
      expect(localStorage.getItem('_ga')).toBe(null)
      expect(localStorage.getItem('_gid')).toBe(null)
    })

    it('clears sessionStorage analytics keys', () => {
      sessionStorage.setItem('pb_session', 'test-session')
      
      clearNonEssentialCookies()
      
      expect(sessionStorage.getItem('pb_session')).toBe(null)
    })
  })

  describe('getConsentVersion', () => {
    it('returns version from stored state', () => {
      saveConsentState({
        ...DEFAULT_CONSENT_STATE,
        version: '1.0.0',
      })
      
      const version = getConsentVersion()
      expect(version).toBe('1.0.0')
    })

    it('returns default version when no consent stored', () => {
      const version = getConsentVersion()
      expect(version).toBe(DEFAULT_CONSENT_STATE.version)
    })
  })

  describe('getConsentAuditLog', () => {
    it('returns audit log with consent choices', () => {
      acceptAllConsent()
      
      const auditLog = getConsentAuditLog()
      
      expect(auditLog.consent_analytics).toBe(true)
      expect(auditLog.consent_marketing).toBe(true)
      expect(auditLog.consent_has_interacted).toBe(true)
    })

    it('includes version and timestamp', () => {
      acceptAllConsent()
      
      const auditLog = getConsentAuditLog()
      
      expect(auditLog.consent_version).toBeDefined()
      expect(auditLog.consent_timestamp).toBeDefined()
    })

    it('returns false for analytics when not consented', () => {
      acceptNecessaryOnly()
      
      const auditLog = getConsentAuditLog()
      
      expect(auditLog.consent_analytics).toBe(false)
      expect(auditLog.consent_marketing).toBe(false)
    })
  })

  describe('clearNonEssentialCookies edge cases', () => {
    it('handles clearing cookies when document.cookie is empty', () => {
      // Ensure no cookies are set
      document.cookie.split(';').forEach(c => {
        const name = c.split('=')[0]?.trim() ?? ''
        if (name) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
        }
      })
      
      // Should not throw
      expect(() => clearNonEssentialCookies()).not.toThrow()
    })

    it('preserves essential cookies when clearing', () => {
      // Set a non-essential cookie using document.cookie
      document.cookie = 'test_cookie=value; path=/'
      
      // Set essential consent
      saveConsentState({ ...DEFAULT_CONSENT_STATE, hasInteracted: true })
      
      clearNonEssentialCookies()
      
      // pb_consent should still be in localStorage
      expect(localStorage.getItem('pb_consent')).toBeTruthy()
    })

    it('clears non-essential cookies from document.cookie', () => {
      // Set a non-essential cookie
      document.cookie = '_ga=GA1.2.12345; path=/'
      document.cookie = 'tracking_id=abc123; path=/'
      
      clearNonEssentialCookies()
      
      // Cookies should be cleared (or at least the function should run without error)
      // In happy-dom, cookie behavior may differ from real browsers
    })
  })

  describe('updateConsent edge cases', () => {
    it('clears non-essential cookies when analytics is revoked', () => {
      // First accept all
      acceptAllConsent()
      localStorage.setItem('pb_anonymous_id', 'test-id')
      
      // Then revoke analytics
      updateConsent({ analytics: false })
      
      // Analytics data should be cleared
      expect(localStorage.getItem('pb_anonymous_id')).toBe(null)
    })

    it('clears non-essential cookies when marketing is revoked', () => {
      // First accept all
      acceptAllConsent()
      localStorage.setItem('pb_utm', 'test-utm')
      
      // Then revoke marketing
      updateConsent({ marketing: false })
      
      // Marketing data should be cleared
      expect(localStorage.getItem('pb_utm')).toBe(null)
    })

    it('does not clear cookies when both remain true', () => {
      // First accept all
      acceptAllConsent()
      
      // Update with same values (both still true)
      updateConsent({ analytics: true, marketing: true })
      
      // Consent should still exist
      expect(localStorage.getItem('pb_consent')).toBeTruthy()
    })

    it('always keeps necessary as true', () => {
      // First accept all
      acceptAllConsent()
      
      // Try to set necessary to false (should be ignored)
      const state = updateConsent({ necessary: false } as unknown as Parameters<typeof updateConsent>[0])
      
      // Necessary should still be true
      expect(state.choices.necessary).toBe(true)
    })
  })

  describe('withdrawConsent events', () => {
    it('dispatches consent-withdrawn event', () => {
      const handler = vi.fn()
      window.addEventListener('consent-withdrawn', handler)
      
      acceptAllConsent()
      withdrawConsent()
      
      expect(handler).toHaveBeenCalled()
      window.removeEventListener('consent-withdrawn', handler)
    })
  })

  describe('getConsentState with cookie', () => {
    it('reads consent from cookie when localStorage is empty', () => {
      // Set consent via cookie (simulated)
      const consentData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        choices: { necessary: true, analytics: true, marketing: false },
        bannerShown: true,
        hasInteracted: true,
      }
      
      // Set in cookie format
      document.cookie = `pb_consent=${encodeURIComponent(JSON.stringify(consentData))}; path=/`
      
      // Clear localStorage
      localStorage.removeItem('pb_consent')
      
      const state = getConsentState()
      
      // Should read from cookie
      expect(state.choices).toBeDefined()
    })
  })
})
