/**
 * OrderModal Component Tests
 *
 * Tests for the order enquiry modal including:
 * - Rendering and form fields
 * - Validation (email, phone)
 * - Submission and success dialog
 * - Pre-populated item name
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OrderModal } from '../OrderModal'

// Mock sonner
const mockToast = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
}))
vi.mock('sonner', () => ({ toast: mockToast }))

// Mock form-service
const mockSubmitOrderForm = vi.hoisted(() => vi.fn())
vi.mock('@/lib/form-service', () => ({
  submitOrderForm: mockSubmitOrderForm,
}))

describe('OrderModal', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    itemName: 'FlexElec Foam',
    itemType: 'Product',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockSubmitOrderForm.mockResolvedValue({ success: true, message: 'OK' })
  })

  describe('rendering', () => {
    it('renders the modal with title', () => {
      render(<OrderModal {...defaultProps} />)
      expect(screen.getByText('Order Enquiry')).toBeInTheDocument()
    })

    it('renders email, phone, item, quantity and comments fields', () => {
      render(<OrderModal {...defaultProps} />)
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/item/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/comments/i)).toBeInTheDocument()
    })

    it('pre-populates item name from prop', () => {
      render(<OrderModal {...defaultProps} />)
      expect(screen.getByLabelText(/item/i)).toHaveValue('FlexElec Foam')
    })

    it('renders submit button', () => {
      render(<OrderModal {...defaultProps} />)
      expect(screen.getByRole('button', { name: /submit order enquiry/i })).toBeInTheDocument()
    })
  })

  describe('validation', () => {
    it('shows error for empty email', async () => {
      render(<OrderModal {...defaultProps} />)

      // Fill phone but not email
      await userEvent.type(screen.getByLabelText(/phone/i), '+44123456')
      await userEvent.click(screen.getByRole('button', { name: /submit order enquiry/i }))

      expect(mockToast.error).toHaveBeenCalledWith('Please enter a valid email address')
    })

    it('shows error for invalid email format', async () => {
      render(<OrderModal {...defaultProps} />)

      await userEvent.type(screen.getByLabelText(/email/i), 'bad-email')
      await userEvent.type(screen.getByLabelText(/phone/i), '+44123456')
      await userEvent.click(screen.getByRole('button', { name: /submit order enquiry/i }))

      expect(mockToast.error).toHaveBeenCalledWith('Please enter a valid email address')
    })

    it('shows error for empty phone', async () => {
      render(<OrderModal {...defaultProps} />)

      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
      await userEvent.click(screen.getByRole('button', { name: /submit order enquiry/i }))

      expect(mockToast.error).toHaveBeenCalledWith('Please enter your phone number')
    })
  })

  describe('submission', () => {
    it('calls submitOrderForm with form data on valid submission', async () => {
      render(<OrderModal {...defaultProps} />)

      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
      await userEvent.type(screen.getByLabelText(/phone/i), '+44123456')
      await userEvent.click(screen.getByRole('button', { name: /submit order enquiry/i }))

      await waitFor(() => {
        expect(mockSubmitOrderForm).toHaveBeenCalledWith(
          expect.objectContaining({
            email: 'test@example.com',
            phone: '+44123456',
            item: 'FlexElec Foam',
            itemType: 'Product',
          })
        )
      })
    })

    it('shows success dialog after successful submission', async () => {
      render(<OrderModal {...defaultProps} />)

      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
      await userEvent.type(screen.getByLabelText(/phone/i), '+44123456')
      await userEvent.click(screen.getByRole('button', { name: /submit order enquiry/i }))

      await waitFor(() => {
        expect(screen.getByText('Order Enquiry Submitted!')).toBeInTheDocument()
      })
    })

    it('shows error toast on submission failure', async () => {
      mockSubmitOrderForm.mockResolvedValue({ success: false, error: 'Server error' })

      render(<OrderModal {...defaultProps} />)

      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
      await userEvent.type(screen.getByLabelText(/phone/i), '+44123456')
      await userEvent.click(screen.getByRole('button', { name: /submit order enquiry/i }))

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Submission failed', expect.any(Object))
      })
    })

    it('shows error toast on network exception', async () => {
      mockSubmitOrderForm.mockRejectedValue(new Error('Network error'))

      render(<OrderModal {...defaultProps} />)

      await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
      await userEvent.type(screen.getByLabelText(/phone/i), '+44123456')
      await userEvent.click(screen.getByRole('button', { name: /submit order enquiry/i }))

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Something went wrong', expect.any(Object))
      })
    })
  })
})
