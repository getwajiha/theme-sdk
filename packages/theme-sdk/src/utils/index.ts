import { clsx, type ClassValue } from 'clsx'

/**
 * cn - Class name merger
 *
 * Combines clsx for conditional classes with deduplication.
 * Themes can use their own Tailwind setup, so we don't include tailwind-merge.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

/**
 * Format a date string for display.
 */
export function formatDate(
  dateStr: string | Date,
  locale: string = 'en',
  options?: Intl.DateTimeFormatOptions
): string {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }
  return new Intl.DateTimeFormat(locale, defaultOptions).format(date)
}

/**
 * Format a number as currency.
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Get a translated value from a multilingual JSON field.
 *
 * Handles both string and object values:
 * - If value is a string, returns it directly
 * - If value is an object, returns the value for the requested locale
 * - Falls back to the fallback locale, then to the first available value
 */
export function getTranslation(
  value: unknown,
  locale: string,
  fallbackLocale: string = 'en'
): string {
  if (typeof value === 'string') {
    return value
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const obj = value as Record<string, string>
    if (obj[locale]) return obj[locale]
    if (obj[fallbackLocale]) return obj[fallbackLocale]
    const firstKey = Object.keys(obj)[0]
    if (firstKey) return obj[firstKey]
  }

  return ''
}

// Re-export clsx for convenience
export { clsx, type ClassValue }
