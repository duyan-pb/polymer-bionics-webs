/**
 * Footer Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Footer } from '../Footer'

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock contact config
vi.mock('@/lib/contact-config', () => ({
  contactConfig: {
    whatsapp: { number: '+1234567890' },
    email: { general: 'info@test.com', sales: 'sales@test.com' },
    address: { street: '123 Test St', city: 'Test City', postcode: '12345', country: 'Test Country' },
  },
  getWhatsAppUrl: vi.fn(() => 'https://wa.me/1234567890?text=Hello'),
  getEmailUrl: vi.fn((type: string) => `mailto:${type}@test.com`),
}))

// Mock utils (openExternal)
vi.mock('@/lib/utils', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    openExternal: vi.fn(),
  }
})

// Mock ConsentBanner components
vi.mock('@/components/ConsentBanner', () => ({
  ManageCookiesLink: () => <button>Manage Cookies</button>,
  ConsentStatusIndicator: () => <span>Consent Status</span>,
}))

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders footer element', () => {
      render(<Footer />)
      
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('renders WhatsApp button', () => {
      render(<Footer />)
      
      expect(screen.getByRole('button', { name: /whatsapp/i })).toBeInTheDocument()
    })

    it('renders email buttons', () => {
      render(<Footer />)
      
      expect(screen.getByRole('link', { name: /general enquiry/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /quote request/i })).toBeInTheDocument()
    })

    it('renders company email', () => {
      render(<Footer />)
      
      expect(screen.getByText('info@test.com')).toBeInTheDocument()
    })

    it('renders address', () => {
      render(<Footer />)
      
      expect(screen.getByText(/123 Test St/)).toBeInTheDocument()
      expect(screen.getByText(/Test City/)).toBeInTheDocument()
    })

    it('renders copyright notice', () => {
      render(<Footer />)
      
      const currentYear = new Date().getFullYear()
      expect(screen.getByText(new RegExp(`Copyright © ${currentYear}`))).toBeInTheDocument()
    })

    it('renders cookie management link', () => {
      render(<Footer />)
      
      expect(screen.getByRole('button', { name: /manage cookies/i })).toBeInTheDocument()
    })

    it('renders consent status indicator', () => {
      render(<Footer />)
      
      expect(screen.getByText('Consent Status')).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('handles WhatsApp click', async () => {
      const { openExternal } = await import('@/lib/utils')
      
      render(<Footer />)
      
      await userEvent.click(screen.getByRole('button', { name: /whatsapp/i }))
      
      expect(openExternal).toHaveBeenCalledWith(
        expect.stringContaining('wa.me')
      )
    })

    it('handles email link clicks', async () => {
      const { openExternal } = await import('@/lib/utils')
      
      render(<Footer />)
      
      await userEvent.click(screen.getByRole('link', { name: /general enquiry/i }))
      
      expect(openExternal).toHaveBeenCalledWith(
        expect.stringContaining('mailto:')
      )
    })
  })
})
