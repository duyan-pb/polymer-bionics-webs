/**
 * Data Export for Azure Data Lake Storage (Epic 9)
 * 
 * Provides utilities for exporting analytics events to ADLS Gen2
 * for data warehouse integration and Power BI reporting.
 * 
 * Features:
 * - Event batching and buffering
 * - Parquet-compatible JSON export format
 * - Automatic flushing on page unload
 * - Retry logic with exponential backoff
 */

import { canTrack } from './consent'
import type { AnalyticsEvent } from './types'

// =============================================================================
// TYPES
// =============================================================================

export interface DataExportConfig {
  /** Whether data export is enabled */
  enabled: boolean
  /** Azure Function endpoint for data export */
  endpoint: string
  /** Batch size before auto-flush */
  batchSize: number
  /** Flush interval in milliseconds */
  flushInterval: number
  /** Maximum retries for failed exports */
  maxRetries: number
  /** Whether to use sendBeacon for reliability */
  useSendBeacon: boolean
  /** Enable debug logging */
  debug: boolean
}

export interface ExportEvent {
  /** Event ID (for deduplication) */
  event_id: string
  /** Event type */
  event_type: string
  /** Event name */
  event_name?: string
  /** Event properties */
  properties: Record<string, unknown>
  /** ISO timestamp */
  timestamp: string
  /** Date partition (YYYY-MM-DD) */
  date_partition: string
  /** Hour partition (HH) */
  hour_partition: string
  /** User/session identifiers */
  identifiers: {
    anonymous_id?: string
    session_id?: string
  }
  /** Context information */
  context: {
    page_url: string
    page_path: string
    page_title: string
    referrer: string
    user_agent: string
    screen_width: number
    screen_height: number
    viewport_width: number
    viewport_height: number
    timezone: string
    language: string
  }
}

export interface ExportBatch {
  /** Unique batch ID */
  batch_id: string
  /** Events in this batch */
  events: ExportEvent[]
  /** Batch creation timestamp */
  created_at: string
  /** Source application */
  source: string
  /** Schema version */
  schema_version: string
}

// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================

const DEFAULT_CONFIG: DataExportConfig = {
  enabled: false, // Must be explicitly enabled
  endpoint: '/api/events/export',
  batchSize: 10,
  flushInterval: 30000, // 30 seconds
  maxRetries: 3,
  useSendBeacon: true,
  debug: false,
}

// =============================================================================
// STATE
// =============================================================================

let config: DataExportConfig = { ...DEFAULT_CONFIG }
let eventBuffer: ExportEvent[] = []
let flushTimer: ReturnType<typeof setInterval> | null = null
let isInitialized = false

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Generate a unique event ID
 */
function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Generate a unique batch ID
 */
function generateBatchId(): string {
  return `batch-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Get current context information
 */
function getContext(): ExportEvent['context'] {
  return {
    page_url: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
    referrer: document.referrer,
    user_agent: navigator.userAgent,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
  }
}

/**
 * Get date and hour partitions from timestamp
 */
function getPartitions(timestamp: Date): { date: string; hour: string } {
  return {
    date: timestamp.toISOString().split('T')[0] ?? '',
    hour: timestamp.getUTCHours().toString().padStart(2, '0'),
  }
}

// =============================================================================
// EVENT TRANSFORMATION
// =============================================================================

/**
 * Transform analytics event to export format
 */
export function transformEventForExport(
  event: AnalyticsEvent,
  identifiers: { anonymousId?: string; sessionId?: string }
): ExportEvent {
  const timestamp = new Date()
  const partitions = getPartitions(timestamp)
  
  // Extract event_id and event_name based on event type
  const eventId = 'event_id' in event ? event.event_id : generateEventId()
  const eventName = 'event_name' in event ? event.event_name : undefined
  
  return {
    event_id: eventId ?? generateEventId(),
    event_type: event.type,
    event_name: eventName,
    properties: { ...event.properties } as Record<string, unknown>,
    timestamp: timestamp.toISOString(),
    date_partition: partitions.date,
    hour_partition: partitions.hour,
    identifiers: {
      anonymous_id: identifiers.anonymousId,
      session_id: identifiers.sessionId,
    },
    context: getContext(),
  }
}

// =============================================================================
// BUFFERING & BATCHING
// =============================================================================

/**
 * Add event to export buffer
 */
export function bufferEvent(event: ExportEvent): void {
  if (!config.enabled || !canTrack('analytics')) {
    return
  }
  
  eventBuffer.push(event)
  
  if (config.debug) {
    // eslint-disable-next-line no-console
    console.log('[DataExport] Event buffered:', event.event_type, 'Buffer size:', eventBuffer.length)
  }
  
  // Auto-flush if batch size reached
  if (eventBuffer.length >= config.batchSize) {
    flushEvents()
  }
}

/**
 * Flush buffered events to ADLS
 */
export async function flushEvents(): Promise<void> {
  if (eventBuffer.length === 0) {
    return
  }
  
  const eventsToSend = [...eventBuffer]
  eventBuffer = []
  
  const batch: ExportBatch = {
    batch_id: generateBatchId(),
    events: eventsToSend,
    created_at: new Date().toISOString(),
    source: 'polymer-bionics-web',
    schema_version: '1.0.0',
  }
  
  if (config.debug) {
    // eslint-disable-next-line no-console
    console.log('[DataExport] Flushing batch:', batch.batch_id, 'Events:', eventsToSend.length)
  }
  
  await sendBatch(batch)
}

/**
 * Send batch to ADLS via Azure Function
 */
async function sendBatch(batch: ExportBatch, retryCount = 0): Promise<void> {
  const payload = JSON.stringify(batch)
  
  // Use sendBeacon for reliability on page unload
  if (config.useSendBeacon && navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' })
    const success = navigator.sendBeacon(config.endpoint, blob)
    
    if (success) {
      if (config.debug) {
        // eslint-disable-next-line no-console
        console.log('[DataExport] Batch sent via sendBeacon:', batch.batch_id)
      }
      return
    }
    // Fall through to fetch if sendBeacon fails
  }
  
  try {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
      keepalive: true,
    })
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.status}`)
    }
    
    if (config.debug) {
      // eslint-disable-next-line no-console
      console.log('[DataExport] Batch sent via fetch:', batch.batch_id)
    }
  } catch (error) {
    console.error('[DataExport] Failed to send batch:', error)
    
    // Retry with exponential backoff
    if (retryCount < config.maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000
      setTimeout(() => sendBatch(batch, retryCount + 1), delay)
    } else {
      // Store failed batch in localStorage for later retry
      storeFailedBatch(batch)
    }
  }
}

/**
 * Store failed batch for later retry
 */
function storeFailedBatch(batch: ExportBatch): void {
  try {
    const stored = localStorage.getItem('pb_failed_batches')
    const failedBatches: ExportBatch[] = stored ? JSON.parse(stored) : []
    
    // Limit stored batches to prevent localStorage bloat
    if (failedBatches.length < 10) {
      failedBatches.push(batch)
      localStorage.setItem('pb_failed_batches', JSON.stringify(failedBatches))
    }
  } catch {
    // localStorage not available or full
  }
}

/**
 * Retry sending failed batches
 */
export async function retryFailedBatches(): Promise<void> {
  try {
    const stored = localStorage.getItem('pb_failed_batches')
    if (!stored) {
      return
    }
    
    const failedBatches: ExportBatch[] = JSON.parse(stored)
    localStorage.removeItem('pb_failed_batches')
    
    for (const batch of failedBatches) {
      await sendBatch(batch)
    }
  } catch {
    // Ignore errors
  }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize data export
 */
export function initDataExport(options: Partial<DataExportConfig> = {}): void {
  if (isInitialized) {
    return
  }
  
  config = { ...DEFAULT_CONFIG, ...options }
  
  if (!config.enabled) {
    return
  }
  
  // Set up periodic flush
  if (config.flushInterval > 0) {
    flushTimer = setInterval(flushEvents, config.flushInterval)
  }
  
  // Flush on page unload
  window.addEventListener('beforeunload', () => {
    flushEvents()
  })
  
  // Flush on visibility change (when user leaves tab)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushEvents()
    }
  })
  
  // Retry failed batches on init
  retryFailedBatches()
  
  isInitialized = true
  
  if (config.debug) {
    // eslint-disable-next-line no-console
    console.log('[DataExport] Initialized with config:', config)
  }
}

/**
 * Stop data export and flush remaining events
 */
export function stopDataExport(): void {
  if (flushTimer) {
    clearInterval(flushTimer)
    flushTimer = null
  }
  
  flushEvents()
  isInitialized = false
}

/**
 * Get current export configuration
 */
export function getExportConfig(): DataExportConfig {
  return { ...config }
}

/**
 * Get current buffer size
 */
export function getBufferSize(): number {
  return eventBuffer.length
}

// =============================================================================
// AZURE DATA LAKE SCHEMA
// =============================================================================

/**
 * The export format is designed to be compatible with Azure Data Lake Storage
 * and can be easily converted to Parquet format using Azure Data Factory
 * or Azure Synapse Analytics.
 * 
 * Recommended ADLS folder structure:
 * 
 * analytics/
 * ├── events/
 * │   ├── date_partition=2024-01-01/
 * │   │   ├── hour_partition=00/
 * │   │   │   ├── batch-xxx.json
 * │   │   │   └── batch-yyy.json
 * │   │   ├── hour_partition=01/
 * │   │   └── ...
 * │   └── date_partition=2024-01-02/
 * └── processed/
 *     └── events.parquet
 * 
 * Azure Data Factory pipeline:
 * 1. Copy JSON from ADLS raw container
 * 2. Flatten nested structures
 * 3. Convert to Parquet
 * 4. Load into Synapse/Power BI
 */

export const ADLS_SCHEMA_VERSION = '1.0.0'

export const ADLS_SCHEMA = {
  version: ADLS_SCHEMA_VERSION,
  fields: [
    { name: 'event_id', type: 'string', description: 'Unique event identifier' },
    { name: 'event_type', type: 'string', description: 'Event type (page_view, track, conversion)' },
    { name: 'event_name', type: 'string', description: 'Event name for track events' },
    { name: 'timestamp', type: 'timestamp', description: 'Event timestamp (ISO 8601)' },
    { name: 'date_partition', type: 'string', description: 'Date partition (YYYY-MM-DD)' },
    { name: 'hour_partition', type: 'string', description: 'Hour partition (HH)' },
    { name: 'anonymous_id', type: 'string', description: 'Anonymous user identifier' },
    { name: 'session_id', type: 'string', description: 'Session identifier' },
    { name: 'page_url', type: 'string', description: 'Full page URL' },
    { name: 'page_path', type: 'string', description: 'Page path' },
    { name: 'referrer', type: 'string', description: 'HTTP referrer' },
    { name: 'user_agent', type: 'string', description: 'Browser user agent' },
    { name: 'properties', type: 'map<string,string>', description: 'Event properties' },
  ],
}
