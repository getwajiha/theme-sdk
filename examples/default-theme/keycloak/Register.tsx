/**
 * Midnight Prism Registration Page — React Component
 */

import React from 'react'
import { GlassCard } from './components/GlassCard'
import { GlassInput } from './components/GlassInput'
import type { KcContext } from './types'

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
            Create Account
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
                  : 'rgba(139, 92, 246, 0.15)',
              border: `1px solid ${
                message.type === 'error'
                  ? 'rgba(239, 68, 68, 0.3)'
                  : 'rgba(139, 92, 246, 0.3)'
              }`,
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
              padding: '14px',
              marginTop: '8px',
              background: 'linear-gradient(135deg, var(--brand-primary, #8B5CF6), #A78BFA)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
            }}
          >
            Register
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
          Already have an account?{' '}
          <a
            href={url.loginUrl}
            style={{
              color: 'var(--brand-primary, #8B5CF6)',
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
