'use client'

import { useContext } from 'react'
import { ThemeContext } from '../provider'
import type { Product } from '../types'

/**
 * useProduct
 *
 * Returns the single-product detail for product-detail templates
 * (rendered when pageType === 'product'), or null when no product is in
 * scope. The platform sets `data.product` for /products/<slug> routes.
 */
export function useProduct(): Product | null {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useProduct must be used within a ThemeProvider')
  }
  return context.product ?? null
}
