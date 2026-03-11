'use client'

import { useContext, useCallback } from 'react'
import { ThemeContext } from '../provider'
import type { LocaleInfo } from '../types'

export interface UseLocaleReturn extends LocaleInfo {
  /** Translate a key using the theme's locale messages */
  t: (key: string, params?: Record<string, string>) => string
  /** Check if current locale is RTL */
  isRTL: boolean
}

/**
 * useLocale
 *
 * Returns locale information and a translation helper function.
 */
export function useLocale(): UseLocaleReturn {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useLocale must be used within a ThemeProvider')
  }

  const { locale } = context

  const t = useCallback(
    (key: string, params?: Record<string, string>): string => {
      let message = locale.messages[key] ?? key
      if (params) {
        for (const [param, value] of Object.entries(params)) {
          message = message.replace(`{${param}}`, value)
        }
      }
      return message
    },
    [locale.messages]
  )

  return {
    ...locale,
    t,
    isRTL: locale.direction === 'rtl',
  }
}
