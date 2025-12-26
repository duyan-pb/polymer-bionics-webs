/**
 * Contact Page Component
 * 
 * Contact form and company information page.
 * Composes ContactForm and ContactInfo components.
 * 
 * @module components/ContactPage
 */

import { motion } from 'framer-motion'
import { PageHero } from '@/components/PageHero'
import { ContactForm } from '@/components/contact/ContactForm'
import { ContactInfo } from '@/components/contact/ContactInfo'

/**
 * Props for the ContactPage component.
 */
interface ContactPageProps {
  /** Navigation handler */
  onNavigate: (page: string) => void
}

/**
 * Contact page component with form and info.
 * 
 * Features:
 * - Contact form with validation
 * - Company address and email
 * - Social media links
 * - Animated entry transitions
 * 
 * @example
 * ```tsx
 * <ContactPage onNavigate={handleNavigate} />
 * ```
 */
export function ContactPage({ onNavigate }: ContactPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="Get In Touch"
        description="Have a question about our advanced polymers or want to discuss a custom application? We'd love to hear from you."
        breadcrumbs={[
          { label: 'Home', page: 'home' },
          { label: 'Contact' }
        ]}
        onNavigate={onNavigate}
      />

      <section className="py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ContactForm />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ContactInfo />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
