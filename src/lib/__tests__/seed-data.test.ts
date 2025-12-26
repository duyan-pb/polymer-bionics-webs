/**
 * Seed Data Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { generateBiomaterialsProducts } from '../seed-data'

// Mock the image imports
vi.mock('@/assets/images/PXL_20251216_115711682.PORTRAIT.jpg', () => ({ default: '/mock-pxl1.jpg' }))
vi.mock('@/assets/images/PXL_20251216_115728419.PORTRAIT.ORIGINAL.jpg', () => ({ default: '/mock-pxl2.jpg' }))
vi.mock('@/assets/images/PXL_20251216_115810661.jpg', () => ({ default: '/mock-pxl5.jpg' }))
vi.mock('@/assets/images/PXL_20251216_115854143.jpg', () => ({ default: '/mock-pxl9.jpg' }))
vi.mock('@/assets/images/PXL_20251216_115905670.jpg', () => ({ default: '/mock-pxl10.jpg' }))
vi.mock('@/assets/images/PXL_20251216_115937300.jpg', () => ({ default: '/mock-pxl11.jpg' }))
vi.mock('@/assets/images/PXL_20251216_115958662.jpg', () => ({ default: '/mock-pxl13.jpg' }))
vi.mock('@/assets/images/PXL_20251216_120056575.jpg', () => ({ default: '/mock-pxl15.jpg' }))

describe('generateBiomaterialsProducts', () => {
  it('returns an array of products', async () => {
    const products = await generateBiomaterialsProducts()
    
    expect(Array.isArray(products)).toBe(true)
    expect(products.length).toBeGreaterThan(0)
  })

  it('generates products from materials', async () => {
    const products = await generateBiomaterialsProducts()
    
    const materialProducts = products.filter(p => p.id.startsWith('material-'))
    expect(materialProducts.length).toBeGreaterThan(0)
  })

  it('generates products from applications', async () => {
    const products = await generateBiomaterialsProducts()
    
    const applicationProducts = products.filter(p => p.id.startsWith('application-'))
    expect(applicationProducts.length).toBeGreaterThan(0)
  })

  it('each product has required fields', async () => {
    const products = await generateBiomaterialsProducts()
    
    products.forEach(product => {
      expect(product.id).toBeDefined()
      expect(product.name).toBeDefined()
      expect(product.category).toBeDefined()
      expect(product.features).toBeDefined()
      expect(Array.isArray(product.features)).toBe(true)
      expect(product.applications).toBeDefined()
      expect(Array.isArray(product.applications)).toBe(true)
    })
  })

  it('material products have advanced-materials category', async () => {
    const products = await generateBiomaterialsProducts()
    
    const materialProducts = products.filter(p => p.id.startsWith('material-'))
    materialProducts.forEach(product => {
      expect(product.category).toBe('advanced-materials')
    })
  })

  it('application products have clinical-applications category', async () => {
    const products = await generateBiomaterialsProducts()
    
    const applicationProducts = products.filter(p => p.id.startsWith('application-'))
    applicationProducts.forEach(product => {
      expect(product.category).toBe('clinical-applications')
    })
  })

  it('products have datasheetId', async () => {
    const products = await generateBiomaterialsProducts()
    
    products.forEach(product => {
      expect(product.datasheetId).toBeDefined()
      expect(typeof product.datasheetId).toBe('string')
    })
  })

  it('some products have caseStudyId', async () => {
    const products = await generateBiomaterialsProducts()
    
    const productsWithCaseStudy = products.filter(p => p.caseStudyId)
    expect(productsWithCaseStudy.length).toBeGreaterThan(0)
  })

  it('in-ear EEG product has images', async () => {
    const products = await generateBiomaterialsProducts()
    
    const inEarProduct = products.find(p => p.id === 'application-inear-eeg')
    if (inEarProduct) {
      expect(inEarProduct.images).toBeDefined()
      expect(Array.isArray(inEarProduct.images)).toBe(true)
      expect(inEarProduct.imageUrl).toBeDefined()
    }
  })

  it('product names are non-empty strings', async () => {
    const products = await generateBiomaterialsProducts()
    
    products.forEach(product => {
      expect(typeof product.name).toBe('string')
      expect(product.name.length).toBeGreaterThan(0)
    })
  })

  it('product features are arrays of strings', async () => {
    const products = await generateBiomaterialsProducts()
    
    products.forEach(product => {
      expect(Array.isArray(product.features)).toBe(true)
      product.features.forEach(feature => {
        expect(typeof feature).toBe('string')
      })
    })
  })
})
