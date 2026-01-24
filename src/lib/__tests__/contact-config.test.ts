/**
 * contact-config.ts Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { contactConfig, copyWhatsAppNumber, getEmailUrl, getOrderEmailBody } from '../contact-config'

describe('contact-config', () => {
  describe('contactConfig object', () => {
    it('has email configuration', () => {
      expect(contactConfig).toHaveProperty('email')
      expect(contactConfig.email).toHaveProperty('general')
      expect(contactConfig.email).toHaveProperty('sales')
    })

    it('has valid email addresses', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      
      expect(emailRegex.test(contactConfig.email.general)).toBe(true)
      expect(emailRegex.test(contactConfig.email.sales)).toBe(true)
    })

    it('has whatsapp configuration', () => {
      expect(contactConfig).toHaveProperty('whatsapp')
      expect(contactConfig.whatsapp).toHaveProperty('number')
      expect(contactConfig.whatsapp).toHaveProperty('defaultMessage')
    })

    it('whatsapp number starts with +', () => {
      expect(contactConfig.whatsapp.number.startsWith('+')).toBe(true)
    })

    it('whatsapp number contains only valid characters', () => {
      // Valid: + and digits only
      const cleaned = contactConfig.whatsapp.number.replace(/[+\d]/g, '')
      expect(cleaned).toBe('')
    })

    it('has address configuration', () => {
      expect(contactConfig).toHaveProperty('address')
      expect(contactConfig.address).toHaveProperty('street')
      expect(contactConfig.address).toHaveProperty('city')
      expect(contactConfig.address).toHaveProperty('postcode')
      expect(contactConfig.address).toHaveProperty('country')
    })

    it('all address fields are non-empty strings', () => {
      expect(typeof contactConfig.address.street).toBe('string')
      expect(contactConfig.address.street.length).toBeGreaterThan(0)
      
      expect(typeof contactConfig.address.city).toBe('string')
      expect(contactConfig.address.city.length).toBeGreaterThan(0)
      
      expect(typeof contactConfig.address.postcode).toBe('string')
      expect(contactConfig.address.postcode.length).toBeGreaterThan(0)
      
      expect(typeof contactConfig.address.country).toBe('string')
      expect(contactConfig.address.country.length).toBeGreaterThan(0)
    })

    it('has social configuration', () => {
      expect(contactConfig).toHaveProperty('social')
      expect(contactConfig.social).toHaveProperty('linkedin')
    })

    it('linkedin URL is valid', () => {
      expect(contactConfig.social.linkedin.startsWith('https://')).toBe(true)
      expect(contactConfig.social.linkedin).toContain('linkedin.com')
    })
  })

  describe('copyWhatsAppNumber function', () => {
    const originalClipboard = navigator.clipboard

    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      // Restore original clipboard
      Object.defineProperty(navigator, 'clipboard', {
        value: originalClipboard,
        writable: true,
        configurable: true,
      })
    })

    it('returns true on successful copy', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true,
      })
      
      const result = await copyWhatsAppNumber()
      
      expect(result).toBe(true)
      expect(mockWriteText).toHaveBeenCalledWith(contactConfig.whatsapp.number)
    })

    it('returns false on clipboard error', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn().mockRejectedValue(new Error('Clipboard access denied')),
        },
        writable: true,
        configurable: true,
      })
      
      const result = await copyWhatsAppNumber()
      
      expect(result).toBe(false)
    })
  })

  describe('getEmailUrl function', () => {
    it('returns general email mailto URL by default', () => {
      const url = getEmailUrl()

      expect(url).toBe(
        `mailto:${contactConfig.email.general}?subject=${encodeURIComponent(contactConfig.email.orderSubject)}&body=${encodeURIComponent(getOrderEmailBody())}`
      )
    })

    it('returns general email mailto URL when type is general', () => {
      const url = getEmailUrl('general')

      expect(url).toBe(
        `mailto:${contactConfig.email.general}?subject=${encodeURIComponent(contactConfig.email.orderSubject)}&body=${encodeURIComponent(getOrderEmailBody())}`
      )
    })

    it('returns sales email mailto URL when type is sales', () => {
      const url = getEmailUrl('sales')

      expect(url).toBe(
        `mailto:${contactConfig.email.sales}?subject=${encodeURIComponent(contactConfig.email.orderSubject)}&body=${encodeURIComponent(getOrderEmailBody())}`
      )
    })

    it('includes subject when provided', () => {
      const subject = 'Product Inquiry'
      const url = getEmailUrl('general', subject)
      
      expect(url).toBe(`mailto:${contactConfig.email.general}?subject=${encodeURIComponent(subject)}`)
    })

    it('encodes special characters in subject', () => {
      const subject = 'Hello & Goodbye'
      const url = getEmailUrl('general', subject)
      
      expect(url).toContain(encodeURIComponent('&'))
    })

    it('includes subject with sales email', () => {
      const subject = 'Sales Question'
      const url = getEmailUrl('sales', subject)
      
      expect(url).toBe(`mailto:${contactConfig.email.sales}?subject=${encodeURIComponent(subject)}`)
    })
    
    it('includes body when provided', () => {
      const subject = 'Custom subject'
      const body = 'Line 1\nLine 2'
      const url = getEmailUrl('general', subject, body)
      
      expect(url).toBe(
        `mailto:${contactConfig.email.general}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      )
    })
    
    it('includes context when no subject/body provided', () => {
      const url = getEmailUrl('general', undefined, undefined, {
        sourcePage: 'Products',
        sourceProduct: 'BioFlex 300',
      })

      expect(url).toBe(
        `mailto:${contactConfig.email.general}?subject=${encodeURIComponent(contactConfig.email.orderSubject)}&body=${encodeURIComponent(getOrderEmailBody({ sourcePage: 'Products', sourceProduct: 'BioFlex 300' }))}`
      )
    })
  })
})
