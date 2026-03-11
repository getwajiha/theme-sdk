'use client'

import { useProducts, useLocale, useSettings } from '@getwajiha/theme-sdk'

export function ProductGridSection() {
  const allProducts = useProducts()
  const { t } = useLocale()
  const settings = useSettings()
  const maxProducts = settings.get<number>('max_products', 6)

  const products = allProducts.slice(0, maxProducts)

  if (products.length === 0) {
    return (
      <section className="mp-section">
        <div className="mp-container mp-text-center">
          <p className="mp-text-muted">{t('products.noProducts')}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="mp-section">
      <div className="mp-container">
        <div className="mp-text-center mp-mb-lg">
          <h2 className="mp-heading-lg mp-animate-slide-up">
            {t('products.title')}
          </h2>
        </div>

        <div className="mp-grid mp-grid--3">
          {products.map((product, index) => (
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
      </div>
    </section>
  )
}
