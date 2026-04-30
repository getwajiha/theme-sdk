/**
 * Wajiha Default — Keycloak Login page (React)
 *
 * Light-first login surface that mirrors the Wajiha DS docs canvas. The
 * tenant brand colour cascades via `--brand-primary-hex` (set on <html>
 * by the Keycloak theme bundle), with deep teal as the fallback.
 */

import React, { useState } from 'react'
import { GlassCard } from './components/GlassCard'
import { GlassInput } from './components/GlassInput'
import type { KcContext } from './types'

const ACCENT = 'var(--brand-primary-hex, #0e6e6e)'  // --ds-accent
const ACCENT_HOVER = 'color-mix(in srgb, var(--brand-primary-hex, #0e6e6e) 88%, black)'
const PAGE_BG = '#fafbfc'      // --ds-surface
const FG = '#0a0e14'           // --ds-fg
const FG_MUTED = '#5a6472'     // --ds-fg-muted
const FG_FAINT = '#8a93a1'     // --ds-fg-faint

export function Login({ kcContext }: { kcContext: KcContext }) {
  const [showPassword, setShowPassword] = useState(false)
  const { url, realm, login, message, social, locale } = kcContext
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
            {realm.displayName || 'Sign In'}
          </h1>
        </div>

        {message && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px',
              background:
                message.type === 'error'
                  ? '#ffe0e0'           // --status-danger-bg
                  : message.type === 'success'
                    ? '#dcf5e5'         // --status-ok-bg
                    : '#dee9ff',        // --status-info-bg
              color:
                message.type === 'error'
                  ? '#b42318'
                  : message.type === 'success'
                    ? '#0a8f4a'
                    : '#1d5fd1',
              border: '1px solid transparent',
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: message.summary }} />
          </div>
        )}

        <form action={url.loginAction} method="post">
          <GlassInput
            id="username"
            name="username"
            label="Username or Email"
            autoComplete="username"
            defaultValue={login?.username || ''}
            autoFocus
          />

          <GlassInput
            id="password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '4px 0 20px',
            }}
          >
            {realm.rememberMe && (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: FG_MUTED,
                  cursor: 'pointer',
                }}
              >
                <input type="checkbox" name="rememberMe" />
                Remember me
              </label>
            )}

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                color: ACCENT,
                marginLeft: 'auto',
                padding: 0,
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px 14px',
              background: ACCENT,
              color: '#ffffff',
              border: '1px solid transparent',
              borderRadius: '6px',          // --ds-radius-md
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
            Sign In
          </button>
        </form>

        {realm.resetPasswordAllowed && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a
              href={url.loginResetCredentialsUrl}
              style={{
                fontSize: '13px',
                color: FG_FAINT,
                textDecoration: 'none',
              }}
            >
              Forgot password?
            </a>
          </div>
        )}

        {social?.providers && social.providers.length > 0 && (
          <div style={{ marginTop: '28px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: '#e5e8eb' }} />
              <span style={{ fontSize: '12px', color: FG_FAINT, textTransform: 'uppercase', letterSpacing: '1px' }}>
                or
              </span>
              <div style={{ flex: 1, height: '1px', background: '#e5e8eb' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {social.providers.map((provider) => (
                <a
                  key={provider.alias}
                  href={provider.loginUrl}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '12px',
                    background: '#fafbfc',
                    border: '1px solid #e5e8eb',
                    borderRadius: '6px',
                    color: FG,
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'background 0.12s',
                  }}
                >
                  {provider.displayName}
                </a>
              ))}
            </div>
          </div>
        )}

        {realm.registrationAllowed && (
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: FG_MUTED }}>
            Don&apos;t have an account?{' '}
            <a
              href={url.registrationUrl}
              style={{
                color: ACCENT,
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Register
            </a>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
