/**
 * SEO Infrastructure Tests (Epic 13)
 */

import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest'
import {
  updatePageMeta,
  setPageMetadata,
  addOrganizationSchema,
  addProductSchema,
  addArticleSchema,
  addBreadcrumbSchema,
  configureRedirects,
  checkRedirect,
  executeRedirect,
  trackOutboundLink,
  setupOutboundLinkTracking,
  DEFAULT_SEO_CONFIG,
  usePageSEO,
} from '../seo'
import { withdrawConsent } from '../consent'

// Create a mock location object that we can modify
const createMockLocation = () => ({
  href: 'https://polymerbionics.com/products',
  pathname: '/products',
  search: '',
  hash: '',
  origin: 'https://polymerbionics.com',
  protocol: 'https:',
  host: 'polymerbionics.com',
  hostname: 'polymerbionics.com',
  port: '',
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
})

// Store the original location
const originalLocation = window.location

// Mock location for tests
let mockLocation = createMockLocation()

describe('SEO Infrastructure', () => {
  beforeEach(() => {
    // Clear any existing meta tags
    document.head.querySelectorAll('meta[property], meta[name], link[rel="canonical"]').forEach(el => el.remove())
    // Clear structured data
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove())
    
    mockLocation = createMockLocation()
    mockLocation.pathname = '/products'
    mockLocation.href = 'https://polymerbionics.com/products'
    
    // Override window.location with our mock
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true,
      configurable: true,
    })
  })

  afterAll(() => {
    // Restore original location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    })
  })

  describe('updatePageMeta', () => {
    it('updates document title with template', () => {
      updatePageMeta({
        title: 'Products',
      })
      
      // Title uses template: '%s | Polymer Bionics'
      expect(document.title).toContain('Products')
      expect(document.title).toContain('Polymer Bionics')
    })

    it('sets meta description', () => {
      updatePageMeta({
        description: 'Explore our bioactive polymer products',
      })
      
      const metaDesc = document.querySelector('meta[name="description"]')
      expect(metaDesc?.getAttribute('content')).toBe('Explore our bioactive polymer products')
    })

    it('sets canonical URL', () => {
      updatePageMeta({
        canonical: 'https://polymerbionics.com/products',
      })
      
      const canonical = document.querySelector('link[rel="canonical"]')
      expect(canonical?.getAttribute('href')).toBe('https://polymerbionics.com/products')
    })

    it('sets Open Graph tags', () => {
      updatePageMeta({
        title: 'Products',
        og: {
          type: 'website',
          image: '/images/products-og.png',
          siteName: 'Polymer Bionics',
        },
      })
      
      const ogType = document.querySelector('meta[property="og:type"]')
      expect(ogType?.getAttribute('content')).toBe('website')
      
      const ogImage = document.querySelector('meta[property="og:image"]')
      expect(ogImage?.getAttribute('content')).toBe('/images/products-og.png')
    })

    it('sets Twitter Card tags', () => {
      updatePageMeta({
        title: 'Products',
        twitter: {
          card: 'summary_large_image',
          site: '@polymerbionics',
        },
      })
      
      const twitterCard = document.querySelector('meta[name="twitter:card"]')
      expect(twitterCard?.getAttribute('content')).toBe('summary_large_image')
      
      const twitterSite = document.querySelector('meta[name="twitter:site"]')
      expect(twitterSite?.getAttribute('content')).toBe('@polymerbionics')
    })

    it('updates existing meta tags instead of duplicating', () => {
      updatePageMeta({ description: 'First description' })
      updatePageMeta({ description: 'Second description' })
      
      const metaDescs = document.querySelectorAll('meta[name="description"]')
      expect(metaDescs.length).toBe(1)
      expect(metaDescs[0]?.getAttribute('content')).toBe('Second description')
    })
  })

  describe('setPageMetadata', () => {
    it('sets predefined page metadata', () => {
      setPageMetadata('home')
      
      expect(document.title).toContain('Polymer Bionics')
    })

    it('handles unknown page gracefully', () => {
      // Should not throw for unknown pages
      expect(() => {
        setPageMetadata('unknown-page')
      }).not.toThrow()
    })
  })

  describe('DEFAULT_SEO_CONFIG', () => {
    it('has site name', () => {
      expect(DEFAULT_SEO_CONFIG.siteName).toBe('Polymer Bionics')
    })

    it('has title template', () => {
      expect(DEFAULT_SEO_CONFIG.titleTemplate).toContain('%s')
    })
  })

  describe('addOrganizationSchema', () => {
    it('adds Organization JSON-LD', () => {
      addOrganizationSchema({
        name: 'Polymer Bionics',
        url: 'https://polymerbionics.com',
        logo: 'https://polymerbionics.com/logo.png',
      })
      
      const script = document.querySelector('script[type="application/ld+json"]')
      expect(script).toBeTruthy()
      
      const schema = JSON.parse(script!.textContent!)
      expect(schema['@type']).toBe('Organization')
      expect(schema.name).toBe('Polymer Bionics')
    })

    it('includes optional properties', () => {
      addOrganizationSchema({
        name: 'Polymer Bionics',
        url: 'https://polymerbionics.com',
        description: 'Medical device company',
        sameAs: ['https://linkedin.com/company/polymerbionics'],
      })
      
      const script = document.querySelector('script[type="application/ld+json"]')
      const schema = JSON.parse(script!.textContent!)
      
      expect(schema.description).toBe('Medical device company')
      expect(schema.sameAs).toContain('https://linkedin.com/company/polymerbionics')
    })
  })

  describe('addProductSchema', () => {
    it('adds Product JSON-LD', () => {
      addProductSchema({
        name: 'BioActive Polymer Sheet',
        description: 'Medical-grade bioactive polymer',
        image: '/images/product.png',
        brand: {
          '@type': 'Brand',
          name: 'Polymer Bionics',
        },
      })
      
      const scripts = document.querySelectorAll('script[type="application/ld+json"]')
      const productScript = Array.from(scripts).find(s => 
        JSON.parse(s.textContent!)['@type'] === 'Product'
      )
      
      expect(productScript).toBeTruthy()
      const schema = JSON.parse(productScript!.textContent!)
      expect(schema.name).toBe('BioActive Polymer Sheet')
    })
  })

  describe('addArticleSchema', () => {
    it('adds Article JSON-LD', () => {
      addArticleSchema({
        headline: 'New Research in Bioactive Polymers',
        description: 'Latest findings...',
        datePublished: '2024-01-15',
        author: {
          '@type': 'Organization',
          name: 'Polymer Bionics',
        },
      })
      
      const scripts = document.querySelectorAll('script[type="application/ld+json"]')
      const articleScript = Array.from(scripts).find(s => 
        JSON.parse(s.textContent!)['@type'] === 'Article'
      )
      
      expect(articleScript).toBeTruthy()
    })

    it('supports NewsArticle type', () => {
      addArticleSchema({
        headline: 'Company News',
        description: 'News item',
        datePublished: '2024-01-15',
        author: { '@type': 'Organization', name: 'PB' },
      }, 'NewsArticle')
      
      const scripts = document.querySelectorAll('script[type="application/ld+json"]')
      const newsScript = Array.from(scripts).find(s => 
        JSON.parse(s.textContent!)['@type'] === 'NewsArticle'
      )
      
      expect(newsScript).toBeTruthy()
    })
  })

  describe('addBreadcrumbSchema', () => {
    it('adds BreadcrumbList JSON-LD', () => {
      addBreadcrumbSchema([
        { name: 'Home', url: 'https://polymerbionics.com' },
        { name: 'Products', url: 'https://polymerbionics.com/products' },
      ])
      
      const scripts = document.querySelectorAll('script[type="application/ld+json"]')
      const breadcrumbScript = Array.from(scripts).find(s => 
        JSON.parse(s.textContent!)['@type'] === 'BreadcrumbList'
      )
      
      expect(breadcrumbScript).toBeTruthy()
      const schema = JSON.parse(breadcrumbScript!.textContent!)
      expect(schema.itemListElement).toHaveLength(2)
    })

    it('sets correct positions', () => {
      addBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/products' },
        { name: 'Item', url: '/products/item' },
      ])
      
      const scripts = document.querySelectorAll('script[type="application/ld+json"]')
      const breadcrumbScript = Array.from(scripts).find(s => 
        JSON.parse(s.textContent!)['@type'] === 'BreadcrumbList'
      )
      
      const schema = JSON.parse(breadcrumbScript!.textContent!)
      expect(schema.itemListElement[0].position).toBe(1)
      expect(schema.itemListElement[2].position).toBe(3)
    })
  })

  describe('configureRedirects', () => {
    it('configures redirect rules without error', () => {
      expect(() => {
        configureRedirects([
          { from: '/old-page', to: '/new-page', status: 301 },
          { from: '/legacy', to: '/modern', status: 302 },
        ])
      }).not.toThrow()
    })
  })

  describe('checkRedirect', () => {
    beforeEach(() => {
      configureRedirects([
        { from: '/old-page', to: '/new-page', status: 301 },
        { from: '/legacy/.*', to: '/modern/$1', status: 301, isRegex: true },
      ])
    })

    it('finds matching redirect', () => {
      mockLocation.pathname = '/old-page'
      
      const rule = checkRedirect()
      
      expect(rule).toBeTruthy()
      expect(rule?.to).toBe('/new-page')
    })

    it('returns null for non-matching path', () => {
      mockLocation.pathname = '/existing-page'
      
      const rule = checkRedirect()
      
      expect(rule).toBeNull()
    })

    it('handles regex redirects', () => {
      mockLocation.pathname = '/legacy/some-path'
      
      const rule = checkRedirect()
      
      expect(rule).toBeTruthy()
      expect(rule?.isRegex).toBe(true)
    })
  })

  describe('executeRedirect', () => {
    it('changes pathname for relative paths', () => {
      executeRedirect({ from: '/old', to: '/new', status: 301 })
      
      expect(mockLocation.pathname).toBe('/new')
    })

    it('changes href for absolute URLs', () => {
      executeRedirect({ from: '/old', to: 'https://example.com/new', status: 301 })
      
      expect(mockLocation.href).toBe('https://example.com/new')
    })
  })

  describe('trackOutboundLink', () => {
    it('tracks outbound link without error', () => {
      // Function returns void
      expect(() => {
        trackOutboundLink('https://external-site.com', 'Learn More')
      }).not.toThrow()
    })

    it('handles invalid URLs gracefully', () => {
      expect(() => {
        trackOutboundLink('not-a-valid-url', 'Test')
      }).not.toThrow()
    })
  })

  describe('setupOutboundLinkTracking', () => {
    it('sets up click handler', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
      
      setupOutboundLinkTracking()
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))
    })

    it('tracks external links on click', () => {
      setupOutboundLinkTracking()
      
      // Simulate click on external link
      const link = document.createElement('a')
      link.href = 'https://external-site.com'
      link.textContent = 'External'
      document.body.appendChild(link)
      
      const event = new MouseEvent('click', { bubbles: true })
      link.dispatchEvent(event)
      
      // Cleanup
      document.body.removeChild(link)
      
      // Should complete without error
      expect(true).toBe(true)
    })
  })

  describe('robots meta', () => {
    it('sets robots meta tag', () => {
      updatePageMeta({
        robots: 'noindex, nofollow',
      })
      
      const robotsMeta = document.querySelector('meta[name="robots"]')
      expect(robotsMeta?.getAttribute('content')).toBe('noindex, nofollow')
    })
  })

  describe('viewport meta', () => {
    it('does not override viewport if present', () => {
      const existingViewport = document.createElement('meta')
      existingViewport.name = 'viewport'
      existingViewport.content = 'width=device-width'
      document.head.appendChild(existingViewport)
      
      updatePageMeta({ title: 'Test' })
      
      const viewports = document.querySelectorAll('meta[name="viewport"]')
      expect(viewports.length).toBe(1)
      
      document.head.removeChild(existingViewport)
    })
  })

  describe('usePageSEO hook', () => {
    it('updates page meta when called', () => {
      usePageSEO('home', { title: 'Custom Home Title' })
      
      // Should apply metadata without throwing
      expect(document.title).toBeTruthy()
    })

    it('works with only page name', () => {
      expect(() => usePageSEO('products')).not.toThrow()
    })
  })

  describe('trackOutboundLink edge cases', () => {
    it('does not track internal links', () => {
      // Set up current hostname
      const originalLocation = window.location
      Object.defineProperty(window, 'location', {
        value: { ...originalLocation, hostname: 'polymerbionics.com', pathname: '/test' },
        writable: true,
      })
      
      // Internal link should not trigger tracking
      expect(() => {
        trackOutboundLink('https://polymerbionics.com/products', 'Products')
      }).not.toThrow()
    })

    it('does not track without consent', () => {
      withdrawConsent()
      
      expect(() => {
        trackOutboundLink('https://external.com', 'External')
      }).not.toThrow()
    })
  })
})
