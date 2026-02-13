/**
 * Form Service Tests
 * 
 * Tests for newsletter, contact, and order form submission handling.
 * 
 * Without VITE_FORMSPREE_* env vars, all submissions fall through to
 * mock mode (console.log only). Tests for the Formspree path set the
 * config directly to simulate a configured environment.
 * 
 * @module lib/__tests__/form-service.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  submitContactForm,
  submitNewsletterSubscription,
  submitOrderForm,
  isFormServiceConfigured,
  formspreeConfig,
  type ContactFormData,
  type NewsletterData,
  type OrderFormData,
} from '../form-service'

// =============================================================================
// TESTS
// =============================================================================

describe('form-service', () => {
  /** Store original config values so they can be restored after each test. */
  const originalFormspreeConfig = { ...formspreeConfig }

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset Formspree config to empty (mock mode)
    formspreeConfig.contactFormId = ''
    formspreeConfig.newsletterFormId = ''
    formspreeConfig.orderFormId = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
    // Restore original config
    Object.assign(formspreeConfig, originalFormspreeConfig)
  })

  // ===========================================================================
  // isFormServiceConfigured
  // ===========================================================================

  describe('isFormServiceConfigured', () => {
    it('returns false when no Formspree IDs or API endpoints are set', () => {
      expect(isFormServiceConfigured()).toBe(false)
    })

    it('returns true when a Formspree contact ID is set', () => {
      formspreeConfig.contactFormId = 'xpznqkdl'
      expect(isFormServiceConfigured()).toBe(true)
    })
  })

  // ===========================================================================
  // Mock mode (no config)
  // ===========================================================================

  describe('mock mode (no Formspree config)', () => {
    it('submitContactForm returns mock success', async () => {
      const result = await submitContactForm({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Hello',
      })

      expect(result.success).toBe(true)
      expect(result.message).toContain('Mock')
    })

    it('submitNewsletterSubscription returns mock success', async () => {
      const result = await submitNewsletterSubscription({ email: 'sub@example.com' })

      expect(result.success).toBe(true)
      expect(result.message).toContain('Mock')
    })

    it('submitOrderForm returns mock success', async () => {
      const result = await submitOrderForm({
        email: 'buyer@example.com',
        phone: '+1234567890',
        item: 'BioFlex Array',
        itemType: 'product',
        quantity: '5',
      })

      expect(result.success).toBe(true)
      expect(result.message).toContain('Mock')
    })
  })

  // ===========================================================================
  // Formspree submission path
  // ===========================================================================

  describe('Formspree submission', () => {
    const validContactData: ContactFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Acme Corp',
      subject: 'Product Inquiry',
      message: 'I would like to learn more about your products.',
    }

    beforeEach(() => {
      formspreeConfig.contactFormId = 'xpznqkdl'
      formspreeConfig.newsletterFormId = 'xnewsltr'
      formspreeConfig.orderFormId = 'xorderid'
    })

    it('submits contact form to Formspree endpoint', async () => {
      const result = await submitContactForm(validContactData)

      expect(result.success).toBe(true)
      expect(result.message).toBe('Submission successful')
      expect(global.fetch).toHaveBeenCalledWith(
        'https://formspree.io/f/xpznqkdl',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }),
        }),
      )
    })

    it('sends correct JSON body for contact form', async () => {
      await submitContactForm(validContactData)

      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      const body = JSON.parse(callArgs[1]?.body as string)
      expect(body.name).toBe('John Doe')
      expect(body.email).toBe('john@example.com')
      expect(body.company).toBe('Acme Corp')
      expect(body.subject).toBe('Product Inquiry')
    })

    it('handles contact data without optional company field', async () => {
      const result = await submitContactForm({
        name: 'Jane Doe',
        email: 'jane@example.com',
        subject: 'Question',
        message: 'Hello!',
      })

      expect(result.success).toBe(true)
    })

    it('submits newsletter to Formspree endpoint', async () => {
      await submitNewsletterSubscription({ email: 'subscriber@example.com' })

      expect(global.fetch).toHaveBeenCalledWith(
        'https://formspree.io/f/xnewsltr',
        expect.objectContaining({ method: 'POST' }),
      )
    })

    it('submits order form to Formspree endpoint', async () => {
      await submitOrderForm({
        email: 'buyer@example.com',
        phone: '+1234567890',
        item: 'BioFlex Array',
        itemType: 'product',
        quantity: '5',
        comments: 'Urgent order',
      })

      expect(global.fetch).toHaveBeenCalledWith(
        'https://formspree.io/f/xorderid',
        expect.objectContaining({ method: 'POST' }),
      )
    })

    it('returns failure on HTTP error', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
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

  // ===========================================================================
  // FormResult type
  // ===========================================================================

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
