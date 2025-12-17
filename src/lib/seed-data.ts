import type { Product } from './types'
import { materials, applications } from './materials-data'

import pxl1 from '@/assets/images/PXL_20251216_115711682.PORTRAIT.jpg'
import pxl2 from '@/assets/images/PXL_20251216_115728419.PORTRAIT.ORIGINAL.jpg'
import pxl3 from '@/assets/images/PXL_20251216_115737523.PORTRAIT.jpg'
import pxl4 from '@/assets/images/PXL_20251216_115759988.jpg'
import pxl5 from '@/assets/images/PXL_20251216_115810661.jpg'
import pxl6 from '@/assets/images/PXL_20251216_115825489.jpg'
import pxl7 from '@/assets/images/PXL_20251216_115836016.jpg'
import pxl8 from '@/assets/images/PXL_20251216_115843208.jpg'
import pxl9 from '@/assets/images/PXL_20251216_115854143.jpg'
import pxl10 from '@/assets/images/PXL_20251216_115905670.jpg'
import pxl11 from '@/assets/images/PXL_20251216_115937300.jpg'
import pxl12 from '@/assets/images/PXL_20251216_115945238.jpg'
import pxl13 from '@/assets/images/PXL_20251216_115958662.jpg'
import pxl14 from '@/assets/images/PXL_20251216_120055171.jpg'
import pxl15 from '@/assets/images/PXL_20251216_120056575.jpg'
import pxl16 from '@/assets/images/PXL_20251216_120105654.jpg'
import pxl17 from '@/assets/images/PXL_20251216_120112987.jpg'
import pxl18 from '@/assets/images/PXL_20251216_120119941.jpg'

const inEarDeviceImages = [
  pxl1, pxl2, pxl3, pxl4, pxl5, pxl6, pxl7, pxl8, pxl9,
  pxl10, pxl11, pxl12, pxl13, pxl14, pxl15, pxl16, pxl17, pxl18
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
