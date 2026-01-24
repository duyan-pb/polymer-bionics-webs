# Analytics Infrastructure Documentation

## Overview

This document describes the comprehensive analytics infrastructure implemented for the Polymer Bionics website. The system is built on Azure services and follows GDPR/privacy-first principles with consent-gated tracking throughout.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Epic 1: Consent Management](#epic-1-consent-management)
3. [Epic 2: Azure Application Insights](#epic-2-azure-application-insights)
4. [Epic 3: Analytics Wrapper](#epic-3-analytics-wrapper)
5. [Epic 4: Google Analytics 4](#epic-4-google-analytics-4)
6. [Epic 5: Server-Side Events](#epic-5-server-side-events)
7. [Epic 6: Identity Management](#epic-6-identity-management)
8. [Epic 7: Schema Validation](#epic-7-schema-validation)
9. [Epic 8: UTM Attribution](#epic-8-utm-attribution)
10. [Epic 9: Data Export (ADLS)](#epic-9-data-export-adls)
11. [Epic 11: Feature Flags](#epic-11-feature-flags)
12. [Epic 12: Session Replay](#epic-12-session-replay)
13. [Epic 13: SEO Infrastructure](#epic-13-seo-infrastructure)
14. [Epic 14: Web Vitals](#epic-14-web-vitals)
15. [Epic 15: Cost Controls](#epic-15-cost-controls)
16. [Epic 16: Error Reporting](#epic-16-error-reporting)
17. [Epic 17: Performance Monitoring](#epic-17-performance-monitoring)
18. [Epic 18: Monitoring Hooks](#epic-18-monitoring-hooks)
19. [Configuration](#configuration)
20. [React Hooks](#react-hooks)
21. [Deployment](#deployment)

---

## Architecture Overview

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Client Browser                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────────────────┐   │
│  │   Consent   │───▶│   Analytics  │───▶│        Destinations         │   │
│  │   Banner    │    │   Wrapper    │    │  ┌─────────┐ ┌───────────┐  │   │
│  └─────────────┘    │              │    │  │App      │ │    GA4    │  │   │
│         │           │ • track()    │    │  │Insights │ │           │  │   │
│         ▼           │ • page()     │    │  └─────────┘ └───────────┘  │   │
│  ┌─────────────┐    │ • conversion │    │  ┌─────────┐ ┌───────────┐  │   │
│  │  canTrack() │───▶│              │───▶│  │Clarity  │ │Data Export│  │   │
│  │    Gate     │    └──────────────┘    │  │(Replay) │ │  (ADLS)   │  │   │
│  └─────────────┘           │            │  └─────────┘ └───────────┘  │   │
│                            │            └─────────────────────────────┘   │
│                            │                                              │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────────────────┐   │
│  │  Identity   │    │   Feature    │    │       Cost Controls         │   │
│  │ • anon_id   │    │    Flags     │    │  • Rate limiting            │   │
│  │ • session   │    │ • A/B tests  │    │  • Budget management        │   │
│  └─────────────┘    └──────────────┘    │  • Sampling                 │   │
│                                         └─────────────────────────────┘   │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │                    Monitoring Layer (Epic 16-18)                     │ │
│  │  ┌──────────────┐  ┌───────────────────┐  ┌───────────────────────┐ │ │
│  │  │Error         │  │Performance        │  │Monitoring Hooks       │ │ │
│  │  │Reporting     │  │Monitor            │  │• useRenderTracking    │ │ │
│  │  │• Exceptions  │  │• Resource timing  │  │• useTrackedFetch      │ │ │
│  │  │• Rejections  │  │• Long tasks       │  │• useVisibilityTracking│ │ │
│  │  │• React errors│  │• Memory usage     │  │• useErrorHandler      │ │ │
│  │  └──────────────┘  └───────────────────┘  └───────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Azure Functions                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  /api/events/collect                                                 │   │
│  │  • Request validation (Zod)                                          │   │
│  │  • Rate limiting (100 req/min)                                       │   │
│  │  • Idempotency (Table Storage)                                       │   │
│  │  • Forward to GA4 Measurement Protocol                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Azure Data Services                                │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────────────┐   │
│  │ App Insights  │  │ Table Storage │  │   Data Lake Storage Gen2      │   │
│  │ (Telemetry)   │  │  (Dedup)      │  │   (Event Archive)             │   │
│  └───────────────┘  └───────────────┘  └───────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### File Structure

```text
src/lib/analytics/
├── index.ts           # Barrel exports
├── types.ts           # TypeScript type definitions
├── consent.ts         # Consent management (Epic 1)
├── identity.ts        # Anonymous identity (Epic 6)
├── tracker.ts         # Main analytics wrapper (Epic 3)
├── schemas.ts         # Zod validation schemas (Epic 7)
├── attribution.ts     # UTM tracking (Epic 8)
├── app-insights.ts    # Azure App Insights (Epic 2)
├── ga4.ts             # Google Analytics 4 (Epic 4)
├── web-vitals.ts      # Core Web Vitals (Epic 14)
├── session-replay.ts  # Clarity integration (Epic 12)
├── seo.ts             # SEO helpers (Epic 13)
├── data-export.ts     # ADLS export (Epic 9)
├── cost-control.ts    # Budget management (Epic 15)
├── error-reporting.ts # Error tracking (Epic 16)
├── performance-monitor.ts # Performance monitoring (Epic 17)
└── monitoring-hooks.ts    # React monitoring hooks (Epic 18)

src/lib/
├── analytics-config.ts  # Environment configuration
└── feature-flags.ts     # Feature flags (Epic 11)

src/components/
├── AnalyticsProvider.tsx  # React initialization wrapper
└── ConsentBanner.tsx      # Consent UI component

api/src/functions/
└── events.ts              # Azure Function (Epic 5)
```

---

## Epic 1: Consent Management

### Purpose

GDPR-compliant consent management with hard gating. No tracking fires without explicit consent.

### Key Files

- `src/lib/analytics/consent.ts` - Core consent logic
- `src/lib/analytics/types.ts` - Type definitions
- `src/components/ConsentBanner.tsx` - UI component

### Consent Categories

| Category | Description | Required |
| -------- | ----------- | -------- |
| `necessary` | Essential cookies for site function | Yes |
| `analytics` | Performance and usage tracking | No |
| `marketing` | Advertising and remarketing | No |

### The `canTrack()` Gate

This is the **single gate** that ALL tracking code must check:

```typescript
import { canTrack } from '@/lib/analytics'

// Before firing any tracking beacon
if (canTrack('analytics')) {
  // Safe to track
  gtag('event', 'page_view', { ... })
}
```

### Consent State Schema

```typescript
interface ConsentState {
  version: string              // Schema version for migration
  timestamp: string            // ISO timestamp of last update
  choices: {
    necessary: boolean         // Always true
    analytics: boolean         // User choice
    marketing: boolean         // User choice
  }
  bannerShown: boolean         // Has banner been displayed
  hasInteracted: boolean       // Has user made explicit choice
}
```

### Storage

Consent is stored in:

1. **Cookie** (`pb_consent`) - Works across subdomains, 365-day expiry
2. **localStorage** - Backup for cookie issues

### API Functions

```typescript
// Get current consent state
getConsentState(): ConsentState

// Save consent (triggers 'consent-changed' event)
saveConsentState(state: ConsentState): void

// Check if tracking allowed for category
canTrack(category: ConsentCategory): boolean

// Accept all categories
acceptAllConsent(): ConsentState

// Accept only necessary
acceptNecessaryOnly(): ConsentState

// Update specific categories
updateConsent(choices: Partial<Record<ConsentCategory, boolean>>): ConsentState

// Withdraw all consent (clears non-essential cookies)
withdrawConsent(): void
```

### React Hook

```tsx
function MyComponent() {
  const {
    consent,
    shouldShowBanner,
    acceptAll,
    acceptNecessary,
    openPreferences,
  } = useConsent()

  if (!shouldShowBanner) return null

  return (
    <div>
      <button onClick={acceptAll}>Accept All</button>
      <button onClick={acceptNecessary}>Necessary Only</button>
      <button onClick={openPreferences}>Manage</button>
    </div>
  )
}
```

### Consent Banner Component

The `ConsentBanner` component provides:

- Main banner with Accept All / Necessary Only / Manage buttons
- Preferences modal with toggles for each category
- `ManageCookiesLink` for footer/settings
- `ConsentStatusIndicator` showing current choices

```tsx
// In App.tsx
import { ConsentBanner } from '@/components/ConsentBanner'

function App() {
  return (
    <AnalyticsProvider>
      {/* ... app content ... */}
      <ConsentBanner />
    </AnalyticsProvider>
  )
}
```

---

## Epic 2: Azure Application Insights

### Purpose

Integration with Azure Application Insights for telemetry, exception tracking, and distributed tracing.

### Key File

- `src/lib/analytics/app-insights.ts`

### Features

- **Dynamic SDK loading** - Only loads when consent granted
- **Consent-gated** - Respects `canTrack('analytics')`
- **Exception tracking** - Automatic error capture
- **Custom metrics** - Performance and business metrics
- **Correlation headers** - Distributed tracing support

### Configuration

```typescript
// In analytics-config.ts
appInsights: {
  connectionString: import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING,
  enableDebugMode: false,
}
```

### API Functions

```typescript
// Initialize (called by AnalyticsProvider)
initAppInsights(config: AppInsightsConfig): Promise<void>

// Track page view
trackAppInsightsPageView(name: string, properties?: Record<string, unknown>): void

// Track custom event
trackAppInsightsEvent(name: string, properties?: Record<string, unknown>): void

// Track exception
trackException(error: Error, properties?: Record<string, unknown>): void

// Track custom metric
trackMetric(name: string, value: number, properties?: Record<string, unknown>): void

// Get correlation headers for distributed tracing
getCorrelationHeaders(): Record<string, string>

// Flush pending telemetry
flushAppInsights(): void
```

### Error Tracking

Global error handler automatically captures:

- Unhandled exceptions
- Unhandled promise rejections

```typescript
// Manual exception tracking
try {
  await riskyOperation()
} catch (error) {
  trackException(error, { operation: 'risky_operation' })
}
```

### Distributed Tracing

For backend API calls that need correlation:

```typescript
const headers = getCorrelationHeaders()

await fetch('/api/data', {
  headers: {
    ...headers,
    'Content-Type': 'application/json',
  },
})
```

---

## Epic 3: Analytics Wrapper

### Purpose

Single abstraction layer for all analytics tracking. This is the **ONE place** to change tracking behavior for the whole site.

### Key File

- `src/lib/analytics/tracker.ts`

### Features

- **Consent gating** - Built-in, not duplicated
- **Standard properties** - Automatically attached to all events
- **Fire-once utilities** - Prevent duplicate events
- **Debug mode** - Console logging for development
- **Sampling** - Configurable event sampling rate
- **Destination routing** - Sends to App Insights, GA4, etc.

### Standard Properties

Every event automatically includes:

```typescript
interface StandardEventProperties {
  // Identity
  anonymous_id: string          // UUID, persisted 365 days
  session_id: string            // Rotates on inactivity/daily

  // Page context
  page_url: string
  page_path: string
  page_title: string
  referrer: string

  // UTM (if captured)
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string

  // Device
  device_class: 'mobile' | 'tablet' | 'desktop'
  locale: string
  timezone: string
  viewport_width: number
  viewport_height: number
  user_agent: string

  // App context
  env: 'development' | 'staging' | 'production'
  app_version: string
  consent_state_version: string

  // Timing
  timestamp: string             // ISO string
  client_timestamp: number      // Unix ms
}
```

### API Functions

```typescript
import { analytics, track, page, conversion } from '@/lib/analytics'

// Initialize analytics
initAnalytics({
  enabled: true,
  debugMode: true,
  samplingRate: 1.0,
  environment: 'development',
  appVersion: '1.0.0',
})

// Track custom event
track('button_clicked', {
  button_id: 'cta_hero',
  button_text: 'Get Started',
})

// Track page view
page('products', {
  category: 'medical-devices',
})

// Track conversion (also sent server-side)
conversion('lead_submitted', 'uuid-123', {
  form_name: 'contact',
  lead_source: 'website',
})

// Track event only once per session
trackOnce('first_interaction')

// Track with custom fire-once key
trackOnceWithKey('video_played', 'video:product-demo', {
  video_id: 'product-demo',
})

// Check if event has fired
if (!hasFired('welcome_modal_shown')) {
  showWelcomeModal()
}
```

### Tracking Options

```typescript
track('event_name', properties, {
  category: 'analytics',      // Consent category required
  fireOnce: true,             // Only fire once per session
  fireOnceKey: 'custom-key',  // Custom deduplication key
})
```

### Registering Destinations

Analytics events are automatically routed to registered destinations:

```typescript
import { registerDestination } from '@/lib/analytics'

// Custom destination
registerDestination((event) => {
  if (event.type === 'conversion') {
    // Send to custom endpoint
    fetch('/api/conversions', {
      method: 'POST',
      body: JSON.stringify(event),
    })
  }
})
```

---

## Epic 4: Google Analytics 4

### Purpose

GA4 integration with Consent Mode v2 support.

### Key File

- `src/lib/analytics/ga4.ts`

### Features

- **Consent Mode v2** - Respects consent choices
- **Dynamic script loading** - Only loads with consent
- **Internal traffic filtering** - Exclude internal users
- **Consistent identity** - Uses same anonymous_id as other destinations

### Configuration

```typescript
// In analytics-config.ts
ga4: {
  measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID,
  enableDebugMode: false,
}
```

### Consent Mode

GA4 consent state is automatically synchronized:

```typescript
// When consent changes, this is called automatically:
gtag('consent', 'update', {
  analytics_storage: analyticsGranted ? 'granted' : 'denied',
  ad_storage: marketingGranted ? 'granted' : 'denied',
  ad_user_data: marketingGranted ? 'granted' : 'denied',
  ad_personalization: marketingGranted ? 'granted' : 'denied',
})
```

### API Functions

```typescript
// Initialize GA4
initGA4({
  measurementId: 'G-XXXXXXXXXX',
  enableDebugMode: false,
  sendPageViews: false,  // We handle page views ourselves
})

// Track page view
trackGA4PageView('/products', 'Products | Polymer Bionics', {
  custom_dimension: 'value',
})

// Track event
trackGA4Event('button_click', {
  button_id: 'cta',
})

// Track conversion
trackGA4Conversion('Lead', 'lead_123', {
  value: 100,
  currency: 'USD',
})

// Track form submission
trackGA4FormSubmit('contact', true)

// Track download
trackGA4Download('datasheet.pdf', 'pdf')

// Mark session as internal traffic
markAsInternalTraffic()

// Check if internal traffic
if (isInternalTraffic()) {
  // Skip certain tracking
}
```

### Internal Traffic Filtering

Mark internal users to exclude from analytics:

```typescript
// In admin section or via query param
if (isInternalUser) {
  markAsInternalTraffic()
}

// Later, check before tracking marketing events
if (!isInternalTraffic()) {
  trackGA4Conversion('purchase', orderId)
}
```

---

## Epic 5: Server-Side Events

### Purpose

Azure Function for server-authoritative conversion tracking with idempotency guarantees.

### Key Files

- `api/src/functions/events.ts` - Azure Function
- `api/host.json` - Function host configuration
- `api/package.json` - Dependencies

### Endpoint

```text
POST /api/events/collect
```

### Request Schema

```typescript
{
  event_id: string      // UUID for idempotency
  event_name: string    // e.g., "lead_submitted"
  event_type: "conversion" | "track"
  properties: Record<string, unknown>
  timestamp: string     // ISO datetime
}
```

### Features

1. **Request Validation** - Zod schema validation
2. **Rate Limiting** - 100 requests/minute per IP
3. **Idempotency** - Azure Table Storage deduplication
4. **GA4 Forwarding** - Measurement Protocol integration

### Rate Limiting

```typescript
// In-memory rate limiting
const RATE_LIMIT_WINDOW_MS = 60 * 1000  // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100     // per IP
```

### Idempotency

Events are deduplicated using Azure Table Storage:

```typescript
// Partition key: date (YYYY-MM-DD)
// Row key: event_id (UUID)

// Check for duplicate
const isDup = await isDuplicate(event_id)
if (isDup) {
  return { status: 200, jsonBody: { success: true, duplicate: true } }
}

// Process event
await processEvent(event)

// Mark as processed
await markAsProcessed(event_id, event_name)
```

### GA4 Measurement Protocol

Conversions are forwarded to GA4 server-side:

```typescript
await fetch(
  `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_ID}&api_secret=${SECRET}`,
  {
    method: 'POST',
    body: JSON.stringify({
      client_id: properties.anonymous_id,
      events: [{
        name: event_name,
        params: {
          ...properties,
          event_id,
          server_timestamp: new Date().toISOString(),
        },
      }],
    }),
  }
)
```

### Environment Variables

```bash
# Required
EVENT_STORAGE_CONNECTION_STRING=  # Azure Table Storage

# Optional (for GA4 forwarding)
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=xxxxx

# Optional (for App Insights)
APPLICATIONINSIGHTS_CONNECTION_STRING=
```

---

## Epic 6: Identity Management

### Purpose

Anonymous identity tracking without PII. Provides consistent `anonymous_id` and `session_id` across all analytics.

### Key File

- `src/lib/analytics/identity.ts`

### Identity Schema

```typescript
interface AnonymousIdentity {
  anonymousId: string    // UUID v4, persisted 365 days
  sessionId: string      // Shorter-lived, rotates on inactivity
  createdAt: string      // ISO timestamp
  lastSeen: string       // ISO timestamp
}
```

### Storage Hierarchy

Identity data is stored with fallbacks:

1. **Cookie** (preferred) - Works across subdomains
2. **localStorage** - First fallback
3. **sessionStorage** - Session-only fallback
4. **Memory** - Last resort (no persistence)

### Session Management

Sessions rotate based on:

- **30 minutes of inactivity** (configurable)
- **Daily reset** (optional, enabled by default)

```typescript
interface IdentityConfig {
  anonymousIdExpiryDays: 365
  sessionTimeoutMinutes: 30
  dailySessionReset: true
}
```

### API Functions

```typescript
// Get full identity object
const identity = getIdentity()
// { anonymousId: 'uuid', sessionId: 'uuid', createdAt: '...', lastSeen: '...' }

// Get just the anonymous ID
const anonId = getAnonymousId()

// Get just the session ID
const sessionId = getSessionId()

// Manually refresh session
refreshSession()

// Reset session (new session ID)
resetSession()

// Clear all identity data
clearIdentity()

// Check storage availability
const available = isStorageAvailable('localStorage')

// Get identity with automatic fallback
const identity = getIdentityWithFallback()
```

### Privacy Considerations

- No PII is collected or stored
- Anonymous ID is a random UUID
- Users can clear identity via browser settings
- Identity is cleared when consent is withdrawn

---

## Epic 7: Schema Validation

### Purpose

Runtime event validation using Zod schemas to ensure data quality.

### Key File

- `src/lib/analytics/schemas.ts`

### Base Schemas

```typescript
// Standard properties schema
const StandardEventPropertiesSchema = z.object({
  anonymous_id: z.string().uuid(),
  session_id: z.string().min(1),
  page_url: z.string().url(),
  page_path: z.string().min(1),
  // ... etc
})

// Page view event
const PageViewEventSchema = z.object({
  type: z.literal('page_view'),
  properties: StandardEventPropertiesSchema.extend({
    page_name: z.string().min(1),
    previous_page: z.string().optional(),
  }),
})

// Track event
const TrackEventSchema = z.object({
  type: z.literal('track'),
  event_name: z.string().min(1).max(100),
  properties: StandardEventPropertiesSchema,
})

// Conversion event
const ConversionEventSchema = z.object({
  type: z.literal('conversion'),
  event_name: z.string().min(1).max(100),
  event_id: z.string().uuid(),
  properties: StandardEventPropertiesSchema.extend({
    conversion_type: z.string(),
    conversion_value: z.number().optional(),
    currency: z.string().length(3).optional(),
  }),
})
```

### Event-Specific Schemas

```typescript
// CTA Click
const CTAClickEventSchema = z.object({
  cta_id: z.string(),
  cta_text: z.string(),
  cta_location: z.string(),
  destination_url: z.string().url().optional(),
})

// Form Submit
const FormSubmitEventSchema = z.object({
  form_name: z.string(),
  form_id: z.string().optional(),
  success: z.boolean(),
  error_message: z.string().optional(),
})

// Video Play
const VideoPlayEventSchema = z.object({
  video_id: z.string(),
  video_title: z.string().optional(),
  video_duration: z.number().optional(),
  video_provider: z.string().optional(),
})
```

### Event Registry

```typescript
const EVENT_REGISTRY = {
  cta_clicked: CTAClickEventSchema,
  form_submitted: FormSubmitEventSchema,
  video_played: VideoPlayEventSchema,
  download_started: DownloadEventSchema,
  search_performed: SearchEventSchema,
  lead_submitted: LeadSubmittedEventSchema,
}
```

### Validation Functions

```typescript
// Validate any event
const result = validateEvent(event)
// { valid: boolean, errors: string[], warnings: string[] }

// Validate specific event type
const result = validateSpecificEvent('cta_clicked', properties)

// Validate and wrap (returns ValidatedEvent)
const validated = validateAndWrap(event)
// { event, validation, rejected: boolean }

// Check required properties exist
const hasRequired = hasRequiredProperties('cta_clicked', properties)
```

---

## Epic 8: UTM Attribution

### Purpose

Capture and persist UTM parameters for marketing attribution.

### Key File

- `src/lib/analytics/attribution.ts`

### UTM Parameters

| Parameter | Example | Purpose |
| --------- | ------- | ------- |
| `utm_source` | `google` | Traffic source |
| `utm_medium` | `cpc` | Marketing medium |
| `utm_campaign` | `spring_sale` | Campaign name |
| `utm_term` | `polymer` | Paid keywords |
| `utm_content` | `banner_a` | Content variant |

### Attribution Policies

```typescript
type AttributionPolicy = 'first-touch' | 'last-touch' | 'session'
```

| Policy | Behavior |
| ------ | -------- |
| `first-touch` | Keep original UTM, ignore new ones (default) |
| `last-touch` | Always overwrite with latest UTM |
| `session` | Reset per session, don't persist long-term |

### Storage Schema

```typescript
interface StoredUTM {
  params: UTMParameters
  capturedAt: string      // ISO timestamp
  policy: 'first-touch' | 'session'
  landingPage: string     // URL where captured
}
```

### API Functions

```typescript
// Capture UTM from current URL
captureUTM('first-touch')  // Only if no existing UTM
captureUTM('last-touch')   // Always overwrite
captureUTM('session')      // Session-only storage

// Get stored UTM
const utm = getUTM()
// { utm_source: 'google', utm_medium: 'cpc', ... }

// Clear stored UTM
clearUTM()

// Get UTM for event properties (auto-attached by tracker)
const utmProps = getUTMForEvent()

// Check if URL has UTM params
if (hasUTMInURL()) {
  captureUTM('first-touch')
}
```

### Automatic Capture

UTM parameters are automatically captured on app load:

```tsx
// In AnalyticsProvider.tsx
useEffect(() => {
  // Capture UTM immediately (before consent needed)
  captureUTM('first-touch')
  
  // Initialize analytics
  initAnalytics(config)
}, [])
```

---

## Epic 9: Data Export (ADLS)

### Purpose

Export analytics events to Azure Data Lake Storage for data warehouse integration.

### Key File

- `src/lib/analytics/data-export.ts`

### Export Format

Events are batched and exported in a Parquet-compatible JSON format:

```typescript
interface ExportEvent {
  event_id: string
  event_type: string
  event_name?: string
  properties: Record<string, unknown>
  timestamp: string           // ISO
  date_partition: string      // YYYY-MM-DD
  hour_partition: string      // HH
  identifiers: {
    anonymous_id?: string
    session_id?: string
  }
  context: {
    page_url: string
    page_path: string
    // ... browser context
  }
}

interface ExportBatch {
  batch_id: string
  events: ExportEvent[]
  created_at: string
  source: string
  schema_version: string
}
```

### ADLS Folder Structure

```text
analytics/
├── events/
│   ├── date_partition=2024-01-01/
│   │   ├── hour_partition=00/
│   │   │   ├── batch-xxx.json
│   │   │   └── batch-yyy.json
│   │   └── hour_partition=01/
│   └── date_partition=2024-01-02/
└── processed/
    └── events.parquet
```

### Configuration

```typescript
interface DataExportConfig {
  enabled: boolean
  endpoint: string              // Azure Function endpoint
  batchSize: number             // Events before auto-flush (default: 10)
  flushInterval: number         // ms between flushes (default: 30000)
  maxRetries: number            // Retry attempts (default: 3)
  useSendBeacon: boolean        // Use sendBeacon for reliability
  debug: boolean
}
```

### API Functions

```typescript
// Initialize data export
initDataExport({
  enabled: true,
  endpoint: '/api/events/export',
  batchSize: 10,
  flushInterval: 30000,
})

// Buffer an event for export
bufferEvent(exportEvent)

// Force flush buffered events
await flushEvents()

// Retry failed batches from localStorage
await retryFailedBatches()

// Transform analytics event to export format
const exportEvent = transformEventForExport(analyticsEvent, identifiers)

// Get current config
const config = getExportConfig()

// Get buffer size
const size = getBufferSize()

// Stop export and flush remaining
stopDataExport()
```

### Reliability Features

1. **sendBeacon** - Events sent even on page unload
2. **Retry with backoff** - Exponential backoff on failures
3. **localStorage fallback** - Failed batches stored for retry
4. **Visibility change flush** - Flushes when tab becomes hidden

---

## Epic 11: Feature Flags

### Purpose

Feature flags with Azure App Configuration support and A/B testing capabilities.

### Key File

- `src/lib/feature-flags.ts`

### Features

- **Azure App Config integration** - Fetch flags from cloud
- **Local defaults** - Work offline
- **Experiment tracking** - Assignment and exposure events
- **Guardrails** - Auto-disable on metric degradation
- **React hooks** - Easy component integration

### Configuration

```typescript
interface FeatureFlagsConfig {
  endpoint?: string           // Azure App Config endpoint
  refreshInterval?: number    // Seconds between refreshes
  defaults?: Record<string, boolean>
  debug?: boolean
}

// Initialize
await initFeatureFlags({
  endpoint: 'https://my-app-config.azconfig.io',
  refreshInterval: 300,  // 5 minutes
  defaults: {
    'analytics.session_replay': false,
    'ui.new_contact_form': true,
  },
})
```

### Flag Evaluation

```typescript
// Simple boolean check
if (isFeatureEnabled('ui.new_contact_form')) {
  return <NewContactForm />
}

// Get flag with variant
const flag = getFeatureFlag('checkout.experiment')
// { name: 'checkout.experiment', enabled: true, variant: 'B' }

// Get all flags
const allFlags = getAllFlags()
// { 'ui.new_form': true, 'analytics.replay': false }
```

### A/B Testing

```typescript
// Assign user to experiment variant
const variant = assignExperimentVariant(
  'checkout_flow',           // Experiment ID
  ['control', 'variant_a', 'variant_b'],  // Variants
  [0.5, 0.25, 0.25]          // Weights (optional)
)

// Track when user sees the experiment
trackExperimentExposed('checkout_flow')

// Get existing assignment
const assignment = getExperimentAssignment('checkout_flow')
// { experimentId, variant, assignedAt, sessionId }
```

### Guardrails

Automatic checks for experiment safety:

```typescript
const result = checkGuardrails('checkout_flow', {
  errorRate: 0.06,           // Current error rate
  p95Latency: 3500,          // Current P95 latency
  conversionRate: 0.045,     // Current conversion rate
  baselineConversionRate: 0.05,  // Baseline rate
})

if (result.violated) {
  console.warn('Guardrails violated:', result.reasons)
  // ['Error rate 6.0% exceeds threshold 5.0%']
}
```

### React Hooks

```tsx
function MyComponent() {
  // Simple feature flag
  const showNewForm = useFeatureFlag('ui.new_contact_form')

  // A/B experiment
  const { variant, trackExposure } = useExperiment(
    'checkout_flow',
    ['control', 'variant_a']
  )

  useEffect(() => {
    // Track when user actually sees the variant
    trackExposure()
  }, [trackExposure])

  if (variant === 'variant_a') {
    return <NewCheckout />
  }
  return <OriginalCheckout />
}
```

---

## Epic 12: Session Replay

### Purpose

Session replay integration with Microsoft Clarity for debugging and UX analysis.

### Key File

- `src/lib/analytics/session-replay.ts`

### Features

- **Microsoft Clarity integration**
- **Privacy masking** - Configurable selectors
- **Consent-gated** - Only loads with analytics consent
- **Sampling** - Control recording percentage
- **Error linking** - Force record on errors

### Configuration

```typescript
interface SessionReplayConfig {
  enabled: boolean
  clarityProjectId?: string
  maskingLevel: 'strict' | 'balanced' | 'relaxed'
  maskSelectors: string[]        // CSS selectors to mask
  blockSelectors: string[]       // CSS selectors to block entirely
  maskAllInputs: boolean
  maskAllText: boolean
  blockIframes: boolean
  sampleRate: number             // 0-1 (default: 0.1 = 10%)
  debug: boolean
}
```

### Default Masking

Automatically masks:

- Password fields
- Email/phone inputs
- Credit card fields
- SSN/tax ID fields
- Elements with `data-sensitive`, `data-private`, `data-mask` attributes
- Elements with `.sensitive`, `.private`, `.pii` classes

### API Functions

```typescript
// Initialize session replay
initSessionReplay({
  clarityProjectId: 'xxxxxxxxxx',
  maskingLevel: 'strict',
  sampleRate: 0.1,  // 10% of sessions
})

// Tag the session
tagSession('user_type', 'premium')

// Mark a point of interest
markReplayEvent('checkout_started')

// Identify user (anonymous ID only!)
identifyReplayUser(anonymousId)

// Force enable recording for this session
forceEnableReplay()

// Enable on error (for debugging)
enableReplayOnError()

// Get Clarity session URL for support tickets
const url = getClaritySessionUrl()

// Add custom mask selector
addMaskSelector('[data-credit-card]')

// Pause/resume recording
pauseReplay()
resumeReplay()
```

### HTML Data Attributes

```html
<!-- Mask content -->
<input type="text" data-sensitive name="ssn" />
<div data-private>Sensitive info</div>
<span data-mask>Account number</span>

<!-- Block from recording entirely -->
<div data-block-replay>
  <iframe src="payment-processor.com"></iframe>
</div>
```

### Error Linking

When an error occurs, force enable replay and tag the session:

```typescript
try {
  await riskyOperation()
} catch (error) {
  trackException(error)
  enableReplayOnError()  // Ensures session is recorded
}
```

---

## Epic 13: SEO Infrastructure

### Purpose

Dynamic SEO management including meta tags, structured data, and redirect tracking.

### Key File

- `src/lib/analytics/seo.ts`

### Features

- **Dynamic meta tags** - Update title, description, etc.
- **Open Graph** - Social sharing optimization
- **Twitter Cards** - Twitter-specific meta
- **Structured Data** - JSON-LD for rich snippets
- **Redirect tracking** - Track client-side redirects

### Meta Tag Management

```typescript
// Update page metadata
updatePageMeta({
  title: 'Products',
  description: 'Explore our bioactive polymer products...',
  canonical: 'https://polymerbionics.com/products',
  og: {
    type: 'website',
    image: '/images/products-og.png',
  },
  twitter: {
    card: 'summary_large_image',
  },
})

// Use predefined page metadata
setPageMetadata('products')
```

### Structured Data (JSON-LD)

```typescript
// Organization schema
addOrganizationSchema({
  name: 'Polymer Bionics',
  url: 'https://polymerbionics.com',
  logo: 'https://polymerbionics.com/logo.png',
  description: 'Pioneering bioactive polymer technologies...',
  sameAs: [
    'https://linkedin.com/company/polymerbionics',
  ],
})

// Product schema
addProductSchema({
  name: 'BioActive Polymer Sheet',
  description: 'Medical-grade bioactive polymer...',
  image: '/images/product.png',
  brand: {
    '@type': 'Brand',
    name: 'Polymer Bionics',
  },
})

// Article schema
addArticleSchema({
  headline: 'New Research in Bioactive Polymers',
  description: 'Our latest findings...',
  datePublished: '2024-01-15',
  author: {
    '@type': 'Organization',
    name: 'Polymer Bionics',
  },
}, 'NewsArticle')

// Breadcrumb schema
addBreadcrumbSchema([
  { name: 'Home', url: 'https://polymerbionics.com' },
  { name: 'Products', url: 'https://polymerbionics.com/products' },
  { name: 'BioActive Sheet', url: 'https://polymerbionics.com/products/bioactive-sheet' },
])
```

### Redirect Tracking

```typescript
// Configure redirect rules
configureRedirects([
  { from: '/old-page', to: '/new-page', status: 301 },
  { from: '/legacy/*', to: '/modern/$1', status: 301, isRegex: true },
])

// Check if current path should redirect
const rule = checkRedirect()
if (rule) {
  executeRedirect(rule)  // Tracks redirect event and navigates
}
```

### Outbound Link Tracking

```typescript
// Set up automatic outbound link tracking
setupOutboundLinkTracking()

// Manual tracking
trackOutboundLink('https://external-site.com', 'Learn More')
```

### React Hook

```tsx
function ProductPage({ product }) {
  usePageSEO('products', {
    title: product.name,
    description: product.description,
    og: {
      type: 'product',
      image: product.image,
    },
  })

  return <div>...</div>
}
```

---

## Epic 14: Web Vitals

### Purpose

Core Web Vitals tracking for performance monitoring.

### Key File

- `src/lib/analytics/web-vitals.ts`

### Metrics Tracked

| Metric | Full Name | Good | Needs Improvement | Poor |
| ------ | --------- | ---- | ----------------- | ---- |
| **LCP** | Largest Contentful Paint | ≤2.5s | ≤4.0s | >4.0s |
| **INP** | Interaction to Next Paint | ≤200ms | ≤500ms | >500ms |
| **CLS** | Cumulative Layout Shift | ≤0.1 | ≤0.25 | >0.25 |
| **FCP** | First Contentful Paint | ≤1.8s | ≤3.0s | >3.0s |
| **TTFB** | Time to First Byte | ≤0.8s | ≤1.8s | >1.8s |

### Configuration

```typescript
interface WebVitalsConfig {
  enabled: boolean
  reportAttribution: boolean     // Include debug info (larger payload)
  reportAllChanges: boolean      // Report every change vs final only
  thresholds?: {                 // Custom thresholds
    LCP?: { good: number; poor: number }
    // ...
  }
  onMetric?: (metric) => void    // Custom callback
}
```

### API Functions

```typescript
// Initialize Web Vitals tracking
await initWebVitals({
  enabled: true,
  reportAttribution: false,
  reportAllChanges: false,
})

// Report custom performance metric
reportCustomMetric('api_response_time', 245, {
  endpoint: '/api/products',
})

// Report long task manually
reportLongTask(150, {
  context: 'data_processing',
})

// Start observing long tasks (>50ms)
startLongTaskObserver(50)

// Stop observing
stopLongTaskObserver()

// Get resource timing data
const resources = getResourceTimings()

// Report slow resources (>1000ms)
reportSlowResources(1000)
```

### React Hook

```tsx
function App() {
  // Initialize on mount
  useWebVitals({
    enabled: true,
    reportAttribution: process.env.NODE_ENV === 'development',
  })

  return <div>...</div>
}
```

### Events Tracked

```typescript
// Web Vitals event
track('web_vitals', {
  metric_name: 'LCP',
  metric_value: 2100,
  metric_rating: 'good',
  metric_delta: 2100,
  metric_id: 'v1-xxxxx',
  navigation_type: 'navigate',
})

// Long task event
track('long_task', {
  duration: 150,
  entry_type: 'longtask',
  start_time: 5000,
})

// Slow resource event
track('slow_resource', {
  resource_url: 'https://cdn.example.com/large-image.jpg',
  resource_type: 'img',
  duration: 1500,
  transfer_size: 500000,
})
```

---

## Epic 15: Cost Controls

### Purpose

Budget management and throttling to prevent runaway analytics costs.

### Key File

- `src/lib/analytics/cost-control.ts`

### Features

- **Rate limiting** - Events per minute
- **Session limits** - Events per session
- **Daily/monthly budgets** - Aggregate limits
- **Adaptive sampling** - Reduce rate near limits
- **Event priorities** - Critical events preserved

### Configuration

```typescript
interface CostControlConfig {
  enabled: boolean
  eventsPerMinute: number        // Default: 60
  eventsPerSession: number       // Default: 1000
  eventsPerDay: number           // Default: 100,000
  eventsPerMonth: number         // Default: 2,000,000
  baseSamplingRate: number       // Default: 1.0 (100%)
  aggressiveSamplingRate: number // Default: 0.1 (10%)
  aggressiveSamplingThreshold: number  // Default: 0.8 (80% of limit)
  eventPriorities: Record<string, number>
  costPer1000Events: number      // Default: $0.01
  monthlyBudget: number          // Default: $100
  debug: boolean
}
```

### Event Priorities

Higher priority = less likely to be dropped:

```typescript
const eventPriorities = {
  'conversion': 10,      // Never drop
  'error': 9,            // Almost never drop
  'page_view': 8,
  'experiment_assigned': 7,
  'form_submit': 6,
  'click': 3,
  'scroll': 1,
  'mouse_move': 0,       // Drop first
}
```

### API Functions

```typescript
// Initialize cost controls
initCostControls({
  enabled: true,
  eventsPerMinute: 60,
  monthlyBudget: 100,
})

// Check if event should be allowed
const decision = shouldAllowEvent('click')
// { allowed: boolean, reason: string, samplingRate: number }

// Record event was sent (call after successful send)
recordEventSent()

// Get current usage metrics
const metrics = getUsageMetrics()
// { eventsThisMinute, eventsThisSession, eventsToday, eventsThisMonth, ... }

// Get estimated costs
const costs = getEstimatedCosts()
// { todayCost, monthCost, projectedMonthCost, budgetRemaining, budgetUtilization }

// Get throttling status
const status = getThrottlingStatus()
// { isThrottling, currentSamplingRate, eventsDropped, limitStatus: {...} }

// Reset session metrics (on new session)
resetSessionMetrics()

// Update config at runtime
updateCostControlConfig({ eventsPerMinute: 30 })
```

### Integration Helper

```typescript
// Wrap tracking function with cost controls
const throttledTrack = withCostControl(track, 'click')

// Now calls check shouldAllowEvent before tracking
throttledTrack('button_clicked', { button_id: 'cta' })
```

### Throttle Reasons

```typescript
type ThrottleReason =
  | 'allowed'          // Event allowed
  | 'rate_limited'     // Exceeded events/minute
  | 'session_limit'    // Exceeded events/session
  | 'daily_limit'      // Exceeded events/day
  | 'monthly_limit'    // Exceeded events/month
  | 'sampled_out'      // Dropped due to sampling
  | 'budget_exceeded'  // Cost limit reached
```

---

## Epic 16: Error Reporting

### Purpose

Centralized error tracking and reporting to Azure Application Insights. Captures uncaught exceptions, unhandled promise rejections, and manual error reports.

### Key File

- `src/lib/analytics/error-reporting.ts`

### Features

- **Global error handlers** - Automatic capture of window.onerror and unhandledrejection
- **React error boundary integration** - Capture errors from React error boundaries
- **Network error tracking** - Track failed API calls with request details
- **Intelligent filtering** - Ignore patterns for third-party scripts and known issues
- **Sampling and limits** - Prevent flooding during error storms
- **App Insights integration** - Errors reported via `trackException()`

### Configuration

```typescript
interface ErrorReportingConfig {
  captureUnhandledExceptions: boolean  // Default: true
  captureUnhandledRejections: boolean  // Default: true
  ignorePatterns: (string | RegExp)[]  // Patterns to ignore
  maxErrorsPerSession: number          // Default: 100
  samplingRate: number                 // Default: 1.0 (100%)
  debug: boolean                       // Debug logging
}
```

### API Functions

```typescript
// Initialize error reporting (called by AnalyticsProvider)
initErrorReporting({
  captureUnhandledExceptions: true,
  captureUnhandledRejections: true,
  maxErrorsPerSession: 50,
})

// Report a custom error
reportCustomError(new Error('Something went wrong'), {
  component: 'PaymentForm',
  action: 'submit',
  userId: 'anon_12345',
})

// Report an error from React error boundary
reportReactError(error, {
  componentStack: errorInfo.componentStack,
  errorBoundary: 'AppErrorBoundary',
})

// Report a network error
reportNetworkError('/api/products', 500, 'Internal Server Error')

// Cleanup (called on unmount)
cleanupErrorReporting()
```

### Error Severity Levels

```typescript
type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info'
```

### Ignore Patterns

Default patterns that won't be reported:

```typescript
const defaultIgnorePatterns = [
  /ResizeObserver loop/,           // Common browser noise
  /Loading chunk/,                 // Code-splitting retries
  /NetworkError/,                  // Offline users
  /AbortError/,                    // Intentional cancellations
  /chrome-extension/,              // Browser extensions
  /moz-extension/,
  /Script error/,                  // Cross-origin scripts
]
```

---

## Epic 17: Performance Monitoring

### Purpose

Real-time performance monitoring with automatic detection of slow resources, long tasks, memory issues, and frame rate problems.

### Key File

- `src/lib/analytics/performance-monitor.ts`

### Features

- **Resource timing** - Detect slow-loading assets (>500ms)
- **Long task observer** - Capture tasks blocking main thread (>50ms)
- **Memory monitoring** - Track JS heap usage (Chrome only)
- **Frame rate tracking** - Detect UI jank via requestAnimationFrame
- **Custom performance marks** - Manual performance instrumentation
- **App Insights integration** - Metrics reported via `trackMetric()`

### Configuration

```typescript
interface PerformanceMonitorConfig {
  trackResources: boolean         // Track slow resources
  trackLongTasks: boolean         // Track long tasks
  trackMemory: boolean            // Track memory (Chrome)
  trackFrameRate: boolean         // Track frame rate
  slowResourceThresholdMs: number // Default: 500ms
  memoryCheckIntervalMs: number   // Default: 30000ms (30s)
  frameRateSampleMs: number       // Default: 5000ms (5s)
  debug: boolean
}
```

### API Functions

```typescript
// Initialize performance monitoring (called by AnalyticsProvider)
initPerformanceMonitor({
  trackResources: true,
  trackLongTasks: true,
  trackMemory: true,
  trackFrameRate: false,  // Disable for reduced overhead
})

// Add a performance mark
markPerformance('component_mounted', { component: 'ProductList' })

// Measure between two marks
measurePerformance('render_duration', 'render_start', 'render_end')

// Track a custom performance metric
trackPerformanceMetric({
  name: 'api_response_time',
  value: 245,
  category: 'custom',
  metadata: { endpoint: '/api/products' },
})

// Cleanup
cleanupPerformanceMonitor()
```

### Metric Categories

```typescript
type MetricCategory = 'resource' | 'long-task' | 'memory' | 'frame-rate' | 'custom'
```

### Automatically Tracked Metrics

| Metric | Category | Description |
| ------ | -------- | ----------- |
| `slow_resource` | resource | Resources taking >500ms to load |
| `long_task` | long-task | Main thread tasks >50ms |
| `memory_usage` | memory | JS heap size and utilization |
| `frame_rate` | frame-rate | Average FPS over sample period |

---

## Epic 18: Monitoring Hooks

### Purpose

React hooks for integrating monitoring into components. Provides render tracking, fetch wrapping, interaction tracking, visibility detection, and error handling.

### Key File

- `src/lib/analytics/monitoring-hooks.ts`

### Available Hooks

#### useRenderTracking

Track component render performance and detect slow renders.

```typescript
function ProductList({ products }: Props) {
  // Logs warning if render takes >100ms
  useRenderTracking('ProductList', { productCount: products.length })
  
  return <div>...</div>
}
```

#### useTrackedFetch

Wrap fetch calls with automatic performance and error tracking.

```typescript
function ProductPage() {
  const trackedFetch = useTrackedFetch()
  
  const loadProducts = async () => {
    // Automatically tracks duration, errors, and status codes
    const response = await trackedFetch('/api/products')
    return response.json()
  }
}
```

#### useInteractionTracking

Track user interactions with debouncing.

```typescript
function SearchInput() {
  const trackInteraction = useInteractionTracking('SearchInput')
  
  return (
    <input
      onChange={(e) => {
        trackInteraction('search_typed', { length: e.target.value.length })
      }}
    />
  )
}
```

#### useVisibilityTracking

Track when components enter the viewport.

```typescript
function ProductCard({ product }: Props) {
  const ref = useVisibilityTracking<HTMLDivElement>('ProductCard', {
    productId: product.id,
    threshold: 0.5,  // 50% visible
  })
  
  return <div ref={ref}>...</div>
}
```

#### useErrorHandler

Create error handlers for components.

```typescript
function DataLoader() {
  const handleError = useErrorHandler('DataLoader')
  
  const loadData = async () => {
    try {
      const response = await fetch('/api/data')
      if (!response.ok) throw new Error('Failed to load')
      return response.json()
    } catch (error) {
      handleError(error)
      return null
    }
  }
}
```

#### usePageLoadTracking

Track page load performance metrics.

```typescript
function App() {
  // Automatically tracks navigation timing on mount
  usePageLoadTracking()
  
  return <Router>...</Router>
}
```

### Hook Options

```typescript
interface RenderTrackingOptions {
  slowThresholdMs?: number  // Default: 100ms
  trackEveryRender?: boolean  // Default: false (only slow renders)
}

interface VisibilityOptions {
  threshold?: number  // 0-1, default: 0.1 (10% visible)
  trackOnce?: boolean  // Default: true
}

interface InteractionOptions {
  debounceMs?: number  // Default: 500ms
}
```

---

## Configuration

### Environment Variables

```bash
# Build metadata (injected by CI)
VITE_BUILD_TIME=2024-01-15T10:30:00Z
VITE_BUILD_SHA=abc1234
VITE_BUILD_REF=main

# Analytics (Epic 2, 3, 4)
VITE_APPINSIGHTS_CONNECTION_STRING=InstrumentationKey=xxx;...
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_EVENTS_ENDPOINT=/api/events/collect

# Feature flags (Epic 11)
VITE_APP_CONFIG_ENDPOINT=https://my-config.azconfig.io
```

### analytics-config.ts

Central configuration file with environment-specific settings:

```typescript
// Development config
const developmentConfig = {
  analytics: {
    enabled: true,
    debugMode: true,
    samplingRate: 1.0,
    environment: 'development',
    appVersion: '1.0.0-dev',
  },
  appInsights: {
    connectionString: undefined,  // Disabled in dev
    enableDebugMode: true,
  },
  ga4: {
    measurementId: undefined,     // Disabled in dev
    enableDebugMode: true,
  },
}

// Production config
const productionConfig = {
  analytics: {
    enabled: true,
    debugMode: false,
    samplingRate: 1.0,
    environment: 'production',
    appVersion: import.meta.env.VITE_BUILD_SHA?.slice(0, 7) || '1.0.0',
  },
  appInsights: {
    connectionString: import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING,
  },
  ga4: {
    measurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID,
  },
}
```

---

## React Hooks

### useConsent

Manage consent state in components:

```tsx
const {
  consent,              // Current consent state
  shouldShowBanner,     // Show banner?
  canTrack,             // Check category
  acceptAll,            // Accept all
  acceptNecessary,      // Necessary only
  withdraw,             // Withdraw consent
  openPreferences,      // Open modal
  closePreferences,
  isPreferencesOpen,
} = useConsent()
```

### useAnalytics

Access analytics functions:

```tsx
const {
  track,       // Track custom event
  page,        // Track page view
  conversion,  // Track conversion
  trackOnce,   // Track once per session
  isEnabled,   // Analytics consent granted?
} = useAnalytics()
```

### usePageTracking

Auto-track page views:

```tsx
function App() {
  const [currentPage, setCurrentPage] = useState('home')
  
  // Automatically tracks when currentPage changes
  usePageTracking(currentPage)
  
  return <div>...</div>
}
```

### useFeatureFlag

Check feature flags:

```tsx
const showNewFeature = useFeatureFlag('ui.new_feature', false)

if (showNewFeature) {
  return <NewFeature />
}
```

### useExperiment

A/B test integration:

```tsx
const { variant, trackExposure } = useExperiment(
  'checkout_experiment',
  ['control', 'variant_a']
)

useEffect(() => {
  trackExposure()
}, [trackExposure])
```

---

## Deployment

### Client-Side

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Environment variables**
   Set production environment variables in Azure Web App settings or `.env.production`:
   ```
   VITE_APPINSIGHTS_CONNECTION_STRING=...
   VITE_GA4_MEASUREMENT_ID=...
   ```

3. **Deploy to Azure**
   The GitHub Actions workflow handles deployment on push to `main`.

### Server-Side (Azure Functions)

1. **Install dependencies**
   ```bash
   cd api
   npm install
   ```

2. **Deploy**
   ```bash
   # Using Azure Functions Core Tools
   func azure functionapp publish <app-name>
   
   # Or via GitHub Actions
   ```

3. **Configure app settings**
   ```bash
   az functionapp config appsettings set \
     --name <app-name> \
     --resource-group <rg-name> \
     --settings \
       EVENT_STORAGE_CONNECTION_STRING="..." \
       GA4_MEASUREMENT_ID="G-XXXXXXXXXX" \
       GA4_API_SECRET="..."
   ```

### Azure Resources Required

| Resource | Purpose |
|----------|---------|
| **App Service** | Host the React app |
| **Function App** | Server-side events API |
| **Application Insights** | Telemetry and monitoring |
| **Storage Account** | Table storage for deduplication |
| **App Configuration** | Feature flags (optional) |
| **Data Lake Storage Gen2** | Event archive (optional) |

---

## Testing

The analytics infrastructure includes comprehensive test coverage.

### Running Tests

```bash
# Run all analytics tests
npm run test -- src/lib/analytics

# Run with coverage
npm run test:coverage -- src/lib/analytics

# Run specific test file
npm run test -- src/lib/analytics/__tests__/consent.test.ts
```

### Test Coverage

Current analytics module coverage:

| Module | Statements | Branches | Functions |
|--------|------------|----------|-----------|
| consent.ts | 90%+ | 80%+ | 95%+ |
| tracker.ts | 90%+ | 75%+ | 90%+ |
| identity.ts | 85%+ | 75%+ | 90%+ |
| hooks.ts | 100% | 90%+ | 100% |
| ga4.ts | 85%+ | 75%+ | 90%+ |
| attribution.ts | 85%+ | 75%+ | 90%+ |
| app-insights.ts | 80%+ | 70%+ | 85%+ |

### Mocking in Tests

The analytics tests use comprehensive mocking for browser APIs:

```typescript
// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock consent state
vi.mock('@/lib/analytics/consent', () => ({
  canTrack: vi.fn().mockReturnValue(true),
  getConsentState: vi.fn().mockReturnValue({ choices: { analytics: true } }),
}))
```

### Key Test Patterns

1. **Consent gating tests** - Verify tracking respects consent
2. **Storage fallback tests** - Test localStorage/cookie fallbacks
3. **Error handling tests** - Verify graceful degradation
4. **Cost control tests** - Test rate limiting and budgets

---

## Troubleshooting

### Events not tracking

1. **Check consent** - Open DevTools console, run:
   ```javascript
   JSON.parse(localStorage.getItem('pb_consent'))
   ```
   Verify `choices.analytics` is `true`.

2. **Check debug mode** - Enable debug mode to see console logs:
   ```javascript
   // In AnalyticsProvider or config
   debugMode: true
   ```

3. **Check network tab** - Look for requests to:
   - `google-analytics.com` (GA4)
   - `dc.services.visualstudio.com` (App Insights)
   - `/api/events/collect` (server-side)

### Identity not persisting

1. **Check storage availability**:
   ```javascript
   import { isStorageAvailable } from '@/lib/analytics'
   console.log('localStorage:', isStorageAvailable('localStorage'))
   console.log('cookie:', isStorageAvailable('cookie'))
   ```

2. **Check cookies** - Look for `pb_anonymous_id` cookie.

3. **Private browsing** - Some storage may be disabled.

### Feature flags not loading

1. **Check Azure App Config endpoint** in environment variables.

2. **Check network** for failed requests to the config endpoint.

3. **Verify CORS** is configured on Azure App Configuration.

### Rate limiting triggered

1. **Check throttle status**:
   ```javascript
   import { getThrottlingStatus } from '@/lib/analytics'
   console.log(getThrottlingStatus())
   ```

2. **Adjust limits** if needed:
   ```javascript
   updateCostControlConfig({ eventsPerMinute: 120 })
   ```

---

## License

This analytics infrastructure is part of the Polymer Bionics website codebase.
