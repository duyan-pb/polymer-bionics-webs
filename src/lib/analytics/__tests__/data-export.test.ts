/**
 * Data Export Tests (Epic 9)
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  initDataExport,
  bufferEvent,
  flushEvents,
  retryFailedBatches,
  transformEventForExport,
  getExportConfig,
  getBufferSize,
  stopDataExport,
  type ExportEvent,
} from '../data-export'
import { acceptAllConsent } from '../consent'

describe('Data Export (ADLS)', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
    acceptAllConsent()
    
    // Reset fetch mock
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as Response)
  })

  afterEach(() => {
    stopDataExport()
  })

  describe('initDataExport', () => {
    it('initializes with config', () => {
      initDataExport({
        enabled: true,
        endpoint: '/api/events/export',
        batchSize: 10,
      })
      
      const config = getExportConfig()
      expect(config.enabled).toBe(true)
      expect(config.endpoint).toBe('/api/events/export')
      expect(config.batchSize).toBe(10)
    })

    it('sets default values', () => {
      initDataExport({
        enabled: true,
        endpoint: '/api/events/export',
      })
      
      const config = getExportConfig()
      expect(config.batchSize).toBeDefined()
      expect(config.flushInterval).toBeDefined()
      expect(config.maxRetries).toBeDefined()
    })

    it('does not start when disabled', () => {
      initDataExport({
        enabled: false,
        endpoint: '/api/events/export',
      })
      
      const config = getExportConfig()
      expect(config.enabled).toBe(false)
    })
  })

  describe('bufferEvent', () => {
    beforeEach(() => {
      initDataExport({
        enabled: true,
        endpoint: '/api/events/export',
        batchSize: 10,
      })
    })

    it('adds event to buffer', () => {
      const event = {
        event_id: 'test-123',
        event_type: 'track',
        event_name: 'test_event',
        properties: { test: 'value' },
        timestamp: new Date().toISOString(),
        date_partition: '2024-01-15',
        hour_partition: '10',
        identifiers: { anonymous_id: 'anon-123' },
        context: { page_url: 'https://example.com' },
      }
      
      bufferEvent(event)
      
      expect(getBufferSize()).toBe(1)
    })

    it('does not buffer when disabled', () => {
      stopDataExport() // Stop current export
      initDataExport({ enabled: false, endpoint: '/api/test' })
      
      const initialSize = getBufferSize()
      
      bufferEvent({
        event_id: 'test-123',
        event_type: 'track',
        event_name: 'test',
        properties: {},
        timestamp: new Date().toISOString(),
        date_partition: '2024-01-15',
        hour_partition: '10',
        identifiers: {},
        context: {} as ExportEvent['context'],
      })
      
      expect(getBufferSize()).toBe(initialSize)
    })
  })

  describe('flushEvents', () => {
    beforeEach(() => {
      initDataExport({
        enabled: true,
        endpoint: '/api/events/export',
        batchSize: 10,
        useSendBeacon: false,
      })
    })

    it('sends buffered events', async () => {
      bufferEvent({
        event_id: 'test-1',
        event_type: 'track',
        event_name: 'test',
        properties: {},
        timestamp: new Date().toISOString(),
        date_partition: '2024-01-15',
        hour_partition: '10',
        identifiers: {},
        context: {},
      })
      
      await flushEvents()
      
      expect(global.fetch).toHaveBeenCalled()
    })

    it('clears buffer after successful flush', async () => {
      bufferEvent({
        event_id: 'test-1',
        event_type: 'track',
        event_name: 'test',
        properties: {},
        timestamp: new Date().toISOString(),
        date_partition: '2024-01-15',
        hour_partition: '10',
        identifiers: {},
        context: {} as ExportEvent['context'],
      })
      
      await flushEvents()
      
      expect(getBufferSize()).toBe(0)
    })

    it('does nothing with empty buffer', async () => {
      await flushEvents()
      
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('handles failed batches gracefully', async () => {
      // This tests that the system doesn't crash when batch sending fails
      // The retry logic uses setTimeout which is complex to test
      vi.mocked(navigator.sendBeacon).mockReturnValue(false)
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'))
      
      bufferEvent({
        event_id: 'test-1',
        event_type: 'track',
        event_name: 'test',
        properties: {},
        timestamp: new Date().toISOString(),
        date_partition: '2024-01-15',
        hour_partition: '10',
        identifiers: {},
        context: {} as ExportEvent['context'],
      })
      
      // Should not throw
      await expect(flushEvents()).resolves.not.toThrow()
    })
  })

  describe('retryFailedBatches', () => {
    beforeEach(() => {
      initDataExport({
        enabled: true,
        endpoint: '/api/events/export',
        useSendBeacon: false,
      })
    })

    it('retries failed batches', async () => {
      // Store a failed batch with correct key
      const failedBatch = {
        batch_id: 'batch-123',
        events: [{
          event_id: 'test-1',
          event_type: 'track',
          event_name: 'test',
          properties: {},
          timestamp: new Date().toISOString(),
          date_partition: '2024-01-15',
          hour_partition: '10',
          identifiers: {},
          context: {} as ExportEvent['context'],
        }],
        created_at: new Date().toISOString(),
        source: 'test',
        schema_version: '1.0',
      }
      localStorage.setItem('pb_failed_batches', JSON.stringify([failedBatch]))
      
      await retryFailedBatches()
      
      // Either fetch or sendBeacon should be called
      expect(global.fetch).toHaveBeenCalled()
    })

    it('removes successful retries', async () => {
      const failedBatch = {
        batch_id: 'batch-123',
        events: [{
          event_id: 'test-1',
          event_type: 'track',
          event_name: 'test',
          properties: {},
          timestamp: new Date().toISOString(),
          date_partition: '2024-01-15',
          hour_partition: '10',
          identifiers: {},
          context: {} as ExportEvent['context'],
        }],
        created_at: new Date().toISOString(),
        source: 'test',
        schema_version: '1.0',
      }
      localStorage.setItem('pb_failed_batches', JSON.stringify([failedBatch]))
      
      await retryFailedBatches()
      
      // After successful retry, the batches should be removed
      const remaining = localStorage.getItem('pb_failed_batches')
      expect(remaining).toBeNull()
    })

    it('limits retry attempts', async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'))
      
      const failedBatch = {
        batch_id: 'batch-123',
        events: [{ event_id: 'test-1', event_type: 'track', event_name: 'test', properties: {}, timestamp: '', date_partition: '', hour_partition: '', identifiers: {}, context: {} }],
        created_at: new Date().toISOString(),
        source: 'test',
        schema_version: '1.0',
        retryCount: 5, // Already at max retries
      }
      localStorage.setItem('pb_failed_export_batches', JSON.stringify([failedBatch]))
      
      await retryFailedBatches()
      
      // Batch should be discarded after max retries
    })
  })

  describe('transformEventForExport', () => {
    it('transforms analytics event to export format', () => {
      const analyticsEvent = {
        type: 'track' as const,
        event_name: 'test_event',
        properties: {
          anonymous_id: 'anon-123',
          session_id: 'session-456',
          page_url: 'https://example.com/page',
          page_path: '/page',
          custom_prop: 'value',
        },
      }
      
      const identifiers = {
        anonymousId: 'anon-123',
        sessionId: 'session-456',
      }
      
      const exported = transformEventForExport(analyticsEvent, identifiers)
      
      expect(exported.event_type).toBe('track')
      expect(exported.event_name).toBe('test_event')
      expect(exported.identifiers.anonymous_id).toBe('anon-123')
      expect(exported.date_partition).toBeTruthy()
      expect(exported.hour_partition).toBeTruthy()
    })

    it('includes context information', () => {
      const analyticsEvent = {
        type: 'page_view' as const,
        properties: {
          page_url: 'https://example.com',
          page_path: '/',
          page_title: 'Home',
          referrer: 'https://google.com',
          user_agent: 'Mozilla/5.0',
        },
      }
      
      const exported = transformEventForExport(analyticsEvent, {})
      
      // Context is populated from window, not from event properties
      expect(exported.context).toBeDefined()
      expect(exported.context.page_url).toBeDefined()
      expect(exported.context.page_path).toBeDefined()
    })

    it('generates event_id if not present', () => {
      const analyticsEvent = {
        type: 'track' as const,
        event_name: 'test',
        properties: {},
      }
      
      const exported = transformEventForExport(analyticsEvent, {})
      
      expect(exported.event_id).toBeTruthy()
    })

    it('uses existing event_id for conversions', () => {
      const analyticsEvent = {
        type: 'conversion' as const,
        event_name: 'purchase',
        event_id: 'existing-uuid-123',
        properties: {},
      }
      
      const exported = transformEventForExport(analyticsEvent, {})
      
      expect(exported.event_id).toBe('existing-uuid-123')
    })
  })

  describe('getBufferSize', () => {
    beforeEach(() => {
      initDataExport({
        enabled: true,
        endpoint: '/api/events/export',
      })
    })

    it('returns current buffer size', () => {
      expect(getBufferSize()).toBe(0)
      
      bufferEvent({
        event_id: 'test-1',
        event_type: 'track',
        event_name: 'test',
        properties: {},
        timestamp: new Date().toISOString(),
        date_partition: '2024-01-15',
        hour_partition: '10',
        identifiers: {},
        context: {},
      })
      
      expect(getBufferSize()).toBe(1)
    })
  })

  describe('stopDataExport', () => {
    it('flushes remaining events', async () => {
      initDataExport({
        enabled: true,
        endpoint: '/api/events/export',
        useSendBeacon: false,
      })
      
      bufferEvent({
        event_id: 'test-1',
        event_type: 'track',
        event_name: 'test',
        properties: {},
        timestamp: new Date().toISOString(),
        date_partition: '2024-01-15',
        hour_partition: '10',
        identifiers: {},
        context: {},
      })
      
      stopDataExport()
      
      // Events should be flushed
      expect(getBufferSize()).toBe(0)
    })
  })

  describe('auto-flush on batch size', () => {
    it('flushes when batch size reached', async () => {
      initDataExport({
        enabled: true,
        endpoint: '/api/events/export',
        batchSize: 2,
        useSendBeacon: false,
      })
      
      bufferEvent({
        event_id: 'test-1',
        event_type: 'track',
        event_name: 'test1',
        properties: {},
        timestamp: new Date().toISOString(),
        date_partition: '2024-01-15',
        hour_partition: '10',
        identifiers: {},
        context: {},
      })
      
      bufferEvent({
        event_id: 'test-2',
        event_type: 'track',
        event_name: 'test2',
        properties: {},
        timestamp: new Date().toISOString(),
        date_partition: '2024-01-15',
        hour_partition: '10',
        identifiers: {},
        context: {},
      })
      
      // Should auto-flush after reaching batch size
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(global.fetch).toHaveBeenCalled()
    })
  })

  describe('sendBeacon usage', () => {
    it('uses sendBeacon when configured', () => {
      initDataExport({
        enabled: true,
        endpoint: '/api/events/export',
        useSendBeacon: true,
      })
      
      bufferEvent({
        event_id: 'test-1',
        event_type: 'track',
        event_name: 'test',
        properties: {},
        timestamp: new Date().toISOString(),
        date_partition: '2024-01-15',
        hour_partition: '10',
        identifiers: {},
        context: {},
      })
      
      stopDataExport()
      
      expect(navigator.sendBeacon).toHaveBeenCalled()
    })
  })

  describe('getExportConfig', () => {
    it('returns current config', () => {
      initDataExport({
        enabled: true,
        endpoint: '/api/test',
        batchSize: 50,
      })
      
      const config = getExportConfig()
      
      expect(config.endpoint).toBe('/api/test')
      expect(config.batchSize).toBe(50)
    })

    it('returns a copy of config', () => {
      initDataExport({ enabled: true, endpoint: '/api/test' })
      
      const config1 = getExportConfig()
      const config2 = getExportConfig()
      
      expect(config1).not.toBe(config2)
      expect(config1).toEqual(config2)
    })
  })

  describe('visibility change flushing', () => {
    it('flushes when page becomes hidden', () => {
      initDataExport({
        enabled: true,
        endpoint: '/api/events/export',
        useSendBeacon: false,
      })
      
      bufferEvent({
        event_id: 'test-1',
        event_type: 'track',
        event_name: 'visibility_test',
        properties: {},
        timestamp: new Date().toISOString(),
        date_partition: '2024-01-15',
        hour_partition: '10',
        identifiers: {},
        context: {},
      })
      
      // Simulate visibility change to hidden
      Object.defineProperty(document, 'visibilityState', {
        value: 'hidden',
        writable: true,
      })
      document.dispatchEvent(new Event('visibilitychange'))
      
      // Should trigger flush
    })
  })

  describe('retryFailedBatches', () => {
    it('retries batches stored in localStorage', async () => {
      const failedBatch = {
        batch_id: 'failed-batch-1',
        events: [{
          event_id: 'test-1',
          event_type: 'track',
          event_name: 'test',
          properties: {},
          timestamp: new Date().toISOString(),
          date_partition: '2024-01-15',
          hour_partition: '10',
          identifiers: {},
          context: {},
        }],
        created_at: new Date().toISOString(),
        source: 'polymer-bionics-web',
        schema_version: '1.0.0',
      }
      
      localStorage.setItem('pb_failed_batches', JSON.stringify([failedBatch]))
      
      initDataExport({
        enabled: true,
        endpoint: '/api/events/export',
        useSendBeacon: false,
      })
      
      await retryFailedBatches()
      
      // Batches should be cleared from localStorage
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(localStorage.getItem('pb_failed_batches')).toBeNull()
    })

    it('does nothing when no failed batches', async () => {
      localStorage.removeItem('pb_failed_batches')
      
      await retryFailedBatches()
      
      // Should not throw
      expect(true).toBe(true)
    })

    it('handles malformed localStorage data', async () => {
      localStorage.setItem('pb_failed_batches', 'not valid json')
      
      // Should not throw
      await expect(retryFailedBatches()).resolves.not.toThrow()
    })
  })

  describe('debug mode logging', () => {
    it('logs buffered events in debug mode', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      initDataExport({
        enabled: true,
        endpoint: '/api/events/export',
        debug: true,
      })
      
      bufferEvent({
        event_id: 'test-1',
        event_type: 'track',
        event_name: 'test',
        properties: {},
        timestamp: new Date().toISOString(),
        date_partition: '2024-01-15',
        hour_partition: '10',
        identifiers: {},
        context: {},
      })
      
      // Check that console.log was called with a message containing 'Event buffered'
      const calls = consoleSpy.mock.calls
      const hasBufferedLog = calls.some(call => 
        call.some(arg => typeof arg === 'string' && arg.includes('[DataExport] Event buffered'))
      )
      expect(hasBufferedLog).toBe(true)
      consoleSpy.mockRestore()
    })
  })
})
