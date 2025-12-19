/// <reference types="vite/client" />
declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string

// Build metadata injected by GitHub Actions
interface ImportMetaEnv {
  readonly VITE_BUILD_TIME?: string
  readonly VITE_BUILD_SHA?: string
  readonly VITE_BUILD_REF?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}