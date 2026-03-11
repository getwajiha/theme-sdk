/**
 * Keycloak Login Page — React Component
 *
 * This component replaces the FTL login page when a React bundle is available.
 * It reads form data and actions from kcContext (serialized by the FTL template).
 */

import React, { useState } from 'react'
import { FormField } from './components/FormField'
import type { KcContext } from './types'

export function Login({ kcContext }: { kcContext: KcContext }) {
  const [showPassword, setShowPassword] = useState(false)
  const { url, realm, login, message, social, locale } = kcContext
  const isRtl = locale?.rtl ?? false

  return (
    <div className="login-container" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="login-header">
        <h1 className="login-title">{realm.displayName || 'Sign In'}</h1>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          <span dangerouslySetInnerHTML={{ __html: message.summary }} />
        </div>
      )}

      <div className="login-content">
        <form action={url.loginAction} method="post">
          <FormField
            id="username"
            name="username"
            label="Username or Email"
            autoComplete="username"
            defaultValue={login?.username || ''}
            autoFocus
          />

          <FormField
            id="password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0' }}>
            {realm.rememberMe && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
                <input type="checkbox" name="rememberMe" />
                Remember me
              </label>
            )}

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--brand-primary, #8B5CF6)' }}
            >
              {showPassword ? 'Hide' : 'Show'} password
            </button>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Sign In
          </button>
        </form>

        {realm.resetPasswordAllowed && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <a href={url.loginResetCredentialsUrl} style={{ fontSize: '14px', color: 'var(--brand-primary, #8B5CF6)' }}>
              Forgot password?
            </a>
          </div>
        )}

        {social?.providers && social.providers.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '14px', color: '#888' }}>
              Or continue with
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {social.providers.map((provider) => (
                <a
                  key={provider.alias}
                  href={provider.loginUrl}
                  className="btn-default"
                  style={{ display: 'block', textAlign: 'center' }}
                >
                  {provider.displayName}
                </a>
              ))}
            </div>
          </div>
        )}

        {realm.registrationAllowed && (
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
            Don&apos;t have an account?{' '}
            <a href={url.registrationUrl} style={{ color: 'var(--brand-primary, #8B5CF6)', fontWeight: 500 }}>
              Register
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
