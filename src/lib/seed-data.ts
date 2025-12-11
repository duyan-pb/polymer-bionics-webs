import type { Product } from './types'
import { materials, applications } from './materials-data'

export async function generateBiomaterialsProducts(): Promise<Product[]> {
  const products: Product[] = []
  
  materials.forEach((material, index) => {
    products.push({
      id: `material-${material.id}`,
      name: material.name,
      tagline: material.description,
      description: material.description,
      technicalDescription: material.technicalDetails,
      category: 'advanced-materials',
      specifications: material.properties.join(', '),
      features: [...material.properties, ...material.keyAdvantages],
      applications: applications
        .filter(app => app.relevantMaterials.includes(material.name))
        .map(app => app.name),
      regulatoryStatus: 'ISO 10993 biocompatibility testing in progress. Designed for medical device applications with cytotoxicity and skin sensitization evaluation.',
      datasheetId: `datasheet-${material.id}`,
      caseStudyId: index % 2 === 0 ? `case-study-${material.id}` : undefined
    })
  })
  
  applications.forEach((application, index) => {
    products.push({
      id: `application-${application.id}`,
      name: application.name,
      tagline: application.description,
      description: application.description,
      technicalDescription: `${application.description} This solution leverages our proprietary flexible bioelectronic materials to deliver superior performance in clinical settings. The platform integrates ${application.relevantMaterials.join(', ')} to achieve optimal biocompatibility, signal quality, and long-term stability.`,
      category: 'clinical-applications',
      specifications: application.useCases.join(', '),
      features: application.benefits,
      applications: application.useCases,
      regulatoryStatus: 'Under development. Design controls and risk management processes aligned with ISO 13485. Contact our team for partnership opportunities.',
      datasheetId: `datasheet-${application.id}`,
      caseStudyId: index % 3 === 0 ? `case-study-${application.id}` : undefined
    })
  })
  
  return products
}
