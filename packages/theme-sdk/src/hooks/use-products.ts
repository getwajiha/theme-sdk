'use client'

import { useContext } from 'react'
import { ThemeContext } from '../provider'
import type { Product } from '../types'

/**
 * useProducts
 *
 * Returns the product catalog for the current page.
 * Only available if the template declares products in its dataRequirements.
 */
export function useProducts(): Product[] {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useProducts must be used within a ThemeProvider')
  }
  return context.products ?? []
}
