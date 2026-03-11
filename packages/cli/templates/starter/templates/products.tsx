/**
 * Product Listing Template
 *
 * Displays all products in a grid layout.
 * Demonstrates:
 *   - useProducts()   Fetching the product catalog
 *   - useSettings()   Reading the products-per-row setting
 *   - useLocale()     Translating UI strings
 *   - useTenant()     Accessing tenant info for the page header
 */

import React from 'react'
import {
  useProducts,
  useSettings,
  useLocale,
  useTenant,
  type TemplateProps,
} from '@getwajiha/theme-sdk'

export default function ProductsTemplate({ data }: TemplateProps) {
  const products = useProducts()
  const settings = useSettings()
  const { t } = useLocale()
  const tenant = useTenant()

  const perRow = settings.get<number>('products_per_row', 3)
  const primaryColor = settings.get<string>('primary_color', '#2563eb')

  return (
    <div className="theme-page theme-page--products">
      <div className="theme-page__inner">
        {/* Page Header */}
        <div className="theme-page__header">
          <h1 className="theme-page__title">{t('products.title')}</h1>
          <p className="theme-page__description">
            {tenant.description || `Browse the products available from ${tenant.name}.`}
          </p>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div
            className="theme-products__grid"
            style={{
              gridTemplateColumns: `repeat(${perRow}, 1fr)`,
            }}
          >
            {products.map((product) => (
              <div key={product.id} className="theme-product-card">
                {/* Product logo or placeholder */}
                <div className="theme-product-card__icon">
                  {product.logo ? (
                    <img src={product.logo} alt={product.name} />
                  ) : (
                    <div
                      className="theme-product-card__icon-placeholder"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {product.name.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="theme-product-card__name">{product.name}</h3>

                {product.description && (
                  <p className="theme-product-card__description">
                    {product.description}
                  </p>
                )}

                {/* Status badge */}
                {product.status === 'published' && (
                  <span className="theme-product-card__badge">
                    {product.isPublic ? 'Public' : 'Private'}
                  </span>
                )}

                <a
                  href={`/products/${product.slug}`}
                  className="theme-product-card__link"
                  style={{ color: primaryColor }}
                >
                  {t('products.explore')}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="theme-products__empty">
            <p>No products available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
