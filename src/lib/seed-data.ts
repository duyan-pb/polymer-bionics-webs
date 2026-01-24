/**
 * Seed Data Generator
 * 
 * Generates initial product data from materials and applications.
 * Used to populate the KV store on first load.
 * 
 * @module lib/seed-data
 */

// =============================================================================
// TODO: REPLACE ALL PLACEHOLDER PRODUCT DATA
// =============================================================================
// Each product needs real content for:
// - tagline: Short marketing tagline (10-15 words)
// - description: Product overview paragraph (50-100 words)
// - technicalDescription: Detailed technical specs
// - specifications: Key specifications list
// - features: Array of 3-5 key features with real details
// - applications: Array of 2-4 real-world applications
// - regulatoryStatus: Current certification status (CE, FDA, etc.)
// =============================================================================

import type { Product } from './types'
import { materials, applications } from './materials-data'

// Optimized WebP images (98% smaller than originals)
import pxl1 from '@/assets/images/optimized/PXL_20251216_115711682.PORTRAIT.webp'
import pxl2 from '@/assets/images/optimized/PXL_20251216_115728419.PORTRAIT.ORIGINAL.webp'
import pxl5 from '@/assets/images/optimized/PXL_20251216_115810661.webp'
import pxl9 from '@/assets/images/optimized/PXL_20251216_115854143.webp'
import pxl10 from '@/assets/images/optimized/PXL_20251216_115905670.webp'
import pxl11 from '@/assets/images/optimized/PXL_20251216_115937300.webp'
import pxl13 from '@/assets/images/optimized/PXL_20251216_115958662.webp'
import pxl15 from '@/assets/images/optimized/PXL_20251216_120056575.webp'

/** Product images for the in-ear EEG device */
const inEarDeviceImages = [
  pxl1, pxl2, pxl5, pxl9, pxl10, pxl11, pxl13, pxl15
]

/**
 * Generates products from materials and applications data.
 * 
 * Creates two types of products:
 * 1. Material-based products (advanced-materials category)
 * 2. Application-based products (clinical-applications category)
 * 
 * @returns Promise resolving to array of Product objects
 */
export async function generateBiomaterialsProducts(): Promise<Product[]> {
  const products: Product[] = []
  
  materials.forEach((material, index) => {
    products.push({
      id: `material-${material.id}`,
      name: material.name,
      tagline: 'Tagline placeholder', // TODO: Add real marketing tagline
      description: 'Description placeholder', // TODO: Add product description
      technicalDescription: 'Technical description placeholder', // TODO: Add technical details
      category: 'advanced-materials',
      specifications: 'Specifications placeholder', // TODO: Add real specifications
      features: ['Feature placeholder', 'Feature placeholder', 'Feature placeholder'], // TODO: Add real features
      applications: ['Application placeholder', 'Application placeholder'], // TODO: Add real applications
      regulatoryStatus: 'Regulatory status placeholder', // TODO: Add regulatory status (CE/FDA)
      datasheetId: `datasheet-${material.id}`,
      caseStudyId: index % 2 === 0 ? `case-study-${material.id}` : undefined
    })
  })
  
  applications.forEach((application, index) => {
    const product: Product = {
      id: `application-${application.id}`,
      name: application.name,
      tagline: 'Tagline placeholder', // TODO: Add real marketing tagline
      description: 'Description placeholder', // TODO: Add product description
      technicalDescription: 'Technical description placeholder', // TODO: Add technical details
      category: 'clinical-applications',
      specifications: 'Specifications placeholder', // TODO: Add real specifications
      features: ['Feature placeholder', 'Feature placeholder', 'Feature placeholder'], // TODO: Add real features
      applications: ['Application placeholder', 'Application placeholder'], // TODO: Add real applications
      regulatoryStatus: 'Regulatory status placeholder', // TODO: Add regulatory status (CE/FDA)
      datasheetId: `datasheet-${application.id}`,
      caseStudyId: index % 3 === 0 ? `case-study-${application.id}` : undefined
    }
    
    if (application.id === 'inear-eeg') {
      product.images = inEarDeviceImages
      product.imageUrl = pxl9  // PXL_20251216_115854143.jpg
    }
    
    products.push(product)
  })
  
  return products
}

/**
 * Pre-generated products from materials and applications data.
 * This is a static array that doesn't require async/await.
 * Used directly in App.tsx to avoid localStorage caching issues.
 */
function createInitialProducts(): Product[] {
  const products: Product[] = []
  
  materials.forEach((material, index) => {
    products.push({
      id: `material-${material.id}`,
      name: material.name,
      tagline: 'Tagline placeholder',
      description: 'Description placeholder',
      technicalDescription: 'Technical description placeholder',
      category: 'advanced-materials',
      specifications: 'Specifications placeholder',
      features: ['Feature placeholder', 'Feature placeholder', 'Feature placeholder'],
      applications: ['Application placeholder', 'Application placeholder'],
      regulatoryStatus: 'Regulatory status placeholder',
      datasheetId: `datasheet-${material.id}`,
      caseStudyId: index % 2 === 0 ? `case-study-${material.id}` : undefined
    })
  })
  
  applications.forEach((application, index) => {
    const product: Product = {
      id: `application-${application.id}`,
      name: application.name,
      tagline: 'Tagline placeholder',
      description: 'Description placeholder',
      technicalDescription: 'Technical description placeholder',
      category: 'clinical-applications',
      specifications: 'Specifications placeholder',
      features: ['Feature placeholder', 'Feature placeholder', 'Feature placeholder'],
      applications: ['Application placeholder', 'Application placeholder'],
      regulatoryStatus: 'Regulatory status placeholder',
      datasheetId: `datasheet-${application.id}`,
      caseStudyId: index % 3 === 0 ? `case-study-${application.id}` : undefined
    }
    
    if (application.id === 'inear-eeg') {
      product.images = inEarDeviceImages
      product.imageUrl = pxl9
    }
    
    products.push(product)
  })
  
  return products
}

export const initialProducts: Product[] = createInitialProducts()
