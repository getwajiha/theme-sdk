'use client'

import { useEffect } from 'react'
import { useNavigation, useLocale } from '@wajiha/theme-sdk'
import { Logo } from './Logo'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const navigation = useNavigation()
  const { t, available, current } = useLocale()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="mp-mobile-menu">
      <div className="mp-mobile-menu__overlay" onClick={onClose} />
      <div className="mp-mobile-menu__panel">
        <button
          type="button"
          className="mp-mobile-menu__close"
          onClick={onClose}
          aria-label={t('nav.close', {})}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div style={{ marginBottom: '2rem' }}>
          <Logo />
        </div>

        <nav className="mp-mobile-menu__nav">
          {navigation.main.map((item) => (
            <a
              key={item.id}
              href={item.url}
              className="mp-mobile-menu__link"
              onClick={onClose}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {available.length > 1 && (
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--mp-border)' }}>
            <div className="mp-label" style={{ marginBottom: '0.75rem' }}>
              {t('nav.language', {})}
            </div>
            <div className="mp-lang-switch">
              {available.map((loc) => (
                <a
                  key={loc}
                  href={`/${loc}/`}
                  className={`mp-lang-switch__item ${loc === current ? 'mp-lang-switch__item--active' : ''}`}
                  lang={loc}
                >
                  {loc.toUpperCase()}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
