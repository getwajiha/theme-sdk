'use client'

import { useContext } from 'react'
import { ThemeContext } from '../provider'
import type { Navigation } from '../types'

/**
 * useNavigation
 *
 * Returns the menu/navigation items for the current tenant.
 */
export function useNavigation(): Navigation {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useNavigation must be used within a ThemeProvider')
  }
  return context.navigation
}
