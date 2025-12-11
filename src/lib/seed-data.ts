import type { Product } from './types'

export async function generateBiomaterialsProducts(): Promise<Product[]> {
  const promptText = `You are a materials scientist creating a product catalog for PolymerBionics, a biotech company specializing in flexible bioelectronics and polymer-based medical devices.

Generate exactly 8 high-quality biomaterial products that would be realistic for this company. The products should cover different categories of biomaterials used in medical devices.

Categories to include:
- Bioadhesives (2 products)
- Conductive Polymers (2 products)
- Biocompatible Elastomers (2 products)
- Functional Coatings (2 products)

For each product, provide:
- A technical product name with designation (e.g., "PolymerBionics PB-100")
- A concise tagline (10-15 words)
- A brief description (20-30 words)
- A detailed technical description (60-80 words) covering polymer chemistry, performance characteristics
- 5-7 key features/benefits
- 4-6 intended applications
- Regulatory/safety status (e.g., ISO 10993 biocompatibility testing, cytotoxicity results, compliance status)

Make the products scientifically accurate and appropriate for a medical device company. Use real polymer chemistry concepts.

Return the result as a valid JSON object with a single property called "products" that contains the product list. Use this exact format:
{
  "products": [
    {
      "name": "Product Name PB-XXX",
      "tagline": "Brief tagline here",
      "description": "Short description",
      "technicalDescription": "Detailed technical description covering polymer chemistry and performance",
      "category": "bioadhesives | conductive-polymers | elastomers | coatings",
      "features": ["Feature 1", "Feature 2", ...],
      "applications": ["Application 1", "Application 2", ...],
      "regulatoryStatus": "Regulatory status description"
    }
  ]
}`

  const response = await window.spark.llm(promptText, 'gpt-4o', true)
  const data = JSON.parse(response)
  
  return data.products.map((product: any, index: number) => ({
    id: `product-${index + 1}`,
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    technicalDescription: product.technicalDescription,
    category: product.category,
    specifications: '',
    features: product.features,
    applications: product.applications,
    regulatoryStatus: product.regulatoryStatus,
    datasheetId: `datasheet-${index + 1}`,
    caseStudyId: index % 2 === 0 ? `case-study-${Math.floor(index / 2) + 1}` : undefined
  }))
}
