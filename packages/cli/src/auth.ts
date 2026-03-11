/**
 * Authentication
 *
 * Reads API credentials from environment variables and provides an
 * authenticated fetch wrapper for communicating with the Wajiha platform.
 *
 * Environment variables:
 *   WAJIHA_API_URL  - Base URL of the platform API (e.g. https://api.wajiha.dev)
 *   WAJIHA_API_KEY  - Tenant API key for authentication
 */

import chalk from 'chalk'

// ── Types ───────────────────────────────────────────────────────────

export interface ApiConfig {
  apiUrl: string
  apiKey: string
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Read the platform API URL and API key from environment variables.
 * Exits with a helpful error message if either is missing.
 */
export function getApiConfig(): ApiConfig {
  const apiUrl = process.env.WAJIHA_API_URL
  const apiKey = process.env.WAJIHA_API_KEY

  if (!apiUrl) {
    console.error(
      chalk.red('Error:'),
      'WAJIHA_API_URL environment variable is not set.'
    )
    console.error(
      chalk.gray(
        'Set it to the platform API base URL, e.g.:\n  export WAJIHA_API_URL=https://api.wajiha.dev'
      )
    )
    process.exit(1)
  }

  if (!apiKey) {
    console.error(
      chalk.red('Error:'),
      'WAJIHA_API_KEY environment variable is not set.'
    )
    console.error(
      chalk.gray(
        'Set it to your tenant API key, e.g.:\n  export WAJIHA_API_KEY=wjh_...'
      )
    )
    process.exit(1)
  }

  return { apiUrl: apiUrl.replace(/\/$/, ''), apiKey }
}

/**
 * Wrapper around fetch that injects the Authorization header automatically.
 * Returns the raw Response so callers can inspect status and parse the body.
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const { apiKey } = getApiConfig()

  const headers = new Headers(options.headers)
  headers.set('Authorization', `Bearer ${apiKey}`)

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  return fetch(url, { ...options, headers })
}

/**
 * Validate that the current API key is accepted by the platform.
 * Returns true if valid, false otherwise.
 */
export async function validateApiKey(): Promise<boolean> {
  const { apiUrl, apiKey } = getApiConfig()

  try {
    const response = await fetch(`${apiUrl}/api/tenant/theme/validate-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    })

    return response.ok
  } catch {
    return false
  }
}
