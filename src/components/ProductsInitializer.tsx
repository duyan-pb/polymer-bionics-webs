import { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { generateBiomaterialsProducts } from '@/lib/seed-data'
import type { Product } from '@/lib/types'

export function ProductsInitializer() {
  const [products, setProducts] = useKV<Product[]>('products', [])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const initProducts = async () => {
      if ((products?.length || 0) === 0 && !isInitialized && !isGenerating) {
        setIsGenerating(true)
        try {
          const generatedProducts = await generateBiomaterialsProducts()
          setProducts(generatedProducts)
          setIsInitialized(true)
        } catch (error) {
          console.error('Failed to generate products:', error)
        } finally {
          setIsGenerating(false)
        }
      }
    }

    initProducts()
  }, [products?.length, isInitialized, isGenerating, setProducts])

  return null
}
