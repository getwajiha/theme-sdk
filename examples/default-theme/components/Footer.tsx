'use client'

import { useNavigation, useLocale, useTenant } from '@wajiha/theme-sdk'

export function Footer() {
  const navigation = useNavigation()
  const { t } = useLocale()
  const tenant = useTenant()
  const year = new Date().getFullYear()

  return (
    <footer className="mp-footer">
      <div className="mp-container">
        <div className="mp-footer__inner">
          <div>
            <div className="mp-footer__copy">
              {year} {tenant.name}. {t('footer.copyright')}
            </div>
            <div className="mp-footer__powered">{t('footer.poweredBy')}</div>
          </div>

          {navigation.footer.length > 0 && (
            <nav className="mp-footer__nav" aria-label="Footer navigation">
              {navigation.footer.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  className="mp-footer__link"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  )
}
