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

  it('generates FlexElec products', async () => {
    const products = await generateBiomaterialsProducts()
    
    const flexElecProducts = products.filter(p => p.id.startsWith('flexelec-'))
    expect(flexElecProducts.length).toBeGreaterThan(0)
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

  it('FlexElec products have electrodes category', async () => {
    const products = await generateBiomaterialsProducts()
    
    const flexElecProducts = products.filter(p => p.id.startsWith('flexelec-'))
    flexElecProducts.forEach(product => {
      expect(product.category).toBe('electrodes')
    })
  })

  it('includes FlexElec Foam Electrode', async () => {
    const products = await generateBiomaterialsProducts()
    
    const foamProduct = products.find(p => p.id === 'flexelec-foam')
    expect(foamProduct).toBeDefined()
    expect(foamProduct?.name).toBe('FlexElec Foam Electrode')
  })

  it('includes FlexElec Sheet Electrode', async () => {
    const products = await generateBiomaterialsProducts()
    
    const sheetProduct = products.find(p => p.id === 'flexelec-sheet')
    expect(sheetProduct).toBeDefined()
    expect(sheetProduct?.name).toBe('FlexElec Sheet Electrode')
  })

  it('includes FlexElec Probe Electrode', async () => {
    const products = await generateBiomaterialsProducts()
    
    const probeProduct = products.find(p => p.id === 'flexelec-probe')
    expect(probeProduct).toBeDefined()
    expect(probeProduct?.name).toBe('FlexElec Probe Electrode')
  })

  it('includes FlexElec Cuff', async () => {
    const products = await generateBiomaterialsProducts()
    
    const cuffProduct = products.find(p => p.id === 'flexelec-cuff')
    expect(cuffProduct).toBeDefined()
    expect(cuffProduct?.name).toBe('FlexElec Cuff')
  })

  it('includes FlexElec MEA', async () => {
    const products = await generateBiomaterialsProducts()
    
    const meaProduct = products.find(p => p.id === 'flexelec-mea')
    expect(meaProduct).toBeDefined()
    expect(meaProduct?.name).toBe('FlexElec MEA')
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
