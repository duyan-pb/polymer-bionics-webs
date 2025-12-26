/**
 * UTM Attribution Management (Epic 8)
 * 
 * Captures and persists UTM parameters for campaign attribution.
 * Follows first-touch or session-based attribution policies.
 */

import type { UTMParameters } from './types'

// =============================================================================
// CONSTANTS
// =============================================================================

const UTM_STORAGE_KEY = 'pb_utm'
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

type UTMParam = typeof UTM_PARAMS[number]

// =============================================================================
// UTM CAPTURE
// =============================================================================

/**
 * Extract UTM parameters from URL
 */
function extractUTMFromURL(): Partial<Record<UTMParam, string>> {
  const params = new URLSearchParams(window.location.search)
  const utm: Partial<Record<UTMParam, string>> = {}
  
  for (const param of UTM_PARAMS) {
    const value = params.get(param)
    if (value) {
      utm[param] = value
    }
  }
  
  return utm
}

/**
 * Check if UTM parameters exist in current URL
 */
export function hasUTMInURL(): boolean {
  const params = new URLSearchParams(window.location.search)
  return UTM_PARAMS.some(param => params.has(param))
}

// =============================================================================
// STORAGE
// =============================================================================

interface StoredUTM {
  params: Partial<Record<UTMParam, string>>
  capturedAt: string
  landingPage: string
  referrer: string
  type: 'first-touch' | 'session'
}

/**
 * Get stored UTM parameters
 */
function getStoredUTM(): StoredUTM | null {
  try {
    // Check sessionStorage first (session-scoped)
    const sessionUTM = sessionStorage.getItem(UTM_STORAGE_KEY)
    if (sessionUTM) {
      return JSON.parse(sessionUTM)
    }
    
    // Fall back to localStorage (first-touch)
    const localUTM = localStorage.getItem(UTM_STORAGE_KEY)
    if (localUTM) {
      return JSON.parse(localUTM)
    }
  } catch {
    // Ignore errors
  }
  
  return null
}

/**
 * Save UTM parameters
 */
function saveUTM(utm: StoredUTM, policy: 'first-touch' | 'session'): void {
  try {
    const serialized = JSON.stringify(utm)
    
    if (policy === 'session') {
      sessionStorage.setItem(UTM_STORAGE_KEY, serialized)
    } else {
      localStorage.setItem(UTM_STORAGE_KEY, serialized)
    }
  } catch {
    // Ignore errors
  }
}

// =============================================================================
// PUBLIC API
// =============================================================================

export type AttributionPolicy = 'first-touch' | 'last-touch' | 'session'

/**
 * Capture UTM parameters from current URL
 * 
 * @param policy - Attribution policy:
 *   - 'first-touch': Only capture if no existing UTM (default)
 *   - 'last-touch': Always overwrite with new UTM
 *   - 'session': Capture per session, don't persist across sessions
 */
export function captureUTM(policy: AttributionPolicy = 'first-touch'): UTMParameters | null {
  const urlUTM = extractUTMFromURL()
  const hasNewUTM = Object.keys(urlUTM).length > 0
  const existingUTM = getStoredUTM()
  
  // Determine what to return based on policy
  if (policy === 'first-touch') {
    if (existingUTM && !hasNewUTM) {
      // Return existing first-touch
      return {
        ...existingUTM.params,
        captured_at: existingUTM.capturedAt,
        landing_page: existingUTM.landingPage,
        referrer: existingUTM.referrer,
      }
    }
    
    if (hasNewUTM && !existingUTM) {
      // Capture new first-touch
      const utm: StoredUTM = {
        params: urlUTM,
        capturedAt: new Date().toISOString(),
        landingPage: window.location.href,
        referrer: document.referrer,
        type: 'first-touch',
      }
      saveUTM(utm, 'first-touch')
      return {
        ...urlUTM,
        captured_at: utm.capturedAt,
        landing_page: utm.landingPage,
        referrer: utm.referrer,
      }
    }
    
    // Return existing if we have one
    if (existingUTM) {
      return {
        ...existingUTM.params,
        captured_at: existingUTM.capturedAt,
        landing_page: existingUTM.landingPage,
        referrer: existingUTM.referrer,
      }
    }
  }
  
  if (policy === 'last-touch' && hasNewUTM) {
    const utm: StoredUTM = {
      params: urlUTM,
      capturedAt: new Date().toISOString(),
      landingPage: window.location.href,
      referrer: document.referrer,
      type: 'first-touch',
    }
    saveUTM(utm, 'first-touch')
    return {
      ...urlUTM,
      captured_at: utm.capturedAt,
      landing_page: utm.landingPage,
      referrer: utm.referrer,
    }
  }
  
  if (policy === 'session') {
    if (hasNewUTM) {
      const utm: StoredUTM = {
        params: urlUTM,
        capturedAt: new Date().toISOString(),
        landingPage: window.location.href,
        referrer: document.referrer,
        type: 'session',
      }
      saveUTM(utm, 'session')
      return {
        ...urlUTM,
        captured_at: utm.capturedAt,
        landing_page: utm.landingPage,
        referrer: utm.referrer,
      }
    }
    
    // Return session UTM if exists
    if (existingUTM?.type === 'session') {
      return {
        ...existingUTM.params,
        captured_at: existingUTM.capturedAt,
        landing_page: existingUTM.landingPage,
        referrer: existingUTM.referrer,
      }
    }
  }
  
  // No UTM to return
  if (existingUTM) {
    return {
      ...existingUTM.params,
      captured_at: existingUTM.capturedAt,
      landing_page: existingUTM.landingPage,
      referrer: existingUTM.referrer,
    }
  }
  
  return null
}

/**
 * Get current UTM parameters (without capturing new ones)
 */
export function getUTM(): UTMParameters | null {
  const stored = getStoredUTM()
  if (!stored) {return null}
  
  return {
    ...stored.params,
    captured_at: stored.capturedAt,
    landing_page: stored.landingPage,
    referrer: stored.referrer,
  }
}

/**
 * Clear stored UTM parameters
 */
export function clearUTM(): void {
  try {
    localStorage.removeItem(UTM_STORAGE_KEY)
    sessionStorage.removeItem(UTM_STORAGE_KEY)
  } catch {
    // Ignore errors
  }
}

/**
 * Get UTM parameters for event properties
 */
export function getUTMForEvent(): Partial<Record<UTMParam, string>> {
  const utm = getUTM()
  if (!utm) {return {}}
  
  return {
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    utm_term: utm.utm_term,
    utm_content: utm.utm_content,
  }
}
