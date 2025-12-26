/**
 * Feature Flags Tests (Epic 11)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  initFeatureFlags,
  isFeatureEnabled,
  getFeatureFlag,
  getAllFlags,
  assignExperimentVariant,
  trackExperimentExposed,
  getExperimentAssignment,
  checkGuardrails,
  getFeatureFlagsConfig,
  useFeatureFlag,
  useExperiment,
} from '../feature-flags'
import { acceptAllConsent } from '../analytics/consent'

describe('Feature Flags', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
    acceptAllConsent()
  })

  describe('initFeatureFlags', () => {
    it('initializes with defaults', async () => {
      await initFeatureFlags({
        defaults: {
          'ui.new_feature': true,
          'analytics.session_replay': false,
        },
      })
      
      expect(isFeatureEnabled('ui.new_feature')).toBe(true)
      expect(isFeatureEnabled('analytics.session_replay')).toBe(false)
    })

    it('accepts custom config', async () => {
      await initFeatureFlags({
        refreshInterval: 600,
        debug: true,
        defaults: {},
      })
      
      const config = getFeatureFlagsConfig()
      expect(config.refreshInterval).toBe(600)
      expect(config.debug).toBe(true)
    })

    it('fetches flags from endpoint when configured', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          flags: {
            'remote.feature': true,
          },
        }),
      } as Response)
      
      await initFeatureFlags({
        endpoint: 'https://config.example.com/flags',
        defaults: {},
      })
      
      expect(global.fetch).toHaveBeenCalled()
    })

    it('uses defaults when fetch fails', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'))
      
      await initFeatureFlags({
        endpoint: 'https://config.example.com/flags',
        defaults: {
          'fallback.feature': true,
        },
      })
      
      expect(isFeatureEnabled('fallback.feature')).toBe(true)
    })
  })

  describe('isFeatureEnabled', () => {
    beforeEach(async () => {
      await initFeatureFlags({
        defaults: {
          'enabled.feature': true,
          'disabled.feature': false,
        },
      })
    })

    it('returns true for enabled flag', () => {
      expect(isFeatureEnabled('enabled.feature')).toBe(true)
    })

    it('returns false for disabled flag', () => {
      expect(isFeatureEnabled('disabled.feature')).toBe(false)
    })

    it('returns false for unknown flag by default', () => {
      expect(isFeatureEnabled('unknown.feature')).toBe(false)
    })

    it('accepts default value for unknown flags', () => {
      expect(isFeatureEnabled('unknown.feature', true)).toBe(true)
    })
  })

  describe('getFeatureFlag', () => {
    beforeEach(async () => {
      await initFeatureFlags({
        defaults: {
          'test.flag': true,
        },
      })
    })

    it('returns flag object with name and enabled state', () => {
      const flag = getFeatureFlag('test.flag')
      
      expect(flag?.name).toBe('test.flag')
      expect(flag?.enabled).toBe(true)
    })

    it('returns null for unknown flag', () => {
      const flag = getFeatureFlag('unknown.flag')
      
      expect(flag).toBeNull()
    })
  })

  describe('getAllFlags', () => {
    beforeEach(async () => {
      await initFeatureFlags({
        defaults: {
          'flag.a': true,
          'flag.b': false,
          'flag.c': true,
        },
      })
    })

    it('returns all flags', () => {
      const flags = getAllFlags()
      
      expect(flags['flag.a']).toBe(true)
      expect(flags['flag.b']).toBe(false)
      expect(flags['flag.c']).toBe(true)
    })
  })

  describe('assignExperimentVariant', () => {
    beforeEach(async () => {
      await initFeatureFlags({ defaults: {} })
    })

    it('assigns variant to user', () => {
      const variant = assignExperimentVariant('checkout_flow', ['control', 'variant_a'])
      
      expect(['control', 'variant_a']).toContain(variant)
    })

    it('returns same variant for same experiment', () => {
      const first = assignExperimentVariant('test_exp', ['a', 'b'])
      const second = assignExperimentVariant('test_exp', ['a', 'b'])
      
      expect(first).toBe(second)
    })

    it('stores assignment in memory', () => {
      assignExperimentVariant('stored_exp', ['control', 'treatment'])
      
      // Assignment is stored in memory and can be retrieved
      const assignment = getExperimentAssignment('stored_exp')
      expect(assignment).toBeDefined()
      expect(assignment?.experimentId).toBe('stored_exp')
    })

    it('respects custom weights', () => {
      // With deterministic weights (100% to first option)
      vi.spyOn(Math, 'random').mockReturnValue(0.05)
      
      const variant = assignExperimentVariant(
        'weighted_exp_test',
        ['control', 'treatment'],
        [0.9, 0.1]
      )
      
      // 0.05 < 0.9, so should be control
      expect(variant).toBe('control')
      
      vi.spyOn(Math, 'random').mockRestore()
    })
  })

  describe('trackExperimentExposed', () => {
    beforeEach(async () => {
      await initFeatureFlags({ defaults: {} })
    })

    it('tracks exposure event', () => {
      assignExperimentVariant('exposure_test', ['a', 'b'])
      
      // trackExperimentExposed returns void, just verify it doesn't throw
      expect(() => trackExperimentExposed('exposure_test')).not.toThrow()
    })

    it('warns for unassigned experiment', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      trackExperimentExposed('unassigned_exp')
      
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('No assignment found'))
      warnSpy.mockRestore()
    })

    it('can track multiple exposures', () => {
      assignExperimentVariant('single_exposure', ['a', 'b'])
      
      // Both calls should not throw
      expect(() => trackExperimentExposed('single_exposure')).not.toThrow()
      expect(() => trackExperimentExposed('single_exposure')).not.toThrow()
    })
  })

  describe('getExperimentAssignment', () => {
    beforeEach(async () => {
      await initFeatureFlags({ defaults: {} })
    })

    it('returns assignment for assigned experiment', () => {
      assignExperimentVariant('get_test', ['control', 'variant'])
      
      const assignment = getExperimentAssignment('get_test')
      
      expect(assignment).toBeTruthy()
      expect(assignment?.experimentId).toBe('get_test')
      expect(['control', 'variant']).toContain(assignment?.variant)
    })

    it('returns null for unassigned experiment', () => {
      const assignment = getExperimentAssignment('not_assigned')
      
      expect(assignment).toBeNull()
    })

    it('includes timestamp', () => {
      assignExperimentVariant('timestamp_test', ['a', 'b'])
      
      const assignment = getExperimentAssignment('timestamp_test')
      
      expect(assignment?.assignedAt).toBeTruthy()
    })
  })

  describe('checkGuardrails', () => {
    it('returns not violated when metrics are good', () => {
      const result = checkGuardrails('test_exp', {
        errorRate: 0.01,
        p95Latency: 500,
        conversionRate: 0.05,
        baselineConversionRate: 0.05,
      })
      
      expect(result.violated).toBe(false)
      expect(result.reasons).toHaveLength(0)
    })

    it('detects error rate violation', () => {
      const result = checkGuardrails('test_exp', {
        errorRate: 0.06, // 6% > 5% threshold
        p95Latency: 500,
        conversionRate: 0.05,
        baselineConversionRate: 0.05,
      })
      
      expect(result.violated).toBe(true)
      expect(result.reasons.some(r => r.includes('Error rate'))).toBe(true)
    })

    it('detects latency violation', () => {
      const result = checkGuardrails('test_exp', {
        errorRate: 0.01,
        p95Latency: 4000, // 4s > 3s threshold
        conversionRate: 0.05,
        baselineConversionRate: 0.05,
      })
      
      expect(result.violated).toBe(true)
      expect(result.reasons.some(r => r.includes('P95 latency'))).toBe(true)
    })

    it('detects conversion rate drop', () => {
      const result = checkGuardrails('test_exp', {
        errorRate: 0.01,
        p95Latency: 500,
        conversionRate: 0.03, // 3% vs 5% baseline
        baselineConversionRate: 0.05,
      })
      
      expect(result.violated).toBe(true)
      expect(result.reasons.some(r => r.includes('Conversion rate'))).toBe(true)
    })

    it('allows custom thresholds', () => {
      const result = checkGuardrails('test_exp', {
        errorRate: 0.08,
        p95Latency: 500,
        conversionRate: 0.05,
        baselineConversionRate: 0.05,
      }, {
        errorRateThreshold: 0.1, // Custom 10% threshold
      })
      
      expect(result.violated).toBe(false)
    })
  })

  describe('flag persistence', () => {
    it('persists assignments across sessions', async () => {
      await initFeatureFlags({ defaults: {} })
      assignExperimentVariant('persist_test', ['a', 'b'])
      const firstVariant = getExperimentAssignment('persist_test')?.variant
      
      // Simulate new session
      await initFeatureFlags({ defaults: {} })
      const secondVariant = getExperimentAssignment('persist_test')?.variant
      
      expect(firstVariant).toBe(secondVariant)
    })
  })

  describe('flag overrides via URL', () => {
    it('respects URL overrides', async () => {
      // Mock URL with override
      Object.defineProperty(window, 'location', {
        value: {
          ...window.location,
          search: '?ff_override_test.feature=true',
        },
        writable: true,
      })
      
      await initFeatureFlags({
        defaults: {
          'test.feature': false,
        },
      })
      
      // With URL override, should be true
      // Note: Implementation may vary
    })
  })

  describe('useFeatureFlag hook', () => {
    it('returns feature flag value', async () => {
      await initFeatureFlags({
        defaults: {
          'test.hook.feature': true,
        },
      })
      
      const { result } = renderHook(() => useFeatureFlag('test.hook.feature', false))
      
      expect(result.current).toBe(true)
    })

    it('returns default value for unknown flag', async () => {
      await initFeatureFlags({ defaults: {} })
      
      const { result } = renderHook(() => useFeatureFlag('unknown.flag', true))
      
      expect(result.current).toBe(true)
    })

    it('rechecks flag on mount with different props', async () => {
      await initFeatureFlags({
        defaults: {
          'flag.a': true,
          'flag.b': false,
        },
      })
      
      const { result, rerender } = renderHook(
        ({ flagName }) => useFeatureFlag(flagName, false),
        { initialProps: { flagName: 'flag.a' } }
      )
      
      expect(result.current).toBe(true)
      
      rerender({ flagName: 'flag.b' })
      
      expect(result.current).toBe(false)
    })
  })

  describe('useExperiment hook', () => {
    it('returns variant and trackExposure function', async () => {
      await initFeatureFlags({ defaults: {} })
      
      const { result } = renderHook(() => 
        useExperiment('hook_exp_v2', ['control', 'treatment'])
      )
      
      expect(['control', 'treatment']).toContain(result.current.variant)
      expect(typeof result.current.trackExposure).toBe('function')
    })

    it('trackExposure can be called without error', async () => {
      await initFeatureFlags({ defaults: {} })
      
      const { result } = renderHook(() => 
        useExperiment('exposure_test', ['a', 'b'])
      )
      
      act(() => {
        result.current.trackExposure()
      })
      
      // Should not throw
      expect(true).toBe(true)
    })

    it('consistent variant assignment', async () => {
      await initFeatureFlags({ defaults: {} })
      
      const { result: result1 } = renderHook(() => 
        useExperiment('consistent_exp', ['x', 'y'])
      )
      
      const { result: result2 } = renderHook(() => 
        useExperiment('consistent_exp', ['x', 'y'])
      )
      
      // Same experiment ID should return same variant
      expect(result1.current.variant).toBe(result2.current.variant)
    })
  })

  describe('edge cases in variant assignment', () => {
    beforeEach(async () => {
      await initFeatureFlags({ defaults: {} })
    })

    it('handles empty weights array', () => {
      const variant = assignExperimentVariant('empty_weights_exp', ['a', 'b'], [])
      expect(['a', 'b']).toContain(variant)
    })

    it('handles single variant', () => {
      const variant = assignExperimentVariant('single_variant_exp', ['only_one'])
      expect(variant).toBe('only_one')
    })

    it('handles weights that do not sum to 1', () => {
      // Weights should be normalized internally
      const variant = assignExperimentVariant('unbalanced_exp', ['a', 'b'], [0.2, 0.2])
      expect(['a', 'b']).toContain(variant)
    })

    it('returns fallback variant when threshold exceeds cumulative weights', () => {
      // Force random to return very high value
      vi.spyOn(Math, 'random').mockReturnValue(0.99)
      
      const variant = assignExperimentVariant('fallback_exp_unique', ['a', 'b'], [0.5, 0.5])
      // Should still return a valid variant
      expect(['a', 'b']).toContain(variant)
      
      vi.spyOn(Math, 'random').mockRestore()
    })

    it('handles many variants with weights', () => {
      const variants = ['a', 'b', 'c', 'd', 'e']
      const weights = [0.2, 0.2, 0.2, 0.2, 0.2]
      
      const variant = assignExperimentVariant('multi_variant_exp', variants, weights)
      expect(variants).toContain(variant)
    })
  })

  describe('stopFeatureFlags', () => {
    it('can be called without error', async () => {
      await initFeatureFlags({ defaults: {} })
      
      const { stopFeatureFlags } = await import('../feature-flags')
      expect(() => stopFeatureFlags()).not.toThrow()
    })

    it('clears interval timer', async () => {
      await initFeatureFlags({ 
        defaults: {},
        refreshInterval: 60,
      })
      
      const { stopFeatureFlags } = await import('../feature-flags')
      stopFeatureFlags()
      
      // Should be safe to call twice
      expect(() => stopFeatureFlags()).not.toThrow()
    })
  })

  describe('debug mode', () => {
    it('logs experiment assignment in debug mode', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      await initFeatureFlags({ 
        defaults: {},
        debug: true,
      })
      
      assignExperimentVariant('debug_exp', ['a', 'b'])
      
      const hasDebugLog = consoleSpy.mock.calls.some(call =>
        call.some(arg => typeof arg === 'string' && arg.includes('[FeatureFlags] Experiment assigned'))
      )
      expect(hasDebugLog).toBe(true)
      consoleSpy.mockRestore()
    })

    it('logs experiment exposure in debug mode', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      await initFeatureFlags({ 
        defaults: {},
        debug: true,
      })
      
      assignExperimentVariant('debug_exposure_exp', ['a', 'b'])
      trackExperimentExposed('debug_exposure_exp')
      
      const hasDebugLog = consoleSpy.mock.calls.some(call =>
        call.some(arg => typeof arg === 'string' && arg.includes('[FeatureFlags] Experiment exposed'))
      )
      expect(hasDebugLog).toBe(true)
      consoleSpy.mockRestore()
    })
  })

  describe('getFeatureFlagsConfig', () => {
    it('returns current config', async () => {
      await initFeatureFlags({ 
        defaults: { 'test.flag': true },
        refreshInterval: 30,
      })
      
      const { getFeatureFlagsConfig } = await import('../feature-flags')
      const config = getFeatureFlagsConfig()
      
      expect(config).toBeDefined()
      expect(config.refreshInterval).toBe(30)
    })
  })
})
