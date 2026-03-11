'use client'

import { useLocale } from '@wajiha/theme-sdk'

interface Feature {
  icon: React.ReactNode
  titleKey: string
  descKey: string
}

export function FeaturesSection() {
  const { t } = useLocale()

  const features: Feature[] = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      titleKey: 'features.apiDocs',
      descKey: 'features.apiDocsDesc',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      titleKey: 'features.sdkGen',
      descKey: 'features.sdkGenDesc',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      titleKey: 'features.analytics',
      descKey: 'features.analyticsDesc',
    },
  ]

  return (
    <section className="mp-section mp-gradient-section">
      <div className="mp-container">
        <div className="mp-text-center mp-mb-lg">
          <h2 className="mp-heading-lg mp-animate-slide-up">
            {t('features.title')}
          </h2>
          <p className="mp-body-lg mp-text-muted mp-animate-slide-up mp-delay-1" style={{ marginTop: '0.75rem' }}>
            {t('features.subtitle')}
          </p>
        </div>

        <div className="mp-grid mp-grid--3">
          {features.map((feature, index) => (
            <div
              key={feature.titleKey}
              className={`mp-glass-card mp-feature-card mp-animate-slide-up mp-delay-${index + 2}`}
            >
              <div className="mp-feature-card__icon">
                {feature.icon}
              </div>
              <h3 className="mp-feature-card__title">
                {t(feature.titleKey)}
              </h3>
              <p className="mp-feature-card__desc">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
