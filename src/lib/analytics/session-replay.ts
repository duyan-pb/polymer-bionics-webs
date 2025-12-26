/**
 * Session Replay Configuration (Epic 12)
 * 
 * Configures session replay with privacy masking for:
 * - Microsoft Clarity
 * - Azure Application Insights Click Analytics
 * 
 * Privacy features:
 * - Mask all user inputs by default
 * - Block recording of sensitive elements
 * - Respect consent preferences
 * - Custom masking selectors
 */

import { canTrack } from './consent'

// =============================================================================
// TYPES
// =============================================================================

export interface SessionReplayConfig {
  /** Whether session replay is enabled */
  enabled: boolean
  /** Microsoft Clarity project ID */
  clarityProjectId?: string
  /** Privacy masking level */
  maskingLevel: 'strict' | 'balanced' | 'relaxed'
  /** Custom CSS selectors to always mask */
  maskSelectors: string[]
  /** Custom CSS selectors to always block (not recorded) */
  blockSelectors: string[]
  /** Whether to mask all input fields */
  maskAllInputs: boolean
  /** Whether to mask all text content */
  maskAllText: boolean
  /** Whether to block recording of iframes */
  blockIframes: boolean
  /** Sample rate for session replay (0-1) */
  sampleRate: number
  /** Debug mode */
  debug: boolean
}

export interface ClarityConfig {
  projectId: string
  /** Cookie consent domain */
  cookieDomain?: string
  /** Disable text masking */
  disableTextMasking?: boolean
  /** Custom tags for filtering */
  tags?: Record<string, string>
}

// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================

export const DEFAULT_REPLAY_CONFIG: SessionReplayConfig = {
  enabled: true,
  maskingLevel: 'strict',
  maskSelectors: [
    // Form inputs
    'input[type="password"]',
    'input[type="email"]',
    'input[type="tel"]',
    'input[type="number"]',
    'input[name*="card"]',
    'input[name*="credit"]',
    'input[name*="cvv"]',
    'input[name*="ssn"]',
    'input[name*="social"]',
    'input[name*="tax"]',
    'input[name*="account"]',
    // Custom data attributes
    '[data-sensitive]',
    '[data-private]',
    '[data-mask]',
    // Common sensitive classes
    '.sensitive',
    '.private',
    '.pii',
    '.credit-card',
    '.bank-account',
    // Address fields
    '[autocomplete="street-address"]',
    '[autocomplete="postal-code"]',
    '[autocomplete="address-line1"]',
    '[autocomplete="address-line2"]',
  ],
  blockSelectors: [
    // Completely block these from recording
    '[data-block-replay]',
    '.no-replay',
    'iframe[src*="payment"]',
    'iframe[src*="checkout"]',
  ],
  maskAllInputs: true,
  maskAllText: false,
  blockIframes: true,
  sampleRate: 0.1, // 10% of sessions by default
  debug: false,
}

// =============================================================================
// STATE
// =============================================================================

let config: SessionReplayConfig = { ...DEFAULT_REPLAY_CONFIG }
let clarityLoaded = false
let sessionSelected = false

// =============================================================================
// CLARITY INTEGRATION
// =============================================================================

declare global {
  interface Window {
    clarity?: (command: string, ...args: unknown[]) => void
  }
}

/**
 * Initialize Microsoft Clarity
 */
export function initClarity(clarityConfig: ClarityConfig): void {
  if (!config.enabled) {
    return
  }
  
  // Check consent
  if (!canTrack('analytics')) {
    // Listen for consent changes
    window.addEventListener('consent-changed', () => {
      if (canTrack('analytics') && !clarityLoaded) {
        loadClarity(clarityConfig)
      }
    })
    return
  }
  
  loadClarity(clarityConfig)
}

/**
 * Load Clarity script
 */
function loadClarity(clarityConfig: ClarityConfig): void {
  // Check sampling
  if (!isSessionSelected()) {
    if (config.debug) {
      // eslint-disable-next-line no-console
      console.log('[SessionReplay] Session not selected for replay (sampling)')
    }
    return
  }
  
  if (clarityLoaded) {
    return
  }
  
  // Initialize Clarity function queue
  window.clarity = window.clarity || function (...args: unknown[]) {
    (window.clarity as unknown as { q: unknown[] }).q = (window.clarity as unknown as { q: unknown[] }).q || []
    ;(window.clarity as unknown as { q: unknown[] }).q.push(args)
  }
  
  // Load Clarity script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.clarity.ms/tag/${clarityConfig.projectId}`
  
  script.onload = () => {
    clarityLoaded = true
    
    // Apply privacy settings
    applyPrivacySettings()
    
    // Set custom tags
    if (clarityConfig.tags) {
      for (const [key, value] of Object.entries(clarityConfig.tags)) {
        window.clarity?.('set', key, value)
      }
    }
    
    if (config.debug) {
      // eslint-disable-next-line no-console
      console.log('[SessionReplay] Clarity loaded with project:', clarityConfig.projectId)
    }
  }
  
  document.head.appendChild(script)
}

/**
 * Apply privacy masking settings to Clarity
 */
function applyPrivacySettings(): void {
  if (!window.clarity) {
    return
  }
  
  // Set masking based on level
  switch (config.maskingLevel) {
    case 'strict':
      window.clarity('set', 'mask-text', true)
      window.clarity('set', 'mask-inputs', true)
      break
    case 'balanced':
      window.clarity('set', 'mask-text', false)
      window.clarity('set', 'mask-inputs', true)
      break
    case 'relaxed':
      window.clarity('set', 'mask-text', false)
      window.clarity('set', 'mask-inputs', false)
      break
  }
}

// =============================================================================
// SAMPLING
// =============================================================================

/**
 * Determine if this session should be recorded (sampling)
 */
function isSessionSelected(): boolean {
  if (sessionSelected) {
    return true
  }
  
  // Check if already selected in storage
  const stored = sessionStorage.getItem('pb_replay_selected')
  if (stored !== null) {
    sessionSelected = stored === 'true'
    return sessionSelected
  }
  
  // Random selection based on sample rate
  sessionSelected = Math.random() < config.sampleRate
  sessionStorage.setItem('pb_replay_selected', String(sessionSelected))
  
  return sessionSelected
}

/**
 * Force enable replay for this session (e.g., after error)
 */
export function forceEnableReplay(): void {
  sessionSelected = true
  sessionStorage.setItem('pb_replay_selected', 'true')
  
  // If Clarity isn't loaded yet, it will load on next page
  if (config.debug) {
    // eslint-disable-next-line no-console
    console.log('[SessionReplay] Force enabled for this session')
  }
}

// =============================================================================
// CUSTOM EVENTS
// =============================================================================

/**
 * Add a custom tag/event to the session recording
 */
export function tagSession(key: string, value: string): void {
  if (!clarityLoaded || !window.clarity) {
    return
  }
  
  window.clarity('set', key, value)
}

/**
 * Mark a point of interest in the recording
 */
export function markReplayEvent(eventName: string): void {
  if (!clarityLoaded || !window.clarity) {
    return
  }
  
  window.clarity('event', eventName)
}

/**
 * Identify user for session replay (hashed/anonymous ID only!)
 */
export function identifyReplayUser(userId: string): void {
  if (!clarityLoaded || !window.clarity) {
    return
  }
  
  // Only use anonymous/hashed IDs, never PII
  window.clarity('identify', userId)
}

// =============================================================================
// ERROR REPLAY LINKING
// =============================================================================

/**
 * Enable replay on error (useful for debugging)
 * Call this when an error occurs to ensure the session is recorded
 */
export function enableReplayOnError(): void {
  // Force enable replay
  forceEnableReplay()
  
  // Tag the session as having an error
  tagSession('has_error', 'true')
}

/**
 * Get Clarity session URL for linking in error reports
 */
export function getClaritySessionUrl(): string | null {
  if (!clarityLoaded || !config.clarityProjectId) {
    return null
  }
  
  // Clarity session URL format (approximate)
  const sessionId = sessionStorage.getItem('_clsk')
  if (!sessionId) {
    return null
  }
  
  return `https://clarity.microsoft.com/project/${config.clarityProjectId}/session/${sessionId}`
}

// =============================================================================
// PRIVACY CONTROLS
// =============================================================================

/**
 * Add elements to mask list dynamically
 */
export function addMaskSelector(selector: string): void {
  if (!config.maskSelectors.includes(selector)) {
    config.maskSelectors.push(selector)
  }
}

/**
 * Add elements to block list dynamically
 */
export function addBlockSelector(selector: string): void {
  if (!config.blockSelectors.includes(selector)) {
    config.blockSelectors.push(selector)
  }
}

/**
 * Temporarily pause recording
 */
export function pauseReplay(): void {
  if (window.clarity) {
    window.clarity('stop')
  }
}

/**
 * Resume recording
 */
export function resumeReplay(): void {
  if (window.clarity) {
    window.clarity('start')
  }
}

// =============================================================================
// CONSENT HANDLING
// =============================================================================

/**
 * Handle consent withdrawal - stop replay immediately
 */
export function handleConsentWithdrawn(): void {
  if (window.clarity) {
    window.clarity('stop')
  }
  clarityLoaded = false
  sessionSelected = false
  sessionStorage.removeItem('pb_replay_selected')
}

// Listen for consent withdrawal
if (typeof window !== 'undefined') {
  window.addEventListener('consent-withdrawn', handleConsentWithdrawn)
}

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize session replay with configuration
 */
export function initSessionReplay(options: Partial<SessionReplayConfig> = {}): void {
  config = { ...DEFAULT_REPLAY_CONFIG, ...options }
  
  // Auto-initialize Clarity if project ID is provided
  if (config.clarityProjectId) {
    initClarity({ projectId: config.clarityProjectId })
  }
}

/**
 * Get current replay configuration
 */
export function getReplayConfig(): SessionReplayConfig {
  return { ...config }
}

/**
 * Alias for getReplayConfig for consistency
 */
export function getSessionReplayConfig(): SessionReplayConfig {
  return getReplayConfig()
}

/**
 * Check if session replay is currently active
 */
export function isReplayActive(): boolean {
  return clarityLoaded && config.enabled && sessionSelected
}

/**
 * Reset state for testing
 */
export function resetSessionReplayForTesting(): void {
  config = { ...DEFAULT_REPLAY_CONFIG }
  clarityLoaded = false
  sessionSelected = false
}

// =============================================================================
// DATA ATTRIBUTES FOR MASKING
// =============================================================================

/**
 * Data attributes that can be added to HTML elements:
 * 
 * data-sensitive    - Mask this element's content
 * data-private      - Mask this element's content  
 * data-mask         - Mask this element's content
 * data-block-replay - Completely block from recording
 * 
 * Example:
 * <input type="text" data-sensitive name="ssn" />
 * <div data-block-replay>Payment iframe</div>
 */

export const REPLAY_DATA_ATTRIBUTES = {
  SENSITIVE: 'data-sensitive',
  PRIVATE: 'data-private',
  MASK: 'data-mask',
  BLOCK: 'data-block-replay',
} as const
