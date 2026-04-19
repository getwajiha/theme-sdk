/**
 * Keycloak Asset Validation
 *
 * Validates optional keycloak/ directory in theme projects.
 * Enforces CSS security rules and validates React component syntax.
 */

import { promises as fs } from 'fs'
import path from 'path'
import * as esbuild from 'esbuild'

const MAX_CSS_SIZE = 100 * 1024 // 100KB

/**
 * Patterns that are blocked in Keycloak CSS for security reasons.
 */
const BLOCKED_PATTERNS = [
  { pattern: /@import\b/gi, reason: '@import is not allowed (use inline styles only)' },
  { pattern: /expression\s*\(/gi, reason: 'CSS expressions are not allowed' },
  { pattern: /behavior\s*:/gi, reason: 'behavior property is not allowed' },
  { pattern: /-moz-binding\s*:/gi, reason: '-moz-binding is not allowed' },
  { pattern: /javascript\s*:/gi, reason: 'javascript: protocol is not allowed' },
]

/**
 * URL patterns blocked in CSS (external resource loading).
 * Internal relative URLs and data: URIs are allowed.
 */
const BLOCKED_URL_PATTERN = /url\s*\(\s*['"]?\s*(https?:\/\/)/gi

/**
 * Validate the CSS content for security issues.
 * Strips comments before checking so that documentation
 * mentioning blocked patterns doesn't trigger false positives.
 */
export function validateKeycloakCSS(css: string): string[] {
  const errors: string[] = []

  // Strip CSS comments before validation
  const cssWithoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '')

  for (const { pattern, reason } of BLOCKED_PATTERNS) {
    // Reset lastIndex for global regex
    pattern.lastIndex = 0
    if (pattern.test(cssWithoutComments)) {
      errors.push(reason)
    }
  }

  BLOCKED_URL_PATTERN.lastIndex = 0
  if (BLOCKED_URL_PATTERN.test(cssWithoutComments)) {
    errors.push('url() with external domains (http/https) is not allowed')
  }

  return errors
}

/**
 * Validate Keycloak React component by attempting an esbuild parse.
 */
async function validateKeycloakComponent(
  filePath: string,
  name: string
): Promise<string[]> {
  const errors: string[] = []

  try {
    await esbuild.build({
      entryPoints: [filePath],
      write: false,
      bundle: false,
      jsx: 'automatic',
      logLevel: 'silent',
    })
  } catch {
    errors.push(`keycloak/${name}: Failed to parse — check for syntax errors`)
  }

  return errors
}

/**
 * Validate a compiled JS bundle for security issues.
 */
export function validateKeycloakBundle(js: string): string[] {
  const errors: string[] = []

  if (/\beval\s*\(/g.test(js)) {
    errors.push('eval() is not allowed in Keycloak bundles')
  }

  if (/\bnew\s+Function\s*\(/g.test(js)) {
    errors.push('new Function() is not allowed in Keycloak bundles')
  }

  return errors
}

/**
 * Validate the optional keycloak/ directory in a theme project.
 * Returns an array of error strings (empty = valid).
 */
export async function validateKeycloakAssets(dir: string): Promise<string[]> {
  const errors: string[] = []
  const keycloakDir = path.join(dir, 'keycloak')

  // Check if keycloak directory exists (it's optional)
  try {
    await fs.access(keycloakDir)
  } catch {
    return [] // No keycloak directory — nothing to validate
  }

  // Validate CSS if present
  const cssPath = path.join(keycloakDir, 'styles.css')
  let hasCss = false
  try {
    await fs.access(cssPath)
    hasCss = true
  } catch {
    // No styles.css — fine if React components exist
  }

  if (hasCss) {
    const stat = await fs.stat(cssPath)
    if (stat.size > MAX_CSS_SIZE) {
      errors.push(
        `keycloak/styles.css exceeds maximum size of 100KB (${(stat.size / 1024).toFixed(1)}KB)`
      )
    } else {
      const css = await fs.readFile(cssPath, 'utf-8')
      const cssErrors = validateKeycloakCSS(css)
      errors.push(...cssErrors.map((e) => `keycloak/styles.css: ${e}`))
    }
  }

  // Validate React components if present
  for (const component of ['Login', 'Register']) {
    for (const ext of ['.tsx', '.jsx']) {
      const componentPath = path.join(keycloakDir, `${component}${ext}`)
      try {
        await fs.access(componentPath)
        errors.push(
          ...(await validateKeycloakComponent(componentPath, `${component}${ext}`))
        )
        break // Found, no need to check other extension
      } catch {
        // continue
      }
    }
  }

  // If keycloak dir exists but has neither CSS nor Login component, warn
  if (!hasCss) {
    let hasLogin = false
    for (const ext of ['.tsx', '.jsx']) {
      try {
        await fs.access(path.join(keycloakDir, `Login${ext}`))
        hasLogin = true
        break
      } catch {
        // continue
      }
    }
    if (!hasLogin) {
      errors.push('keycloak/ directory exists but has neither styles.css nor Login.tsx')
    }
  }

  return errors
}
