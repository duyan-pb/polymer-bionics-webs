/**
 * Server-Side Event Collection Function (Epic 5)
 * 
 * Azure Function HTTP trigger for collecting conversion events.
 * Features:
 * - Request validation with Zod
 * - Rate limiting
 * - Idempotency (event_id deduplication)
 * - Forwards to analytics tools and/or data lake
 */

import { app, type HttpRequest, type HttpResponseInit, type InvocationContext } from '@azure/functions'
import { TableClient } from '@azure/data-tables'
import { z } from 'zod'

// =============================================================================
// SCHEMAS
// =============================================================================

const EventPayloadSchema = z.object({
  event_id: z.string().uuid(),
  event_name: z.string().min(1).max(100),
  event_type: z.enum(['conversion', 'track']),
  properties: z.record(z.unknown()),
  timestamp: z.string().datetime(),
})

type EventPayload = z.infer<typeof EventPayloadSchema>

// =============================================================================
// RATE LIMITING
// =============================================================================

const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

/** Rate limit window duration (ms) - 1 minute */
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '100', 10)

/** HTTP status code for conflict (duplicate) */
const HTTP_STATUS_CONFLICT = 409

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(clientIp)
  
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }
  
  entry.count++
  return true
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetAt) {
      rateLimitStore.delete(key)
    }
  }
}, RATE_LIMIT_WINDOW_MS)

// =============================================================================
// DEDUPLICATION
// =============================================================================

let tableClient: TableClient | null = null

async function getTableClient(): Promise<TableClient | null> {
  if (tableClient) {return tableClient}
  
  const connectionString = process.env.EVENT_STORAGE_CONNECTION_STRING
  if (!connectionString) {
    console.warn('EVENT_STORAGE_CONNECTION_STRING not set, deduplication disabled')
    return null
  }
  
  try {
    tableClient = TableClient.fromConnectionString(connectionString, 'eventdedup')
    // Ensure table exists
    await tableClient.createTable()
  } catch (error: unknown) {
    // Table might already exist
    const err = error as { statusCode?: number }
    if (err.statusCode !== HTTP_STATUS_CONFLICT) {
      console.error('Failed to create dedup table:', error)
      return null
    }
  }
  
  return tableClient
}

async function isDuplicate(eventId: string): Promise<boolean> {
  const client = await getTableClient()
  if (!client) {return false}
  
  try {
    // Use date as partition key for efficient queries
    const partitionKey = new Date().toISOString().split('T')[0]
    await client.getEntity(partitionKey, eventId)
    return true // Found, it's a duplicate
  } catch {
    return false // Not found, not a duplicate
  }
}

async function markAsProcessed(eventId: string, eventName: string): Promise<void> {
  const client = await getTableClient()
  if (!client) {return}
  
  try {
    const partitionKey = new Date().toISOString().split('T')[0]
    await client.createEntity({
      partitionKey,
      rowKey: eventId,
      eventName,
      processedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to mark event as processed:', error)
  }
}

// =============================================================================
// EVENT FORWARDING
// =============================================================================

async function forwardToAnalytics(event: EventPayload): Promise<void> {
  // Forward to GA4 Measurement Protocol (if configured)
  const ga4MeasurementId = process.env.GA4_MEASUREMENT_ID
  const ga4ApiSecret = process.env.GA4_API_SECRET
  
  if (ga4MeasurementId && ga4ApiSecret) {
    try {
      const clientId = (event.properties.anonymous_id as string) || 'unknown'
      
      await fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${ga4MeasurementId}&api_secret=${ga4ApiSecret}`,
        {
          method: 'POST',
          body: JSON.stringify({
            client_id: clientId,
            events: [{
              name: event.event_name,
              params: {
                ...event.properties,
                event_id: event.event_id,
                server_timestamp: new Date().toISOString(),
              },
            }],
          }),
        }
      )
    } catch (error) {
      console.error('Failed to forward to GA4:', error)
    }
  }
  
  // Forward to Application Insights (if configured)
  const appInsightsKey = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING
  if (appInsightsKey) {
    // App Insights auto-collects from Azure Functions
    // Custom events are logged via context.log
  }
}

async function forwardToDataLake(_event: EventPayload): Promise<void> {
  // TODO: Implement forwarding to Azure Data Lake / Event Hubs
  // This would be used for Epic 9 - Analytics Warehouse
  
  const eventHubsConnectionString = process.env.EVENT_HUBS_CONNECTION_STRING
  if (eventHubsConnectionString) {
    // Forward to Event Hubs for downstream processing
  }
}

// =============================================================================
// MAIN HANDLER
// =============================================================================

async function collectEvents(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  // Get client IP for rate limiting
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                   request.headers.get('x-real-ip') || 
                   'unknown'
  
  // Check rate limit
  if (!checkRateLimit(clientIp)) {
    context.warn(`Rate limit exceeded for ${clientIp}`)
    return {
      status: 429,
      jsonBody: { error: 'Too many requests', retry_after: 60 },
    }
  }
  
  // Parse and validate request body
  let payload: EventPayload
  try {
    const body = await request.json()
    payload = EventPayloadSchema.parse(body)
  } catch (error) {
    context.warn('Invalid request payload:', error)
    return {
      status: 400,
      jsonBody: { error: 'Invalid request payload', details: error },
    }
  }
  
  // Check for duplicate (idempotency)
  if (await isDuplicate(payload.event_id)) {
    context.info(`Duplicate event ignored: ${payload.event_id}`)
    return {
      status: 200,
      jsonBody: { status: 'duplicate', event_id: payload.event_id },
    }
  }
  
  // Process the event
  try {
    // Log for Application Insights
    context.info('Processing event', {
      event_id: payload.event_id,
      event_name: payload.event_name,
      event_type: payload.event_type,
    })
    
    // Forward to analytics tools
    await forwardToAnalytics(payload)
    
    // Forward to data lake (if enabled)
    await forwardToDataLake(payload)
    
    // Mark as processed
    await markAsProcessed(payload.event_id, payload.event_name)
    
    return {
      status: 200,
      jsonBody: { 
        status: 'success', 
        event_id: payload.event_id,
        processed_at: new Date().toISOString(),
      },
    }
  } catch (error) {
    context.error('Failed to process event:', error)
    return {
      status: 500,
      jsonBody: { error: 'Failed to process event' },
    }
  }
}

// Register the function
app.http('collectEvents', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'events/collect',
  handler: collectEvents,
})

// =============================================================================
// HEALTH CHECK
// =============================================================================

app.http('health', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'health',
  handler: async () => ({
    status: 200,
    jsonBody: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  }),
})
