'use client'

import { useLocale } from '@getwajiha/theme-sdk'

interface CTASectionProps {
  titleKey?: string
  descKey?: string
  ctaKey?: string
  ctaHref?: string
}

export function CTASection({
  titleKey = 'cta.title',
  descKey = 'cta.desc',
  ctaKey = 'cta.button',
  ctaHref = '/products',
}: CTASectionProps) {
  const { t } = useLocale()

  return (
    <section className="mp-section">
      <div className="mp-container">
        <div className="mp-cta mp-animate-slide-up">
          <h2 className="mp-heading-md mp-cta__title">
            {t(titleKey)}
          </h2>
          <p className="mp-cta__desc">
            {t(descKey)}
          </p>
          <a href={ctaHref} className="mp-btn mp-btn--primary mp-btn--lg">
            {t(ctaKey)}
          </a>
        </div>
      </div>
    </section>
  )
}
