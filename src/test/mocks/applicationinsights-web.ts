/**
 * Mock for @microsoft/applicationinsights-web
 * 
 * This mock is used in tests to avoid loading the real SDK
 */

const mockContext = {
  application: { ver: '1.0.0' },
  session: { id: 'mock-session-id' },
  user: { id: 'mock-user-id' },
  operation: { id: 'mock-operation-id', name: 'MockOperation' },
}

const mockAppInsights = {
  loadAppInsights: () => {},
  trackPageView: () => {},
  trackEvent: () => {},
  trackException: () => {},
  trackMetric: () => {},
  trackTrace: () => {},
  setAuthenticatedUserContext: () => {},
  clearAuthenticatedUserContext: () => {},
  flush: () => {},
  context: mockContext,
  config: {},
}

export class ApplicationInsights {
  config: Record<string, unknown>
  context = mockContext

  constructor(options: { config: Record<string, unknown> }) {
    this.config = options.config
  }

  loadAppInsights() {
    return mockAppInsights
  }

  trackPageView = mockAppInsights.trackPageView
  trackEvent = mockAppInsights.trackEvent
  trackException = mockAppInsights.trackException
  trackMetric = mockAppInsights.trackMetric
  trackTrace = mockAppInsights.trackTrace
  setAuthenticatedUserContext = mockAppInsights.setAuthenticatedUserContext
  clearAuthenticatedUserContext = mockAppInsights.clearAuthenticatedUserContext
  flush = mockAppInsights.flush
}

export default { ApplicationInsights }
