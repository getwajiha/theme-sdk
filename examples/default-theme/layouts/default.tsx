'use client'

import type { ReactNode } from 'react'
import { useLocale, useSettings } from '@getwajiha/theme-sdk'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

interface DefaultLayoutProps {
  children: ReactNode
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  const { direction } = useLocale()
  const settings = useSettings()
  const layoutStyle = settings.get<string>('layout_style', 'centered')
  const primaryColor = settings.get<string>('primary_color', '#8B5CF6')
  const accentColor = settings.get<string>('accent_color', '#A78BFA')

  return (
    <div
      className="mp-theme"
      dir={direction}
      data-theme="dark"
      style={{
        '--mp-primary': primaryColor,
        '--mp-primary-hover': adjustBrightness(primaryColor, -15),
        '--mp-primary-glow': hexToRgba(primaryColor, 0.25),
        '--mp-accent': accentColor,
        '--mp-accent-dim': hexToRgba(accentColor, 0.15),
      } as React.CSSProperties}
    >
      <Header />
      <main className={layoutStyle === 'wide' ? 'mp-layout--wide' : ''}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

/**
 * Adjust hex color brightness by a percentage.
 */
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + Math.round(2.55 * percent)))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + Math.round(2.55 * percent)))
  const b = Math.min(255, Math.max(0, (num & 0xff) + Math.round(2.55 * percent)))
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
}

/**
 * Convert hex color to rgba string.
 */
function hexToRgba(hex: string, alpha: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = (num >> 16) & 0xff
  const g = (num >> 8) & 0xff
  const b = num & 0xff
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
