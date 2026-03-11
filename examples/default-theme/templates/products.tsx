'use client'

import { useState, useMemo } from 'react'
import { useProducts, useLocale } from '@getwajiha/theme-sdk'
import type { DataRequirements } from '@getwajiha/theme-sdk'

export const dataRequirements: DataRequirements = {
  products: true,
}

export default function ProductsTemplate() {
  const products = useProducts()
  const { t } = useLocale()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return products
    const query = search.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
    )
  }, [products, search])

  return (
      <section className="mp-section">
        <div className="mp-container">
          <div className="mp-flex mp-flex--between" style={{ marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div className="mp-animate-slide-up">
              <h1 className="mp-heading-lg">{t('products.title')}</h1>
              <p className="mp-body mp-text-muted" style={{ marginTop: '0.5rem' }}>
                {t('products.subtitle', { count: String(products.length) })}
              </p>
            </div>

            <div className="mp-search mp-animate-slide-up mp-delay-1">
              <svg className="mp-search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="mp-search__input"
                placeholder={t('products.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="mp-text-center mp-animate-fade-in" style={{ paddingBlock: '4rem' }}>
              <p className="mp-body-lg mp-text-muted">
                {search ? t('products.noResults') : t('products.noProducts')}
              </p>
            </div>
          ) : (
            <div className="mp-grid mp-grid--3">
              {filtered.map((product, index) => (
                <a
                  key={product.id}
                  href={`/docs/${product.slug}`}
                  className={`mp-glass-card mp-product-card mp-animate-slide-up mp-delay-${Math.min(index + 1, 6)}`}
                >
                  <div className="mp-product-card__logo">
                    {product.logo ? (
                      <img src={product.logo} alt={product.name} />
                    ) : (
                      <span className="mp-product-card__logo-placeholder">
                        {product.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h3 className="mp-product-card__name">{product.name}</h3>
                  {product.description && (
                    <p className="mp-product-card__desc">{product.description}</p>
                  )}
                  <div className="mp-product-card__footer">
                    <span
                      className={`mp-badge ${
                        product.status === 'PUBLISHED'
                          ? 'mp-badge--success'
                          : 'mp-badge--muted'
                      }`}
                    >
                      {product.status}
                    </span>
                    <span className="mp-btn mp-btn--ghost mp-btn--sm">
                      {t('products.viewDocs')}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
  )
}
