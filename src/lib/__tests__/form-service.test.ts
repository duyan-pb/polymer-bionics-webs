/**
 * Form Service Tests
 * 
 * Tests for newsletter, contact, and order form submission handling.
 * 
 * The global test setup mocks window.location.hostname to
 * 'polymerbionics.com', which makes isNetlifyEnvironment() return true.
 * Tests that need to reach the unconfigured fallback override hostname
 * to 'localhost'.
 * 
 * @module lib/__tests__/form-service.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mockLocation } from '@/test/setup'
import {
  submitContactForm,
  submitNewsletterSubscription,
  submitOrderForm,
  isFormServiceConfigured,
  isNetlifyEnvironment,
  formspreeConfig,
  envCheck,
  type ContactFormData,
  type NewsletterData,
  type OrderFormData,
} from '../form-service'

// =============================================================================
// TESTS
// =============================================================================

describe('form-service', () => {
  /**
   * Test configuration strategy:
   * 
   * These tests modify formspreeConfig properties directly to test different
   * scenarios. While this mutates an exported object, it's safe here because:
   * 
   * 1. Tests in Vitest run sequentially within a describe block
   * 2. beforeEach resets config to a known state before each test
   * 3. afterEach restores original values after each test
   * 4. No other modules import form-service during test execution
   * 
   * Alternative approaches considered:
   * - vi.mock() with dynamic imports: Would make tests significantly more complex
   * - Dependency injection: Would require refactoring the production code
   * - Property spies: Don't work well with config objects read at call time
   * 
   * This pattern provides adequate test isolation for the current architecture.
   */
  const originalFormspreeConfig = { ...formspreeConfig }

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset config to empty state to test unconfigured fallback
    formspreeConfig.contactFormId = ''
    formspreeConfig.newsletterFormId = ''
    formspreeConfig.orderFormId = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
    // Restore original config to prevent test pollution
    Object.assign(formspreeConfig, originalFormspreeConfig)
  })

  // ===========================================================================
  // isFormServiceConfigured
  // ===========================================================================

  describe('isFormServiceConfigured', () => {
    it('returns false when no Formspree IDs, API endpoints, or Netlify host', () => {
      mockLocation.hostname = 'localhost'
      expect(isFormServiceConfigured()).toBe(false)
    })

    it('returns true when a Formspree contact ID is set', () => {
      mockLocation.hostname = 'localhost'
      formspreeConfig.contactFormId = 'xpznqkdl'
      expect(isFormServiceConfigured()).toBe(true)
    })

    it('returns true when running on Netlify (polymerbionics.com)', () => {
      mockLocation.hostname = 'polymerbionics.com'
      expect(isFormServiceConfigured()).toBe(true)
    })
  })

  // ===========================================================================
  // Unconfigured fallback — DEV mode (vitest runs with DEV=true)
  // ===========================================================================

  describe('unconfigured fallback (DEV mode)', () => {
    beforeEach(() => {
      // Override hostname so isNetlifyEnvironment() returns false
      mockLocation.hostname = 'localhost'
    })

    afterEach(() => {
      mockLocation.hostname = 'polymerbionics.com'
    })

    it('submitContactForm returns mock success in dev', async () => {
      const result = await submitContactForm({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Hello',
      })

      expect(result.success).toBe(true)
      expect(result.message).toContain('Mock')
    })

    it('submitNewsletterSubscription returns mock success in dev', async () => {
      const result = await submitNewsletterSubscription({ email: 'sub@example.com' })

      expect(result.success).toBe(true)
      expect(result.message).toContain('Mock')
    })

    it('submitOrderForm returns mock success in dev', async () => {
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
  // Unconfigured fallback — PROD mode (simulated)
  // ===========================================================================

  describe('unconfigured fallback (PROD mode)', () => {
    beforeEach(() => {
      // Simulate production environment with non-Netlify host
      envCheck.isDev = false
      mockLocation.hostname = 'localhost'
    })

    afterEach(() => {
      envCheck.isDev = true
      mockLocation.hostname = 'polymerbionics.com'
    })

    it('submitContactForm returns failure with NO_FORM_BACKEND in prod', async () => {
      const result = await submitContactForm({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Hello',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('NO_FORM_BACKEND')
      expect(result.message).toContain('not configured')
    })

    it('submitNewsletterSubscription returns failure in prod', async () => {
      const result = await submitNewsletterSubscription({ email: 'sub@example.com' })

      expect(result.success).toBe(false)
      expect(result.error).toBe('NO_FORM_BACKEND')
    })

    it('submitOrderForm returns failure in prod', async () => {
      const result = await submitOrderForm({
        email: 'buyer@example.com',
        phone: '+1234567890',
        item: 'BioFlex Array',
        itemType: 'product',
        quantity: '5',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('NO_FORM_BACKEND')
    })
  })

  // ===========================================================================
  // Netlify Forms fallback (no Formspree IDs, hostname is polymerbionics.com)
  // ===========================================================================

  describe('Netlify Forms fallback', () => {
    // No Formspree IDs set (from outer beforeEach), hostname is already
    // 'polymerbionics.com' from the global test setup, so
    // isNetlifyEnvironment() returns true.

    it('isNetlifyEnvironment returns true for polymerbionics.com', () => {
      expect(isNetlifyEnvironment()).toBe(true)
    })

    it('isNetlifyEnvironment returns true for *.netlify.app', () => {
      mockLocation.hostname = 'my-site.netlify.app'
      expect(isNetlifyEnvironment()).toBe(true)
      mockLocation.hostname = 'polymerbionics.com'
    })

    it('isNetlifyEnvironment returns false for localhost', () => {
      mockLocation.hostname = 'localhost'
      expect(isNetlifyEnvironment()).toBe(false)
      mockLocation.hostname = 'polymerbionics.com'
    })

    it('submits contact form via Netlify Forms', async () => {
      const result = await submitContactForm({
        name: 'Jane Doe',
        email: 'jane@example.com',
        subject: 'Inquiry',
        message: 'Testing Netlify fallback',
      })

      expect(result.success).toBe(true)
      expect(global.fetch).toHaveBeenCalledWith(
        '/',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      )

      // Verify form-name field is included in URL-encoded body
      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      const body = callArgs[1]?.body as string
      expect(body).toContain('form-name=contact')
      expect(body).toContain('name=Jane+Doe')
      expect(body).toContain('email=jane%40example.com')
    })

    it('submits newsletter via Netlify Forms', async () => {
      await submitNewsletterSubscription({ email: 'sub@example.com' })

      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      const body = callArgs[1]?.body as string
      expect(body).toContain('form-name=newsletter')
      expect(body).toContain('email=sub%40example.com')
    })

    it('submits order form via Netlify Forms', async () => {
      await submitOrderForm({
        email: 'buyer@example.com',
        phone: '+1234567890',
        item: 'BioFlex Array',
        itemType: 'product',
        quantity: '5',
      })

      const callArgs = vi.mocked(global.fetch).mock.calls[0]
      const body = callArgs[1]?.body as string
      expect(body).toContain('form-name=order')
      expect(body).toContain('item=BioFlex+Array')
    })

    it('returns failure on Netlify HTTP error', async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: () => Promise.resolve({}),
      } as Response)

      const result = await submitContactForm({
        name: 'Test',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Fails',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('HTTP 422')
    })

    it('returns network error on Netlify fetch failure', async () => {
      vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Connection refused'))

      const result = await submitContactForm({
        name: 'Test',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Fails',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Connection refused')
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
