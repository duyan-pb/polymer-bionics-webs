/**
 * Feature Flags Module (Epic 11)
 * 
 * Implements feature flags with Azure App Configuration support.
 * Tracks experiment assignment and exposure events for analytics.
 */

import type { FeatureFlag, ExperimentAssignment } from './analytics/types'
import { track } from './analytics/tracker'
import { getSessionId, getAnonymousId } from './analytics/identity'

// =============================================================================
// STATE
// =============================================================================

interface FeatureFlagsState {
  flags: Map<string, FeatureFlag>
  assignments: Map<string, ExperimentAssignment>
  initialized: boolean
  lastFetched: number | null
}

const state: FeatureFlagsState = {
  flags: new Map(),
  assignments: new Map(),
  initialized: false,
  lastFetched: null,
}

// Default flags (used before Azure App Config loads)
const DEFAULT_FLAGS: Record<string, boolean> = {
  'analytics.enhanced_tracking': true,
  'analytics.session_replay': false,
  'marketing.personalization': false,
  'ui.new_contact_form': false,
  'ui.video_autoplay': true,
}

// =============================================================================
// INITIALIZATION
// =============================================================================

interface FeatureFlagsConfig {
  /** Azure App Configuration endpoint */
  endpoint?: string
  /** Refresh interval in seconds */
  refreshInterval?: number
  /** Default flags to use before fetch */
  defaults?: Record<string, boolean>
  /** Enable debug logging */
  debug?: boolean
}

let config: FeatureFlagsConfig = {}
let refreshIntervalId: number | null = null

/**
 * Initialize feature flags
 */
export async function initFeatureFlags(userConfig: FeatureFlagsConfig = {}): Promise<void> {
  config = { ...userConfig }
  
  // Set defaults
  const defaults = { ...DEFAULT_FLAGS, ...config.defaults }
  for (const [name, enabled] of Object.entries(defaults)) {
    state.flags.set(name, { name, enabled })
  }
  
  state.initialized = true
  
  // Fetch from Azure App Configuration if endpoint provided
  if (config.endpoint) {
    await fetchFlags()
    
    // Set up periodic refresh
    if (config.refreshInterval && config.refreshInterval > 0) {
      refreshIntervalId = window.setInterval(
        fetchFlags,
        config.refreshInterval * 1000
      )
    }
  }
  
  if (config.debug) {
    // eslint-disable-next-line no-console
    console.log('[FeatureFlags] Initialized with flags:', Object.fromEntries(state.flags))
  }
}

/**
 * Fetch flags from Azure App Configuration
 */
async function fetchFlags(): Promise<void> {
  if (!config.endpoint) {return}
  
  try {
    const response = await fetch(`${config.endpoint}/kv?key=feature.*`, {
      headers: {
        'Accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch flags: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Parse Azure App Config response
    if (data.items) {
      for (const item of data.items) {
        const name = item.key.replace('feature.', '')
        const value = JSON.parse(item.value)
        
        state.flags.set(name, {
          name,
          enabled: value.enabled ?? false,
          variant: value.variant,
          targetingRules: value.targeting,
        })
      }
    }
    
    state.lastFetched = Date.now()
    
    if (config.debug) {
      // eslint-disable-next-line no-console
      console.log('[FeatureFlags] Fetched flags:', Object.fromEntries(state.flags))
    }
  } catch (error) {
    console.error('[FeatureFlags] Failed to fetch flags:', error)
  }
}

/**
 * Stop feature flags refresh
 */
export function stopFeatureFlags(): void {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
    refreshIntervalId = null
  }
}

/**
 * Get current configuration
 */
export function getFeatureFlagsConfig(): FeatureFlagsConfig {
  return { ...config }
}

// =============================================================================
// FLAG EVALUATION
// =============================================================================

/**
 * Check if a feature flag is enabled
 * 
 * @param flagName - Name of the feature flag
 * @param defaultValue - Default value if flag not found
 */
export function isFeatureEnabled(flagName: string, defaultValue = false): boolean {
  const flag = state.flags.get(flagName)
  return flag?.enabled ?? defaultValue
}

/**
 * Get a feature flag value with variant
 */
export function getFeatureFlag(flagName: string): FeatureFlag | null {
  return state.flags.get(flagName) || null
}

/**
 * Get all feature flags
 */
export function getAllFlags(): Record<string, boolean> {
  const result: Record<string, boolean> = {}
  for (const [name, flag] of state.flags) {
    result[name] = flag.enabled
  }
  return result
}

// =============================================================================
// EXPERIMENT TRACKING (Task 11.2)
// =============================================================================

/**
 * Track experiment assignment
 * Called when a user is assigned to an experiment variant
 */
export function trackExperimentAssigned(
  experimentId: string,
  variant: string,
  properties: Record<string, unknown> = {}
): void {
  const sessionId = getSessionId()
  const anonymousId = getAnonymousId()
  
  // Check if already assigned in this session
  const existingAssignment = state.assignments.get(experimentId)
  if (existingAssignment && existingAssignment.sessionId === sessionId) {
    // Already assigned, don't track again
    return
  }
  
  // Store assignment
  const assignment: ExperimentAssignment = {
    experimentId,
    variant,
    assignedAt: new Date().toISOString(),
    sessionId,
  }
  state.assignments.set(experimentId, assignment)
  
  // Track event
  track('experiment_assigned', {
    experiment_id: experimentId,
    experiment_variant: variant,
    anonymous_id: anonymousId,
    session_id: sessionId,
    ...properties,
  })
  
  if (config.debug) {
    // eslint-disable-next-line no-console
    console.log('[FeatureFlags] Experiment assigned:', experimentId, variant)
  }
}

/**
 * Track experiment exposure
 * Called when a user actually sees/interacts with the experiment
 */
export function trackExperimentExposed(
  experimentId: string,
  properties: Record<string, unknown> = {}
): void {
  const assignment = state.assignments.get(experimentId)
  if (!assignment) {
    console.warn(`[FeatureFlags] No assignment found for experiment: ${experimentId}`)
    return
  }
  
  // Track exposure event
  track('experiment_exposed', {
    experiment_id: experimentId,
    experiment_variant: assignment.variant,
    time_since_assignment: Date.now() - new Date(assignment.assignedAt).getTime(),
    ...properties,
  })
  
  if (config.debug) {
    // eslint-disable-next-line no-console
    console.log('[FeatureFlags] Experiment exposed:', experimentId, assignment.variant)
  }
}

/**
 * Get experiment assignment for a user
 */
export function getExperimentAssignment(experimentId: string): ExperimentAssignment | null {
  return state.assignments.get(experimentId) || null
}

// =============================================================================
// VARIANT ASSIGNMENT
// =============================================================================

/**
 * Assign a user to an experiment variant
 * Uses consistent hashing based on anonymous ID for sticky assignment
 */
export function assignExperimentVariant(
  experimentId: string,
  variants: string[],
  weights?: number[]
): string {
  if (variants.length === 0) {
    throw new Error('At least one variant is required')
  }
  
  // Check for existing assignment
  const existing = state.assignments.get(experimentId)
  if (existing) {
    return existing.variant
  }
  
  // Use anonymous ID for consistent assignment
  const anonymousId = getAnonymousId()
  const hash = simpleHash(`${experimentId}:${anonymousId}`)
  
  // Weighted random selection
  const normalizedWeights = weights?.length === variants.length
    ? normalizeWeights(weights)
    : variants.map(() => 1 / variants.length)
  
  let cumulative = 0
  const threshold = (hash % 10000) / 10000
  
  for (let i = 0; i < variants.length; i++) {
    const weight = normalizedWeights[i]
    if (weight === undefined) {continue}
    cumulative += weight
    if (threshold < cumulative) {
      const variant = variants[i]
      if (variant) {
        trackExperimentAssigned(experimentId, variant)
        return variant
      }
    }
  }
  
  // Fallback to last variant
  const lastVariant = variants[variants.length - 1]
  if (lastVariant) {
    trackExperimentAssigned(experimentId, lastVariant)
    return lastVariant
  }
  
  // Ultimate fallback - should never reach here
  return variants[0] ?? 'control'
}

/**
 * Simple hash function for consistent assignment
 */
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

/**
 * Normalize weights to sum to 1
 */
function normalizeWeights(weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0)
  return weights.map(w => w / sum)
}

// =============================================================================
// GUARDRAILS (Task 11.3)
// =============================================================================

interface GuardrailConfig {
  /** Maximum error rate threshold (0-1) */
  errorRateThreshold: number
  /** Maximum p95 latency in milliseconds */
  latencyThreshold: number
  /** Minimum conversion rate change to trigger alert (-1 to 1) */
  conversionHarmThreshold: number
}

const DEFAULT_GUARDRAILS: GuardrailConfig = {
  errorRateThreshold: 0.05, // 5% error rate
  latencyThreshold: 3000, // 3 seconds
  conversionHarmThreshold: -0.1, // 10% drop
}

/**
 * Check if guardrails are violated
 * In production, this would query metrics from App Insights
 */
export function checkGuardrails(
  _experimentId: string, // Reserved for future use with experiment-specific guardrails
  metrics: {
    errorRate?: number
    p95Latency?: number
    conversionRate?: number
    baselineConversionRate?: number
  },
  guardrails: GuardrailConfig = DEFAULT_GUARDRAILS
): { violated: boolean; reasons: string[] } {
  const reasons: string[] = []
  
  if (metrics.errorRate !== undefined && metrics.errorRate > guardrails.errorRateThreshold) {
    reasons.push(`Error rate ${(metrics.errorRate * 100).toFixed(1)}% exceeds threshold ${(guardrails.errorRateThreshold * 100).toFixed(1)}%`)
  }
  
  if (metrics.p95Latency !== undefined && metrics.p95Latency > guardrails.latencyThreshold) {
    reasons.push(`P95 latency ${metrics.p95Latency}ms exceeds threshold ${guardrails.latencyThreshold}ms`)
  }
  
  if (
    metrics.conversionRate !== undefined &&
    metrics.baselineConversionRate !== undefined &&
    metrics.baselineConversionRate > 0
  ) {
    const change = (metrics.conversionRate - metrics.baselineConversionRate) / metrics.baselineConversionRate
    if (change < guardrails.conversionHarmThreshold) {
      reasons.push(`Conversion rate dropped ${(Math.abs(change) * 100).toFixed(1)}%, exceeds harm threshold`)
    }
  }
  
  return {
    violated: reasons.length > 0,
    reasons,
  }
}

// =============================================================================
// REACT HOOK
// =============================================================================

import { useState, useEffect, useCallback } from 'react'

/**
 * React hook for feature flags
 */
export function useFeatureFlag(flagName: string, defaultValue = false): boolean {
  const [enabled, setEnabled] = useState(() => isFeatureEnabled(flagName, defaultValue))
  
  useEffect(() => {
    // Re-check on mount (flags might have been fetched)
    setEnabled(isFeatureEnabled(flagName, defaultValue))
    
    // TODO: Add listener for flag changes if implementing real-time updates
  }, [flagName, defaultValue])
  
  return enabled
}

/**
 * React hook for experiments
 */
export function useExperiment(
  experimentId: string,
  variants: string[],
  weights?: number[]
): {
  variant: string
  trackExposure: () => void
} {
  const [variant] = useState(() => assignExperimentVariant(experimentId, variants, weights))
  
  const trackExposure = useCallback(() => {
    trackExperimentExposed(experimentId)
  }, [experimentId])
  
  return { variant, trackExposure }
}
