/**
 * Cookie Consent Banner Component (Epic 1)
 * 
 * GDPR-compliant cookie consent banner with:
 * - Three-tier consent (necessary, analytics, marketing)
 * - Accept all / Reject all / Manage options
 * - Preferences modal for granular control
 * - Accessible design following WCAG guidelines
 */

import { useState, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, Gear, CheckCircle, XCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useConsent } from '@/lib/analytics/hooks'
import type { ConsentCategory } from '@/lib/analytics/types'

// =============================================================================
// CONSENT CATEGORIES CONFIG
// =============================================================================

interface ConsentCategoryInfo {
  id: ConsentCategory
  name: string
  description: string
  required: boolean
}

const CONSENT_CATEGORIES: ConsentCategoryInfo[] = [
  {
    id: 'necessary',
    name: 'Necessary Cookies',
    description: 'Essential for the website to function properly. These cookies ensure basic functionalities and security features of the website.',
    required: true,
  },
  {
    id: 'analytics',
    name: 'Analytics Cookies',
    description: 'Help us understand how visitors interact with our website. This data helps us improve the user experience.',
    required: false,
  },
  {
    id: 'marketing',
    name: 'Marketing Cookies',
    description: 'Used to track visitors across websites to display relevant advertisements.',
    required: false,
  },
]

// =============================================================================
// BANNER COMPONENT
// =============================================================================

export const ConsentBanner = memo(() => {
  const {
    shouldShowBanner,
    acceptAll,
    acceptNecessary,
    openPreferences,
    closePreferences,
    isPreferencesOpen,
    consent,
    updateCategories,
  } = useConsent()
  
  const [localChoices, setLocalChoices] = useState<Record<ConsentCategory, boolean>>({
    necessary: true,
    analytics: consent.choices.analytics,
    marketing: consent.choices.marketing,
  })
  
  const handleToggle = useCallback((category: ConsentCategory, checked: boolean) => {
    if (category === 'necessary') {return} // Can't disable necessary
    setLocalChoices(prev => ({ ...prev, [category]: checked }))
  }, [])
  
  const handleSavePreferences = useCallback(() => {
    updateCategories(localChoices)
    closePreferences()
  }, [localChoices, updateCategories, closePreferences])
  
  // Don't render if user has already made a choice
  if (!shouldShowBanner && !isPreferencesOpen) {
    return null
  }
  
  return (
    <>
      {/* Main Banner */}
      <AnimatePresence>
        {shouldShowBanner && !isPreferencesOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
          >
            <div className="mx-auto max-w-4xl">
              <div className="bg-card border border-border rounded-xl shadow-2xl p-6 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Cookie weight="duotone" className="h-6 w-6 text-primary" />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Cookie Preferences
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        We use cookies to enhance your browsing experience, analyze site traffic, 
                        and personalize content. By clicking "Accept All", you consent to our use of cookies.{' '}
                        <button 
                          onClick={openPreferences}
                          className="text-primary underline hover:no-underline"
                        >
                          Manage preferences
                        </button>
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={acceptAll}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <CheckCircle weight="bold" className="mr-2 h-4 w-4" />
                        Accept All
                      </Button>
                      <Button
                        onClick={acceptNecessary}
                        variant="outline"
                      >
                        <XCircle weight="bold" className="mr-2 h-4 w-4" />
                        Necessary Only
                      </Button>
                      <Button
                        onClick={openPreferences}
                        variant="ghost"
                        className="sm:ml-auto"
                      >
                        <Gear weight="bold" className="mr-2 h-4 w-4" />
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Preferences Modal */}
      <Dialog open={isPreferencesOpen} onOpenChange={(open) => !open && closePreferences()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie weight="duotone" className="h-5 w-5 text-primary" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              Customize your cookie settings. You can change these preferences at any time.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {CONSENT_CATEGORIES.map((category) => (
              <div
                key={category.id}
                className="flex items-start justify-between gap-4 rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <Label htmlFor={`consent-${category.id}`} className="font-medium">
                    {category.name}
                    {category.required && (
                      <span className="ml-2 text-xs text-muted-foreground">(Required)</span>
                    )}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
                <Switch
                  id={`consent-${category.id}`}
                  checked={localChoices[category.id]}
                  onCheckedChange={(checked) => handleToggle(category.id, checked)}
                  disabled={category.required}
                  aria-describedby={`consent-${category.id}-description`}
                />
              </div>
            ))}
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t">
            <Button
              onClick={closePreferences}
              variant="outline"
              className="sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setLocalChoices({ necessary: true, analytics: true, marketing: true })
              }}
              variant="outline"
              className="sm:w-auto"
            >
              Accept All
            </Button>
            <Button
              onClick={handleSavePreferences}
              className="sm:w-auto sm:ml-auto"
            >
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
})

// =============================================================================
// MANAGE COOKIES LINK
// =============================================================================

/**
 * Link component to open cookie preferences modal
 * Use this in the footer or privacy policy page
 */
export const ManageCookiesLink = memo(({ 
  className = '',
  children = 'Manage Cookies' 
}: { 
  className?: string
  children?: React.ReactNode 
}) => {
  const { openPreferences } = useConsent()
  
  return (
    <button
      onClick={openPreferences}
      className={`text-sm text-muted-foreground hover:text-foreground underline ${className}`}
    >
      {children}
    </button>
  )
})

// =============================================================================
// CONSENT STATUS INDICATOR
// =============================================================================

/**
 * Small indicator showing current consent status
 * Can be used in footer or settings area
 */
export const ConsentStatusIndicator = memo(() => {
  const { consent, openPreferences } = useConsent()
  
  const getStatusText = () => {
    if (!consent.hasInteracted) {return 'Not set'}
    const granted = [
      consent.choices.analytics && 'Analytics',
      consent.choices.marketing && 'Marketing',
    ].filter(Boolean)
    
    if (granted.length === 0) {return 'Essential only'}
    return granted.join(' & ')
  }
  
  return (
    <button
      onClick={openPreferences}
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
    >
      <Cookie weight="duotone" className="h-3.5 w-3.5" />
      <span>{getStatusText()}</span>
    </button>
  )
})
