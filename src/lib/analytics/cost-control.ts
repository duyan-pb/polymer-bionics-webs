/**
 * Cost Control & Throttling (Epic 15)
 * 
 * Implements budget controls and throttling for analytics:
 * - Event rate limiting per session
 * - Daily/monthly event budgets
 * - Automatic downsampling under load
 * - Cost estimation based on event counts
 * 
 * Prevents runaway analytics costs while maintaining data quality.
 */

import { canTrack } from './consent'

// =============================================================================
// TYPES
// =============================================================================

export interface CostControlConfig {
  /** Whether cost controls are enabled */
  enabled: boolean
  /** Maximum events per minute per session */
  eventsPerMinute: number
  /** Maximum events per session */
  eventsPerSession: number
  /** Maximum events per day (across all sessions) */
  eventsPerDay: number
  /** Maximum events per month */
  eventsPerMonth: number
  /** Base sampling rate (1 = 100%, 0.5 = 50%) */
  baseSamplingRate: number
  /** Aggressive sampling rate when approaching limits */
  aggressiveSamplingRate: number
  /** Threshold (% of limit) to trigger aggressive sampling */
  aggressiveSamplingThreshold: number
  /** Event type priorities (higher = more important, less likely to be dropped) */
  eventPriorities: Record<string, number>
  /** Cost per 1000 events (for estimation) */
  costPer1000Events: number
  /** Monthly budget limit in dollars */
  monthlyBudget: number
  /** Enable debug logging */
  debug: boolean
}

export interface UsageMetrics {
  /** Events in current minute */
  eventsThisMinute: number
  /** Events in current session */
  eventsThisSession: number
  /** Events today */
  eventsToday: number
  /** Events this month */
  eventsThisMonth: number
  /** Timestamp of last minute reset */
  lastMinuteReset: number
  /** Timestamp of last day reset */
  lastDayReset: string
  /** Timestamp of last month reset */
  lastMonthReset: string
  /** Events dropped due to throttling */
  eventsDropped: number
  /** Current sampling rate */
  currentSamplingRate: number
}

export interface ThrottleDecision {
  /** Whether the event should be allowed */
  allowed: boolean
  /** Reason for the decision */
  reason: 'allowed' | 'rate_limited' | 'session_limit' | 'daily_limit' | 'monthly_limit' | 'sampled_out' | 'budget_exceeded'
  /** Current sampling rate applied */
  samplingRate: number
}

// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================

const DEFAULT_CONFIG: CostControlConfig = {
  enabled: true,
  eventsPerMinute: 60,          // 1 event per second
  eventsPerSession: 1000,       // Reasonable session limit
  eventsPerDay: 100000,         // 100k events/day
  eventsPerMonth: 2000000,      // 2M events/month
  baseSamplingRate: 1.0,        // 100% by default
  aggressiveSamplingRate: 0.1,  // 10% when approaching limits
  aggressiveSamplingThreshold: 0.8, // Trigger at 80% of limit
  eventPriorities: {
    // Higher priority = less likely to be dropped
    'conversion': 10,
    'error': 9,
    'page_view': 8,
    'experiment_assigned': 7,
    'form_submit': 6,
    'click': 3,
    'scroll': 1,
    'mouse_move': 0,
  },
  costPer1000Events: 0.01,      // $0.01 per 1000 events (estimate)
  monthlyBudget: 100,           // $100/month budget
  debug: false,
}

// Priority thresholds - events below this priority are dropped first
const HIGH_PRIORITY_THRESHOLD = 5
const CRITICAL_PRIORITY_THRESHOLD = 8

// =============================================================================
// STATE
// =============================================================================

let config: CostControlConfig = { ...DEFAULT_CONFIG }
let metrics: UsageMetrics = createInitialMetrics()

function createInitialMetrics(): UsageMetrics {
  return {
    eventsThisMinute: 0,
    eventsThisSession: 0,
    eventsToday: 0,
    eventsThisMonth: 0,
    lastMinuteReset: Date.now(),
    lastDayReset: new Date().toISOString().split('T')[0] ?? '',
    lastMonthReset: new Date().toISOString().substring(0, 7),
    eventsDropped: 0,
    currentSamplingRate: 1.0,
  }
}

// =============================================================================
// STORAGE
// =============================================================================

const STORAGE_KEY = 'pb_cost_metrics'

/**
 * Load metrics from localStorage
 */
function loadMetrics(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as UsageMetrics
      
      // Reset counters if day/month has changed
      const today = new Date().toISOString().split('T')[0] ?? ''
      const thisMonth = new Date().toISOString().substring(0, 7)
      
      if (parsed.lastDayReset !== today) {
        parsed.eventsToday = 0
        parsed.lastDayReset = today
      }
      
      if (parsed.lastMonthReset !== thisMonth) {
        parsed.eventsThisMonth = 0
        parsed.lastMonthReset = thisMonth
      }
      
      metrics = parsed
    }
  } catch {
    // Use initial metrics
  }
}

/**
 * Save metrics to localStorage
 */
function saveMetrics(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics))
  } catch {
    // localStorage not available
  }
}

// =============================================================================
// THROTTLING LOGIC
// =============================================================================

/**
 * Check if an event should be allowed based on cost controls
 */
export function shouldAllowEvent(eventType: string): ThrottleDecision {
  if (!config.enabled) {
    return { allowed: true, reason: 'allowed', samplingRate: 1.0 }
  }
  
  // Check consent first
  if (!canTrack('analytics')) {
    return { allowed: false, reason: 'allowed', samplingRate: 0 }
  }
  
  // Reset minute counter if needed
  const now = Date.now()
  if (now - metrics.lastMinuteReset > 60000) {
    metrics.eventsThisMinute = 0
    metrics.lastMinuteReset = now
  }
  
  // Calculate current sampling rate based on usage
  const samplingRate = calculateSamplingRate()
  metrics.currentSamplingRate = samplingRate
  
  // Get event priority
  const priority = config.eventPriorities[eventType] ?? 5
  
  // Check hard limits (even high-priority events are blocked)
  
  // Rate limit check
  if (metrics.eventsThisMinute >= config.eventsPerMinute) {
    if (priority < CRITICAL_PRIORITY_THRESHOLD) {
      metrics.eventsDropped++
      return { allowed: false, reason: 'rate_limited', samplingRate }
    }
  }
  
  // Session limit check
  if (metrics.eventsThisSession >= config.eventsPerSession) {
    if (priority < CRITICAL_PRIORITY_THRESHOLD) {
      metrics.eventsDropped++
      return { allowed: false, reason: 'session_limit', samplingRate }
    }
  }
  
  // Daily limit check
  if (metrics.eventsToday >= config.eventsPerDay) {
    if (priority < CRITICAL_PRIORITY_THRESHOLD) {
      metrics.eventsDropped++
      return { allowed: false, reason: 'daily_limit', samplingRate }
    }
  }
  
  // Monthly limit check
  if (metrics.eventsThisMonth >= config.eventsPerMonth) {
    if (priority < CRITICAL_PRIORITY_THRESHOLD) {
      metrics.eventsDropped++
      return { allowed: false, reason: 'monthly_limit', samplingRate }
    }
  }
  
  // Budget check
  const estimatedCost = (metrics.eventsThisMonth / 1000) * config.costPer1000Events
  if (estimatedCost >= config.monthlyBudget) {
    if (priority < CRITICAL_PRIORITY_THRESHOLD) {
      metrics.eventsDropped++
      return { allowed: false, reason: 'budget_exceeded', samplingRate }
    }
  }
  
  // Apply sampling for non-critical events
  if (priority < HIGH_PRIORITY_THRESHOLD && samplingRate < 1.0) {
    if (Math.random() > samplingRate) {
      metrics.eventsDropped++
      return { allowed: false, reason: 'sampled_out', samplingRate }
    }
  }
  
  return { allowed: true, reason: 'allowed', samplingRate }
}

/**
 * Record that an event was sent
 */
export function recordEventSent(): void {
  metrics.eventsThisMinute++
  metrics.eventsThisSession++
  metrics.eventsToday++
  metrics.eventsThisMonth++
  
  // Periodic save (every 10 events)
  if (metrics.eventsThisSession % 10 === 0) {
    saveMetrics()
  }
}

/**
 * Calculate current sampling rate based on usage
 */
function calculateSamplingRate(): number {
  // Start with base rate
  let rate = config.baseSamplingRate
  
  // Check if we're approaching any limits
  const dailyUsage = metrics.eventsToday / config.eventsPerDay
  const monthlyUsage = metrics.eventsThisMonth / config.eventsPerMonth
  const budgetUsage = ((metrics.eventsThisMonth / 1000) * config.costPer1000Events) / config.monthlyBudget
  
  const maxUsage = Math.max(dailyUsage, monthlyUsage, budgetUsage)
  
  // Apply aggressive sampling if approaching limits
  if (maxUsage >= config.aggressiveSamplingThreshold) {
    rate = config.aggressiveSamplingRate
  } else if (maxUsage >= 0.5) {
    // Gradual reduction between 50% and threshold
    const factor = (maxUsage - 0.5) / (config.aggressiveSamplingThreshold - 0.5)
    rate = config.baseSamplingRate - (factor * (config.baseSamplingRate - config.aggressiveSamplingRate))
  }
  
  return Math.max(0, Math.min(1, rate))
}

// =============================================================================
// COST ESTIMATION
// =============================================================================

/**
 * Get estimated costs
 */
export function getEstimatedCosts(): {
  todayCost: number
  monthCost: number
  projectedMonthCost: number
  budgetRemaining: number
  budgetUtilization: number
} {
  const todayCost = (metrics.eventsToday / 1000) * config.costPer1000Events
  const monthCost = (metrics.eventsThisMonth / 1000) * config.costPer1000Events
  
  // Project monthly cost based on current day of month
  const dayOfMonth = new Date().getDate()
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  const projectedMonthCost = (monthCost / dayOfMonth) * daysInMonth
  
  return {
    todayCost,
    monthCost,
    projectedMonthCost,
    budgetRemaining: Math.max(0, config.monthlyBudget - monthCost),
    budgetUtilization: monthCost / config.monthlyBudget,
  }
}

// =============================================================================
// METRICS ACCESS
// =============================================================================

/**
 * Get current usage metrics
 */
export function getUsageMetrics(): UsageMetrics {
  return { ...metrics }
}

/**
 * Get throttling status
 */
export function getThrottlingStatus(): {
  isThrottling: boolean
  currentSamplingRate: number
  eventsDropped: number
  limitStatus: {
    minute: { current: number; limit: number; utilization: number }
    session: { current: number; limit: number; utilization: number }
    day: { current: number; limit: number; utilization: number }
    month: { current: number; limit: number; utilization: number }
  }
} {
  return {
    isThrottling: metrics.currentSamplingRate < 1.0 || metrics.eventsDropped > 0,
    currentSamplingRate: metrics.currentSamplingRate,
    eventsDropped: metrics.eventsDropped,
    limitStatus: {
      minute: {
        current: metrics.eventsThisMinute,
        limit: config.eventsPerMinute,
        utilization: metrics.eventsThisMinute / config.eventsPerMinute,
      },
      session: {
        current: metrics.eventsThisSession,
        limit: config.eventsPerSession,
        utilization: metrics.eventsThisSession / config.eventsPerSession,
      },
      day: {
        current: metrics.eventsToday,
        limit: config.eventsPerDay,
        utilization: metrics.eventsToday / config.eventsPerDay,
      },
      month: {
        current: metrics.eventsThisMonth,
        limit: config.eventsPerMonth,
        utilization: metrics.eventsThisMonth / config.eventsPerMonth,
      },
    },
  }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize cost controls
 */
export function initCostControls(options: Partial<CostControlConfig> = {}): void {
  config = { ...DEFAULT_CONFIG, ...options }
  
  // Load persisted metrics
  loadMetrics()
  
  // Save on page unload
  window.addEventListener('beforeunload', saveMetrics)
  
  if (config.debug) {
    // eslint-disable-next-line no-console
    console.log('[CostControl] Initialized with config:', config)
    // eslint-disable-next-line no-console
    console.log('[CostControl] Current metrics:', metrics)
  }
}

/**
 * Update cost control configuration
 */
export function updateCostControlConfig(options: Partial<CostControlConfig>): void {
  config = { ...config, ...options }
}

/**
 * Reset session metrics (call on new session)
 */
export function resetSessionMetrics(): void {
  metrics.eventsThisSession = 0
  metrics.eventsThisMinute = 0
  metrics.lastMinuteReset = Date.now()
}

/**
 * Get current configuration
 */
export function getCostControlConfig(): CostControlConfig {
  return { ...config }
}

// =============================================================================
// INTEGRATION HELPER
// =============================================================================

/**
 * Wrap a tracking function with cost controls
 */
export function withCostControl<T extends (...args: unknown[]) => boolean>(
  trackFn: T,
  eventType: string
): T {
  return ((...args: unknown[]) => {
    const decision = shouldAllowEvent(eventType)
    
    if (!decision.allowed) {
      if (config.debug) {
        // eslint-disable-next-line no-console
        console.log(`[CostControl] Event dropped: ${eventType}, reason: ${decision.reason}`)
      }
      return false
    }
    
    const result = trackFn(...args)
    
    if (result) {
      recordEventSent()
    }
    
    return result
  }) as T
}
