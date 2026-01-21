/**
 * React Hooks for Monitoring
 * 
 * Custom hooks for integrating monitoring capabilities into React components.
 * 
 * @module lib/analytics/monitoring-hooks
 */

import { useEffect, useRef, useCallback } from 'react'
import { markPerformance, trackPerformanceMetric } from './performance-monitor'
import { reportCustomError, reportReactError } from './error-reporting'
import { track } from './tracker'

// =============================================================================
// COMPONENT RENDER TRACKING
// =============================================================================

/**
 * Track component render performance
 * 
 * @param componentName - Name of the component to track
 * @param options - Configuration options
 * 
 * @example
 * ```tsx
 * function ProductsPage() {
 *   useRenderTracking('ProductsPage')
 *   return <div>...</div>
 * }
 * ```
 */
export function useRenderTracking(
  componentName: string,
  options: {
    /** Track every render (default: only first render) */
    trackAllRenders?: boolean
    /** Threshold in ms to report slow renders */
    slowRenderThreshold?: number
  } = {}
): void {
  const { trackAllRenders = false, slowRenderThreshold = 16 } = options
  const renderCount = useRef(0)
  const renderStart = useRef<number>(0)
  
  // Mark render start
  renderStart.current = performance.now()
  
  useEffect(() => {
    const renderTime = performance.now() - renderStart.current
    renderCount.current++
    
    // Only track first render or all renders if enabled
    if (renderCount.current === 1 || trackAllRenders) {
      // Report slow renders
      if (renderTime > slowRenderThreshold) {
        trackPerformanceMetric(`component_render_${componentName}`, renderTime, {
          renderCount: renderCount.current,
          isSlowRender: true,
        })
      } else if (renderCount.current === 1) {
        // Always track first render
        trackPerformanceMetric(`component_mount_${componentName}`, renderTime, {
          renderCount: 1,
        })
      }
    }
  })
}

// =============================================================================
// API CALL TRACKING
// =============================================================================

interface ApiCallOptions {
  /** Custom name for the API call */
  name?: string
  /** Track successful responses */
  trackSuccess?: boolean
  /** Track errors */
  trackErrors?: boolean
}

/**
 * Create a tracked fetch wrapper that reports performance and errors
 * 
 * @param baseUrl - Base URL for API calls
 * @param options - Configuration options
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const trackedFetch = useTrackedFetch('/api')
 *   
 *   const loadData = async () => {
 *     const response = await trackedFetch('/users')
 *     return response.json()
 *   }
 * }
 * ```
 */
export function useTrackedFetch(
  baseUrl: string = '',
  options: ApiCallOptions = {}
): (url: string, init?: RequestInit) => Promise<Response> {
  const { name = 'api_call', trackSuccess = true, trackErrors = true } = options
  
  const trackedFetch = useCallback(async (url: string, init?: RequestInit): Promise<Response> => {
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
    const startTime = performance.now()
    const markName = `${name}_${Date.now()}`
    
    markPerformance(markName)
    
    try {
      const response = await fetch(fullUrl, init)
      const duration = performance.now() - startTime
      
      if (trackSuccess || !response.ok) {
        track('api_call', {
          api_url: new URL(fullUrl).pathname,
          api_method: init?.method ?? 'GET',
          api_status: response.status,
          api_duration: Math.round(duration),
          api_success: response.ok,
        }, { category: 'analytics' })
      }
      
      if (!response.ok && trackErrors) {
        reportCustomError(
          new Error(`API Error: ${response.status} ${response.statusText}`),
          { url: fullUrl, status: response.status }
        )
      }
      
      return response
    } catch (error) {
      const duration = performance.now() - startTime
      
      if (trackErrors) {
        const err = error instanceof Error ? error : new Error(String(error))
        
        track('api_call', {
          api_url: new URL(fullUrl).pathname,
          api_method: init?.method ?? 'GET',
          api_status: 0,
          api_duration: Math.round(duration),
          api_success: false,
          api_error: err.message,
        }, { category: 'analytics' })
        
        reportCustomError(err, { url: fullUrl, type: 'network' })
      }
      
      throw error
    }
  }, [baseUrl, name, trackSuccess, trackErrors])
  
  return trackedFetch
}

// =============================================================================
// USER INTERACTION TRACKING
// =============================================================================

/**
 * Track user interactions with debouncing
 * 
 * @param eventName - Name of the event to track
 * @param debounceMs - Debounce interval in milliseconds
 * 
 * @example
 * ```tsx
 * function SearchInput() {
 *   const trackSearch = useInteractionTracking('search_input', 500)
 *   
 *   return (
 *     <input 
 *       onChange={(e) => {
 *         trackSearch({ query_length: e.target.value.length })
 *       }}
 *     />
 *   )
 * }
 * ```
 */
export function useInteractionTracking(
  eventName: string,
  debounceMs: number = 300
): (properties?: Record<string, unknown>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastPropsRef = useRef<Record<string, unknown>>({})
  
  const trackInteraction = useCallback((properties: Record<string, unknown> = {}) => {
    // Store latest properties
    lastPropsRef.current = { ...lastPropsRef.current, ...properties }
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    // Set new debounced timeout
    timeoutRef.current = setTimeout(() => {
      track(eventName, lastPropsRef.current, { category: 'analytics' })
      lastPropsRef.current = {}
    }, debounceMs)
  }, [eventName, debounceMs])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  
  return trackInteraction
}

// =============================================================================
// VISIBILITY TRACKING
// =============================================================================

/**
 * Track when a component becomes visible in the viewport
 * 
 * @param options - IntersectionObserver options
 * 
 * @example
 * ```tsx
 * function ProductCard({ product }) {
 *   const { ref, isVisible } = useVisibilityTracking({
 *     onVisible: () => console.log('Product visible:', product.id)
 *   })
 *   
 *   return <div ref={ref}>...</div>
 * }
 * ```
 */
export function useVisibilityTracking<T extends HTMLElement>(options: {
  /** Callback when element becomes visible */
  onVisible?: () => void
  /** Callback when element is no longer visible */
  onHidden?: () => void
  /** Track event when visible */
  trackEvent?: string
  /** Properties to include in tracked event */
  eventProperties?: Record<string, unknown>
  /** Visibility threshold (0-1) */
  threshold?: number
  /** Only fire once */
  once?: boolean
} = {}): {
  ref: React.RefCallback<T>
  isVisible: boolean
} {
  const {
    onVisible,
    onHidden,
    trackEvent,
    eventProperties,
    threshold = 0.5,
    once = false,
  } = options
  
  const isVisibleRef = useRef(false)
  const hasTriggeredRef = useRef(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const elementRef = useRef<T | null>(null)
  
  const ref = useCallback((node: T | null) => {
    // Cleanup old observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }
    
    if (!node) {
      elementRef.current = null
      return
    }
    
    elementRef.current = node
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        
        const wasVisible = isVisibleRef.current
        isVisibleRef.current = entry.isIntersecting
        
        if (entry.isIntersecting && !wasVisible) {
          if (once && hasTriggeredRef.current) return
          hasTriggeredRef.current = true
          
          onVisible?.()
          
          if (trackEvent) {
            track(trackEvent, {
              visibility_percent: Math.round(entry.intersectionRatio * 100),
              ...eventProperties,
            }, { category: 'analytics' })
          }
        } else if (!entry.isIntersecting && wasVisible) {
          onHidden?.()
        }
      },
      { threshold }
    )
    
    observerRef.current.observe(node)
  }, [onVisible, onHidden, trackEvent, eventProperties, threshold, once])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect()
    }
  }, [])
  
  return {
    ref,
    isVisible: isVisibleRef.current,
  }
}

// =============================================================================
// ERROR BOUNDARY HOOK
// =============================================================================

/**
 * Hook for error boundary integration
 * 
 * @param componentName - Name of the component for error reporting
 * 
 * @example
 * ```tsx
 * class MyErrorBoundary extends React.Component {
 *   static getDerivedStateFromError() {
 *     return { hasError: true }
 *   }
 *   
 *   componentDidCatch(error, info) {
 *     reportReactError(error, info.componentStack)
 *   }
 * }
 * ```
 */
export function useErrorHandler(componentName: string): {
  handleError: (error: Error, componentStack?: string) => void
} {
  const handleError = useCallback((error: Error, componentStack?: string) => {
    reportReactError(error, componentStack ?? '', {
      component: componentName,
    })
  }, [componentName])
  
  return { handleError }
}

// =============================================================================
// PAGE LOAD TRACKING
// =============================================================================

/**
 * Track page load performance
 * 
 * @param pageName - Name of the page
 * 
 * @example
 * ```tsx
 * function ProductsPage() {
 *   usePageLoadTracking('ProductsPage')
 *   return <div>...</div>
 * }
 * ```
 */
export function usePageLoadTracking(pageName: string): void {
  const hasTracked = useRef(false)
  
  useEffect(() => {
    if (hasTracked.current) return
    hasTracked.current = true
    
    // Wait for page to be fully loaded
    if (document.readyState === 'complete') {
      trackPageLoad()
    } else {
      window.addEventListener('load', trackPageLoad, { once: true })
    }
    
    function trackPageLoad() {
      const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (timing) {
        track('page_load', {
          page_name: pageName,
          load_time: Math.round(timing.loadEventEnd - timing.startTime),
          dom_content_loaded: Math.round(timing.domContentLoadedEventEnd - timing.startTime),
          first_paint: getFirstPaint(),
          transfer_size: timing.transferSize,
          navigation_type: timing.type,
        }, { category: 'analytics' })
      }
    }
    
    function getFirstPaint(): number | null {
      const paintEntries = performance.getEntriesByType('paint')
      const fpEntry = paintEntries.find(e => e.name === 'first-paint')
      return fpEntry ? Math.round(fpEntry.startTime) : null
    }
  }, [pageName])
}
