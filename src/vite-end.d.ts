/// <reference types="vite/client" />
declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string

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