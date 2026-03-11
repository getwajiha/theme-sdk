/**
 * Error Page Template
 *
 * Displayed when a page is not found (404) or a server error occurs.
 * Demonstrates:
 *   - useThemeData()  Accessing the full page data including error info
 *   - useLocale()     Translating error messages
 *   - useSettings()   Styling with the primary color
 *
 * The error object contains:
 *   - code: HTTP status code (404, 500, etc.)
 *   - message: Short error title
 *   - description: Longer explanation (optional)
 */

import React from 'react'
import {
  useThemeData,
  useLocale,
  useSettings,
  type TemplateProps,
} from '@getwajiha/theme-sdk'

export default function ErrorTemplate({ data }: TemplateProps) {
  const { error } = useThemeData()
  const { t } = useLocale()
  const settings = useSettings()

  const primaryColor = settings.get<string>('primary_color', '#2563eb')

  // Fallback values if the error object is not provided
  const errorCode = error?.code ?? 500
  const errorMessage = error?.message ?? t('error.title')
  const errorDescription = error?.description

  return (
    <div className="theme-page theme-page--error">
      <div className="theme-error">
        {/* Error Code */}
        <span
          className="theme-error__code"
          style={{ color: primaryColor }}
        >
          {errorCode}
        </span>

        {/* Error Message */}
        <h1 className="theme-error__title">{errorMessage}</h1>

        {/* Description */}
        {errorDescription && (
          <p className="theme-error__description">{errorDescription}</p>
        )}

        {/* Back to Home */}
        <a
          href="/"
          className="theme-error__back"
          style={{ backgroundColor: primaryColor }}
        >
          {t('error.back')}
        </a>
      </div>
    </div>
  )
}
