'use client'

import { useState } from 'react'
import { useNavigation, useLocale } from '@wajiha/theme-sdk'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const navigation = useNavigation()
  const { available, current } = useLocale()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="mp-header">
        <div className="mp-container">
          <div className="mp-header__inner">
            <div className="mp-header__left">
              <Logo />
              <nav className="mp-header__nav" aria-label="Main navigation">
                {navigation.main.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    className="mp-header__nav-link"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="mp-header__right">
              {available.length > 1 && (
                <div className="mp-lang-switch mp-hide-mobile">
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
              )}

              <ThemeToggle />

              <button
                type="button"
                className="mp-header__hamburger"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
