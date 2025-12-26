/**
 * Floating Contact Button Component
 * 
 * Fixed-position floating action button (FAB) that expands to show
 * contact options. Provides quick access to WhatsApp, Email, and
 * location from any page.
 * 
 * @module components/FloatingContactButton
 */

import { useState } from 'react'
import { EnvelopeSimple, WhatsappLogo, X, ChatCircleDots, MapPin, Copy } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { contactConfig, copyWhatsAppNumber, getEmailUrl } from '@/lib/contact-config'

/**
 * Floating contact button with expandable menu.
 * 
 * Features:
 * - Fixed position in bottom-right corner
 * - Animated expansion/collapse
 * - WhatsApp (with clipboard copy)
 * - Email links (general and sales)
 * - Google Maps location link
 * - Responsive sizing for mobile/desktop
 * 
 * @example
 * ```tsx
 * // Add to App.tsx or layout component
 * <FloatingContactButton />
 * ```
 */
export function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false)

  const handleEmailClick = (type: 'general' | 'sales') => {
    window.open(getEmailUrl(type), '_blank', 'noopener,noreferrer')
    setIsOpen(false)
  }

  const handleWhatsAppClick = async () => {
    const success = await copyWhatsAppNumber()
    if (success) {
      toast.success('WhatsApp number copied!', {
        description: `${contactConfig.whatsapp.number} - Open WhatsApp and start a chat`,
      })
    } else {
      toast.error('Could not copy number', {
        description: `WhatsApp: ${contactConfig.whatsapp.number}`,
      })
    }
    setIsOpen(false)
  }

  const handleLocationClick = () => {
    const { street, city, postcode, country } = contactConfig.address
    const query = encodeURIComponent(`${street}, ${city} ${postcode}, ${country}`)
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50 flex flex-col items-end gap-2 md:gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2 bg-card border border-border rounded-lg shadow-lg p-2 md:p-3 min-w-[200px] md:min-w-[240px]"
          >
            <div className="text-xs md:text-sm font-semibold text-foreground mb-1 px-2">
              Contact Us
            </div>
            
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={() => handleEmailClick('general')}
            >
              <EnvelopeSimple className="flex-shrink-0" />
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium">General Enquiry</span>
                <span className="text-xs text-muted-foreground">{contactConfig.email.general}</span>
              </div>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={() => handleEmailClick('sales')}
            >
              <EnvelopeSimple className="flex-shrink-0" />
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium">Quote Request</span>
                <span className="text-xs text-muted-foreground">{contactConfig.email.sales}</span>
              </div>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={handleWhatsAppClick}
            >
              <WhatsappLogo className="flex-shrink-0" />
              <div className="flex flex-col items-start text-left flex-1">
                <span className="text-sm font-medium">WhatsApp</span>
                <span className="text-xs text-muted-foreground">{contactConfig.whatsapp.number}</span>
              </div>
              <Copy className="flex-shrink-0 text-muted-foreground" size={14} />
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-auto py-3"
              onClick={handleLocationClick}
            >
              <MapPin className="flex-shrink-0" />
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium">Visit Us</span>
                <span className="text-xs text-muted-foreground">{contactConfig.address.city}</span>
              </div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChatCircleDots />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </div>
  )
}
