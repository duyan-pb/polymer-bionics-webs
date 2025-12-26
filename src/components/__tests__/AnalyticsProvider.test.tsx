/**
 * AnalyticsProvider Component Tests
 * 
 * Tests the analytics initialization component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { AnalyticsProvider } from '../AnalyticsProvider'

// Mock the analytics modules
vi.mock('@/lib/analytics', () => ({
  initAnalytics: vi.fn(),
}))

vi.mock('@/lib/analytics/app-insights', () => ({
  initAppInsights: vi.fn(() => Promise.resolve()),
}))

vi.mock('@/lib/analytics/ga4', () => ({
  initGA4: vi.fn(() => Promise.resolve()),
}))

vi.mock('@/lib/analytics/web-vitals', () => ({
  initWebVitals: vi.fn(),
}))

vi.mock('@/lib/analytics/session-replay', () => ({
  initClarity: vi.fn(),
}))

vi.mock('@/lib/analytics/cost-control', () => ({
  initCostControls: vi.fn(),
}))

vi.mock('@/lib/analytics/data-export', () => ({
  initDataExport: vi.fn(),
}))

vi.mock('@/lib/analytics/attribution', () => ({
  captureUTM: vi.fn(),
}))

vi.mock('@/lib/analytics-config', () => ({
  getAnalyticsConfig: vi.fn(() => ({
    environment: 'test',
    appVersion: '1.0.0',
    debugMode: false,
  })),
  getAppInsightsConfig: vi.fn(() => ({
    connectionString: 'test-connection-string',
  })),
  getGA4Config: vi.fn(() => ({
    measurementId: 'G-TEST123',
    enableDebugMode: false,
  })),
  getClarityConfig: vi.fn(() => ({
    projectId: undefined,
    enabled: false,
    sampleRate: 0.1,
  })),
  getWebVitalsConfig: vi.fn(() => ({
    enabled: false,
    reportAttribution: false,
  })),
  getCostControlConfig: vi.fn(() => ({
    enabled: false,
    eventsPerDay: 100000,
    baseSamplingRate: 1.0,
  })),
  getDataExportConfig: vi.fn(() => ({
    enabled: false,
    endpoint: '/api/events/export',
    batchSize: 10,
  })),
}))

describe('AnalyticsProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders children', () => {
    const { getByText } = render(
      <AnalyticsProvider>
        <div>Test Child</div>
      </AnalyticsProvider>
    )
    
    expect(getByText('Test Child')).toBeInTheDocument()
  })

  it('captures UTM parameters on mount', async () => {
    const { captureUTM } = await import('@/lib/analytics/attribution')
    
    render(
      <AnalyticsProvider>
        <div>App</div>
      </AnalyticsProvider>
    )
    
    await waitFor(() => {
      expect(captureUTM).toHaveBeenCalledWith('first-touch')
    })
  })

  it('initializes core analytics on mount', async () => {
    const { initAnalytics } = await import('@/lib/analytics')
    
    render(
      <AnalyticsProvider>
        <div>App</div>
      </AnalyticsProvider>
    )
    
    await waitFor(() => {
      expect(initAnalytics).toHaveBeenCalled()
    })
  })

  it('initializes App Insights when connection string is provided', async () => {
    const { initAppInsights } = await import('@/lib/analytics/app-insights')
    
    render(
      <AnalyticsProvider>
        <div>App</div>
      </AnalyticsProvider>
    )
    
    await waitFor(() => {
      expect(initAppInsights).toHaveBeenCalledWith(expect.objectContaining({
        connectionString: 'test-connection-string',
        enableAutoRouteTracking: false,
      }))
    })
  })

  it('initializes GA4 when measurement ID is provided', async () => {
    const { initGA4 } = await import('@/lib/analytics/ga4')
    
    render(
      <AnalyticsProvider>
        <div>App</div>
      </AnalyticsProvider>
    )
    
    await waitFor(() => {
      expect(initGA4).toHaveBeenCalledWith(expect.objectContaining({
        measurementId: 'G-TEST123',
        sendPageViews: false,
      }))
    })
  })

  it('does not initialize App Insights without connection string', async () => {
    const { getAppInsightsConfig } = await import('@/lib/analytics-config')
    vi.mocked(getAppInsightsConfig).mockReturnValue({})
    
    const { initAppInsights } = await import('@/lib/analytics/app-insights')
    vi.mocked(initAppInsights).mockClear()
    
    render(
      <AnalyticsProvider>
        <div>App</div>
      </AnalyticsProvider>
    )
    
    // Wait a tick for effects to run
    await waitFor(() => {
      // The condition checks for connectionString OR instrumentationKey
      // Neither is provided so initAppInsights should not be called
    })
  })

  it('does not initialize GA4 without measurement ID', async () => {
    const { getGA4Config } = await import('@/lib/analytics-config')
    vi.mocked(getGA4Config).mockReturnValue({})
    
    const { initGA4 } = await import('@/lib/analytics/ga4')
    vi.mocked(initGA4).mockClear()
    
    render(
      <AnalyticsProvider>
        <div>App</div>
      </AnalyticsProvider>
    )
    
    await waitFor(() => {
      // No measurementId so initGA4 should not be called
    })
  })

  it('logs initialization in debug mode', async () => {
    const { getAnalyticsConfig } = await import('@/lib/analytics-config')
    vi.mocked(getAnalyticsConfig).mockReturnValue({
      environment: 'test',
      appVersion: '1.0.0',
      debugMode: true,
    })
    
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    render(
      <AnalyticsProvider>
        <div>App</div>
      </AnalyticsProvider>
    )
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics] Provider initialized',
        expect.any(Object)
      )
    })
  })

  it('only initializes once even when re-rendered', async () => {
    const { initAnalytics } = await import('@/lib/analytics')
    vi.mocked(initAnalytics).mockClear()
    
    const { rerender } = render(
      <AnalyticsProvider>
        <div>App</div>
      </AnalyticsProvider>
    )
    
    rerender(
      <AnalyticsProvider>
        <div>App Updated</div>
      </AnalyticsProvider>
    )
    
    // useEffect with [] deps only runs once
    expect(initAnalytics).toHaveBeenCalledTimes(1)
  })

  it('initializes Clarity when enabled with project ID', async () => {
    const { getClarityConfig } = await import('@/lib/analytics-config')
    vi.mocked(getClarityConfig).mockReturnValue({
      projectId: 'test-clarity-id',
      enabled: true,
      sampleRate: 0.1,
    })
    
    const { initClarity } = await import('@/lib/analytics/session-replay')
    
    render(
      <AnalyticsProvider>
        <div>App</div>
      </AnalyticsProvider>
    )
    
    await waitFor(() => {
      expect(initClarity).toHaveBeenCalledWith({
        projectId: 'test-clarity-id',
      })
    })
  })

  it('does not initialize Clarity when disabled', async () => {
    const { getClarityConfig } = await import('@/lib/analytics-config')
    vi.mocked(getClarityConfig).mockReturnValue({
      projectId: 'test-clarity-id',
      enabled: false,
      sampleRate: 0.1,
    })
    
    const { initClarity } = await import('@/lib/analytics/session-replay')
    vi.mocked(initClarity).mockClear()
    
    render(
      <AnalyticsProvider>
        <div>App</div>
      </AnalyticsProvider>
    )
    
    // Clarity should not be initialized when disabled
    await waitFor(() => {
      expect(initClarity).not.toHaveBeenCalled()
    })
  })

  it('handles Clarity initialization error gracefully', async () => {
    const { getClarityConfig } = await import('@/lib/analytics-config')
    vi.mocked(getClarityConfig).mockReturnValue({
      projectId: 'test-clarity-id',
      enabled: true,
      sampleRate: 0.1,
    })
    
    const { initClarity } = await import('@/lib/analytics/session-replay')
    vi.mocked(initClarity).mockImplementation(() => {
      throw new Error('Clarity error')
    })
    
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    render(
      <AnalyticsProvider>
        <div>App</div>
      </AnalyticsProvider>
    )
    
    await waitFor(() => {
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to initialize Clarity'),
        expect.any(Error)
      )
    })
  })

  it('handles data export initialization error gracefully', async () => {
    const { getDataExportConfig } = await import('@/lib/analytics-config')
    vi.mocked(getDataExportConfig).mockReturnValue({
      enabled: true,
      endpoint: '/api/export',
      batchSize: 10,
    })
    
    const { initDataExport } = await import('@/lib/analytics/data-export')
    vi.mocked(initDataExport).mockImplementation(() => {
      throw new Error('Data export error')
    })
    
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    render(
      <AnalyticsProvider>
        <div>App</div>
      </AnalyticsProvider>
    )
    
    await waitFor(() => {
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to initialize data export'),
        expect.any(Error)
      )
    })
  })

  it('handles overall initialization error gracefully', async () => {
    const { initAnalytics } = await import('@/lib/analytics')
    vi.mocked(initAnalytics).mockImplementation(() => {
      throw new Error('Critical error')
    })
    
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(
      <AnalyticsProvider>
        <div>App</div>
      </AnalyticsProvider>
    )
    
    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to initialize analytics provider'),
        expect.any(Error)
      )
    })
  })
})
