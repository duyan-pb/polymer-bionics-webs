/**
 * Anonymous Identity Management (Epic 6)
 * 
 * Handles anonymous_id and session_id generation and persistence.
 * No PII is collected - all IDs are random and non-reversible.
 */

import { DEFAULT_IDENTITY_CONFIG, type AnonymousIdentity, type IdentityConfig } from './types'

// =============================================================================
// CONSTANTS
// =============================================================================

const ANONYMOUS_ID_KEY = 'pb_anonymous_id'
const SESSION_KEY = 'pb_session'

// =============================================================================
// ID GENERATION
// =============================================================================

/**
 * Get a (preferably) cryptographically secure 32-bit unsigned integer.
 * Falls back to Math.random() only if crypto APIs are unavailable.
 */
function getSecureRandomUint32(): number {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return array[0]!
  }
  // Best-effort fallback; not cryptographically secure
  return (Math.random() * 0xffffffff) >>> 0
}

/**
 * Generate a random anonymous ID (UUID v4 format)
 * Uses crypto.randomUUID when available, falls back to manual generation
 */
function generateAnonymousId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = getSecureRandomUint32() & 0xf
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Generate a session ID (shorter format for session-scoped use)
 */
function generateSessionId(): string {
  const timestamp = Date.now().toString(36)

  // Generate 8 random bytes and encode as base-36 for a short, opaque string
  let randomValue = ''
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(8)
    crypto.getRandomValues(bytes)
    for (let i = 0; i < bytes.length; i++) {
      randomValue += bytes[i]!.toString(36)
    }
  } else {
    // Best-effort fallback; not cryptographically secure
    randomValue = getSecureRandomUint32().toString(36) + getSecureRandomUint32().toString(36)
  }

  const random = randomValue.substring(0, 8)
  return `${timestamp}-${random}`
}

// =============================================================================
// STORAGE
// =============================================================================

interface StoredAnonymousId {
  id: string
  createdAt: string
  expiresAt: string
}

interface StoredSession {
  id: string
  startedAt: string
  lastActivityAt: string
  dayKey: string // YYYY-MM-DD for daily reset
}

/**
 * Get or create anonymous ID
 */
function getOrCreateAnonymousId(config: IdentityConfig): { id: string; createdAt: string; isNew: boolean } {
  try {
    const stored = localStorage.getItem(ANONYMOUS_ID_KEY)
    
    if (stored) {
      const parsed: StoredAnonymousId = JSON.parse(stored)
      const expiresAt = new Date(parsed.expiresAt)
      
      // Check if still valid
      if (expiresAt > new Date()) {
        return { id: parsed.id, createdAt: parsed.createdAt, isNew: false }
      }
    }
  } catch {
    // Storage read failed, generate new
  }
  
  // Generate new anonymous ID
  const id = generateAnonymousId()
  const createdAt = new Date().toISOString()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + config.anonymousIdExpiryDays)
  
  const toStore: StoredAnonymousId = {
    id,
    createdAt,
    expiresAt: expiresAt.toISOString(),
  }
  
  try {
    localStorage.setItem(ANONYMOUS_ID_KEY, JSON.stringify(toStore))
  } catch {
    // Storage write failed, ID will still work for this session
  }
  
  return { id, createdAt, isNew: true }
}

/**
 * Get today's date key for daily session reset
 */
function getTodayKey(): string {
  const parts = new Date().toISOString().split('T')
  return parts[0] ?? new Date().toISOString().slice(0, 10)
}

/**
 * Get or create session ID with timeout and daily reset logic
 */
function getOrCreateSession(config: IdentityConfig): { id: string; startedAt: string; isNew: boolean } {
  const now = new Date()
  const todayKey = getTodayKey()
  
  try {
    const stored = sessionStorage.getItem(SESSION_KEY)
    
    if (stored) {
      const parsed: StoredSession = JSON.parse(stored)
      const lastActivity = new Date(parsed.lastActivityAt)
      const timeSinceActivity = (now.getTime() - lastActivity.getTime()) / 1000 / 60 // minutes
      
      // Check session timeout
      if (timeSinceActivity < config.sessionTimeoutMinutes) {
        // Check daily reset
        if (!config.dailySessionReset || parsed.dayKey === todayKey) {
          // Update last activity and return existing session
          const updated: StoredSession = {
            ...parsed,
            lastActivityAt: now.toISOString(),
          }
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated))
          const sessionId = parsed.id || generateSessionId()
          const sessionStartedAt = parsed.startedAt || now.toISOString()
          return { id: sessionId, startedAt: sessionStartedAt, isNew: false }
        }
      }
    }
  } catch {
    // Storage read failed, generate new
  }
  
  // Generate new session
  const id = generateSessionId()
  const startedAt = now.toISOString()
  
  const toStore: StoredSession = {
    id,
    startedAt,
    lastActivityAt: startedAt,
    dayKey: todayKey,
  }
  
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(toStore))
  } catch {
    // Storage write failed, ID will still work
  }
  
  return { id, startedAt, isNew: true }
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Get current identity (creates if needed)
 * 
 * Note: Anonymous ID can exist pre-consent, but should only be sent
 * with tracking calls after consent is granted.
 */
export function getIdentity(config: IdentityConfig = DEFAULT_IDENTITY_CONFIG): AnonymousIdentity {
  const anonymousId = getOrCreateAnonymousId(config)
  const session = getOrCreateSession(config)
  
  return {
    anonymousId: anonymousId.id,
    sessionId: session.id,
    anonymousIdCreatedAt: anonymousId.createdAt,
    sessionStartedAt: session.startedAt,
    lastActivityAt: new Date().toISOString(),
  }
}

/**
 * Get anonymous ID only (without creating session)
 */
export function getAnonymousId(config: IdentityConfig = DEFAULT_IDENTITY_CONFIG): string {
  return getOrCreateAnonymousId(config).id
}

/**
 * Get session ID only
 */
export function getSessionId(config: IdentityConfig = DEFAULT_IDENTITY_CONFIG): string {
  return getOrCreateSession(config).id
}

/**
 * Refresh session activity timestamp
 * Call this on user interactions to keep session alive
 */
export function refreshSession(): void {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY)
    if (stored) {
      const parsed: StoredSession = JSON.parse(stored)
      parsed.lastActivityAt = new Date().toISOString()
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(parsed))
    }
  } catch {
    // Ignore errors
  }
}

/**
 * Force new session (useful for testing or logout-like scenarios)
 */
export function resetSession(): string {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // Ignore errors
  }
  return getOrCreateSession(DEFAULT_IDENTITY_CONFIG).id
}

/**
 * Clear all identity data (for consent withdrawal)
 */
export function clearIdentity(): void {
  try {
    localStorage.removeItem(ANONYMOUS_ID_KEY)
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // Ignore errors
  }
}

// =============================================================================
// EDGE CASE HANDLING (Task 6.3)
// =============================================================================

/**
 * Check if storage is available
 */
export function isStorageAvailable(): { localStorage: boolean; sessionStorage: boolean } {
  const testKey = '__storage_test__'
  
  let localStorageAvailable = false
  let sessionStorageAvailable = false
  
  try {
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    localStorageAvailable = true
  } catch {
    localStorageAvailable = false
  }
  
  try {
    sessionStorage.setItem(testKey, testKey)
    sessionStorage.removeItem(testKey)
    sessionStorageAvailable = true
  } catch {
    sessionStorageAvailable = false
  }
  
  return { localStorage: localStorageAvailable, sessionStorage: sessionStorageAvailable }
}

/**
 * Get identity with fallback for blocked storage
 * Returns ephemeral IDs that won't persist
 */
export function getIdentityWithFallback(config: IdentityConfig = DEFAULT_IDENTITY_CONFIG): AnonymousIdentity & { isPersisted: boolean } {
  const storage = isStorageAvailable()
  
  if (storage.localStorage && storage.sessionStorage) {
    return { ...getIdentity(config), isPersisted: true }
  }
  
  // Generate ephemeral IDs for incognito/blocked storage
  const now = new Date().toISOString()
  return {
    anonymousId: generateAnonymousId(),
    sessionId: generateSessionId(),
    anonymousIdCreatedAt: now,
    sessionStartedAt: now,
    lastActivityAt: now,
    isPersisted: false,
  }
}
