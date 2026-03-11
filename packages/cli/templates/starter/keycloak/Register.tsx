/**
 * Keycloak Registration Page — React Component
 */

import React from 'react'
import { FormField } from './components/FormField'
import type { KcContext } from './types'

export function Register({ kcContext }: { kcContext: KcContext }) {
  const { url, realm, message, locale } = kcContext
  const isRtl = locale?.rtl ?? false

  return (
    <div className="login-container" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="login-header">
        <h1 className="login-title">Create Account</h1>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          <span dangerouslySetInnerHTML={{ __html: message.summary }} />
        </div>
      )}

      <div className="login-content">
        <form action={url.registrationAction} method="post">
          <FormField id="firstName" name="firstName" label="First Name" autoComplete="given-name" autoFocus />
          <FormField id="lastName" name="lastName" label="Last Name" autoComplete="family-name" />
          <FormField id="email" name="email" label="Email" type="email" autoComplete="email" />
          <FormField id="username" name="username" label="Username" autoComplete="username" />
          <FormField id="password" name="password" label="Password" type="password" autoComplete="new-password" />
          <FormField id="password-confirm" name="password-confirm" label="Confirm Password" type="password" autoComplete="new-password" />

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }}>
            Register
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
          Already have an account?{' '}
          <a href={url.loginUrl} style={{ color: 'var(--brand-primary, #8B5CF6)', fontWeight: 500 }}>
            Sign in
          </a>
        </div>
      </div>
    </div>
  )
}
