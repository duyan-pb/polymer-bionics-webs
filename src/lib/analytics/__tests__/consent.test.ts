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
  })
})
