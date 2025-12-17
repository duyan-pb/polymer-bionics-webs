import { useState } from 'react'
import { EnvelopeSimple, WhatsappLogo, X, ChatCircleDots, MapPin } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { contactConfig, getWhatsAppUrl, getEmailUrl } from '@/lib/contact-config'

export function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false)

  const handleEmailClick = (type: 'general' | 'sales') => {
    window.location.href = getEmailUrl(type)
    setIsOpen(false)
  }

  const handleWhatsAppClick = () => {
    window.open(getWhatsAppUrl(), '_blank', 'noopener,noreferrer')
    setIsOpen(false)
  }

  const handleLocationClick = () => {
    const { street, city, postcode, country } = contactConfig.address
    const query = encodeURIComponent(`${street}, ${city} ${postcode}, ${country}`)
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2 bg-card border border-border rounded-lg shadow-lg p-3 min-w-[240px]"
          >
            <div className="text-sm font-semibold text-foreground mb-1 px-2">
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
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium">WhatsApp</span>
                <span className="text-xs text-muted-foreground">Chat with us</span>
              </div>
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
