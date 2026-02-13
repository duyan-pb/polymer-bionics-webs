/**
 * Vite Environment Type Declarations
 * 
 * TypeScript type definitions for Vite build-time environment variables.
 * 
 * Build Metadata (from GitHub Actions):
 * - VITE_BUILD_TIME: Commit timestamp
 * - VITE_BUILD_SHA: Git commit SHA
 * - VITE_BUILD_REF: Branch name
 * 
 * Analytics Configuration:
 * - VITE_APPINSIGHTS_CONNECTION_STRING: Azure App Insights
 * - VITE_GA4_MEASUREMENT_ID: Google Analytics 4
 * - VITE_EVENTS_ENDPOINT: Custom events API
 * - VITE_CLARITY_PROJECT_ID: Microsoft Clarity
 * 
 * @see docs/ANALYTICS.md for analytics setup
 */
/// <reference types="vite/client" />

// Build metadata injected by GitHub Actions
interface ImportMetaEnv {
  readonly VITE_BUILD_TIME?: string
  readonly VITE_BUILD_SHA?: string
  readonly VITE_BUILD_REF?: string
  
  // Analytics configuration (Epic 2, 3, 4)
  readonly VITE_APPINSIGHTS_CONNECTION_STRING?: string
  readonly VITE_GA4_MEASUREMENT_ID?: string
  readonly VITE_EVENTS_ENDPOINT?: string
  
  // Session Replay (Epic 12)
  readonly VITE_CLARITY_PROJECT_ID?: string
  
  // Feature flags (Epic 11)
  readonly VITE_APP_CONFIG_ENDPOINT?: string
  
  // Mode
  readonly MODE: 'development' | 'staging' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Type declarations for uppercase image extensions
declare module '*.JPG' {
  const src: string
  export default src
}
declare module '*.JPEG' {
  const src: string
  export default src
}
declare module '*.PNG' {
  const src: string
  export default src
}
declare module '*.HEIC' {
  const src: string
  export default src
}