/**
 * Default Layout
 *
 * Wraps every page with a consistent header and footer.
 * Demonstrates usage of the theme SDK hooks:
 *   - useTenant()      Tenant branding (name, logo)
 *   - useNavigation()  Menu items
 *   - useLocale()      i18n translation + RTL detection
 *   - useSettings()    Admin-configured settings
 *
 * The layout renders a responsive header with logo, navigation links,
 * and a language switcher. It includes RTL support via dir="rtl" on
 * the root container when the current locale is right-to-left.
 */

import React from 'react'
import {
  useTenant,
  useNavigation,
  useLocale,
  useSettings,
  type LayoutProps,
} from '@wajiha/theme-sdk'

// ── Header ──────────────────────────────────────────────────────────

function Header() {
  const tenant = useTenant()
  const { main } = useNavigation()
  const { t, current, available, isRTL } = useLocale()
  const settings = useSettings()

  const primaryColor = settings.get<string>('primary_color', '#2563eb')

  return (
    <header className="theme-header" style={{ borderBottomColor: primaryColor }}>
      <div className="theme-header__inner">
        {/* Logo / Tenant Name */}
        <a href="/" className="theme-header__brand">
          {tenant.logo ? (
            <img
              src={tenant.logo}
              alt={tenant.name}
              className="theme-header__logo"
            />
          ) : (
            <span className="theme-header__name">{tenant.name}</span>
          )}
        </a>

        {/* Main Navigation */}
        <nav className="theme-header__nav" aria-label="Main navigation">
          <ul className="theme-header__nav-list">
            {main.map((item) => (
              <li key={item.id} className="theme-header__nav-item">
                <a href={item.url} className="theme-header__nav-link">
                  {item.label}
                </a>

                {/* Dropdown for children */}
                {item.children.length > 0 && (
                  <ul className="theme-header__dropdown">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <a href={child.url} className="theme-header__dropdown-link">
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Language Switcher */}
        {available.length > 1 && (
          <div className="theme-header__lang">
            <span className="theme-header__lang-label">
              {t('lang.switch')}:
            </span>
            {available.map((locale) => (
              <a
                key={locale}
                href={`?locale=${locale}`}
                className={`theme-header__lang-option ${
                  locale === current ? 'theme-header__lang-option--active' : ''
                }`}
              >
                {locale.toUpperCase()}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}

// ── Footer ──────────────────────────────────────────────────────────

function Footer() {
  const tenant = useTenant()
  const { footer } = useNavigation()
  const { t } = useLocale()
  const settings = useSettings()

  const footerLayout = settings.get<string>('footer_layout', 'simple')

  return (
    <footer className={`theme-footer theme-footer--${footerLayout}`}>
      <div className="theme-footer__inner">
        {/* Footer Navigation */}
        <nav className="theme-footer__nav" aria-label="Footer navigation">
          <ul className="theme-footer__nav-list">
            {footer.map((item) => (
              <li key={item.id} className="theme-footer__nav-item">
                <a href={item.url} className="theme-footer__nav-link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Copyright */}
        <p className="theme-footer__copyright">
          {t('footer.copyright')}
        </p>
      </div>
    </footer>
  )
}

// ── Layout ──────────────────────────────────────────────────────────

export default function DefaultLayout({ children }: LayoutProps) {
  const { isRTL, direction } = useLocale()

  return (
    <div className="theme-layout" dir={direction}>
      <Header />
      <main className="theme-main">{children}</main>
      <Footer />
    </div>
  )
}
