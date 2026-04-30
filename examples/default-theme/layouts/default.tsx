'use client'

import type { ReactNode } from 'react'
import { useLocale, useSettings } from '@getwajiha/theme-sdk'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

interface DefaultLayoutProps {
  children: ReactNode
}

/**
 * Default layout for the Wajiha Default theme.
 *
 * Brand colour overrides are no longer set here — they flow in via the
 * platform-injected `--brand-primary-hex` custom property, which the SDK
 * tokens (`--ds-accent`) resolve through automatically. This keeps tenant
 * branding consistent across the docs canvas and the theme without
 * bespoke per-theme JavaScript.
 */
export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const { direction } = useLocale()
  const settings = useSettings()
  const layoutStyle = settings.get<string>('layout_style', 'centered')

  return (
    <div className="mp-theme" dir={direction}>
      <Header />
      <main className={layoutStyle === 'wide' ? 'mp-layout--wide' : ''}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
