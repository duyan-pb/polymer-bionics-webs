/**
 * Schema Validation Tests (Epic 7)
 */

import { describe, it, expect } from 'vitest'
import {
  StandardEventPropertiesSchema,
  PageViewEventSchema,
  TrackEventSchema,
  ConversionEventSchema,
  AnalyticsEventSchema,
  CTAClickEventSchema,
  FormSubmitEventSchema,
  SearchEventSchema,
  validateEvent,
  validateSpecificEvent,
  validateAndWrap,
  hasRequiredProperties,
  EVENT_REGISTRY,
} from '../schemas'

describe('Schema Validation', () => {
  // Helper to create valid standard properties
  const createStandardProps = (overrides = {}) => ({
    anonymous_id: '12345678-1234-4234-8234-123456789012',
    session_id: 'session-123',
    page_url: 'https://example.com/page',
    page_path: '/page',
    page_title: 'Test Page',
    referrer: 'https://google.com',
    device_class: 'desktop' as const,
    locale: 'en-US',
    timezone: 'America/New_York',
    viewport_width: 1920,
    viewport_height: 1080,
    user_agent: 'Mozilla/5.0',
    env: 'production' as const,
    app_version: '1.0.0',
    consent_state_version: '1.0.0',
    timestamp: new Date().toISOString(),
    client_timestamp: Date.now(),
    ...overrides,
  })

  describe('StandardEventPropertiesSchema', () => {
    it('validates correct standard properties', () => {
      const props = createStandardProps()
      const result = StandardEventPropertiesSchema.safeParse(props)
      
      expect(result.success).toBe(true)
    })

    it('rejects invalid anonymous_id format', () => {
      const props = createStandardProps({ anonymous_id: 'not-a-uuid' })
      const result = StandardEventPropertiesSchema.safeParse(props)
      
      expect(result.success).toBe(false)
    })

    it('rejects invalid page_url', () => {
      const props = createStandardProps({ page_url: 'not-a-url' })
      const result = StandardEventPropertiesSchema.safeParse(props)
      
      expect(result.success).toBe(false)
    })

    it('allows optional UTM parameters', () => {
      const props = createStandardProps({
        utm_source: 'google',
        utm_medium: 'cpc',
      })
      const result = StandardEventPropertiesSchema.safeParse(props)
      
      expect(result.success).toBe(true)
    })

    it('rejects invalid device_class', () => {
      const props = createStandardProps({ device_class: 'laptop' })
      const result = StandardEventPropertiesSchema.safeParse(props)
      
      expect(result.success).toBe(false)
    })

    it('rejects negative viewport dimensions', () => {
      const props = createStandardProps({ viewport_width: -100 })
      const result = StandardEventPropertiesSchema.safeParse(props)
      
      expect(result.success).toBe(false)
    })
  })

  describe('PageViewEventSchema', () => {
    it('validates correct page view event', () => {
      const event = {
        type: 'page_view' as const,
        properties: {
          ...createStandardProps(),
          page_name: 'home',
        },
      }
      const result = PageViewEventSchema.safeParse(event)
      
      expect(result.success).toBe(true)
    })

    it('requires page_name', () => {
      const event = {
        type: 'page_view' as const,
        properties: createStandardProps(),
      }
      const result = PageViewEventSchema.safeParse(event)
      
      expect(result.success).toBe(false)
    })

    it('allows optional previous_page', () => {
      const event = {
        type: 'page_view' as const,
        properties: {
          ...createStandardProps(),
          page_name: 'products',
          previous_page: 'home',
        },
      }
      const result = PageViewEventSchema.safeParse(event)
      
      expect(result.success).toBe(true)
    })
  })

  describe('TrackEventSchema', () => {
    it('validates correct track event', () => {
      const event = {
        type: 'track' as const,
        event_name: 'button_clicked',
        properties: createStandardProps(),
      }
      const result = TrackEventSchema.safeParse(event)
      
      expect(result.success).toBe(true)
    })

    it('rejects empty event_name', () => {
      const event = {
        type: 'track' as const,
        event_name: '',
        properties: createStandardProps(),
      }
      const result = TrackEventSchema.safeParse(event)
      
      expect(result.success).toBe(false)
    })

    it('rejects too long event_name', () => {
      const event = {
        type: 'track' as const,
        event_name: 'a'.repeat(101),
        properties: createStandardProps(),
      }
      const result = TrackEventSchema.safeParse(event)
      
      expect(result.success).toBe(false)
    })

    it('allows additional properties (passthrough)', () => {
      const event = {
        type: 'track' as const,
        event_name: 'custom_event',
        properties: {
          ...createStandardProps(),
          custom_field: 'custom_value',
        },
      }
      const result = TrackEventSchema.safeParse(event)
      
      expect(result.success).toBe(true)
    })
  })

  describe('ConversionEventSchema', () => {
    it('validates correct conversion event', () => {
      const event = {
        type: 'conversion' as const,
        event_name: 'purchase',
        event_id: '12345678-1234-4234-8234-123456789012',
        properties: {
          ...createStandardProps(),
          conversion_type: 'purchase',
        },
      }
      const result = ConversionEventSchema.safeParse(event)
      
      expect(result.success).toBe(true)
    })

    it('requires valid UUID for event_id', () => {
      const event = {
        type: 'conversion' as const,
        event_name: 'purchase',
        event_id: 'not-a-uuid',
        properties: {
          ...createStandardProps(),
          conversion_type: 'purchase',
        },
      }
      const result = ConversionEventSchema.safeParse(event)
      
      expect(result.success).toBe(false)
    })

    it('allows optional conversion_value and currency', () => {
      const event = {
        type: 'conversion' as const,
        event_name: 'purchase',
        event_id: '12345678-1234-4234-8234-123456789012',
        properties: {
          ...createStandardProps(),
          conversion_type: 'purchase',
          conversion_value: 99.99,
          currency: 'USD',
        },
      }
      const result = ConversionEventSchema.safeParse(event)
      
      expect(result.success).toBe(true)
    })

    it('requires 3-character currency code', () => {
      const event = {
        type: 'conversion' as const,
        event_name: 'purchase',
        event_id: '12345678-1234-4234-8234-123456789012',
        properties: {
          ...createStandardProps(),
          conversion_type: 'purchase',
          currency: 'USDD',
        },
      }
      const result = ConversionEventSchema.safeParse(event)
      
      expect(result.success).toBe(false)
    })
  })

  describe('AnalyticsEventSchema (discriminated union)', () => {
    it('validates page_view type', () => {
      const event = {
        type: 'page_view' as const,
        properties: {
          ...createStandardProps(),
          page_name: 'home',
        },
      }
      const result = AnalyticsEventSchema.safeParse(event)
      
      expect(result.success).toBe(true)
    })

    it('validates track type', () => {
      const event = {
        type: 'track' as const,
        event_name: 'click',
        properties: createStandardProps(),
      }
      const result = AnalyticsEventSchema.safeParse(event)
      
      expect(result.success).toBe(true)
    })

    it('validates conversion type', () => {
      const event = {
        type: 'conversion' as const,
        event_name: 'purchase',
        event_id: '12345678-1234-4234-8234-123456789012',
        properties: {
          ...createStandardProps(),
          conversion_type: 'purchase',
        },
      }
      const result = AnalyticsEventSchema.safeParse(event)
      
      expect(result.success).toBe(true)
    })

    it('rejects unknown type', () => {
      const event = {
        type: 'unknown',
        properties: createStandardProps(),
      }
      const result = AnalyticsEventSchema.safeParse(event)
      
      expect(result.success).toBe(false)
    })
  })

  describe('CTAClickEventSchema', () => {
    it('validates CTA click event', () => {
      const event = {
        type: 'track' as const,
        event_name: 'cta_clicked',
        properties: {
          ...createStandardProps(),
          button_id: 'hero-cta',
          button_text: 'Get Started',
        },
      }
      const result = CTAClickEventSchema.safeParse(event)
      
      expect(result.success).toBe(true)
    })

    it('requires button_id', () => {
      const event = {
        type: 'track' as const,
        event_name: 'cta_clicked',
        properties: {
          ...createStandardProps(),
          button_text: 'Get Started',
        },
      }
      const result = CTAClickEventSchema.safeParse(event)
      
      expect(result.success).toBe(false)
    })
  })

  describe('FormSubmitEventSchema', () => {
    it('validates form submit event', () => {
      const event = {
        type: 'track' as const,
        event_name: 'form_submitted',
        properties: {
          ...createStandardProps(),
          form_id: 'contact-form',
          form_name: 'Contact Form',
          form_type: 'contact' as const,
        },
      }
      const result = FormSubmitEventSchema.safeParse(event)
      
      expect(result.success).toBe(true)
    })

    it('validates form_type enum', () => {
      const event = {
        type: 'track' as const,
        event_name: 'form_submitted',
        properties: {
          ...createStandardProps(),
          form_id: 'form-1',
          form_name: 'Test',
          form_type: 'invalid',
        },
      }
      const result = FormSubmitEventSchema.safeParse(event)
      
      expect(result.success).toBe(false)
    })
  })

  describe('SearchEventSchema', () => {
    it('validates search event', () => {
      const event = {
        type: 'track' as const,
        event_name: 'search_performed',
        properties: {
          ...createStandardProps(),
          search_query: 'polymer',
          results_count: 10,
        },
      }
      const result = SearchEventSchema.safeParse(event)
      
      expect(result.success).toBe(true)
    })

    it('rejects negative results_count', () => {
      const event = {
        type: 'track' as const,
        event_name: 'search_performed',
        properties: {
          ...createStandardProps(),
          search_query: 'polymer',
          results_count: -1,
        },
      }
      const result = SearchEventSchema.safeParse(event)
      
      expect(result.success).toBe(false)
    })
  })

  describe('validateEvent', () => {
    it('returns valid: true for valid events', () => {
      const event = {
        type: 'track' as const,
        event_name: 'test',
        properties: createStandardProps(),
      }
      const result = validateEvent(event)
      
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('returns errors for invalid events', () => {
      const event = {
        type: 'track' as const,
        event_name: '',
        properties: createStandardProps(),
      }
      const result = validateEvent(event)
      
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('validateSpecificEvent', () => {
    it('validates against specific event schema', () => {
      const event = {
        type: 'track' as const,
        event_name: 'cta_clicked',
        properties: {
          ...createStandardProps(),
          button_id: 'cta',
          button_text: 'Click',
        },
      }
      const result = validateSpecificEvent('cta_clicked', event)
      
      expect(result.valid).toBe(true)
    })

    it('fails when specific requirements not met', () => {
      const event = {
        type: 'track' as const,
        event_name: 'cta_clicked',
        properties: createStandardProps(),
      }
      const result = validateSpecificEvent('cta_clicked', event)
      
      expect(result.valid).toBe(false)
    })
  })

  describe('validateAndWrap', () => {
    it('wraps valid event', () => {
      const event = {
        type: 'track' as const,
        event_name: 'test',
        properties: createStandardProps(),
      }
      const wrapped = validateAndWrap(event)
      
      expect(wrapped.event).toBe(event)
      expect(wrapped.validation.valid).toBe(true)
      expect(wrapped.rejected).toBe(false)
    })

    it('marks invalid event as rejected', () => {
      const event = {
        type: 'track' as const,
        event_name: '',
        properties: createStandardProps(),
      }
      const wrapped = validateAndWrap(event)
      
      expect(wrapped.rejected).toBe(true)
    })
  })

  describe('hasRequiredProperties', () => {
    it('returns valid: true when all required properties present', () => {
      const props = {
        ...createStandardProps(),
        button_id: 'cta',
        button_text: 'Click',
      }
      const result = hasRequiredProperties('cta_clicked', props)
      
      expect(result.valid).toBe(true)
      expect(result.missing).toHaveLength(0)
    })

    it('returns valid: false when required properties missing', () => {
      const props = createStandardProps()
      const result = hasRequiredProperties('cta_clicked', props)
      
      expect(result.valid).toBe(false)
      expect(result.missing).toContain('button_id')
      expect(result.missing).toContain('button_text')
    })

    it('checks standard required properties', () => {
      const props = { button_id: 'test', button_text: 'Click' }
      const result = hasRequiredProperties('cta_clicked', props)
      
      expect(result.valid).toBe(false)
      expect(result.missing).toContain('anonymous_id')
      expect(result.missing).toContain('session_id')
    })
  })

  describe('EVENT_REGISTRY', () => {
    it('contains all expected events', () => {
      expect(EVENT_REGISTRY).toHaveProperty('page_view')
      expect(EVENT_REGISTRY).toHaveProperty('cta_clicked')
      expect(EVENT_REGISTRY).toHaveProperty('form_submitted')
      expect(EVENT_REGISTRY).toHaveProperty('video_played')
      expect(EVENT_REGISTRY).toHaveProperty('file_downloaded')
      expect(EVENT_REGISTRY).toHaveProperty('search_performed')
      expect(EVENT_REGISTRY).toHaveProperty('lead_submitted')
    })
  })
})
