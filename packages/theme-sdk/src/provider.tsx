'use client'

import { createContext, type ReactNode } from 'react'
import type { ThemePageData } from './types'

/**
 * ThemeContext
 *
 * Provides the injected page data to all theme components via React Context.
 * The theme engine wraps the SSR render in ThemeProvider with pre-fetched data,
 * and hydration preserves the context on the client.
 */
export const ThemeContext = createContext<ThemePageData | null>(null)

export interface ThemeProviderProps {
  data: ThemePageData
  children: ReactNode
}

export function ThemeProvider({ data, children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={data}>
      {children}
    </ThemeContext.Provider>
  )
}
