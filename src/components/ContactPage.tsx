/**
 * Contact Page Component
 * 
 * Contact form and company information page.
 * Composes ContactForm and ContactInfo components.
 * 
 * @module components/ContactPage
 */

import { PageLayout } from '@/components/layout/PageLayout'
import { ContactForm } from '@/components/contact/ContactForm'
import { ContactInfo } from '@/components/contact/ContactInfo'
import BackgroundCover from '@/assets/images/Background_Cover.png'
import { AnimatedSplitSection } from '@/components/layout/AnimatedSplitSection'

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
  const hero = {
    title: 'Get In Touch',
    description: "Have a question about our advanced polymers or want to discuss a custom application? We'd love to hear from you.",
    backgroundImage: BackgroundCover,
    backgroundOpacity: 0.7,
    breadcrumbs: [
      { label: 'Home', page: 'home' },
      { label: 'Contact' },
    ],
    onNavigate,
  }

  return (
    <PageLayout hero={hero}>
      <AnimatedSplitSection left={<ContactForm />} right={<ContactInfo />} />
    </PageLayout>
  )
}
