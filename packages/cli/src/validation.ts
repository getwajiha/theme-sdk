/**
 * Theme Validation
 *
 * Checks that a theme directory is structurally valid before building
 * or pushing. Validates:
 *   - wajiha.theme.json exists and conforms to ThemeConfig
 *   - Required template files exist (index, page, products, error)
 *   - Locale JSON files exist for every declared locale
 *   - Settings schema has no duplicates or missing fields
 */

import { promises as fs } from 'fs'
import path from 'path'
import { validateKeycloakAssets } from './keycloak/validate.js'

// ── Types ───────────────────────────────────────────────────────────

import type { ThemeConfig as BaseThemeConfig, ThemeSettingDefinition } from '@getwajiha/theme-sdk'

export interface ThemeConfig extends BaseThemeConfig {
  keycloak?: {
    customCSS?: boolean
    reactBundle?: boolean
  }
}

export type { ThemeSettingDefinition }

// Required template files that every theme must include
const REQUIRED_TEMPLATES = ['index', 'page', 'products', 'error']

// ── Helpers ─────────────────────────────────────────────────────────

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Load and parse wajiha.theme.json from the given directory.
 * Throws if the file is missing or contains invalid JSON.
 */
export async function loadThemeConfig(dir: string): Promise<ThemeConfig> {
  const configPath = path.join(dir, 'wajiha.theme.json')

  if (!(await fileExists(configPath))) {
    throw new Error(
      'wajiha.theme.json not found. Run "wajiha init" to create a new theme.'
    )
  }

  const raw = await fs.readFile(configPath, 'utf-8')
  try {
    return JSON.parse(raw) as ThemeConfig
  } catch {
    throw new Error('wajiha.theme.json contains invalid JSON.')
  }
}

/**
 * Validate the parsed ThemeConfig object.
 * Returns an array of human-readable error strings (empty = valid).
 */
export function validateThemeStructure(config: Partial<ThemeConfig>): string[] {
  const errors: string[] = []

  if (!config.name || typeof config.name !== 'string') {
    errors.push('Theme "name" is required and must be a string.')
  }

  if (!config.version || typeof config.version !== 'string') {
    errors.push('Theme "version" is required and must be a string.')
  }

  if (!config.sdk_version || typeof config.sdk_version !== 'string') {
    errors.push('"sdk_version" is required and must be a string.')
  }

  if (
    !config.locales ||
    !Array.isArray(config.locales) ||
    config.locales.length === 0
  ) {
    errors.push('At least one locale must be specified in "locales".')
  }

  if (config.settings !== undefined && !Array.isArray(config.settings)) {
    errors.push('"settings" must be an array.')
  }

  return errors
}

/**
 * Check that all required template files exist in the templates/ directory.
 * Accepts .tsx or .jsx extensions.
 */
export async function validateTemplates(dir: string): Promise<string[]> {
  const errors: string[] = []
  const templatesDir = path.join(dir, 'templates')

  if (!(await fileExists(templatesDir))) {
    errors.push('Missing "templates/" directory.')
    return errors
  }

  for (const name of REQUIRED_TEMPLATES) {
    const tsxPath = path.join(templatesDir, `${name}.tsx`)
    const jsxPath = path.join(templatesDir, `${name}.jsx`)
    if (!(await fileExists(tsxPath)) && !(await fileExists(jsxPath))) {
      errors.push(`Missing required template: templates/${name}.tsx`)
    }
  }

  return errors
}

/**
 * Check that locale JSON files exist for every locale declared in the config.
 */
export async function validateLocales(
  dir: string,
  locales: string[]
): Promise<string[]> {
  const errors: string[] = []
  const localesDir = path.join(dir, 'locales')

  if (!(await fileExists(localesDir))) {
    errors.push('Missing "locales/" directory.')
    return errors
  }

  for (const locale of locales) {
    const localePath = path.join(localesDir, `${locale}.json`)
    if (!(await fileExists(localePath))) {
      errors.push(`Missing locale file: locales/${locale}.json`)
    } else {
      // Verify it is valid JSON
      try {
        const raw = await fs.readFile(localePath, 'utf-8')
        JSON.parse(raw)
      } catch {
        errors.push(`locales/${locale}.json contains invalid JSON.`)
      }
    }
  }

  return errors
}

/**
 * Validate the settings schema for duplicate keys and missing required fields.
 */
export function validateSettings(
  settings: ThemeSettingDefinition[]
): string[] {
  const errors: string[] = []
  const keys = new Set<string>()

  for (const setting of settings) {
    if (!setting.key) {
      errors.push('Each setting must have a "key".')
      continue
    }

    if (keys.has(setting.key)) {
      errors.push(`Duplicate setting key: "${setting.key}"`)
    }
    keys.add(setting.key)

    if (!setting.type) {
      errors.push(`Setting "${setting.key}" is missing a "type".`)
    }

    if (!setting.label || typeof setting.label !== 'object') {
      errors.push(`Setting "${setting.key}" must have a "label" object.`)
    }
  }

  return errors
}

/**
 * Run all validations at once. Returns all errors combined.
 */
export async function validateAll(dir: string): Promise<string[]> {
  const config = await loadThemeConfig(dir)
  const errors: string[] = []

  errors.push(...validateThemeStructure(config))
  errors.push(...(await validateTemplates(dir)))
  errors.push(...(await validateLocales(dir, config.locales)))

  if (config.settings) {
    errors.push(...validateSettings(config.settings))
  }

  // Validate optional Keycloak assets
  errors.push(...(await validateKeycloakAssets(dir)))

  return errors
}
