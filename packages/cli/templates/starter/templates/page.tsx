/**
 * Generic Page Template
 *
 * Renders a content page with an optional HTML body.
 * Demonstrates:
 *   - useCurrentPage()  Accessing page metadata (title, slug, content)
 *   - useLocale()       i18n translation helper
 *
 * The page content comes from the platform as an HTML string stored
 * in page.content. This template renders it using dangerouslySetInnerHTML
 * which is safe because the content is sanitized server-side.
 */

import React from 'react'
import {
  useCurrentPage,
  useLocale,
  type TemplateProps,
} from '@getwajiha/theme-sdk'

export default function PageTemplate({ data }: TemplateProps) {
  const page = useCurrentPage()
  const { t } = useLocale()

  return (
    <div className="theme-page theme-page--content">
      <div className="theme-page__inner">
        {/* Page Title */}
        <h1 className="theme-page__title">{page.meta.title}</h1>

        {page.meta.description && (
          <p className="theme-page__description">{page.meta.description}</p>
        )}

        {/* Page Body */}
        {page.content ? (
          <div
            className="theme-page__body"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        ) : (
          <p className="theme-page__empty">
            This page has no content yet.
          </p>
        )}
      </div>
    </div>
  )
}
