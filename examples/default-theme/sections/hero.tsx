'use client'

import { useSettings, useLocale } from '@wajiha/theme-sdk'

export function HeroSection() {
  const settings = useSettings()
  const { t } = useLocale()

  const title = settings.get<string>('hero_title', 'Welcome to our platform')
  const subtitle = settings.get<string>('hero_subtitle', 'Build, deploy, and manage your APIs with ease')
  const heroImage = settings.get<string | null>('hero_image', null)

  return (
    <section className="mp-hero mp-gradient-hero">
      {heroImage && (
        <div
          className="mp-hero__bg"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
      )}
      <div className="mp-hero__content mp-animate-slide-up">
        <h1 className="mp-heading-xl mp-hero__title mp-gradient-text">
          {title}
        </h1>
        <p className="mp-hero__subtitle">
          {subtitle}
        </p>
        <div className="mp-hero__actions">
          <a href="/products" className="mp-btn mp-btn--primary mp-btn--lg">
            {t('hero.cta')}
          </a>
          <a href="/products" className="mp-btn mp-btn--secondary mp-btn--lg">
            {t('hero.explore')}
          </a>
        </div>
      </div>
    </section>
  )
}
