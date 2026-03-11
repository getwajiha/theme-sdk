/**
 * Home Page Template (index)
 *
 * The landing page for the tenant's portal. Demonstrates:
 *   - useSettings()    Reading admin-configured hero text and toggles
 *   - useProducts()    Displaying the product catalog
 *   - useLocale()      Translating UI strings
 *   - useTenant()      Accessing tenant branding
 *
 * Sections:
 *   1. Hero - Large title and subtitle from theme settings
 *   2. Product Grid - Cards for each product from the catalog
 *   3. Features - Highlight cards showcasing platform capabilities
 */

import React from 'react'
import {
  useSettings,
  useProducts,
  useLocale,
  useTenant,
  type TemplateProps,
} from '@wajiha/theme-sdk'

// ── Hero Section ────────────────────────────────────────────────────

function HeroSection() {
  const settings = useSettings()
  const { t } = useLocale()

  // Read the hero title and subtitle from theme settings.
  // These values are configured by the tenant admin in the dashboard.
  const heroTitle = settings.get<string>('hero_title', t('hero.title'))
  const heroSubtitle = settings.get<string>('hero_subtitle', t('hero.subtitle'))
  const primaryColor = settings.get<string>('primary_color', '#2563eb')

  return (
    <section className="theme-hero">
      <div className="theme-hero__inner">
        <h1 className="theme-hero__title">{heroTitle}</h1>
        <p className="theme-hero__subtitle">{heroSubtitle}</p>
        <a
          href="/products"
          className="theme-hero__cta"
          style={{ backgroundColor: primaryColor }}
        >
          {t('products.explore')}
        </a>
      </div>
    </section>
  )
}

// ── Product Grid ────────────────────────────────────────────────────

function ProductGrid() {
  const products = useProducts()
  const settings = useSettings()
  const { t } = useLocale()

  const showFeatured = settings.get<boolean>('show_featured_products', true)
  const perRow = settings.get<number>('products_per_row', 3)

  if (!showFeatured || products.length === 0) {
    return null
  }

  return (
    <section className="theme-products">
      <div className="theme-products__inner">
        <h2 className="theme-products__title">{t('products.title')}</h2>

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
                  <div className="theme-product-card__icon-placeholder">
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

              <a
                href={`/products/${product.slug}`}
                className="theme-product-card__link"
              >
                {t('products.explore')}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Features Section ────────────────────────────────────────────────

function FeaturesSection() {
  const { t } = useLocale()
  const settings = useSettings()
  const primaryColor = settings.get<string>('primary_color', '#2563eb')

  // Static feature data -- in a real theme these could come from settings
  const features = [
    {
      title: 'API Documentation',
      description:
        'Interactive API docs with Try It functionality. Powered by OpenAPI specifications.',
    },
    {
      title: 'SDKs & Libraries',
      description:
        'Auto-generated client libraries in multiple languages. Get started in minutes.',
    },
    {
      title: 'Developer Community',
      description:
        'Join thousands of developers building on our platform. Forums, guides, and support.',
    },
  ]

  return (
    <section className="theme-features">
      <div className="theme-features__inner">
        <div className="theme-features__grid">
          {features.map((feature, index) => (
            <div key={index} className="theme-feature-card">
              <div
                className="theme-feature-card__accent"
                style={{ backgroundColor: primaryColor }}
              />
              <h3 className="theme-feature-card__title">{feature.title}</h3>
              <p className="theme-feature-card__description">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Page Component ──────────────────────────────────────────────────

export default function IndexPage({ data }: TemplateProps) {
  return (
    <div className="theme-page theme-page--index">
      <HeroSection />
      <ProductGrid />
      <FeaturesSection />
    </div>
  )
}
