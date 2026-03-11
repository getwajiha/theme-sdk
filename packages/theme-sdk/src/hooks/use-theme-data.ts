'use client'

import { useContext } from 'react'
import { ThemeContext } from '../provider'
import type { ThemePageData } from '../types'

/**
 * useThemeData
 *
 * Returns the full page data object for the current page.
 * Must be used within a ThemeProvider.
 */
export function useThemeData(): ThemePageData {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeData must be used within a ThemeProvider')
  }
  return context
}
