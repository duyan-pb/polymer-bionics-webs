/**
 * SuccessDialog Component Tests
 *
 * Tests for the reusable form submission success confirmation popup.
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SuccessDialog } from '../SuccessDialog'

describe('SuccessDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    title: 'Message Sent!',
  }

  it('renders title when open', () => {
    render(<SuccessDialog {...defaultProps} />)
    expect(screen.getByText('Message Sent!')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<SuccessDialog {...defaultProps} description="We'll respond in 24 hours." />)
    expect(screen.getByText("We'll respond in 24 hours.")).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    render(<SuccessDialog {...defaultProps} />)
    // Only title and button should be present, no extra paragraph
    expect(screen.queryByText(/respond/i)).not.toBeInTheDocument()
  })

  it('renders default "OK" button label', () => {
    render(<SuccessDialog {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument()
  })

  it('renders custom button label', () => {
    render(<SuccessDialog {...defaultProps} buttonLabel="Got it" />)
    expect(screen.getByRole('button', { name: 'Got it' })).toBeInTheDocument()
  })

  it('calls onOpenChange(false) when button is clicked', async () => {
    const handleChange = vi.fn()
    render(<SuccessDialog {...defaultProps} onOpenChange={handleChange} />)

    await userEvent.click(screen.getByRole('button', { name: 'OK' }))
    expect(handleChange).toHaveBeenCalledWith(false)
  })

  it('renders nothing when open is false', () => {
    const { container } = render(<SuccessDialog {...defaultProps} open={false} />)
    // Dialog should not render its content
    expect(screen.queryByText('Message Sent!')).not.toBeInTheDocument()
    expect(container.innerHTML).toBe('')
  })

  it('has accessible dialog role', () => {
    render(<SuccessDialog {...defaultProps} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
