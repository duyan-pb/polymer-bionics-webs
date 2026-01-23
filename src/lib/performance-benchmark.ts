/**
 * Performance Benchmark Utilities
 * 
 * Tools for measuring and reporting performance metrics.
 * Integrates with the existing analytics infrastructure.
 * 
 * @module lib/performance-benchmark
 */

// =============================================================================
// TYPES
// =============================================================================

export interface BenchmarkResult {
  /** Benchmark name */
  name: string
  /** Navigation timing metrics */
  navigation: NavigationMetrics
  /** Resource loading metrics */
  resources: ResourceMetrics
  /** Core Web Vitals */
  webVitals: WebVitalsMetrics
  /** Memory usage (if available) */
  memory?: MemoryMetrics
  /** Total scores */
  scores: PerformanceScores
  /** Timestamp of benchmark */
  timestamp: number
}

export interface NavigationMetrics {
  /** DNS lookup time */
  dnsLookup: number
  /** TCP connection time */
  tcpConnection: number
  /** Time to first byte */
  ttfb: number
  /** DOM content loaded */
  domContentLoaded: number
  /** Full page load */
  pageLoad: number
  /** DOM interactive */
  domInteractive: number
}

export interface ResourceMetrics {
  /** Total resources loaded */
  totalResources: number
  /** Total bytes transferred */
  totalBytes: number
  /** Resources by type */
  byType: Record<string, { count: number; bytes: number; avgDuration: number }>
  /** Slowest resources */
  slowestResources: Array<{ name: string; duration: number; size: number }>
}

export interface WebVitalsMetrics {
  /** First Contentful Paint */
  fcp?: number
  /** Largest Contentful Paint */
  lcp?: number
  /** Cumulative Layout Shift */
  cls?: number
  /** First Input Delay */
  fid?: number
  /** Interaction to Next Paint */
  inp?: number
  /** Time to First Byte */
  ttfb?: number
}

export interface MemoryMetrics {
  /** Used JS heap size in MB */
  usedJSHeapSize: number
  /** Total JS heap size in MB */
  totalJSHeapSize: number
  /** JS heap size limit in MB */
  jsHeapSizeLimit: number
  /** Heap utilization percentage */
  heapUtilization: number
}

export interface PerformanceScores {
  /** Overall performance score (0-100) */
  overall: number
  /** Navigation performance score */
  navigation: number
  /** Resource loading score */
  resources: number
  /** Web Vitals score */
  webVitals: number
}

// =============================================================================
// NAVIGATION TIMING
// =============================================================================

/**
 * Get navigation timing metrics
 */
export function getNavigationMetrics(): NavigationMetrics {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  
  if (!nav) {
    return {
      dnsLookup: 0,
      tcpConnection: 0,
      ttfb: 0,
      domContentLoaded: 0,
      pageLoad: 0,
      domInteractive: 0,
    }
  }

  return {
    dnsLookup: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
    tcpConnection: Math.round(nav.connectEnd - nav.connectStart),
    ttfb: Math.round(nav.responseStart - nav.requestStart),
    domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
    pageLoad: Math.round(nav.loadEventEnd - nav.startTime),
    domInteractive: Math.round(nav.domInteractive - nav.startTime),
  }
}

// =============================================================================
// RESOURCE TIMING
// =============================================================================

/**
 * Get resource loading metrics
 */
export function getResourceMetrics(): ResourceMetrics {
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  
  const byType: Record<string, { count: number; bytes: number; totalDuration: number }> = {}
  let totalBytes = 0
  
  for (const resource of resources) {
    const type = getResourceType(resource.initiatorType, resource.name)
    
    if (!byType[type]) {
      byType[type] = { count: 0, bytes: 0, totalDuration: 0 }
    }
    
    byType[type].count++
    byType[type].bytes += resource.transferSize || 0
    byType[type].totalDuration += resource.duration
    totalBytes += resource.transferSize || 0
  }
  
  // Calculate averages
  const byTypeWithAvg: Record<string, { count: number; bytes: number; avgDuration: number }> = {}
  for (const [type, data] of Object.entries(byType)) {
    byTypeWithAvg[type] = {
      count: data.count,
      bytes: data.bytes,
      avgDuration: Math.round(data.totalDuration / data.count),
    }
  }
  
  // Get slowest resources
  const slowestResources = resources
    .map(r => ({
      name: getShortResourceName(r.name),
      duration: Math.round(r.duration),
      size: r.transferSize || 0,
    }))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10)
  
  return {
    totalResources: resources.length,
    totalBytes,
    byType: byTypeWithAvg,
    slowestResources,
  }
}

/**
 * Get resource type from initiator and URL
 */
function getResourceType(initiator: string, url: string): string {
  if (initiator === 'script' || url.endsWith('.js')) {return 'js'}
  if (initiator === 'css' || url.endsWith('.css')) {return 'css'}
  if (initiator === 'img' || /\.(png|jpg|jpeg|gif|webp|svg|avif)$/i.test(url)) {return 'image'}
  if (initiator === 'font' || /\.(woff2?|ttf|otf|eot)$/i.test(url)) {return 'font'}
  if (initiator === 'fetch' || initiator === 'xmlhttprequest') {return 'api'}
  return 'other'
}

/**
 * Get short resource name for display
 */
function getShortResourceName(url: string): string {
  try {
    const urlObj = new URL(url, window.location.origin)
    const path = urlObj.pathname
    const parts = path.split('/')
    return parts[parts.length - 1] || path
  } catch {
    return url.slice(-50)
  }
}

// =============================================================================
// MEMORY METRICS
// =============================================================================

/**
 * Get memory metrics (Chrome only)
 */
export function getMemoryMetrics(): MemoryMetrics | undefined {
  const memory = (performance as Performance & { memory?: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  } }).memory
  
  if (!memory) {return undefined}
  
  const usedMB = memory.usedJSHeapSize / (1024 * 1024)
  const totalMB = memory.totalJSHeapSize / (1024 * 1024)
  const limitMB = memory.jsHeapSizeLimit / (1024 * 1024)
  
  return {
    usedJSHeapSize: Math.round(usedMB * 100) / 100,
    totalJSHeapSize: Math.round(totalMB * 100) / 100,
    jsHeapSizeLimit: Math.round(limitMB * 100) / 100,
    heapUtilization: Math.round((usedMB / totalMB) * 100),
  }
}

// =============================================================================
// WEB VITALS
// =============================================================================

/**
 * Collect Web Vitals from paint entries
 */
export function getWebVitalsFromEntries(): Partial<WebVitalsMetrics> {
  const paintEntries = performance.getEntriesByType('paint')
  const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  
  const metrics: Partial<WebVitalsMetrics> = {}
  
  for (const entry of paintEntries) {
    if (entry.name === 'first-contentful-paint') {
      metrics.fcp = Math.round(entry.startTime)
    }
  }
  
  if (navEntry) {
    metrics.ttfb = Math.round(navEntry.responseStart - navEntry.requestStart)
  }
  
  // LCP requires PerformanceObserver, get from stored metrics if available
  const lcpEntries = performance.getEntriesByType('largest-contentful-paint') as PerformanceEntry[]
  const lastLcp = lcpEntries[lcpEntries.length - 1]
  if (lastLcp) {
    metrics.lcp = Math.round(lastLcp.startTime)
  }
  
  return metrics
}

// =============================================================================
// SCORING
// =============================================================================

/**
 * Calculate performance scores
 */
function calculateScores(
  navigation: NavigationMetrics,
  resources: ResourceMetrics,
  webVitals: Partial<WebVitalsMetrics>
): PerformanceScores {
  // Navigation score (target: < 1000ms for full load)
  const navScore = Math.max(0, Math.min(100, 100 - (navigation.pageLoad / 50)))
  
  // Resource score (based on total bytes and slow resources)
  const bytesScore = Math.max(0, 100 - (resources.totalBytes / 50000)) // Penalize > 5MB
  const slowScore = Math.max(0, 100 - (resources.slowestResources[0]?.duration || 0) / 20)
  const resourceScore = Math.round((bytesScore + slowScore) / 2)
  
  // Web Vitals score
  let vitalsScore = 100
  if (webVitals.fcp) {
    // Good FCP: < 1800ms
    vitalsScore -= Math.max(0, (webVitals.fcp - 1800) / 50)
  }
  if (webVitals.lcp) {
    // Good LCP: < 2500ms
    vitalsScore -= Math.max(0, (webVitals.lcp - 2500) / 50)
  }
  if (webVitals.ttfb) {
    // Good TTFB: < 800ms
    vitalsScore -= Math.max(0, (webVitals.ttfb - 800) / 20)
  }
  vitalsScore = Math.max(0, Math.round(vitalsScore))
  
  // Overall score (weighted average)
  const overall = Math.round(
    (navScore * 0.3) + (resourceScore * 0.3) + (vitalsScore * 0.4)
  )
  
  return {
    overall: Math.max(0, Math.min(100, overall)),
    navigation: Math.max(0, Math.min(100, Math.round(navScore))),
    resources: Math.max(0, Math.min(100, resourceScore)),
    webVitals: vitalsScore,
  }
}

// =============================================================================
// MAIN BENCHMARK FUNCTION
// =============================================================================

/**
 * Run a complete performance benchmark
 */
export function runBenchmark(name: string = 'Page Load'): BenchmarkResult {
  const navigation = getNavigationMetrics()
  const resources = getResourceMetrics()
  const webVitals = getWebVitalsFromEntries()
  const memory = getMemoryMetrics()
  const scores = calculateScores(navigation, resources, webVitals)
  
  return {
    name,
    navigation,
    resources,
    webVitals,
    memory,
    scores,
    timestamp: Date.now(),
  }
}

/**
 * Format benchmark results for console output
 */
export function formatBenchmarkResults(result: BenchmarkResult): string {
  const lines: string[] = [
    '',
    `📊 Performance Benchmark: ${result.name}`,
    '═'.repeat(50),
    '',
    '🚀 Navigation Timing:',
    `   DNS Lookup:        ${result.navigation.dnsLookup}ms`,
    `   TCP Connection:    ${result.navigation.tcpConnection}ms`,
    `   Time to First Byte: ${result.navigation.ttfb}ms`,
    `   DOM Interactive:   ${result.navigation.domInteractive}ms`,
    `   DOM Content Loaded: ${result.navigation.domContentLoaded}ms`,
    `   Full Page Load:    ${result.navigation.pageLoad}ms`,
    '',
    '📦 Resources:',
    `   Total Resources:   ${result.resources.totalResources}`,
    `   Total Size:        ${formatBytes(result.resources.totalBytes)}`,
    '',
    '   By Type:',
  ]
  
  for (const [type, data] of Object.entries(result.resources.byType)) {
    lines.push(`     ${type.padEnd(8)} ${data.count} files, ${formatBytes(data.bytes)}, avg ${data.avgDuration}ms`)
  }
  
  lines.push('')
  lines.push('   Slowest Resources:')
  for (const res of result.resources.slowestResources.slice(0, 5)) {
    lines.push(`     ${res.name.padEnd(30).slice(0, 30)} ${res.duration}ms (${formatBytes(res.size)})`)
  }
  
  lines.push('')
  lines.push('🎯 Core Web Vitals:')
  if (result.webVitals.fcp) {lines.push(`   FCP:  ${result.webVitals.fcp}ms ${getRating(result.webVitals.fcp, 1800, 3000)}`)}
  if (result.webVitals.lcp) {lines.push(`   LCP:  ${result.webVitals.lcp}ms ${getRating(result.webVitals.lcp, 2500, 4000)}`)}
  if (result.webVitals.ttfb) {lines.push(`   TTFB: ${result.webVitals.ttfb}ms ${getRating(result.webVitals.ttfb, 800, 1800)}`)}
  if (result.webVitals.cls !== undefined) {lines.push(`   CLS:  ${result.webVitals.cls} ${getRating(result.webVitals.cls, 0.1, 0.25)}`)}
  
  if (result.memory) {
    lines.push('')
    lines.push('🧠 Memory:')
    lines.push(`   Used Heap:     ${result.memory.usedJSHeapSize} MB`)
    lines.push(`   Total Heap:    ${result.memory.totalJSHeapSize} MB`)
    lines.push(`   Heap Limit:    ${result.memory.jsHeapSizeLimit} MB`)
    lines.push(`   Utilization:   ${result.memory.heapUtilization}%`)
  }
  
  lines.push('')
  lines.push('📈 Scores:')
  lines.push(`   Navigation:  ${result.scores.navigation}/100 ${getScoreEmoji(result.scores.navigation)}`)
  lines.push(`   Resources:   ${result.scores.resources}/100 ${getScoreEmoji(result.scores.resources)}`)
  lines.push(`   Web Vitals:  ${result.scores.webVitals}/100 ${getScoreEmoji(result.scores.webVitals)}`)
  lines.push(`   ─────────────────────`)
  lines.push(`   Overall:     ${result.scores.overall}/100 ${getScoreEmoji(result.scores.overall)}`)
  lines.push('')
  
  return lines.join('\n')
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) {return `${bytes} B`}
  if (bytes < 1024 * 1024) {return `${(bytes / 1024).toFixed(1)} KB`}
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * Get rating emoji based on thresholds
 */
function getRating(value: number, good: number, poor: number): string {
  if (value <= good) {return '✅ Good'}
  if (value <= poor) {return '⚠️ Needs Improvement'}
  return '❌ Poor'
}

/**
 * Get score emoji
 */
function getScoreEmoji(score: number): string {
  if (score >= 90) {return '🟢'}
  if (score >= 50) {return '🟡'}
  return '🔴'
}

// =============================================================================
// BENCHMARK HOOK FOR REACT
// =============================================================================

/**
 * Run benchmark after page load and log results
 */
export function runBenchmarkOnLoad(): void {
  if (typeof window === 'undefined') {return}
  
  // Wait for page to fully load
  if (document.readyState === 'complete') {
    // Wait a bit more for all async resources
    setTimeout(() => {
      const result = runBenchmark()
      console.warn(formatBenchmarkResults(result))
      
      // Store in window for debugging
      ;(window as Window & { __perfBenchmark?: BenchmarkResult }).__perfBenchmark = result
    }, 1000)
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const result = runBenchmark()
        console.warn(formatBenchmarkResults(result))
        ;(window as Window & { __perfBenchmark?: BenchmarkResult }).__perfBenchmark = result
      }, 1000)
    })
  }
}

/**
 * Export benchmark result to JSON
 */
export function exportBenchmarkJSON(result: BenchmarkResult): string {
  return JSON.stringify(result, null, 2)
}

/**
 * Compare two benchmark results
 */
export function compareBenchmarks(
  before: BenchmarkResult,
  after: BenchmarkResult
): { metric: string; before: number | string; after: number | string; change: string }[] {
  return [
    {
      metric: 'Page Load',
      before: `${before.navigation.pageLoad  }ms`,
      after: `${after.navigation.pageLoad  }ms`,
      change: formatChange(before.navigation.pageLoad, after.navigation.pageLoad),
    },
    {
      metric: 'TTFB',
      before: `${before.navigation.ttfb  }ms`,
      after: `${after.navigation.ttfb  }ms`,
      change: formatChange(before.navigation.ttfb, after.navigation.ttfb),
    },
    {
      metric: 'Total Bytes',
      before: formatBytes(before.resources.totalBytes),
      after: formatBytes(after.resources.totalBytes),
      change: formatChange(before.resources.totalBytes, after.resources.totalBytes),
    },
    {
      metric: 'FCP',
      before: `${before.webVitals.fcp || 0  }ms`,
      after: `${after.webVitals.fcp || 0  }ms`,
      change: formatChange(before.webVitals.fcp || 0, after.webVitals.fcp || 0),
    },
    {
      metric: 'Overall Score',
      before: before.scores.overall,
      after: after.scores.overall,
      change: formatChange(after.scores.overall, before.scores.overall, true), // Higher is better
    },
  ]
}

function formatChange(before: number, after: number, higherIsBetter = false): string {
  const diff = after - before
  const pct = before === 0 ? 0 : Math.round((diff / before) * 100)
  
  if (diff === 0) {return '→ No change'}
  
  const improved = higherIsBetter ? diff > 0 : diff < 0
  const arrow = improved ? '↓' : '↑'
  const emoji = improved ? '✅' : '⚠️'
  
  return `${emoji} ${arrow} ${Math.abs(pct)}%`
}
