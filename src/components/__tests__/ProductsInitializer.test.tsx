/**
 * ProductsInitializer Component Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { ProductsInitializer } from '../ProductsInitializer'

// Mock useKV hook
const mockSetProducts = vi.fn()
vi.mock('@github/spark/hooks', () => ({
  useKV: vi.fn(() => [[], mockSetProducts]),
}))

// Mock seed-data
vi.mock('@/lib/seed-data', () => ({
  generateBiomaterialsProducts: vi.fn().mockResolvedValue([
    {
      id: 'product-1',
      name: 'Test Product',
      tagline: 'Test tagline',
      description: 'Test description',
      technicalDescription: 'Tech description',
      category: 'test',
      specifications: 'Specs',
      features: ['Feature 1'],
      applications: ['App 1'],
      regulatoryStatus: 'Approved',
    },
  ]),
}))

describe('ProductsInitializer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders null (no visible output)', () => {
      const { container } = render(<ProductsInitializer />)
      
      expect(container.firstChild).toBeNull()
    })
  })

  describe('initialization', () => {
    it('generates products when products array is empty', async () => {
      const { generateBiomaterialsProducts } = await import('@/lib/seed-data')
      
      render(<ProductsInitializer />)
      
      await waitFor(() => {
        expect(generateBiomaterialsProducts).toHaveBeenCalled()
      })
    })

    it('sets products after generation', async () => {
      render(<ProductsInitializer />)
      
      await waitFor(() => {
        expect(mockSetProducts).toHaveBeenCalledWith(expect.arrayContaining([
          expect.objectContaining({
            id: 'product-1',
            name: 'Test Product',
          }),
        ]))
      })
    })
  })

  describe('with existing products', () => {
    it('does not regenerate when products exist', async () => {
      const { useKV } = await import('@github/spark/hooks')
      vi.mocked(useKV).mockReturnValue([[{ id: 'existing' }], mockSetProducts])
      
      const { generateBiomaterialsProducts } = await import('@/lib/seed-data')
      
      render(<ProductsInitializer />)
      
      // Wait a bit to ensure no regeneration happens
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Should not call generate because products exist
      expect(generateBiomaterialsProducts).not.toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    it('handles generation errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const { generateBiomaterialsProducts } = await import('@/lib/seed-data')
      vi.mocked(generateBiomaterialsProducts).mockRejectedValueOnce(new Error('Generation failed'))
      
      const { useKV } = await import('@github/spark/hooks')
      vi.mocked(useKV).mockReturnValue([[], mockSetProducts])
      
      // Should not throw
      render(<ProductsInitializer />)
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('[ProductsInitializer] Failed to generate products:', expect.any(Error))
      })
      
      consoleSpy.mockRestore()
    })
  })
})
