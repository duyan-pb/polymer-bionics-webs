import type { Product } from './types'
import { materials, applications } from './materials-data'

import pxl1 from '@/assets/images/PXL_20251216_115711682.PORTRAIT.jpg'
import pxl2 from '@/assets/images/PXL_20251216_115728419.PORTRAIT.ORIGINAL.jpg'
import pxl5 from '@/assets/images/PXL_20251216_115810661.jpg'
import pxl7 from '@/assets/images/PXL_20251216_115836016.jpg'
import pxl9 from '@/assets/images/PXL_20251216_115854143.jpg'
import pxl11 from '@/assets/images/PXL_20251216_115937300.jpg'
import pxl13 from '@/assets/images/PXL_20251216_115958662.jpg'
import pxl15 from '@/assets/images/PXL_20251216_120056575.jpg'
import pxl17 from '@/assets/images/PXL_20251216_120112987.jpg'

const inEarDeviceImages = [
  pxl1, pxl2, pxl5, pxl7, pxl9, pxl11, pxl13, pxl15, pxl17
]

export async function generateBiomaterialsProducts(): Promise<Product[]> {
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
      product.imageUrl = pxl1
    }
    
    products.push(product)
  })
  
  return products
}
