/**
 * Type definitions for the Keycloak context object.
 * This is serialized by the FTL template into window.__KC_CONTEXT__.
 */

export interface KcContext {
  pageId: string
  realm: {
    name: string
    displayName: string
    registrationAllowed: boolean
    resetPasswordAllowed: boolean
    rememberMe: boolean
    internationalizationEnabled: boolean
  }
  url: {
    loginAction: string
    registrationAction: string
    loginUrl: string
    registrationUrl: string
    loginResetCredentialsUrl: string
  }
  message?: {
    type: 'success' | 'warning' | 'error' | 'info'
    summary: string
  }
  login?: {
    username: string
  }
  social?: {
    providers: Array<{
      alias: string
      displayName: string
      loginUrl: string
    }>
  }
  locale: {
    currentLanguageTag: string
    rtl: boolean
  }
}

declare global {
  interface Window {
    __KC_CONTEXT__: KcContext
  }
}
