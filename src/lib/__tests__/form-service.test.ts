/**
 * Form Service Tests
 * 
 * Tests for newsletter and contact form submission handling.
 * The test setup mocks window.location.hostname to 'polymerbionics.com',
 * so isNetlifyEnvironment() returns true by default — matching the Netlify
 * Forms submission path. The global fetch mock returns { ok: true }.
 * 
 * @module lib/__tests__/form-service.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  submitContactForm,
  submitNewsletterSubscription,
  submitOrderForm,
  isFormServiceConfigured,
  type ContactFormData,
  type NewsletterData,
  type OrderFormData,
} from '../form-service'

// =============================================================================
// TESTS
// =============================================================================

describe('form-service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('isFormServiceConfigured', () => {
    it('returns true when running on Netlify (hostname matches)', () => {
      // Test setup sets hostname to polymerbionics.com → isNetlifyEnvironment() = true
      expect(isFormServiceConfigured()).toBe(true)
    })
  })

  describe('submitContactForm', () => {
    const validContactData: ContactFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Acme Corp',
      subject: 'Product Inquiry',
      message: 'I would like to learn more about your products.',
    }

    it('returns success when submitted via Netlify Forms', async () => {
      // Global fetch mock returns ok: true → Netlify Forms path succeeds
      const result = await submitContactForm(validContactData)
      
      expect(result.success).toBe(true)
      expect(result.message).toBe('Submission successful')
    })

    it('sends form data via URL-encoded POST', async () => {
      await submitContactForm(validContactData)
      
      expect(global.fetch).toHaveBeenCalledWith('/', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }))
      
      // Verify form-name field is included for Netlify
      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      const body = callArgs[1]?.body as string
      expect(body).toContain('form-name=contact')
      expect(body).toContain('name=John')
      expect(body).toContain('email=john%40example.com')
    })

    it('handles form data without optional company field', async () => {
      const dataWithoutCompany: ContactFormData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        subject: 'Question',
        message: 'Hello!',
      }
      
      const result = await submitContactForm(dataWithoutCompany)
      
      expect(result.success).toBe(true)
    })

    it('returns failure on HTTP error', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)
      
      const result = await submitContactForm(validContactData)
      
      expect(result.success).toBe(false)
      expect(result.message).toBe('Submission failed')
      expect(result.error).toBe('HTTP 500')
    })

    it('returns network error on fetch failure', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'))
      
      const result = await submitContactForm(validContactData)
      
      expect(result.success).toBe(false)
      expect(result.message).toBe('Network error')
      expect(result.error).toBe('Network error')
    })
  })

  describe('submitNewsletterSubscription', () => {
    const validNewsletterData: NewsletterData = {
      email: 'subscriber@example.com',
    }

    it('returns success when submitted via Netlify Forms', async () => {
      const result = await submitNewsletterSubscription(validNewsletterData)
      
      expect(result.success).toBe(true)
      expect(result.message).toBe('Submission successful')
    })

    it('sends newsletter form data correctly', async () => {
      await submitNewsletterSubscription(validNewsletterData)
      
      expect(global.fetch).toHaveBeenCalledWith('/', expect.objectContaining({
        method: 'POST',
      }))
      
      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      const body = callArgs[1]?.body as string
      expect(body).toContain('form-name=newsletter')
      expect(body).toContain('email=subscriber%40example.com')
    })
  })

  describe('submitOrderForm', () => {
    const validOrderData: OrderFormData = {
      email: 'buyer@example.com',
      phone: '+1234567890',
      item: 'BioFlex Array',
      itemType: 'product',
      quantity: '5',
      comments: 'Urgent order',
    }

    it('returns success when submitted via Netlify Forms', async () => {
      const result = await submitOrderForm(validOrderData)
      
      expect(result.success).toBe(true)
      expect(result.message).toBe('Submission successful')
    })

    it('sends order form data correctly', async () => {
      await submitOrderForm(validOrderData)
      
      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      const body = callArgs[1]?.body as string
      expect(body).toContain('form-name=order')
      expect(body).toContain('item=BioFlex')
      expect(body).toContain('quantity=5')
    })
  })

  describe('FormResult type', () => {
    it('has correct structure', async () => {
      const result = await submitContactForm({
        name: 'Test',
        email: 'test@test.com',
        subject: 'Test',
        message: 'Test message',
      })
      
      expect(result).toHaveProperty('success')
      expect(result).toHaveProperty('message')
      expect(typeof result.success).toBe('boolean')
      expect(typeof result.message).toBe('string')
    })
  })
})
