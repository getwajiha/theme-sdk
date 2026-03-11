import type { ThemeSettingDefinition, ThemeConfig } from './types'

/**
 * Validates a value against a theme setting definition.
 * Returns the validated value or the default.
 */
export function validateSettingValue(
  definition: ThemeSettingDefinition,
  value: unknown
): unknown {
  if (value === undefined || value === null) {
    return definition.default
  }

  switch (definition.type) {
    case 'text':
      if (typeof value !== 'string') return definition.default
      if (definition.maxLength && value.length > definition.maxLength) {
        return value.slice(0, definition.maxLength)
      }
      return value

    case 'color':
      if (typeof value !== 'string') return definition.default
      return value

    case 'boolean':
      if (typeof value !== 'boolean') return definition.default
      return value

    case 'number':
      if (typeof value !== 'number') return definition.default
      if (definition.min !== undefined && value < definition.min) return definition.min
      if (definition.max !== undefined && value > definition.max) return definition.max
      return value

    case 'select':
      if (!definition.options) return definition.default
      const validValues = definition.options.map((o) => o.value)
      if (!validValues.includes(value as string)) return definition.default
      return value

    case 'image':
      if (typeof value !== 'string' && value !== null) return definition.default
      return value

    case 'array':
      if (!Array.isArray(value)) return definition.default
      if (definition.maxItems && value.length > definition.maxItems) {
        return value.slice(0, definition.maxItems)
      }
      return value

    case 'link':
      if (typeof value !== 'object' || value === null) return definition.default
      return value

    default:
      return definition.default
  }
}

/**
 * Merges saved settings values with schema defaults.
 * New fields get defaults, removed fields are pruned, existing fields are preserved.
 */
export function mergeSettingsWithDefaults(
  schema: ThemeSettingDefinition[],
  values: Record<string, unknown>
): Record<string, unknown> {
  const merged: Record<string, unknown> = {}

  for (const definition of schema) {
    const value = values[definition.key]
    merged[definition.key] = validateSettingValue(definition, value)
  }

  return merged
}

/**
 * Extracts the default values from a theme settings schema.
 */
export function getDefaultSettings(
  schema: ThemeSettingDefinition[]
): Record<string, unknown> {
  const defaults: Record<string, unknown> = {}
  for (const definition of schema) {
    defaults[definition.key] = definition.default
  }
  return defaults
}

/**
 * Validates a theme config object (wajiha.theme.json).
 * Returns an array of validation errors, or empty array if valid.
 */
export function validateThemeConfig(config: Partial<ThemeConfig>): string[] {
  const errors: string[] = []

  if (!config.name || typeof config.name !== 'string') {
    errors.push('Theme name is required')
  }

  if (!config.version || typeof config.version !== 'string') {
    errors.push('Theme version is required')
  }

  if (!config.sdk_version || typeof config.sdk_version !== 'string') {
    errors.push('SDK version is required')
  }

  if (!config.locales || !Array.isArray(config.locales) || config.locales.length === 0) {
    errors.push('At least one locale must be specified')
  }

  if (config.settings && Array.isArray(config.settings)) {
    const keys = new Set<string>()
    for (const setting of config.settings) {
      if (!setting.key) {
        errors.push('Each setting must have a key')
        continue
      }
      if (keys.has(setting.key)) {
        errors.push(`Duplicate setting key: ${setting.key}`)
      }
      keys.add(setting.key)

      if (!setting.type) {
        errors.push(`Setting "${setting.key}" must have a type`)
      }

      if (!setting.label || typeof setting.label !== 'object') {
        errors.push(`Setting "${setting.key}" must have a label object`)
      }
    }
  }

  return errors
}
