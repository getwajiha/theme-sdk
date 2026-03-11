'use client'

import { useContext } from 'react'
import { ThemeContext } from '../provider'
import type { UserInfo } from '../types'

const ANONYMOUS_USER: UserInfo = {
  id: '',
  name: '',
  email: '',
  isAuthenticated: false,
}

/**
 * useUser
 *
 * Returns the current user session information.
 * Returns an anonymous user object if not authenticated.
 */
export function useUser(): UserInfo {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useUser must be used within a ThemeProvider')
  }
  return context.user ?? ANONYMOUS_USER
}
