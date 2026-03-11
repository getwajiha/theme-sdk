import type { PageMeta } from '../types'

// ── SEOHead ─────────────────────────────────────────────────────────

export interface SEOHeadProps {
  meta: PageMeta
  siteName?: string
  locale?: string
  url?: string
}

/**
 * SEOHead renders meta tags for SEO.
 * Should be rendered in the <head> section of the page.
 */
export function SEOHead({ meta, siteName, locale, url }: SEOHeadProps) {
  return (
    <>
      <title>{meta.title}{siteName ? ` | ${siteName}` : ''}</title>
      <meta name="description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      {meta.ogImage && <meta property="og:image" content={meta.ogImage} />}
      {siteName && <meta property="og:site_name" content={siteName} />}
      {locale && <meta property="og:locale" content={locale} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="website" />
    </>
  )
}

// ── StructuredData ──────────────────────────────────────────────────

export interface StructuredDataProps {
  data: Record<string, unknown>
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
