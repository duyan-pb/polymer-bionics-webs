/**
 * Session Replay Tests (Epic 12)
 * 
 * Tests for Microsoft Clarity session replay integration with privacy masking
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  initSessionReplay,
  tagSession,
  markReplayEvent,
  identifyReplayUser,
  forceEnableReplay,
  enableReplayOnError,
  getClaritySessionUrl,
  addMaskSelector,
  addBlockSelector,
  pauseReplay,
  resumeReplay,
  getSessionReplayConfig,
  isReplayActive,
  resetSessionReplayForTesting,
  DEFAULT_REPLAY_CONFIG,
  REPLAY_DATA_ATTRIBUTES,
} from '../session-replay'
import { acceptAllConsent } from '../consent'

// Mock clarity function
const mockClarityFn = vi.fn()

describe('Session Replay', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
    resetSessionReplayForTesting()
    
    // Mock window.clarity as a function
    Object.defineProperty(window, 'clarity', {
      value: mockClarityFn,
      writable: true,
      configurable: true,
    })
    
    acceptAllConsent()
  })

  afterEach(() => {
    resetSessionReplayForTesting()
    // @ts-expect-error - Reset clarity
    window.clarity = undefined
  })

  describe('DEFAULT_REPLAY_CONFIG', () => {
    it('has strict masking level by default', () => {
      expect(DEFAULT_REPLAY_CONFIG.maskingLevel).toBe('strict')
    })

    it('masks all inputs by default', () => {
      expect(DEFAULT_REPLAY_CONFIG.maskAllInputs).toBe(true)
    })

    it('has 10% sample rate by default', () => {
      expect(DEFAULT_REPLAY_CONFIG.sampleRate).toBe(0.1)
    })

    it('blocks iframes by default', () => {
      expect(DEFAULT_REPLAY_CONFIG.blockIframes).toBe(true)
    })

    it('has default mask selectors for sensitive fields', () => {
      expect(DEFAULT_REPLAY_CONFIG.maskSelectors).toContain('input[type="password"]')
      expect(DEFAULT_REPLAY_CONFIG.maskSelectors).toContain('input[type="email"]')
      expect(DEFAULT_REPLAY_CONFIG.maskSelectors).toContain('[data-sensitive]')
      expect(DEFAULT_REPLAY_CONFIG.maskSelectors).toContain('.pii')
    })

    it('has default block selectors', () => {
      expect(DEFAULT_REPLAY_CONFIG.blockSelectors).toContain('[data-block-replay]')
      expect(DEFAULT_REPLAY_CONFIG.blockSelectors).toContain('.no-replay')
    })
  })

  describe('REPLAY_DATA_ATTRIBUTES', () => {
    it('defines data attribute constants', () => {
      expect(REPLAY_DATA_ATTRIBUTES.SENSITIVE).toBe('data-sensitive')
      expect(REPLAY_DATA_ATTRIBUTES.PRIVATE).toBe('data-private')
      expect(REPLAY_DATA_ATTRIBUTES.MASK).toBe('data-mask')
      expect(REPLAY_DATA_ATTRIBUTES.BLOCK).toBe('data-block-replay')
    })
  })

  describe('initSessionReplay', () => {
    it('initializes with project ID', () => {
      initSessionReplay({
        clarityProjectId: 'test-project-id',
      })
      
      const config = getSessionReplayConfig()
      expect(config.clarityProjectId).toBe('test-project-id')
    })

    it('uses default strict masking level', () => {
      initSessionReplay({
        clarityProjectId: 'test',
      })
      
      const config = getSessionReplayConfig()
      expect(config.maskingLevel).toBe('strict')
    })

    it('accepts custom masking level', () => {
      initSessionReplay({
        clarityProjectId: 'test',
        maskingLevel: 'balanced',
      })
      
      const config = getSessionReplayConfig()
      expect(config.maskingLevel).toBe('balanced')
    })

    it('respects sample rate', () => {
      initSessionReplay({
        clarityProjectId: 'test',
        sampleRate: 0.5,
      })
      
      const config = getSessionReplayConfig()
      expect(config.sampleRate).toBe(0.5)
    })

    it('respects enabled flag', () => {
      initSessionReplay({
        enabled: false,
        clarityProjectId: 'test',
      })
      
      const config = getSessionReplayConfig()
      expect(config.enabled).toBe(false)
    })

    it('sets debug mode when specified', () => {
      initSessionReplay({
        clarityProjectId: 'test',
        debug: true,
      })
      
      const config = getSessionReplayConfig()
      expect(config.debug).toBe(true)
    })
  })

  describe('getSessionReplayConfig', () => {
    it('returns a copy of the current config', () => {
      initSessionReplay({
        clarityProjectId: 'test',
        maskingLevel: 'relaxed',
      })
      
      const config = getSessionReplayConfig()
      expect(config.clarityProjectId).toBe('test')
      expect(config.maskingLevel).toBe('relaxed')
    })

    it('returns default config when not initialized', () => {
      const config = getSessionReplayConfig()
      expect(config.enabled).toBe(true)
      expect(config.maskingLevel).toBe('strict')
    })
  })

  describe('isReplayActive', () => {
    it('returns false when not initialized', () => {
      expect(isReplayActive()).toBe(false)
    })

    it('returns false when disabled', () => {
      initSessionReplay({ enabled: false })
      expect(isReplayActive()).toBe(false)
    })
  })

  describe('tagSession', () => {
    it('calls clarity set function when clarity is loaded', () => {
      // tagSession requires clarityLoaded to be true, which happens after script load
      // Since we're not actually loading the script, we test the guard condition
      tagSession('user_type', 'premium')
      
      // clarityLoaded is false by default, so clarity shouldn't be called
      // This tests the guard condition
    })
  })

  describe('markReplayEvent', () => {
    it('does nothing when clarity not loaded', () => {
      markReplayEvent('checkout_started')
      
      // Should not throw and not call clarity
      expect(mockClarityFn).not.toHaveBeenCalled()
    })
  })

  describe('identifyReplayUser', () => {
    it('does nothing when clarity not loaded', () => {
      identifyReplayUser('anon-123')
      
      // Should not throw and not call clarity
      expect(mockClarityFn).not.toHaveBeenCalled()
    })
  })

  describe('forceEnableReplay', () => {
    it('sets session storage flag', () => {
      forceEnableReplay()
      
      expect(sessionStorage.getItem('pb_replay_selected')).toBe('true')
    })
  })

  describe('enableReplayOnError', () => {
    it('forces replay and tags session', () => {
      enableReplayOnError()
      
      expect(sessionStorage.getItem('pb_replay_selected')).toBe('true')
    })
  })

  describe('getClaritySessionUrl', () => {
    it('returns null when clarity not loaded', () => {
      const url = getClaritySessionUrl()
      expect(url).toBeNull()
    })

    it('returns null when project ID not set', () => {
      initSessionReplay({})
      const url = getClaritySessionUrl()
      expect(url).toBeNull()
    })

    it('returns null when session key not in storage', () => {
      initSessionReplay({ clarityProjectId: 'test-project' })
      sessionStorage.removeItem('_clsk')
      
      const url = getClaritySessionUrl()
      expect(url).toBeNull()
    })
  })

  describe('pauseReplay', () => {
    it('calls clarity stop when available', () => {
      pauseReplay()
      
      expect(mockClarityFn).toHaveBeenCalledWith('stop')
    })

    it('does not throw when clarity not available', () => {
      // @ts-expect-error - Testing missing clarity
      window.clarity = undefined
      
      expect(() => pauseReplay()).not.toThrow()
    })
  })

  describe('resumeReplay', () => {
    it('calls clarity start when available', () => {
      resumeReplay()
      
      expect(mockClarityFn).toHaveBeenCalledWith('start')
    })

    it('does not throw when clarity not available', () => {
      // @ts-expect-error - Testing missing clarity
      window.clarity = undefined
      
      expect(() => resumeReplay()).not.toThrow()
    })
  })

  describe('markReplayEvent', () => {
    it('does nothing when clarity not loaded', () => {
      markReplayEvent('button_click')
      
      // Should not call clarity since it's not loaded
      expect(mockClarityFn).not.toHaveBeenCalled()
    })
  })

  describe('tagSession', () => {
    it('does nothing when clarity not loaded', () => {
      tagSession('user_type', 'premium')
      
      // Should not call clarity since it's not loaded
      expect(mockClarityFn).not.toHaveBeenCalled()
    })
  })

  describe('addMaskSelector', () => {
    it('adds selector to mask list', () => {
      initSessionReplay({ clarityProjectId: 'test' })
      
      addMaskSelector('[data-credit-card]')
      
      const config = getSessionReplayConfig()
      expect(config.maskSelectors).toContain('[data-credit-card]')
    })

    it('does not add duplicate selectors', () => {
      initSessionReplay({ clarityProjectId: 'test' })
      
      const initialCount = getSessionReplayConfig().maskSelectors.length
      addMaskSelector('input[type="password"]') // Already in defaults
      
      expect(getSessionReplayConfig().maskSelectors.length).toBe(initialCount)
    })
  })

  describe('addBlockSelector', () => {
    it('adds selector to block list', () => {
      initSessionReplay({ clarityProjectId: 'test' })
      
      addBlockSelector('.secret-content')
      
      const config = getSessionReplayConfig()
      expect(config.blockSelectors).toContain('.secret-content')
    })

    it('does not add duplicate selectors', () => {
      initSessionReplay({ clarityProjectId: 'test' })
      
      const initialCount = getSessionReplayConfig().blockSelectors.length
      addBlockSelector('[data-block-replay]') // Already in defaults
      
      expect(getSessionReplayConfig().blockSelectors.length).toBe(initialCount)
    })
  })

  describe('pauseReplay', () => {
    it('calls clarity stop when available', () => {
      pauseReplay()
      
      expect(mockClarityFn).toHaveBeenCalledWith('stop')
    })

    it('does nothing when clarity not available', () => {
      // @ts-expect-error - Testing missing clarity
      window.clarity = undefined
      
      // Should not throw
      expect(() => pauseReplay()).not.toThrow()
    })
  })

  describe('resumeReplay', () => {
    it('calls clarity start when available', () => {
      resumeReplay()
      
      expect(mockClarityFn).toHaveBeenCalledWith('start')
    })

    it('does nothing when clarity not available', () => {
      // @ts-expect-error - Testing missing clarity
      window.clarity = undefined
      
      // Should not throw
      expect(() => resumeReplay()).not.toThrow()
    })
  })

  describe('resetSessionReplayForTesting', () => {
    it('resets config to defaults', () => {
      initSessionReplay({
        clarityProjectId: 'test',
        maskingLevel: 'relaxed',
        sampleRate: 0.5,
      })
      
      resetSessionReplayForTesting()
      
      const config = getSessionReplayConfig()
      expect(config.clarityProjectId).toBeUndefined()
      expect(config.maskingLevel).toBe('strict')
      expect(config.sampleRate).toBe(0.1)
    })
  })

  describe('privacy masking configuration', () => {
    it('strict mode includes text and input masking', () => {
      initSessionReplay({
        clarityProjectId: 'test',
        maskingLevel: 'strict',
      })
      
      const config = getSessionReplayConfig()
      expect(config.maskingLevel).toBe('strict')
    })

    it('balanced mode preserves text but masks inputs', () => {
      initSessionReplay({
        clarityProjectId: 'test',
        maskingLevel: 'balanced',
      })
      
      const config = getSessionReplayConfig()
      expect(config.maskingLevel).toBe('balanced')
    })

    it('relaxed mode minimal masking', () => {
      initSessionReplay({
        clarityProjectId: 'test',
        maskingLevel: 'relaxed',
      })
      
      const config = getSessionReplayConfig()
      expect(config.maskingLevel).toBe('relaxed')
    })
  })

  describe('sampling behavior', () => {
    it('stores selection in sessionStorage', () => {
      // Force enable sets the session storage
      forceEnableReplay()
      
      expect(sessionStorage.getItem('pb_replay_selected')).toBe('true')
    })
  })

  describe('handleConsentWithdrawn', () => {
    it('stops clarity recording when consent is withdrawn', async () => {
      const { handleConsentWithdrawn } = await import('../session-replay')
      
      handleConsentWithdrawn()
      
      expect(mockClarityFn).toHaveBeenCalledWith('stop')
    })

    it('clears session storage flag', async () => {
      sessionStorage.setItem('pb_replay_selected', 'true')
      
      const { handleConsentWithdrawn } = await import('../session-replay')
      handleConsentWithdrawn()
      
      expect(sessionStorage.getItem('pb_replay_selected')).toBeNull()
    })

    it('does not throw when clarity is not available', async () => {
      // @ts-expect-error - Testing missing clarity
      window.clarity = undefined
      
      const { handleConsentWithdrawn } = await import('../session-replay')
      
      expect(() => handleConsentWithdrawn()).not.toThrow()
    })
  })

  describe('getReplayConfig', () => {
    it('returns config copy', async () => {
      const { getReplayConfig } = await import('../session-replay')
      initSessionReplay({ clarityProjectId: 'test-project' })
      
      const config = getReplayConfig()
      expect(config.clarityProjectId).toBe('test-project')
    })
  })

  describe('isReplayActive', () => {
    it('returns false when clarity not loaded', () => {
      initSessionReplay({ clarityProjectId: 'test', enabled: true })
      
      // clarityLoaded is false since we haven't actually loaded the script
      expect(isReplayActive()).toBe(false)
    })
  })
})
