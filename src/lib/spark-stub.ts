/**
 * Spark Runtime Stub
 * 
 * A no-op stub for the GitHub Spark runtime (`@github/spark/spark`).
 * Used when deploying to static hosts (Netlify, Vercel) where the
 * Spark backend is unavailable.
 * 
 * This prevents 404 errors for `/_spark/` API calls.
 * 
 * @module lib/spark-stub
 */

// No-op export - the Spark runtime is a side-effect import that sets up
// global APIs. In static mode, we don't need those APIs.
export {}
