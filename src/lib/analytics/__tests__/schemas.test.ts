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
  VideoPlayEventSchema,
  DownloadEventSchema,
  LeadSubmittedEventSchema,
  validateEvent,
  validateSpecificEvent,
  validateAndWrap,
  hasRequiredProperties,
  getRequiredProperties,
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

  describe('validateSpecificEvent edge cases', () => {
    it('returns error for unknown event type', () => {
      const event = {
        type: 'track' as const,
        event_name: 'unknown_event',
        properties: createStandardProps(),
      }
      // Force cast to bypass TypeScript type checking
      const result = validateSpecificEvent('unknown_event' as keyof typeof EVENT_REGISTRY, event)
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Unknown event type: unknown_event')
    })
  })

  describe('VideoPlayEventSchema', () => {
    it('validates video play event', () => {
      const event = {
        type: 'track' as const,
        event_name: 'video_played',
        properties: {
          ...createStandardProps(),
          video_id: 'video-123',
          video_title: 'Product Demo',
        },
      }
      const result = VideoPlayEventSchema.safeParse(event)
      
      expect(result.success).toBe(true)
    })

    it('allows optional video_duration and video_position', () => {
      const event = {
        type: 'track' as const,
        event_name: 'video_played',
        properties: {
          ...createStandardProps(),
          video_id: 'video-123',
          video_title: 'Product Demo',
          video_duration: 120,
          video_position: 30,
        },
      }
      const result = VideoPlayEventSchema.safeParse(event)
      
      expect(result.success).toBe(true)
    })

    it('requires video_id', () => {
      const event = {
        type: 'track' as const,
        event_name: 'video_played',
        properties: {
          ...createStandardProps(),
          video_title: 'Product Demo',
        },
      }
      const result = VideoPlayEventSchema.safeParse(event)
      
      expect(result.success).toBe(false)
    })
  })

  describe('DownloadEventSchema', () => {
    it('validates download event', () => {
      const event = {
        type: 'track' as const,
        event_name: 'file_downloaded',
        properties: {
          ...createStandardProps(),
          file_id: 'file-123',
          file_name: 'datasheet.pdf',
          file_type: 'pdf',
        },
      }
      const result = DownloadEventSchema.safeParse(event)
      
      expect(result.success).toBe(true)
    })

    it('allows optional file_category', () => {
      const event = {
        type: 'track' as const,
        event_name: 'file_downloaded',
        properties: {
          ...createStandardProps(),
          file_id: 'file-123',
          file_name: 'datasheet.pdf',
          file_type: 'pdf',
          file_category: 'datasheets',
        },
      }
      const result = DownloadEventSchema.safeParse(event)
      
      expect(result.success).toBe(true)
    })

    it('requires file_type', () => {
      const event = {
        type: 'track' as const,
        event_name: 'file_downloaded',
        properties: {
          ...createStandardProps(),
          file_id: 'file-123',
          file_name: 'datasheet.pdf',
        },
      }
      const result = DownloadEventSchema.safeParse(event)
      
      expect(result.success).toBe(false)
    })
  })

  describe('LeadSubmittedEventSchema', () => {
    it('validates lead submitted event', () => {
      const event = {
        type: 'conversion' as const,
        event_name: 'lead_submitted',
        event_id: '12345678-1234-4234-8234-123456789012',
        properties: {
          ...createStandardProps(),
          conversion_type: 'lead',
          lead_type: 'contact' as const,
        },
      }
      const result = LeadSubmittedEventSchema.safeParse(event)
      
      expect(result.success).toBe(true)
    })

    it('validates lead_type enum', () => {
      const validTypes = ['contact', 'inquiry', 'demo_request', 'partnership']
      
      for (const leadType of validTypes) {
        const event = {
          type: 'conversion' as const,
          event_name: 'lead_submitted',
          event_id: '12345678-1234-4234-8234-123456789012',
          properties: {
            ...createStandardProps(),
            conversion_type: 'lead',
            lead_type: leadType as 'contact' | 'inquiry' | 'demo_request' | 'partnership',
          },
        }
        const result = LeadSubmittedEventSchema.safeParse(event)
        expect(result.success).toBe(true)
      }
    })

    it('rejects invalid lead_type', () => {
      const event = {
        type: 'conversion' as const,
        event_name: 'lead_submitted',
        event_id: '12345678-1234-4234-8234-123456789012',
        properties: {
          ...createStandardProps(),
          conversion_type: 'lead',
          lead_type: 'invalid',
        },
      }
      const result = LeadSubmittedEventSchema.safeParse(event)
      
      expect(result.success).toBe(false)
    })

    it('allows optional lead_source', () => {
      const event = {
        type: 'conversion' as const,
        event_name: 'lead_submitted',
        event_id: '12345678-1234-4234-8234-123456789012',
        properties: {
          ...createStandardProps(),
          conversion_type: 'lead',
          lead_type: 'contact' as const,
          lead_source: 'google',
        },
      }
      const result = LeadSubmittedEventSchema.safeParse(event)
      
      expect(result.success).toBe(true)
    })
  })

  describe('getRequiredProperties', () => {
    it('returns base required properties for any event', () => {
      const required = getRequiredProperties('page_view')
      
      expect(required).toContain('anonymous_id')
      expect(required).toContain('session_id')
      expect(required).toContain('page_url')
      expect(required).toContain('page_path')
      expect(required).toContain('device_class')
      expect(required).toContain('locale')
      expect(required).toContain('timezone')
      expect(required).toContain('env')
      expect(required).toContain('app_version')
      expect(required).toContain('consent_state_version')
      expect(required).toContain('timestamp')
      expect(required).toContain('client_timestamp')
    })

    it('returns page_view specific properties', () => {
      const required = getRequiredProperties('page_view')
      expect(required).toContain('page_name')
    })

    it('returns cta_clicked specific properties', () => {
      const required = getRequiredProperties('cta_clicked')
      expect(required).toContain('button_id')
      expect(required).toContain('button_text')
    })

    it('returns form_submitted specific properties', () => {
      const required = getRequiredProperties('form_submitted')
      expect(required).toContain('form_id')
      expect(required).toContain('form_name')
      expect(required).toContain('form_type')
    })

    it('returns video_played specific properties', () => {
      const required = getRequiredProperties('video_played')
      expect(required).toContain('video_id')
      expect(required).toContain('video_title')
    })

    it('returns file_downloaded specific properties', () => {
      const required = getRequiredProperties('file_downloaded')
      expect(required).toContain('file_id')
      expect(required).toContain('file_name')
      expect(required).toContain('file_type')
    })

    it('returns search_performed specific properties', () => {
      const required = getRequiredProperties('search_performed')
      expect(required).toContain('search_query')
      expect(required).toContain('results_count')
    })

    it('returns lead_submitted specific properties', () => {
      const required = getRequiredProperties('lead_submitted')
      expect(required).toContain('conversion_type')
      expect(required).toContain('lead_type')
    })
  })

  describe('StandardEventPropertiesSchema edge cases', () => {
    it('accepts all valid device_class values', () => {
      const validClasses = ['mobile', 'tablet', 'desktop']
      
      for (const deviceClass of validClasses) {
        const props = createStandardProps({ device_class: deviceClass })
        const result = StandardEventPropertiesSchema.safeParse(props)
        expect(result.success).toBe(true)
      }
    })

    it('accepts all valid env values', () => {
      const validEnvs = ['development', 'staging', 'production']
      
      for (const env of validEnvs) {
        const props = createStandardProps({ env })
        const result = StandardEventPropertiesSchema.safeParse(props)
        expect(result.success).toBe(true)
      }
    })

    it('allows all UTM parameters to be set', () => {
      const props = createStandardProps({
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'spring_sale',
        utm_term: 'polymer',
        utm_content: 'banner',
      })
      const result = StandardEventPropertiesSchema.safeParse(props)
      
      expect(result.success).toBe(true)
    })

    it('rejects empty session_id', () => {
      const props = createStandardProps({ session_id: '' })
      const result = StandardEventPropertiesSchema.safeParse(props)
      
      expect(result.success).toBe(false)
    })

    it('rejects empty page_path', () => {
      const props = createStandardProps({ page_path: '' })
      const result = StandardEventPropertiesSchema.safeParse(props)
      
      expect(result.success).toBe(false)
    })

    it('rejects zero viewport dimensions', () => {
      const props = createStandardProps({ viewport_width: 0 })
      const result = StandardEventPropertiesSchema.safeParse(props)
      
      expect(result.success).toBe(false)
    })

    it('rejects invalid timestamp format', () => {
      const props = createStandardProps({ timestamp: 'not-a-date' })
      const result = StandardEventPropertiesSchema.safeParse(props)
      
      expect(result.success).toBe(false)
    })

    it('rejects non-integer client_timestamp', () => {
      const props = createStandardProps({ client_timestamp: 1234.56 })
      const result = StandardEventPropertiesSchema.safeParse(props)
      
      expect(result.success).toBe(false)
    })
  })

  describe('hasRequiredProperties edge cases', () => {
    it('handles properties object with all required fields', () => {
      const props = {
        ...createStandardProps(),
        page_name: 'home',
      }
      const result = hasRequiredProperties('page_view', props)
      
      expect(result.valid).toBe(true)
      expect(result.missing).toHaveLength(0)
    })

    it('returns all missing base properties for empty object', () => {
      const result = hasRequiredProperties('page_view', {})
      
      expect(result.valid).toBe(false)
      expect(result.missing.length).toBeGreaterThan(10)
    })
  })
})
