/**
 * Application Entry Point
 * 
 * Initializes the React application with:
 * - React 18 createRoot for concurrent rendering
 * - Error boundary for graceful error handling
 * - GitHub Spark integration
 * - Global styles and theming
 * 
 * @module main
 */

import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

// Run performance benchmark in development
if (import.meta.env.DEV) {
  import('./lib/performance-benchmark').then(({ runBenchmarkOnLoad }) => {
    runBenchmarkOnLoad()
  })
}

/**
 * Mount the React application to the DOM.
 * Uses React 18's createRoot API for concurrent features.
 */
const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  )
}
