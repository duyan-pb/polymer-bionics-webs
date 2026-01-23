import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

// Mock framer-motion - pass through children without animation props
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      // Filter out framer-motion-specific props
      const { 
        initial, animate, exit, transition, whileHover, whileTap,
        ...validProps 
      } = props as Record<string, unknown>
      void initial; void animate; void exit; void transition; void whileHover; void whileTap;
      return <div {...validProps}>{children}</div>
    },
    button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { 
        initial, animate, exit, transition, whileHover, whileTap,
        ...validProps 
      } = props as Record<string, unknown>
      void initial; void animate; void exit; void transition; void whileHover; void whileTap;
      return <button {...validProps}>{children}</button>
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}))

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock contact config
vi.mock('@/lib/contact-config', () => ({
  contactConfig: {
    email: {
      general: 'info@test.com',
      sales: 'sales@test.com',
    },
    whatsapp: {
      number: '+1234567890',
    },
    address: {
      street: '123 Test St',
      city: 'Test City',
      postcode: '12345',
      country: 'Test Country',
    },
  },
  copyWhatsAppNumber: vi.fn().mockResolvedValue(true),
  getEmailUrl: vi.fn((type: string) => `mailto:${type}@test.com`),
}))

import { FloatingContactButton } from '../FloatingContactButton'

describe('FloatingContactButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.open = vi.fn()
  })

  describe('initial state', () => {
    it('renders a button', () => {
      render(<FloatingContactButton />)
      // The component has a button for toggling the menu
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('renders the chat icon initially', () => {
      const { container } = render(<FloatingContactButton />)
      // Check that the component renders
      expect(container.querySelector('svg')).toBeInTheDocument()
    })
  })

  describe('toggle behavior', () => {
    it('opens contact menu when button clicked', async () => {
      const user = userEvent.setup()
      render(<FloatingContactButton />)
      
      const toggleButton = screen.getAllByRole('button')[0]
      await user.click(toggleButton)
      
      // Check that contact options are now visible
      expect(screen.getByText('Contact Us')).toBeInTheDocument()
    })

    it('shows all contact options when open', async () => {
      const user = userEvent.setup()
      render(<FloatingContactButton />)
      
      const toggleButton = screen.getAllByRole('button')[0]
      await user.click(toggleButton)
      
      expect(screen.getByText('General Enquiry')).toBeInTheDocument()
      expect(screen.getByText('Quote Request')).toBeInTheDocument()
      expect(screen.getByText('WhatsApp')).toBeInTheDocument()
      expect(screen.getByText('Visit Us')).toBeInTheDocument()
    })
  })

  describe('contact actions', () => {
    it('opens email on general enquiry click', async () => {
      const user = userEvent.setup()
      render(<FloatingContactButton />)
      
      // Open menu first
      const toggleButton = screen.getAllByRole('button')[0]
      await user.click(toggleButton)
      
      // Click general enquiry
      const generalButton = screen.getByText('General Enquiry').closest('button')
      await user.click(generalButton!)
      
      expect(window.open).toHaveBeenCalled()
    })

    it('copies whatsapp number on click', async () => {
      const { copyWhatsAppNumber } = await import('@/lib/contact-config')
      const user = userEvent.setup()
      render(<FloatingContactButton />)
      
      // Open menu first
      const toggleButton = screen.getAllByRole('button')[0]
      await user.click(toggleButton)
      
      // Click WhatsApp
      const whatsappButton = screen.getByText('WhatsApp').closest('button')
      await user.click(whatsappButton!)
      
      expect(copyWhatsAppNumber).toHaveBeenCalled()
    })

    it('opens maps on visit us click', async () => {
      const user = userEvent.setup()
      render(<FloatingContactButton />)
      
      // Open menu first
      const toggleButton = screen.getAllByRole('button')[0]
      await user.click(toggleButton)
      
      // Click Visit Us
      const visitButton = screen.getByText('Visit Us').closest('button')
      await user.click(visitButton!)
      
      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('google.com/maps'),
        '_blank',
        'noopener,noreferrer'
      )
    })
  })

  describe('structure', () => {
    it('renders in a fixed position container', () => {
      const { container } = render(<FloatingContactButton />)
      const wrapper = container.firstChild as HTMLElement
      expect(wrapper).toHaveClass('fixed')
    })
  })
})
