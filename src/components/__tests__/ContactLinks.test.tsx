/**
 * ContactLinks Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactLinks } from '../ContactLinks'

// Mock contact config
vi.mock('@/lib/contact-config', () => ({
  contactConfig: {
    whatsapp: { number: '+1234567890' },
    email: { general: 'info@test.com', sales: 'sales@test.com' },
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

describe('ContactLinks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders both buttons by default', () => {
      render(<ContactLinks />)
      
      expect(screen.getByRole('button', { name: /whatsapp/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /email us/i })).toBeInTheDocument()
    })

    it('renders only WhatsApp when showEmail is false', () => {
      render(<ContactLinks showEmail={false} />)
      
      expect(screen.getByRole('button', { name: /whatsapp/i })).toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /email/i })).not.toBeInTheDocument()
    })

    it('renders only email when showWhatsApp is false', () => {
      render(<ContactLinks showWhatsApp={false} />)
      
      expect(screen.queryByRole('button', { name: /whatsapp/i })).not.toBeInTheDocument()
      expect(screen.getByRole('link', { name: /email us/i })).toBeInTheDocument()
    })

    it('renders sales email text when emailType is sales', () => {
      render(<ContactLinks emailType="sales" />)
      
      expect(screen.getByRole('link', { name: /enquiry/i })).toBeInTheDocument()
    })
  })

  describe('variants', () => {
    it('applies default variant', () => {
      render(<ContactLinks variant="default" />)
      
      expect(screen.getByRole('button', { name: /whatsapp/i })).toBeInTheDocument()
    })

    it('applies outline variant', () => {
      render(<ContactLinks variant="outline" />)
      
      expect(screen.getByRole('button', { name: /whatsapp/i })).toBeInTheDocument()
    })

    it('applies ghost variant', () => {
      render(<ContactLinks variant="ghost" />)
      
      expect(screen.getByRole('button', { name: /whatsapp/i })).toBeInTheDocument()
    })
  })

  describe('sizes', () => {
    it('applies default size', () => {
      render(<ContactLinks size="default" />)
      
      expect(screen.getByRole('button', { name: /whatsapp/i })).toBeInTheDocument()
    })

    it('applies small size', () => {
      render(<ContactLinks size="sm" />)
      
      expect(screen.getByRole('button', { name: /whatsapp/i })).toBeInTheDocument()
    })

    it('applies large size', () => {
      render(<ContactLinks size="lg" />)
      
      expect(screen.getByRole('button', { name: /whatsapp/i })).toBeInTheDocument()
    })
  })

  describe('custom className', () => {
    it('applies custom className', () => {
      const { container } = render(<ContactLinks className="custom-class" />)
      
      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('interactions', () => {
    it('opens WhatsApp URL on click', async () => {
      const { openExternal } = await import('@/lib/utils')
      
      render(<ContactLinks />)
      
      await userEvent.click(screen.getByRole('button', { name: /whatsapp/i }))
      
      expect(openExternal).toHaveBeenCalledWith(
        expect.stringContaining('wa.me')
      )
    })

    it('opens email link via openExternal', async () => {
      const { openExternal } = await import('@/lib/utils')
      
      render(<ContactLinks />)
      
      await userEvent.click(screen.getByRole('link', { name: /email us/i }))
      
      expect(openExternal).toHaveBeenCalledWith(
        expect.stringContaining('mailto:'),
      )
    })
  })
})
