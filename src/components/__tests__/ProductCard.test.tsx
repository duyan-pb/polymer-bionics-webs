/**
 * ProductCard Component Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard } from '../products/ProductCard'
import type { Product } from '../../lib/types'

describe('ProductCard', () => {
  const product: Product = {
    id: 'product-1',
    name: 'BioFlex Elastomer',
    tagline: 'Flexible and durable',
    description: 'Short description',
    technicalDescription: 'Technical description',
    category: 'implants',
    specifications: 'Specs',
    features: ['Feature A', 'Feature B', 'Feature C'],
    applications: ['App A'],
    imageUrl: '/images/product.jpg',
    datasheetId: 'datasheet-1',
    caseStudyId: 'case-1',
  }

  it('renders product details', () => {
    render(
      <ProductCard
        product={product}
        featurePreviewCount={2}
        onSelect={vi.fn()}
        onZoomImage={vi.fn()}
        onBuy={vi.fn()}
        onContact={vi.fn()}
        onDatasheet={vi.fn()}
        onCaseStudy={vi.fn()}
      />
    )

    expect(screen.getByText('BioFlex Elastomer')).toBeTruthy()
    expect(screen.getByText('Flexible and durable')).toBeTruthy()
    expect(screen.getByText('implants')).toBeTruthy()
    expect(screen.getByText('Feature A')).toBeTruthy()
    expect(screen.getByText('Feature B')).toBeTruthy()
  })

  it('calls onSelect when card is clicked', async () => {
    const handleSelect = vi.fn()
    render(
      <ProductCard
        product={product}
        featurePreviewCount={2}
        onSelect={handleSelect}
        onZoomImage={vi.fn()}
        onBuy={vi.fn()}
        onContact={vi.fn()}
        onDatasheet={vi.fn()}
        onCaseStudy={vi.fn()}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: `View details for ${product.name}` }))

    expect(handleSelect).toHaveBeenCalledWith(product)
  })

  it('calls onZoomImage with imageUrl and deduplicated gallery when image is clicked', async () => {
    const handleSelect = vi.fn()
    const handleZoom = vi.fn()

    const productWithImages: Product = {
      ...product,
      images: ['/images/product.jpg', '/images/extra.jpg'],
    }

    render(
      <ProductCard
        product={productWithImages}
        featurePreviewCount={2}
        onSelect={handleSelect}
        onZoomImage={handleZoom}
        onBuy={vi.fn()}
        onContact={vi.fn()}
        onDatasheet={vi.fn()}
        onCaseStudy={vi.fn()}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: `Enlarge image of ${product.name}` }))

    // Should pass the imageUrl and a deduplicated gallery
    expect(handleZoom).toHaveBeenCalledWith(
      productWithImages.imageUrl,
      expect.arrayContaining(['/images/product.jpg', '/images/extra.jpg'])
    )
    // Gallery should NOT have duplicates (imageUrl is already in images)
    const gallery = handleZoom.mock.calls[0][1] as string[]
    const unique = [...new Set(gallery)]
    expect(gallery).toEqual(unique)

    expect(handleSelect).not.toHaveBeenCalled()
  })

  it('calls onDatasheet and onCaseStudy actions', async () => {
    const handleDatasheet = vi.fn()
    const handleCaseStudy = vi.fn()

    render(
      <ProductCard
        product={product}
        featurePreviewCount={2}
        onSelect={vi.fn()}
        onZoomImage={vi.fn()}
        onBuy={vi.fn()}
        onContact={vi.fn()}
        onDatasheet={handleDatasheet}
        onCaseStudy={handleCaseStudy}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: /datasheet/i }))
    await userEvent.click(screen.getByRole('button', { name: /case study/i }))

    expect(handleDatasheet).toHaveBeenCalled()
    expect(handleCaseStudy).toHaveBeenCalled()
  })
})
