import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { generateBiomaterialsProducts } from '@/lib/seed-data'
import type { Product } from '@/lib/types'

export function ProductsInitializer() {
  const [products, setProducts] = useKV<Product[]>('products', [])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if ((products?.length || 0) === 0 && !isInitialized && !isGenerating) {
      setIsGenerating(true)
      try {
        // generateBiomaterialsProducts is now synchronous for better performance
        const generatedProducts = generateBiomaterialsProducts()
        setProducts(generatedProducts)
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to generate products:', error)
      } finally {
        setIsGenerating(false)
      }
    }
    // Only run when products length changes or on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products?.length])

  return null
}
