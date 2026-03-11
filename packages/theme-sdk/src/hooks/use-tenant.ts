'use client'

import { useContext } from 'react'
import { ThemeContext } from '../provider'
import type { TenantInfo } from '../types'

/**
 * useTenant
 *
 * Returns tenant information (name, domain, branding).
 */
export function useTenant(): TenantInfo {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTenant must be used within a ThemeProvider')
  }
  return context.tenant
}
