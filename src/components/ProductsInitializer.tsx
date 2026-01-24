/**
 * Products Initializer Component
 * 
 * Seeds the KV store with product data on first load.
 * Generates products from materials and applications data.
 * 
 * @module components/ProductsInitializer
 */

import { useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { generateBiomaterialsProducts } from '@/lib/seed-data'
import type { Product } from '@/lib/types'

/**
 * Initializes products in the KV store.
 * 
 * Automatically generates products from materials and applications
 * data when the KV store is empty. Renders nothing to the DOM.
 * 
 * @returns null - This is a headless component
 */
export function ProductsInitializer() {
  const [products, setProducts] = useKV<Product[]>('products', [])
  const hasInitialized = useRef(false)

  useEffect(() => {
    console.log('[ProductsInitializer] Current products:', products?.length || 0, 'hasInitialized:', hasInitialized.current)
    
    // Only run once, and only if products are empty
    if (hasInitialized.current) {
      return
    }
    
    if ((products?.length || 0) === 0) {
      hasInitialized.current = true
      console.log('[ProductsInitializer] Generating products...')
      
      generateBiomaterialsProducts()
        .then(generatedProducts => {
          console.log('[ProductsInitializer] Generated', generatedProducts.length, 'products')
          setProducts(generatedProducts)
        })
        .catch(error => {
          console.error('[ProductsInitializer] Failed to generate products:', error)
          hasInitialized.current = false // Allow retry on error
        })
    } else {
      hasInitialized.current = true
    }
  }, [products, setProducts])

  return null
}
