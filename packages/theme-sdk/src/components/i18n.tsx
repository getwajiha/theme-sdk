'use client'

import { createElement, type ReactNode } from 'react'
import { useLocale } from '../hooks/use-locale'
import { getTranslation } from '../utils'

// ── TranslatedText ──────────────────────────────────────────────────

export interface TranslatedTextProps {
  /** Multilingual value: string or { en: "...", ar: "..." } */
  value: unknown
  /** Override locale (defaults to current locale from context) */
  locale?: string
  /** Fallback locale */
  fallbackLocale?: string
  /** HTML tag to render */
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'strong' | 'em' | 'label'
  className?: string
}

export function TranslatedText({
  value,
  locale: overrideLocale,
  fallbackLocale = 'en',
  as = 'span',
  className = '',
}: TranslatedTextProps) {
  const { current } = useLocale()
  const locale = overrideLocale ?? current
  const text = getTranslation(value, locale, fallbackLocale)

  return createElement(as, { className }, text)
}

// ── LanguageSwitcher ────────────────────────────────────────────────

export interface LanguageSwitcherProps {
  className?: string
  itemClassName?: string
  activeClassName?: string
  renderItem?: (locale: string, isActive: boolean) => ReactNode
}

export function LanguageSwitcher({
  className = '',
  itemClassName = '',
  activeClassName = '',
  renderItem,
}: LanguageSwitcherProps) {
  const { current, available } = useLocale()

  return (
    <div className={className} role="navigation" aria-label="Language">
      {available.map((loc) => {
        const isActive = loc === current
        if (renderItem) {
          return <div key={loc}>{renderItem(loc, isActive)}</div>
        }
        return (
          <a
            key={loc}
            href={`/${loc}/`}
            className={`${itemClassName} ${isActive ? activeClassName : ''}`.trim()}
            lang={loc}
            aria-current={isActive ? 'true' : undefined}
          >
            {loc.toUpperCase()}
          </a>
        )
      })}
    </div>
  )
}

// ── RTLProvider ──────────────────────────────────────────────────────

export interface RTLProviderProps {
  children: ReactNode
  className?: string
}

/**
 * RTLProvider wraps children with the correct dir attribute based on locale.
 */
export function RTLProvider({ children, className = '' }: RTLProviderProps) {
  const { direction } = useLocale()

  return (
    <div dir={direction} className={className}>
      {children}
    </div>
  )
}
