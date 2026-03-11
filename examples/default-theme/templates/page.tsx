'use client'

import { useCurrentPage, useLocale } from '@wajiha/theme-sdk'
import { RichText } from '@wajiha/theme-sdk/components'
import type { DataRequirements } from '@wajiha/theme-sdk'

export const dataRequirements: DataRequirements = {}

export default function PageTemplate() {
  const page = useCurrentPage()
  const { t } = useLocale()

  return (
    <section className="mp-section">
      <div className="mp-container" style={{ maxWidth: '48rem' }}>
        <nav className="mp-breadcrumb" aria-label="Breadcrumb">
          <a href="/" className="mp-breadcrumb__link">
            {t('nav.home')}
          </a>
          <span className="mp-breadcrumb__sep" aria-hidden="true">/</span>
          <span className="mp-breadcrumb__current">
            {page.meta.title}
          </span>
        </nav>

        <h1 className="mp-heading-lg mp-animate-slide-up" style={{ marginBottom: '2rem' }}>
          {page.meta.title}
        </h1>

        {page.content ? (
          <div className="mp-animate-fade-in mp-delay-1">
            <RichText content={page.content} className="mp-rich-text" />
          </div>
        ) : (
          <p className="mp-text-muted">{t('page.noContent')}</p>
        )}
      </div>
    </section>
  )
}
