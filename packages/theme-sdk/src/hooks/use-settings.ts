'use client'

import { useContext, useCallback } from 'react'
import { ThemeContext } from '../provider'

/**
 * useSettings
 *
 * Returns theme settings values (from wajiha.theme.json schema).
 * Settings are configured by the tenant admin in the admin panel.
 */
export function useSettings(): Record<string, unknown> & {
  /** Get a typed setting value with fallback */
  get: <T>(key: string, fallback: T) => T
} {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useSettings must be used within a ThemeProvider')
  }

  const get = useCallback(
    <T>(key: string, fallback: T): T => {
      const value = context.settings[key]
      return (value !== undefined ? value : fallback) as T
    },
    [context.settings]
  )

  return {
    ...context.settings,
    get,
  }
}
