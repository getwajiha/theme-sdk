/**
 * Midnight Prism Login Page — React Component
 *
 * Matches the existing FTL visual design with glassmorphism and violet accents.
 */

import React, { useState } from 'react'
import { GlassCard } from './components/GlassCard'
import { GlassInput } from './components/GlassInput'
import type { KcContext } from './types'

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
        fontFamily: "var(--brand-font, 'Inter', system-ui, sans-serif)",
        color: '#fff',
      }}
    >
      <GlassCard>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--brand-primary, #8B5CF6), #A78BFA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
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
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '14px',
              background:
                message.type === 'error'
                  ? 'rgba(239, 68, 68, 0.15)'
                  : message.type === 'success'
                    ? 'rgba(34, 197, 94, 0.15)'
                    : 'rgba(139, 92, 246, 0.15)',
              border: `1px solid ${
                message.type === 'error'
                  ? 'rgba(239, 68, 68, 0.3)'
                  : message.type === 'success'
                    ? 'rgba(34, 197, 94, 0.3)'
                    : 'rgba(139, 92, 246, 0.3)'
              }`,
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
                  color: 'rgba(255, 255, 255, 0.6)',
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
                color: 'var(--brand-primary, #8B5CF6)',
                marginLeft: 'auto',
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, var(--brand-primary, #8B5CF6), #A78BFA)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
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
                color: 'rgba(255, 255, 255, 0.5)',
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
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                or
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
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
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'background 0.2s',
                  }}
                >
                  {provider.displayName}
                </a>
              ))}
            </div>
          </div>
        )}

        {realm.registrationAllowed && (
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
            Don&apos;t have an account?{' '}
            <a
              href={url.registrationUrl}
              style={{
                color: 'var(--brand-primary, #8B5CF6)',
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
