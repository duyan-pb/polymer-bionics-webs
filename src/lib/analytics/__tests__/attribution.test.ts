/**
 * UTM Attribution Tests (Epic 8)
 */

import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import {
  captureUTM,
  getUTM,
  clearUTM,
  hasUTMInURL,
  getUTMForEvent,
} from '../attribution'

// Create a mock location object that we can modify
const createMockLocation = () => ({
  href: 'https://polymerbionics.com/products',
  pathname: '/products',
  search: '',
  hash: '',
  origin: 'https://polymerbionics.com',
  protocol: 'https:',
  host: 'polymerbionics.com',
  hostname: 'polymerbionics.com',
  port: '',
})

// Store the original location
const originalLocation = window.location

// Mock location for tests
let mockLocation = createMockLocation()

describe('UTM Attribution', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    mockLocation = createMockLocation()
    // Override window.location with our mock
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
      configurable: true,
    })
  })

  afterAll(() => {
    // Restore original location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    })
  })

  describe('hasUTMInURL', () => {
    it('returns false when no UTM params', () => {
      mockLocation.search = ''
      
      expect(hasUTMInURL()).toBe(false)
    })

    it('returns true when utm_source present', () => {
      mockLocation.search = '?utm_source=google'
      
      expect(hasUTMInURL()).toBe(true)
    })

    it('returns true when utm_medium present', () => {
      mockLocation.search = '?utm_medium=cpc'
      
      expect(hasUTMInURL()).toBe(true)
    })

    it('returns true when utm_campaign present', () => {
      mockLocation.search = '?utm_campaign=spring_sale'
      
      expect(hasUTMInURL()).toBe(true)
    })

    it('returns true when multiple UTM params present', () => {
      mockLocation.search = '?utm_source=google&utm_medium=cpc&utm_campaign=test'
      
      expect(hasUTMInURL()).toBe(true)
    })
  })

  describe('captureUTM', () => {
    describe('first-touch policy', () => {
      it('captures UTM on first visit', () => {
        mockLocation.search = '?utm_source=google&utm_medium=cpc'
        
        const utm = captureUTM('first-touch')
        
        expect(utm).toBeTruthy()
        expect(utm?.utm_source).toBe('google')
        expect(utm?.utm_medium).toBe('cpc')
      })

      it('preserves first UTM on subsequent visits', () => {
        mockLocation.search = '?utm_source=google'
        captureUTM('first-touch')
        
        mockLocation.search = '?utm_source=facebook'
        const utm = captureUTM('first-touch')
        
        expect(utm?.utm_source).toBe('google')
      })

      it('returns stored UTM when no new UTM in URL', () => {
        mockLocation.search = '?utm_source=google'
        captureUTM('first-touch')
        
        mockLocation.search = ''
        const utm = captureUTM('first-touch')
        
        expect(utm?.utm_source).toBe('google')
      })

      it('stores to localStorage', () => {
        mockLocation.search = '?utm_source=google'
        captureUTM('first-touch')
        
        const stored = localStorage.getItem('pb_utm')
        expect(stored).toBeTruthy()
        const parsed = JSON.parse(stored!)
        expect(parsed.params.utm_source).toBe('google')
      })
    })

    describe('last-touch policy', () => {
      it('overwrites UTM with new values', () => {
        mockLocation.search = '?utm_source=google'
        captureUTM('last-touch')
        
        mockLocation.search = '?utm_source=facebook'
        const utm = captureUTM('last-touch')
        
        expect(utm?.utm_source).toBe('facebook')
      })

      it('preserves existing when no new UTM', () => {
        mockLocation.search = '?utm_source=google'
        captureUTM('last-touch')
        
        mockLocation.search = ''
        const utm = captureUTM('last-touch')
        
        expect(utm?.utm_source).toBe('google')
      })
    })

    describe('session policy', () => {
      it('stores to sessionStorage', () => {
        mockLocation.search = '?utm_source=google'
        captureUTM('session')
        
        const stored = sessionStorage.getItem('pb_utm')
        expect(stored).toBeTruthy()
      })

      it('does not persist to localStorage', () => {
        mockLocation.search = '?utm_source=google'
        captureUTM('session')
        
        const stored = localStorage.getItem('pb_utm')
        expect(stored).toBe(null)
      })

      it('returns existing session UTM when no new URL params', () => {
        // First capture with UTM
        mockLocation.search = '?utm_source=google'
        captureUTM('session')
        
        // Now call without UTM in URL
        mockLocation.search = ''
        const result = captureUTM('session')
        
        expect(result?.utm_source).toBe('google')
      })
    })

    it('captures all UTM parameters', () => {
      mockLocation.search = '?utm_source=google&utm_medium=cpc&utm_campaign=spring&utm_term=polymer&utm_content=ad1'
      
      const utm = captureUTM('first-touch')
      
      expect(utm?.utm_source).toBe('google')
      expect(utm?.utm_medium).toBe('cpc')
      expect(utm?.utm_campaign).toBe('spring')
      expect(utm?.utm_term).toBe('polymer')
      expect(utm?.utm_content).toBe('ad1')
    })

    it('captures landing page', () => {
      mockLocation.search = '?utm_source=google'
      mockLocation.href = 'https://example.com/products?utm_source=google'
      
      const utm = captureUTM('first-touch')
      
      expect(utm?.landing_page).toBeTruthy()
    })

    it('returns null when no UTM and none stored', () => {
      mockLocation.search = ''
      
      const utm = captureUTM('first-touch')
      
      expect(utm).toBe(null)
    })
  })

  describe('getUTM', () => {
    it('returns stored UTM', () => {
      mockLocation.search = '?utm_source=google'
      captureUTM('first-touch')
      mockLocation.search = ''
      
      const utm = getUTM()
      
      expect(utm?.utm_source).toBe('google')
    })

    it('returns null when no UTM stored', () => {
      const utm = getUTM()
      
      expect(utm).toBe(null)
    })

    it('checks sessionStorage first', () => {
      // Set different values in both storages
      localStorage.setItem('pb_utm', JSON.stringify({
        params: { utm_source: 'local' },
        capturedAt: new Date().toISOString(),
        landingPage: '',
        referrer: '',
        type: 'first-touch',
      }))
      sessionStorage.setItem('pb_utm', JSON.stringify({
        params: { utm_source: 'session' },
        capturedAt: new Date().toISOString(),
        landingPage: '',
        referrer: '',
        type: 'session',
      }))
      
      const utm = getUTM()
      
      expect(utm?.utm_source).toBe('session')
    })
  })

  describe('clearUTM', () => {
    it('removes UTM from localStorage', () => {
      mockLocation.search = '?utm_source=google'
      captureUTM('first-touch')
      
      clearUTM()
      
      expect(localStorage.getItem('pb_utm')).toBe(null)
    })

    it('removes UTM from sessionStorage', () => {
      mockLocation.search = '?utm_source=google'
      captureUTM('session')
      
      clearUTM()
      
      expect(sessionStorage.getItem('pb_utm')).toBe(null)
    })

    it('getUTM returns null after clear', () => {
      mockLocation.search = '?utm_source=google'
      captureUTM('first-touch')
      
      clearUTM()
      
      expect(getUTM()).toBe(null)
    })
  })

  describe('getUTMForEvent', () => {
    it('returns empty object when no UTM', () => {
      const utm = getUTMForEvent()
      
      expect(utm).toEqual({})
    })

    it('returns UTM parameters for event attachment', () => {
      mockLocation.search = '?utm_source=google&utm_medium=cpc'
      captureUTM('first-touch')
      
      const utm = getUTMForEvent()
      
      expect(utm.utm_source).toBe('google')
      expect(utm.utm_medium).toBe('cpc')
    })

    it('excludes metadata fields', () => {
      mockLocation.search = '?utm_source=google'
      captureUTM('first-touch')
      
      const utm = getUTMForEvent()
      
      expect(utm).not.toHaveProperty('captured_at')
      expect(utm).not.toHaveProperty('landing_page')
      expect(utm).not.toHaveProperty('referrer')
    })
  })
})
