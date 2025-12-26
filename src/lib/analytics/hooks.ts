/**
 * React Hooks for Analytics
 * 
 * Provides React-friendly APIs for consent management and tracking.
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { ConsentState, ConsentCategory, AnalyticsConfig } from './types'
import {
  getConsentState,
  canTrack,
  acceptAllConsent,
  acceptNecessaryOnly,
  updateConsent,
  withdrawConsent,
} from './consent'
import { analytics, initAnalytics } from './tracker'

// =============================================================================
// useConsent Hook
// =============================================================================

interface UseConsentReturn {
  /** Current consent state */
  consent: ConsentState
  /** Whether user has interacted with consent banner */
  hasInteracted: boolean
  /** Whether consent banner should be shown */
  shouldShowBanner: boolean
  /** Check if tracking is allowed for a category */
  canTrack: (category: ConsentCategory) => boolean
  /** Accept all consent categories */
  acceptAll: () => void
  /** Accept only necessary cookies */
  acceptNecessary: () => void
  /** Update specific categories */
  updateCategories: (choices: Partial<Record<ConsentCategory, boolean>>) => void
  /** Withdraw all consent */
  withdraw: () => void
  /** Open consent preferences (for "manage cookies" link) */
  openPreferences: () => void
  /** Close consent preferences */
  closePreferences: () => void
  /** Whether preferences modal is open */
  isPreferencesOpen: boolean
}

/**
 * Hook for managing consent state in React components
 * 
 * @example
 * function ConsentBanner() {
 *   const { shouldShowBanner, acceptAll, acceptNecessary, openPreferences } = useConsent()
 *   
 *   if (!shouldShowBanner) return null
 *   
 *   return (
 *     <div>
 *       <p>We use cookies...</p>
 *       <button onClick={acceptAll}>Accept All</button>
 *       <button onClick={acceptNecessary}>Necessary Only</button>
 *       <button onClick={openPreferences}>Manage</button>
 *     </div>
 *   )
 * }
 */
export function useConsent(): UseConsentReturn {
  const [consent, setConsent] = useState<ConsentState>(() => getConsentState())
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
  
  // Listen for consent changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pb_consent' && e.newValue) {
        try {
          setConsent(JSON.parse(e.newValue))
        } catch {
          // Ignore parse errors
        }
      }
    }
    
    const handleConsentChange = (e: CustomEvent<ConsentState>) => {
      setConsent(e.detail)
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('consent-changed', handleConsentChange as EventListener)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('consent-changed', handleConsentChange as EventListener)
    }
  }, [])
  
  const handleAcceptAll = useCallback(() => {
    const newState = acceptAllConsent()
    setConsent(newState)
    setIsPreferencesOpen(false)
  }, [])
  
  const handleAcceptNecessary = useCallback(() => {
    const newState = acceptNecessaryOnly()
    setConsent(newState)
    setIsPreferencesOpen(false)
  }, [])
  
  const handleUpdateCategories = useCallback((choices: Partial<Record<ConsentCategory, boolean>>) => {
    const newState = updateConsent(choices)
    setConsent(newState)
  }, [])
  
  const handleWithdraw = useCallback(() => {
    const newState = withdrawConsent()
    setConsent(newState)
    setIsPreferencesOpen(false)
  }, [])
  
  const handleCanTrack = useCallback((category: ConsentCategory) => {
    return canTrack(category)
  }, [])
  
  const shouldShowBanner = useMemo(() => {
    return !consent.hasInteracted
  }, [consent.hasInteracted])
  
  return {
    consent,
    hasInteracted: consent.hasInteracted,
    shouldShowBanner,
    canTrack: handleCanTrack,
    acceptAll: handleAcceptAll,
    acceptNecessary: handleAcceptNecessary,
    updateCategories: handleUpdateCategories,
    withdraw: handleWithdraw,
    openPreferences: useCallback(() => setIsPreferencesOpen(true), []),
    closePreferences: useCallback(() => setIsPreferencesOpen(false), []),
    isPreferencesOpen,
  }
}

// =============================================================================
// useAnalytics Hook
// =============================================================================

interface UseAnalyticsReturn {
  /** Track a custom event */
  track: typeof analytics.track
  /** Track a page view */
  page: typeof analytics.page
  /** Track a conversion */
  conversion: typeof analytics.conversion
  /** Track an event only once */
  trackOnce: typeof analytics.trackOnce
  /** Check if analytics consent is granted */
  isEnabled: boolean
}

/**
 * Hook for tracking events in React components
 * 
 * @example
 * function ProductCard({ product }) {
 *   const { track } = useAnalytics()
 *   
 *   const handleClick = () => {
 *     track('product_clicked', { product_id: product.id, product_name: product.name })
 *   }
 *   
 *   return <div onClick={handleClick}>...</div>
 * }
 */
export function useAnalytics(): UseAnalyticsReturn {
  const [isEnabled, setIsEnabled] = useState(() => canTrack('analytics'))
  
  // Update enabled state when consent changes
  useEffect(() => {
    const handleConsentChange = () => {
      setIsEnabled(canTrack('analytics'))
    }
    
    window.addEventListener('consent-changed', handleConsentChange)
    return () => window.removeEventListener('consent-changed', handleConsentChange)
  }, [])
  
  return {
    track: analytics.track,
    page: analytics.page,
    conversion: analytics.conversion,
    trackOnce: analytics.trackOnce,
    isEnabled,
  }
}

// =============================================================================
// usePageTracking Hook
// =============================================================================

/**
 * Hook that automatically tracks page views when the page changes
 * 
 * @param pageName - Current page name
 * @param properties - Additional properties to track
 * 
 * @example
 * function ProductsPage() {
 *   usePageTracking('products', { category: 'medical-devices' })
 *   return <div>...</div>
 * }
 */
export function usePageTracking(
  pageName: string,
  _properties: Record<string, unknown> = {}
): void {
  useEffect(() => {
    analytics.page(pageName)
  }, [pageName]) // Only track when page name changes
}

// =============================================================================
// useAnalyticsInit Hook
// =============================================================================

/**
 * Hook to initialize analytics (call once at app root)
 * 
 * @param config - Analytics configuration
 * 
 * @example
 * function App() {
 *   useAnalyticsInit({
 *     appInsightsConnectionString: 'InstrumentationKey=...',
 *     ga4MeasurementId: 'G-...',
 *   })
 *   return <div>...</div>
 * }
 */
export function useAnalyticsInit(_config: Partial<AnalyticsConfig> = {}): void {
  useEffect(() => {
    initAnalytics()
  }, []) // Only run once on mount
}

// =============================================================================
// useTrackEvent Hook (stable callback)
// =============================================================================

/**
 * Hook that returns a stable callback for tracking an event
 * Useful for passing to child components without causing re-renders
 * 
 * @param eventName - Name of the event
 * @param baseProperties - Base properties to include
 * 
 * @example
 * function ParentComponent() {
 *   const trackClick = useTrackEvent('button_clicked', { section: 'hero' })
 *   return <ChildComponent onClick={trackClick} />
 * }
 */
export function useTrackEvent(
  eventName: string,
  _baseProperties: Record<string, unknown> = {}
): (additionalProps?: Record<string, unknown>) => void {
  return useCallback(
    (additionalProps: Record<string, unknown> = {}) => {
      analytics.track(eventName, additionalProps)
    },
    [eventName] // Only recreate if event name changes
  )
}

// =============================================================================
// useConversionTracking Hook
// =============================================================================

/**
 * Hook for tracking conversions with automatic deduplication
 * 
 * @param conversionType - Type of conversion
 * 
 * @example
 * function ContactForm() {
 *   const { trackConversion, hasConverted } = useConversionTracking('lead_submitted')
 *   
 *   const handleSubmit = (data) => {
 *     trackConversion({ lead_type: 'contact' })
 *   }
 *   
 *   return <form onSubmit={handleSubmit}>...</form>
 * }
 */
export function useConversionTracking(conversionType: string): {
  trackConversion: (properties?: Record<string, unknown>) => void
  hasConverted: boolean
} {
  const [hasConverted, setHasConverted] = useState(() => 
    analytics.hasFired(`conversion:${conversionType}`)
  )
  
  const trackConversion = useCallback(
    (properties: Record<string, unknown> = {}) => {
      const eventId = crypto.randomUUID()
      const success = analytics.conversion(conversionType, eventId, properties)
      if (success) {
        setHasConverted(true)
      }
    },
    [conversionType]
  )
  
  return { trackConversion, hasConverted }
}
