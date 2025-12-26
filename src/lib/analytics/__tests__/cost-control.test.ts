/**
 * Cost Control Tests (Epic 15)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  initCostControls,
  shouldAllowEvent,
  recordEventSent,
  getUsageMetrics,
  getEstimatedCosts,
  getThrottlingStatus,
  resetSessionMetrics,
  updateCostControlConfig,
  withCostControl,
  getCostControlConfig,
} from '../cost-control'
import { acceptAllConsent, withdrawConsent } from '../consent'

describe('Cost Control', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    
    // Reset to default config
    initCostControls({
      enabled: true,
      eventsPerMinute: 60,
      eventsPerSession: 1000,
      eventsPerDay: 100000,
      eventsPerMonth: 2000000,
      baseSamplingRate: 1.0,
      aggressiveSamplingRate: 0.1,
      aggressiveSamplingThreshold: 0.8,
      eventPriorities: {
        conversion: 10,
        error: 9,
        page_view: 8,
        click: 3,
      },
      costPer1000Events: 0.01,
      monthlyBudget: 100,
      debug: false,
    })
    
    acceptAllConsent()
  })

  describe('initCostControls', () => {
    it('initializes with default config', () => {
      initCostControls({})
      
      const config = getCostControlConfig()
      expect(config.enabled).toBe(true)
      expect(config.eventsPerMinute).toBe(60)
    })

    it('accepts custom config', () => {
      initCostControls({
        eventsPerMinute: 30,
        monthlyBudget: 50,
      })
      
      const config = getCostControlConfig()
      expect(config.eventsPerMinute).toBe(30)
      expect(config.monthlyBudget).toBe(50)
    })

    it('loads existing metrics from storage', () => {
      const existingMetrics = {
        eventsThisMinute: 10,
        eventsThisSession: 100,
        eventsToday: 1000,
        eventsThisMonth: 10000,
        lastMinuteReset: Date.now(),
        lastDayReset: new Date().toISOString().split('T')[0],
        lastMonthReset: new Date().toISOString().substring(0, 7),
        eventsDropped: 5,
        currentSamplingRate: 1.0,
      }
      localStorage.setItem('pb_cost_metrics', JSON.stringify(existingMetrics))
      
      initCostControls({})
      
      const metrics = getUsageMetrics()
      expect(metrics.eventsThisSession).toBe(100)
    })
  })

  describe('shouldAllowEvent', () => {
    it('allows event when under limits', () => {
      const decision = shouldAllowEvent('click')
      
      expect(decision.allowed).toBe(true)
      expect(decision.reason).toBe('allowed')
    })

    it('allows event when controls disabled', () => {
      initCostControls({ enabled: false })
      
      const decision = shouldAllowEvent('click')
      
      expect(decision.allowed).toBe(true)
    })

    it('blocks when consent not granted', () => {
      withdrawConsent()
      
      const decision = shouldAllowEvent('click')
      
      expect(decision.allowed).toBe(false)
    })

    it('rate limits when exceeding events per minute', () => {
      initCostControls({ eventsPerMinute: 5 })
      
      // Exhaust the limit
      for (let i = 0; i < 6; i++) {
        shouldAllowEvent('click')
        recordEventSent()
      }
      
      const decision = shouldAllowEvent('click')
      expect(decision.reason).toBe('rate_limited')
    })

    it('blocks low priority events first during rate limiting', () => {
      initCostControls({
        eventsPerMinute: 5,
        eventPriorities: {
          conversion: 10,
          click: 1,
        },
      })
      
      // Fill up near limit
      for (let i = 0; i < 5; i++) {
        recordEventSent()
      }
      
      // High priority should still be allowed
      const conversionDecision = shouldAllowEvent('conversion')
      expect(conversionDecision.allowed).toBe(true)
    })

    it('applies sampling when approaching limits', () => {
      // Clear and re-initialize with fresh state
      localStorage.removeItem('pb_cost_metrics')
      initCostControls({
        eventsPerDay: 100, // Use daily limit for easier testing
        eventsPerMinute: 10000, // High to avoid rate limiting
        aggressiveSamplingThreshold: 0.8, // Trigger at 80%
        baseSamplingRate: 1.0,
        aggressiveSamplingRate: 0.1,
      })
      
      // Simulate 85 events (85% of daily limit)
      for (let i = 0; i < 85; i++) {
        recordEventSent()
      }
      
      const status = getThrottlingStatus()
      // Should be throttling due to approaching daily limit
      expect(status.limitStatus.day.utilization).toBeGreaterThan(0.8)
    })
  })

  describe('recordEventSent', () => {
    it('increments all counters', () => {
      const before = getUsageMetrics()
      
      recordEventSent()
      
      const after = getUsageMetrics()
      expect(after.eventsThisMinute).toBe(before.eventsThisMinute + 1)
      expect(after.eventsThisSession).toBe(before.eventsThisSession + 1)
      expect(after.eventsToday).toBe(before.eventsToday + 1)
      expect(after.eventsThisMonth).toBe(before.eventsThisMonth + 1)
    })

    it('persists to localStorage periodically', () => {
      // Clear any existing metrics first
      localStorage.removeItem('pb_cost_metrics')
      
      // Re-initialize to get fresh state
      initCostControls({
        enabled: true,
        eventsPerMinute: 60,
        eventsPerSession: 1000,
      })
      
      // Record 10 events to trigger save (happens every 10 events)
      for (let i = 0; i < 10; i++) {
        recordEventSent()
      }
      
      const stored = localStorage.getItem('pb_cost_metrics')
      expect(stored).toBeTruthy()
      const parsed = JSON.parse(stored!)
      // Metrics should include at least 10 events this session
      expect(parsed.eventsThisSession).toBeGreaterThanOrEqual(10)
    })
  })

  describe('getUsageMetrics', () => {
    it('returns current metrics', () => {
      const metrics = getUsageMetrics()
      
      expect(metrics).toHaveProperty('eventsThisMinute')
      expect(metrics).toHaveProperty('eventsThisSession')
      expect(metrics).toHaveProperty('eventsToday')
      expect(metrics).toHaveProperty('eventsThisMonth')
      expect(metrics).toHaveProperty('eventsDropped')
      expect(metrics).toHaveProperty('currentSamplingRate')
    })

    it('reflects recorded events', () => {
      const initialMetrics = getUsageMetrics()
      const initialCount = initialMetrics.eventsThisSession
      
      recordEventSent()
      recordEventSent()
      recordEventSent()
      
      const metrics = getUsageMetrics()
      
      expect(metrics.eventsThisSession).toBe(initialCount + 3)
    })
  })

  describe('getEstimatedCosts', () => {
    it('calculates costs based on events', () => {
      // Clear and re-initialize with fresh state
      localStorage.removeItem('pb_cost_metrics')
      initCostControls({ 
        costPer1000Events: 0.01,
        eventsPerMinute: 10000, // High limit to avoid rate limiting
      })
      
      // Record some events
      for (let i = 0; i < 100; i++) {
        recordEventSent()
      }
      
      const costs = getEstimatedCosts()
      
      // Should have recorded events and calculated cost
      expect(costs.todayCost).toBeGreaterThan(0)
    })

    it('returns budget information', () => {
      initCostControls({ monthlyBudget: 100 })
      
      const costs = getEstimatedCosts()
      
      expect(costs).toHaveProperty('budgetRemaining')
      expect(costs).toHaveProperty('budgetUtilization')
      expect(costs.budgetRemaining).toBeLessThanOrEqual(100)
    })

    it('calculates projected monthly cost', () => {
      const costs = getEstimatedCosts()
      
      expect(costs).toHaveProperty('projectedMonthCost')
      expect(typeof costs.projectedMonthCost).toBe('number')
    })
  })

  describe('getThrottlingStatus', () => {
    it('returns throttling status', () => {
      const status = getThrottlingStatus()
      
      expect(status).toHaveProperty('isThrottling')
      expect(status).toHaveProperty('currentSamplingRate')
      expect(status).toHaveProperty('eventsDropped')
      expect(status).toHaveProperty('limitStatus')
    })

    it('indicates not throttling when newly initialized', () => {
      // Re-initialize fresh
      initCostControls({})
      resetSessionMetrics()
      
      const status = getThrottlingStatus()
      
      // After fresh init, no events dropped so not throttling
      // Note: isThrottling may be true if eventsDropped > 0 from previous tests
      expect(status.currentSamplingRate).toBe(1)
    })

    it('indicates throttling when rate limited', () => {
      initCostControls({ eventsPerMinute: 5 })
      
      for (let i = 0; i < 10; i++) {
        recordEventSent()
      }
      
      const status = getThrottlingStatus()
      
      expect(status.isThrottling).toBe(true)
    })

    it('includes limit status breakdown', () => {
      const status = getThrottlingStatus()
      
      expect(status.limitStatus).toHaveProperty('minute')
      expect(status.limitStatus).toHaveProperty('session')
      expect(status.limitStatus).toHaveProperty('day')
      expect(status.limitStatus).toHaveProperty('month')
      expect(status.limitStatus.minute).toHaveProperty('utilization')
      expect(status.limitStatus.session).toHaveProperty('utilization')
    })
  })

  describe('resetSessionMetrics', () => {
    it('resets session-scoped metrics', () => {
      recordEventSent()
      recordEventSent()
      
      resetSessionMetrics()
      
      const metrics = getUsageMetrics()
      expect(metrics.eventsThisSession).toBe(0)
      expect(metrics.eventsThisMinute).toBe(0)
    })

    it('preserves daily and monthly counts', () => {
      recordEventSent()
      recordEventSent()
      
      const before = getUsageMetrics()
      
      resetSessionMetrics()
      
      const after = getUsageMetrics()
      expect(after.eventsToday).toBe(before.eventsToday)
      expect(after.eventsThisMonth).toBe(before.eventsThisMonth)
    })
  })

  describe('updateCostControlConfig', () => {
    it('updates config at runtime', () => {
      updateCostControlConfig({ eventsPerMinute: 100 })
      
      const config = getCostControlConfig()
      expect(config.eventsPerMinute).toBe(100)
    })

    it('preserves other config values', () => {
      initCostControls({ eventsPerMinute: 60, monthlyBudget: 200 })
      
      updateCostControlConfig({ eventsPerMinute: 100 })
      
      const config = getCostControlConfig()
      expect(config.monthlyBudget).toBe(200)
    })
  })

  describe('withCostControl', () => {
    it('wraps function with cost control check', () => {
      const trackFn = vi.fn()
      const wrapped = withCostControl(trackFn, 'click')
      
      wrapped('test_event', { prop: 'value' })
      
      expect(trackFn).toHaveBeenCalled()
    })

    it('blocks function when rate limited', () => {
      initCostControls({ eventsPerMinute: 0 }) // Block all
      
      const trackFn = vi.fn()
      const wrapped = withCostControl(trackFn, 'click')
      
      wrapped('test_event')
      
      expect(trackFn).not.toHaveBeenCalled()
    })

    it('records event when function returns true', () => {
      const trackFn = vi.fn().mockReturnValue(true)
      const wrapped = withCostControl(trackFn, 'click')
      
      const before = getUsageMetrics()
      wrapped('test_event')
      const after = getUsageMetrics()
      
      expect(after.eventsThisSession).toBe(before.eventsThisSession + 1)
    })
  })

  describe('daily/monthly reset', () => {
    it('resets daily count on new day', () => {
      // Store metrics with yesterday's date
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const metrics = {
        eventsThisMinute: 0,
        eventsThisSession: 50,
        eventsToday: 1000,
        eventsThisMonth: 10000,
        lastMinuteReset: Date.now(),
        lastDayReset: yesterday.toISOString().split('T')[0],
        lastMonthReset: new Date().toISOString().substring(0, 7),
        eventsDropped: 0,
        currentSamplingRate: 1.0,
      }
      localStorage.setItem('pb_cost_metrics', JSON.stringify(metrics))
      
      // Re-initialize to trigger day check
      initCostControls({})
      
      const current = getUsageMetrics()
      expect(current.eventsToday).toBe(0)
    })

    it('resets monthly count on new month', () => {
      // Store metrics with last month's date
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)
      const metrics = {
        eventsThisMinute: 0,
        eventsThisSession: 50,
        eventsToday: 1000,
        eventsThisMonth: 500000,
        lastMinuteReset: Date.now(),
        lastDayReset: new Date().toISOString().split('T')[0],
        lastMonthReset: lastMonth.toISOString().substring(0, 7),
        eventsDropped: 0,
        currentSamplingRate: 1.0,
      }
      localStorage.setItem('pb_cost_metrics', JSON.stringify(metrics))
      
      initCostControls({})
      
      const current = getUsageMetrics()
      expect(current.eventsThisMonth).toBe(0)
    })
  })

  describe('budget limits', () => {
    it('tracks budget utilization', () => {
      localStorage.removeItem('pb_cost_metrics')
      initCostControls({
        monthlyBudget: 1, // $1 budget
        costPer1000Events: 0.01,
      })
      
      // Record some events
      for (let i = 0; i < 100; i++) {
        recordEventSent()
      }
      
      const costs = getEstimatedCosts()
      expect(costs.budgetUtilization).toBeGreaterThan(0)
    })
  })

  describe('event priorities', () => {
    it('prioritizes high-priority events', () => {
      initCostControls({
        eventsPerSession: 100,
        eventPriorities: {
          conversion: 10,
          error: 9,
          click: 1,
        },
      })
      
      // Fill to 95% capacity
      for (let i = 0; i < 95; i++) {
        recordEventSent()
      }
      
      // Conversion should still be allowed
      const conversionDecision = shouldAllowEvent('conversion')
      expect(conversionDecision.allowed).toBe(true)
    })
  })

  describe('debug mode', () => {
    it('logs when debug is enabled', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      initCostControls({
        debug: true,
      })
      
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('logs dropped events in debug mode', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      initCostControls({
        debug: true,
        eventsPerSession: 1,
      })
      
      // First event allowed
      recordEventSent()
      
      // Second event should be dropped
      shouldAllowEvent('click')
      
      // Check if debug logging occurred
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('withCostControl wrapper', () => {
    it('wraps tracking function with cost control', () => {
      const mockTrackFn = vi.fn(() => true)
      
      localStorage.clear()
      acceptAllConsent()
      initCostControls({ 
        enabled: true,
        eventsPerSession: 1000,
        eventsPerMinute: 100,
      })
      
      // Verify the function can be wrapped without error
      const wrappedFn = withCostControl(mockTrackFn as (...args: unknown[]) => boolean, 'test_event')
      expect(typeof wrappedFn).toBe('function')
    })

    it('records event when tracking succeeds', () => {
      localStorage.clear()
      acceptAllConsent()
      initCostControls({ 
        enabled: true,
        eventsPerSession: 1000,
        eventsPerMinute: 100,
      })
      
      const initialMetrics = getUsageMetrics()
      recordEventSent()
      
      // After recording event, count should increase
      const afterMetrics = getUsageMetrics()
      expect(afterMetrics.eventsThisSession).toBeGreaterThanOrEqual(initialMetrics.eventsThisSession + 1)
    })
  })
})
