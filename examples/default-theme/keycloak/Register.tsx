/**
 * Wajiha Default — Keycloak Registration page (React)
 */

import React from 'react'
import { GlassCard } from './components/GlassCard'
import { GlassInput } from './components/GlassInput'
import type { KcContext } from './types'

const ACCENT = 'var(--brand-primary-hex, #0e6e6e)'
const ACCENT_HOVER = 'color-mix(in srgb, var(--brand-primary-hex, #0e6e6e) 88%, black)'
const PAGE_BG = '#fafbfc'
const FG = '#0a0e14'
const FG_MUTED = '#5a6472'

export function Register({ kcContext }: { kcContext: KcContext }) {
  const { url, realm, message, locale } = kcContext
  const isRtl = locale?.rtl ?? false

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: PAGE_BG,
        padding: '24px',
        fontFamily: "var(--brand-font, 'Inter', system-ui, sans-serif)",
        color: FG,
      }}
    >
      <GlassCard>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: FG,
              marginBottom: '8px',
            }}
          >
            Create Account
          </h1>
        </div>

        {message && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px',
              background: message.type === 'error' ? '#ffe0e0' : '#dee9ff',
              color: message.type === 'error' ? '#b42318' : '#1d5fd1',
              border: '1px solid transparent',
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: message.summary }} />
          </div>
        )}

        <form action={url.registrationAction} method="post">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <GlassInput id="firstName" name="firstName" label="First Name" autoComplete="given-name" autoFocus />
            <GlassInput id="lastName" name="lastName" label="Last Name" autoComplete="family-name" />
          </div>

          <GlassInput id="email" name="email" label="Email" type="email" autoComplete="email" />
          <GlassInput id="username" name="username" label="Username" autoComplete="username" />
          <GlassInput id="password" name="password" label="Password" type="password" autoComplete="new-password" />
          <GlassInput id="password-confirm" name="password-confirm" label="Confirm Password" type="password" autoComplete="new-password" />

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px 14px',
              marginTop: '8px',
              background: ACCENT,
              color: '#ffffff',
              border: '1px solid transparent',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.12s, transform 0.12s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = ACCENT_HOVER
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background = ACCENT
            }}
          >
            Register
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: FG_MUTED }}>
          Already have an account?{' '}
          <a
            href={url.loginUrl}
            style={{
              color: ACCENT,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Sign in
          </a>
        </div>
      </GlassCard>
    </div>
  )
}
