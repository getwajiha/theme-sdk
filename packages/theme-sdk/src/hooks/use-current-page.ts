'use client'

import { useContext } from 'react'
import { ThemeContext } from '../provider'
import type { PageInfo } from '../types'

/**
 * useCurrentPage
 *
 * Returns metadata about the current page (type, slug, meta, content).
 */
export function useCurrentPage(): PageInfo {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useCurrentPage must be used within a ThemeProvider')
  }
  return context.page
}
