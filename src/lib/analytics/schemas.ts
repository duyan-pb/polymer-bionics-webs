/**
 * Event Schema Validation (Epic 7)
 * 
 * Defines JSON schemas for analytics events using Zod.
 * Provides runtime validation with clear error messages.
 */

import { z } from 'zod'
import type { ValidationResult, ValidatedEvent, AnalyticsEvent } from './types'

// =============================================================================
// BASE SCHEMAS
// =============================================================================

/**
 * Standard event properties schema
 */
export const StandardEventPropertiesSchema = z.object({
  // Identity
  anonymous_id: z.string().uuid('Invalid anonymous_id format'),
  session_id: z.string().min(1, 'session_id is required'),
  
  // Page context
  page_url: z.string().url('Invalid page_url'),
  page_path: z.string().min(1, 'page_path is required'),
  page_title: z.string(),
  referrer: z.string(),
  
  // UTM parameters (optional)
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
  
  // Device/browser
  device_class: z.enum(['mobile', 'tablet', 'desktop']),
  locale: z.string().min(1),
  timezone: z.string().min(1),
  viewport_width: z.number().int().positive(),
  viewport_height: z.number().int().positive(),
  user_agent: z.string(),
  
  // App context
  env: z.enum(['development', 'staging', 'production']),
  app_version: z.string().min(1),
  consent_state_version: z.string().min(1),
  
  // Timestamp
  timestamp: z.string().datetime(),
  client_timestamp: z.number().int().positive(),
})

// =============================================================================
// EVENT SCHEMAS
// =============================================================================

/**
 * Page view event schema
 */
export const PageViewEventSchema = z.object({
  type: z.literal('page_view'),
  properties: StandardEventPropertiesSchema.extend({
    page_name: z.string().min(1, 'page_name is required'),
    previous_page: z.string().optional(),
  }),
})

/**
 * Track event schema (flexible properties)
 */
export const TrackEventSchema = z.object({
  type: z.literal('track'),
  event_name: z.string().min(1, 'event_name is required').max(100, 'event_name too long'),
  properties: StandardEventPropertiesSchema.passthrough(),
})

/**
 * Conversion event schema
 */
export const ConversionEventSchema = z.object({
  type: z.literal('conversion'),
  event_name: z.string().min(1, 'event_name is required'),
  event_id: z.string().uuid('event_id must be a valid UUID'),
  properties: StandardEventPropertiesSchema.extend({
    conversion_type: z.string().min(1),
    conversion_value: z.number().optional(),
    currency: z.string().length(3).optional(),
  }),
})

/**
 * Union of all event schemas
 */
export const AnalyticsEventSchema = z.discriminatedUnion('type', [
  PageViewEventSchema,
  TrackEventSchema,
  ConversionEventSchema,
])

// =============================================================================
// SPECIFIC EVENT SCHEMAS (defined per tracking plan)
// =============================================================================

/**
 * CTA Click event
 */
export const CTAClickEventSchema = TrackEventSchema.extend({
  event_name: z.literal('cta_clicked'),
  properties: StandardEventPropertiesSchema.extend({
    button_id: z.string().min(1),
    button_text: z.string(),
    button_location: z.string().optional(),
  }),
})

/**
 * Form Submit event
 */
export const FormSubmitEventSchema = TrackEventSchema.extend({
  event_name: z.literal('form_submitted'),
  properties: StandardEventPropertiesSchema.extend({
    form_id: z.string().min(1),
    form_name: z.string(),
    form_type: z.enum(['contact', 'newsletter', 'inquiry', 'other']),
  }),
})

/**
 * Video Play event
 */
export const VideoPlayEventSchema = TrackEventSchema.extend({
  event_name: z.literal('video_played'),
  properties: StandardEventPropertiesSchema.extend({
    video_id: z.string().min(1),
    video_title: z.string(),
    video_duration: z.number().optional(),
    video_position: z.number().optional(),
  }),
})

/**
 * Download event
 */
export const DownloadEventSchema = TrackEventSchema.extend({
  event_name: z.literal('file_downloaded'),
  properties: StandardEventPropertiesSchema.extend({
    file_id: z.string().min(1),
    file_name: z.string(),
    file_type: z.string(),
    file_category: z.string().optional(),
  }),
})

/**
 * Search event
 */
export const SearchEventSchema = TrackEventSchema.extend({
  event_name: z.literal('search_performed'),
  properties: StandardEventPropertiesSchema.extend({
    search_query: z.string().min(1),
    results_count: z.number().int().nonnegative(),
    search_type: z.enum(['global', 'products', 'team', 'datasheets']).optional(),
  }),
})

/**
 * Lead Submitted conversion
 */
export const LeadSubmittedEventSchema = ConversionEventSchema.extend({
  event_name: z.literal('lead_submitted'),
  properties: StandardEventPropertiesSchema.extend({
    conversion_type: z.literal('lead'),
    lead_type: z.enum(['contact', 'inquiry', 'demo_request', 'partnership']),
    lead_source: z.string().optional(),
  }),
})

// =============================================================================
// EVENT REGISTRY (for CI validation)
// =============================================================================

/**
 * Registry of all defined events with their schemas
 */
export const EVENT_REGISTRY = {
  page_view: PageViewEventSchema,
  cta_clicked: CTAClickEventSchema,
  form_submitted: FormSubmitEventSchema,
  video_played: VideoPlayEventSchema,
  file_downloaded: DownloadEventSchema,
  search_performed: SearchEventSchema,
  lead_submitted: LeadSubmittedEventSchema,
} as const

export type RegisteredEventName = keyof typeof EVENT_REGISTRY

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validate an analytics event
 */
export function validateEvent(event: unknown): ValidationResult {
  const result = AnalyticsEventSchema.safeParse(event)
  
  if (result.success) {
    return {
      valid: true,
      errors: [],
      warnings: [],
    }
  }
  
  const errors = result.error.errors.map(err => 
    `${err.path.join('.')}: ${err.message}`
  )
  
  return {
    valid: false,
    errors,
    warnings: [],
  }
}

/**
 * Validate a specific event type
 */
export function validateSpecificEvent(
  eventName: RegisteredEventName,
  event: unknown
): ValidationResult {
  const schema = EVENT_REGISTRY[eventName]
  
  if (!schema) {
    return {
      valid: false,
      errors: [`Unknown event type: ${eventName}`],
      warnings: [],
    }
  }
  
  const result = schema.safeParse(event)
  
  if (result.success) {
    return {
      valid: true,
      errors: [],
      warnings: [],
    }
  }
  
  const errors = result.error.errors.map(err => 
    `${err.path.join('.')}: ${err.message}`
  )
  
  return {
    valid: false,
    errors,
    warnings: [],
  }
}

/**
 * Validate and wrap an event
 */
export function validateAndWrap(event: AnalyticsEvent): ValidatedEvent {
  const validation = validateEvent(event)
  
  return {
    event,
    validation,
    rejected: !validation.valid,
  }
}

// =============================================================================
// REQUIRED PROPERTIES CHECKER (for CI)
// =============================================================================

/**
 * Get required properties for an event type
 */
export function getRequiredProperties(eventName: RegisteredEventName): string[] {
  // Base required properties
  const base = [
    'anonymous_id',
    'session_id',
    'page_url',
    'page_path',
    'device_class',
    'locale',
    'timezone',
    'env',
    'app_version',
    'consent_state_version',
    'timestamp',
    'client_timestamp',
  ]
  
  // Event-specific required properties
  const specific: Record<RegisteredEventName, string[]> = {
    page_view: ['page_name'],
    cta_clicked: ['button_id', 'button_text'],
    form_submitted: ['form_id', 'form_name', 'form_type'],
    video_played: ['video_id', 'video_title'],
    file_downloaded: ['file_id', 'file_name', 'file_type'],
    search_performed: ['search_query', 'results_count'],
    lead_submitted: ['conversion_type', 'lead_type'],
  }
  
  return [...base, ...(specific[eventName] || [])]
}

/**
 * Check if an event has all required properties
 */
export function hasRequiredProperties(
  eventName: RegisteredEventName,
  properties: Record<string, unknown>
): { valid: boolean; missing: string[] } {
  const required = getRequiredProperties(eventName)
  const missing = required.filter(prop => !(prop in properties))
  
  return {
    valid: missing.length === 0,
    missing,
  }
}
