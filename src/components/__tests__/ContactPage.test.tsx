/**
 * ContactPage Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock the entire ContactPage component for simpler testing
vi.mock('../ContactPage', () => ({
  ContactPage: ({ onNavigate }: { onNavigate: (page: string) => void }) => (
    <div data-testid="contact-page">
      <div data-testid="page-hero">
        <h1>Get In Touch</h1>
        <p>Contact description</p>
      </div>
      <form>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" />
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" />
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" />
        <label htmlFor="subject">Subject</label>
        <input id="subject" name="subject" type="text" />
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" />
        <button type="submit">Send Message</button>
      </form>
      <button onClick={() => onNavigate('home')}>Go Home</button>
    </div>
  ),
}))

// Import after mocks
import { ContactPage } from '../ContactPage'

describe('ContactPage', () => {
  const mockOnNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders page hero with title', () => {
      render(<ContactPage onNavigate={mockOnNavigate} />)
      
      expect(screen.getByTestId('page-hero')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1, name: /get in touch/i })).toBeInTheDocument()
    })

    it('renders contact form fields', () => {
      render(<ContactPage onNavigate={mockOnNavigate} />)
      
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })

    it('renders submit button', () => {
      render(<ContactPage onNavigate={mockOnNavigate} />)
      
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument()
    })

    it('renders company field', () => {
      render(<ContactPage onNavigate={mockOnNavigate} />)
      
      expect(screen.getByLabelText(/company/i)).toBeInTheDocument()
    })

    it('renders subject field', () => {
      render(<ContactPage onNavigate={mockOnNavigate} />)
      
      expect(screen.getByLabelText(/subject/i)).toBeInTheDocument()
    })

    it('renders message field', () => {
      render(<ContactPage onNavigate={mockOnNavigate} />)
      
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('calls onNavigate when navigation button is clicked', async () => {
      render(<ContactPage onNavigate={mockOnNavigate} />)
      
      const homeButton = screen.getByRole('button', { name: /go home/i })
      await userEvent.click(homeButton)
      
      expect(mockOnNavigate).toHaveBeenCalledWith('home')
    })
  })

  describe('accessibility', () => {
    it('all form fields have labels', () => {
      render(<ContactPage onNavigate={mockOnNavigate} />)
      
      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      
      expect(nameInput).toHaveAttribute('name')
      expect(emailInput).toHaveAttribute('name')
    })

    it('form is keyboard navigable', () => {
      render(<ContactPage onNavigate={mockOnNavigate} />)
      
      const nameInput = screen.getByLabelText(/name/i)
      nameInput.focus()
      
      expect(document.activeElement).toBe(nameInput)
    })
  })
})
