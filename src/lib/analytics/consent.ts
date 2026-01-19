/**
 * Consent Management Module (Epic 1)
 * 
 * Handles consent state persistence, validation, and the canTrack() gate API.
 * All analytics/marketing beacons must check canTrack() before firing.
 */

import { DEFAULT_CONSENT_STATE, type ConsentState, type ConsentCategory } from './types'

// =============================================================================
// CONSTANTS
// =============================================================================

const CONSENT_COOKIE_NAME = 'pb_consent'
const CONSENT_VERSION = '1.0.0'

// =============================================================================
// STORAGE AVAILABILITY CHECK
// =============================================================================

/**
 * Check if localStorage is available and working
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Check if cookies are available
 */
function areCookiesAvailable(): boolean {
  try {
    return typeof document !== 'undefined' && typeof document.cookie === 'string'
  } catch {
    return false
  }
}

// In-memory fallback for when storage is unavailable
let inMemoryConsentState: ConsentState | null = null

// =============================================================================
// STORAGE
// =============================================================================

/**
 * Get consent state from storage
 */
export function getConsentState(): ConsentState {
  // Return in-memory state if storage failed previously
  if (inMemoryConsentState !== null) {
    return { ...inMemoryConsentState }
  }

  try {
    // Try cookie first (works across subdomains)
    if (areCookiesAvailable()) {
      const cookieValue = getCookie(CONSENT_COOKIE_NAME)
      if (cookieValue) {
        const parsed = JSON.parse(decodeURIComponent(cookieValue))
        return migrateConsentState(parsed)
      }
    }
    
    // Fallback to localStorage
    if (isLocalStorageAvailable()) {
      const stored = localStorage.getItem(CONSENT_COOKIE_NAME)
      if (stored) {
        const parsed = JSON.parse(stored)
        return migrateConsentState(parsed)
      }
    }
  } catch (error) {
    console.warn('[Consent] Failed to read consent state:', error)
  }
  
  return { ...DEFAULT_CONSENT_STATE }
}

/**
 * Save consent state to storage
 */
export function saveConsentState(state: ConsentState): void {
  const stateToSave: ConsentState = {
    ...state,
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
  }

  // Always save to in-memory as fallback
  inMemoryConsentState = stateToSave

  try {
    const serialized = JSON.stringify(stateToSave)
    
    // Save to cookie (365 days, secure, SameSite=Lax)
    if (areCookiesAvailable()) {
      setCookie(CONSENT_COOKIE_NAME, encodeURIComponent(serialized), 365)
    }
    
    // Also save to localStorage as backup
    if (isLocalStorageAvailable()) {
      localStorage.setItem(CONSENT_COOKIE_NAME, serialized)
    }
    
    // Emit custom event for other parts of the app
    window.dispatchEvent(new CustomEvent('consent-changed', { detail: stateToSave }))
    
  } catch (error) {
    console.error('[Consent] Failed to save consent state:', error)
  }
}

/**
 * Clear all non-essential cookies when consent is withdrawn
 */
export function clearNonEssentialCookies(): void {
  const essentialCookies = [CONSENT_COOKIE_NAME, 'pb-theme']
  
  try {
    if (areCookiesAvailable()) {
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0]?.trim() ?? ''
        if (name && !essentialCookies.includes(name)) {
          // Clear cookie by setting expiry to past
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`
        }
      })
    }
  } catch (error) {
    console.warn('[Consent] Failed to clear cookies:', error)
  }
  
  // Clear analytics-related localStorage items
  if (isLocalStorageAvailable()) {
    const analyticsKeys = ['pb_anonymous_id', 'pb_session', 'pb_utm', '_ga', '_gid']
    analyticsKeys.forEach(key => {
      try {
        localStorage.removeItem(key)
        sessionStorage.removeItem(key)
      } catch {
        // Ignore errors
      }
    })
  }
}

// =============================================================================
// CONSENT GATE API (Task 1.2)
// =============================================================================

/**
 * Check if tracking is allowed for a given category.
 * This is the SINGLE gate that all tracking code must use.
 * 
 * @param category - The consent category to check
 * @returns true if tracking is allowed, false otherwise
 * 
 * @example
 * if (canTrack('analytics')) {
 *   gtag('event', 'page_view', { ... })
 * }
 */
export function canTrack(category: ConsentCategory): boolean {
  // Necessary is always allowed
  if (category === 'necessary') {
    return true
  }
  
  const state = getConsentState()
  
  // Must have explicitly interacted with consent banner
  if (!state.hasInteracted) {
    return false
  }
  
  return state.choices[category] === true
}

/**
 * Check if any non-necessary tracking is allowed
 */
export function hasAnyTrackingConsent(): boolean {
  return canTrack('analytics') || canTrack('marketing')
}

/**
 * Get current consent version for audit trail
 */
export function getConsentVersion(): string {
  const state = getConsentState()
  return state.version
}

// =============================================================================
// CONSENT ACTIONS
// =============================================================================

/**
 * Accept all consent categories
 */
export function acceptAllConsent(): ConsentState {
  const state: ConsentState = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    choices: {
      necessary: true,
      analytics: true,
      marketing: true,
    },
    bannerShown: true,
    hasInteracted: true,
  }
  
  saveConsentState(state)
  return state
}

/**
 * Accept only necessary cookies
 */
export function acceptNecessaryOnly(): ConsentState {
  const state: ConsentState = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    choices: {
      necessary: true,
      analytics: false,
      marketing: false,
    },
    bannerShown: true,
    hasInteracted: true,
  }
  
  saveConsentState(state)
  clearNonEssentialCookies()
  return state
}

/**
 * Update specific consent categories
 */
export function updateConsent(choices: Partial<Record<ConsentCategory, boolean>>): ConsentState {
  const currentState = getConsentState()
  
  const state: ConsentState = {
    ...currentState,
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    choices: {
      ...currentState.choices,
      ...choices,
      necessary: true, // Always keep necessary
    },
    bannerShown: true,
    hasInteracted: true,
  }
  
  saveConsentState(state)
  
  // If analytics or marketing was revoked, clear those cookies
  if (!state.choices.analytics || !state.choices.marketing) {
    clearNonEssentialCookies()
  }
  
  return state
}

/**
 * Withdraw all consent (Task 1.4)
 */
export function withdrawConsent(): ConsentState {
  const state = acceptNecessaryOnly()
  
  // Immediately stop any active tracking
  window.dispatchEvent(new CustomEvent('consent-withdrawn'))
  
  // Clear all non-essential cookies
  clearNonEssentialCookies()
  
  return state
}

// =============================================================================
// MIGRATION
// =============================================================================

/**
 * Migrate consent state from older versions
 */
function migrateConsentState(state: Partial<ConsentState>): ConsentState {
  // Handle version migrations here
  // For now, just ensure all required fields exist
  return {
    version: state.version || CONSENT_VERSION,
    timestamp: state.timestamp || new Date().toISOString(),
    choices: {
      necessary: true,
      analytics: state.choices?.analytics ?? false,
      marketing: state.choices?.marketing ?? false,
    },
    region: state.region,
    bannerShown: state.bannerShown ?? false,
    hasInteracted: state.hasInteracted ?? false,
  }
}

// =============================================================================
// COOKIE UTILITIES
// =============================================================================

function getCookie(name: string): string | null {
  try {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
    return match ? match[2] ?? null : null
  } catch {
    return null
  }
}

function setCookie(name: string, value: string, days: number): void {
  try {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secure}`
  } catch {
    // Silently fail - in-memory state will be used
  }
}

// =============================================================================
// AUDIT LOGGING
// =============================================================================

/**
 * Get consent audit log entry (non-PII)
 */
export function getConsentAuditLog(): Record<string, unknown> {
  const state = getConsentState()
  
  return {
    consent_version: state.version,
    consent_timestamp: state.timestamp,
    consent_analytics: state.choices.analytics,
    consent_marketing: state.choices.marketing,
    consent_has_interacted: state.hasInteracted,
    // Don't log region or other potentially identifying info
  }
}
