import { describe, it, expect } from 'vitest'
import {
  validateSettingValue,
  mergeSettingsWithDefaults,
  getDefaultSettings,
  validateThemeConfig,
} from '../src/settings'
import type { ThemeSettingDefinition, ThemeConfig } from '../src/types'

// ── validateSettingValue ──────────────────────────────────────────────

describe('validateSettingValue', () => {
  // -- text type --

  describe('text type', () => {
    const def: ThemeSettingDefinition = {
      key: 'title',
      type: 'text',
      label: { en: 'Title' },
      default: 'Default Title',
    }

    it('returns the value when it is a valid string', () => {
      expect(validateSettingValue(def, 'Hello')).toBe('Hello')
    })

    it('returns default when value is null', () => {
      expect(validateSettingValue(def, null)).toBe('Default Title')
    })

    it('returns default when value is undefined', () => {
      expect(validateSettingValue(def, undefined)).toBe('Default Title')
    })

    it('returns default when value is not a string', () => {
      expect(validateSettingValue(def, 123)).toBe('Default Title')
      expect(validateSettingValue(def, true)).toBe('Default Title')
    })

    it('truncates string when maxLength is exceeded', () => {
      const defWithMax: ThemeSettingDefinition = { ...def, maxLength: 5 }
      expect(validateSettingValue(defWithMax, 'Hello World')).toBe('Hello')
    })

    it('does not truncate string within maxLength', () => {
      const defWithMax: ThemeSettingDefinition = { ...def, maxLength: 20 }
      expect(validateSettingValue(defWithMax, 'Hello')).toBe('Hello')
    })

    it('returns empty string as valid text', () => {
      expect(validateSettingValue(def, '')).toBe('')
    })
  })

  // -- color type --

  describe('color type', () => {
    const def: ThemeSettingDefinition = {
      key: 'primary_color',
      type: 'color',
      label: { en: 'Primary Color' },
      default: '#000000',
    }

    it('returns valid color string', () => {
      expect(validateSettingValue(def, '#ff0000')).toBe('#ff0000')
    })

    it('returns default when value is not a string', () => {
      expect(validateSettingValue(def, 42)).toBe('#000000')
    })

    it('returns default when value is null', () => {
      expect(validateSettingValue(def, null)).toBe('#000000')
    })
  })

  // -- boolean type --

  describe('boolean type', () => {
    const def: ThemeSettingDefinition = {
      key: 'show_header',
      type: 'boolean',
      label: { en: 'Show Header' },
      default: true,
    }

    it('returns true when value is true', () => {
      expect(validateSettingValue(def, true)).toBe(true)
    })

    it('returns false when value is false', () => {
      expect(validateSettingValue(def, false)).toBe(false)
    })

    it('returns default when value is not a boolean', () => {
      expect(validateSettingValue(def, 'yes')).toBe(true)
      expect(validateSettingValue(def, 1)).toBe(true)
    })
  })

  // -- number type --

  describe('number type', () => {
    const def: ThemeSettingDefinition = {
      key: 'columns',
      type: 'number',
      label: { en: 'Columns' },
      default: 3,
    }

    it('returns valid number', () => {
      expect(validateSettingValue(def, 5)).toBe(5)
    })

    it('returns default when value is not a number', () => {
      expect(validateSettingValue(def, '5')).toBe(3)
    })

    it('clamps to min when value is below minimum', () => {
      const defWithMin: ThemeSettingDefinition = { ...def, min: 1 }
      expect(validateSettingValue(defWithMin, 0)).toBe(1)
      expect(validateSettingValue(defWithMin, -5)).toBe(1)
    })

    it('clamps to max when value exceeds maximum', () => {
      const defWithMax: ThemeSettingDefinition = { ...def, max: 10 }
      expect(validateSettingValue(defWithMax, 15)).toBe(10)
    })

    it('returns value when within min/max range', () => {
      const defWithRange: ThemeSettingDefinition = { ...def, min: 1, max: 10 }
      expect(validateSettingValue(defWithRange, 5)).toBe(5)
    })

    it('returns 0 as a valid number', () => {
      expect(validateSettingValue(def, 0)).toBe(0)
    })
  })

  // -- select type --

  describe('select type', () => {
    const def: ThemeSettingDefinition = {
      key: 'layout',
      type: 'select',
      label: { en: 'Layout' },
      default: 'grid',
      options: [
        { value: 'grid', label: { en: 'Grid' } },
        { value: 'list', label: { en: 'List' } },
      ],
    }

    it('returns value when it matches an option', () => {
      expect(validateSettingValue(def, 'grid')).toBe('grid')
      expect(validateSettingValue(def, 'list')).toBe('list')
    })

    it('returns default when value is not a valid option', () => {
      expect(validateSettingValue(def, 'table')).toBe('grid')
    })

    it('returns default when options are not defined', () => {
      const defNoOptions: ThemeSettingDefinition = {
        key: 'layout',
        type: 'select',
        label: { en: 'Layout' },
        default: 'grid',
      }
      expect(validateSettingValue(defNoOptions, 'grid')).toBe('grid')
    })
  })

  // -- image type --

  describe('image type', () => {
    const def: ThemeSettingDefinition = {
      key: 'hero_image',
      type: 'image',
      label: { en: 'Hero Image' },
      default: null,
    }

    it('returns valid image URL string', () => {
      expect(validateSettingValue(def, 'https://example.com/img.png')).toBe(
        'https://example.com/img.png'
      )
    })

    it('returns null as a valid image value', () => {
      expect(validateSettingValue(def, null)).toBe(null)
    })

    it('returns default when value is not a string or null', () => {
      expect(validateSettingValue(def, 123)).toBe(null)
      expect(validateSettingValue(def, true)).toBe(null)
    })
  })

  // -- array type --

  describe('array type', () => {
    const def: ThemeSettingDefinition = {
      key: 'slides',
      type: 'array',
      label: { en: 'Slides' },
      default: [],
    }

    it('returns valid array', () => {
      const value = [{ title: 'Slide 1' }, { title: 'Slide 2' }]
      expect(validateSettingValue(def, value)).toEqual(value)
    })

    it('returns default when value is not an array', () => {
      expect(validateSettingValue(def, 'not-array')).toEqual([])
      expect(validateSettingValue(def, 42)).toEqual([])
    })

    it('truncates array when maxItems is exceeded', () => {
      const defWithMax: ThemeSettingDefinition = { ...def, maxItems: 2 }
      const value = ['a', 'b', 'c', 'd']
      expect(validateSettingValue(defWithMax, value)).toEqual(['a', 'b'])
    })

    it('does not truncate array within maxItems', () => {
      const defWithMax: ThemeSettingDefinition = { ...def, maxItems: 5 }
      const value = ['a', 'b']
      expect(validateSettingValue(defWithMax, value)).toEqual(['a', 'b'])
    })
  })

  // -- link type --

  describe('link type', () => {
    const def: ThemeSettingDefinition = {
      key: 'cta_link',
      type: 'link',
      label: { en: 'CTA Link' },
      default: { url: '/', label: 'Home' },
    }

    it('returns valid link object', () => {
      const value = { url: '/about', label: 'About' }
      expect(validateSettingValue(def, value)).toEqual(value)
    })

    it('returns default when value is not an object', () => {
      expect(validateSettingValue(def, 'string')).toEqual({ url: '/', label: 'Home' })
      expect(validateSettingValue(def, 42)).toEqual({ url: '/', label: 'Home' })
    })

    it('returns default when value is null', () => {
      expect(validateSettingValue(def, null)).toEqual({ url: '/', label: 'Home' })
    })
  })

  // -- unknown type --

  describe('unknown type', () => {
    it('returns default for unrecognized setting type', () => {
      const def = {
        key: 'unknown',
        type: 'custom' as ThemeSettingDefinition['type'],
        label: { en: 'Unknown' },
        default: 'fallback',
      }
      expect(validateSettingValue(def, 'value')).toBe('fallback')
    })
  })
})

// ── mergeSettingsWithDefaults ─────────────────────────────────────────

describe('mergeSettingsWithDefaults', () => {
  const schema: ThemeSettingDefinition[] = [
    { key: 'title', type: 'text', label: { en: 'Title' }, default: 'Default' },
    { key: 'color', type: 'color', label: { en: 'Color' }, default: '#000' },
    { key: 'show', type: 'boolean', label: { en: 'Show' }, default: true },
  ]

  it('uses provided values when they are valid', () => {
    const result = mergeSettingsWithDefaults(schema, {
      title: 'My Title',
      color: '#fff',
      show: false,
    })
    expect(result).toEqual({
      title: 'My Title',
      color: '#fff',
      show: false,
    })
  })

  it('falls back to defaults for missing keys', () => {
    const result = mergeSettingsWithDefaults(schema, {
      title: 'My Title',
    })
    expect(result).toEqual({
      title: 'My Title',
      color: '#000',
      show: true,
    })
  })

  it('prunes extra keys not in schema', () => {
    const result = mergeSettingsWithDefaults(schema, {
      title: 'My Title',
      color: '#fff',
      show: true,
      extraKey: 'should be removed',
    })
    expect(result).not.toHaveProperty('extraKey')
    expect(Object.keys(result)).toEqual(['title', 'color', 'show'])
  })

  it('validates values through validateSettingValue', () => {
    const result = mergeSettingsWithDefaults(schema, {
      title: 123, // invalid: not a string
      color: '#fff',
      show: 'yes', // invalid: not a boolean
    })
    expect(result).toEqual({
      title: 'Default',
      color: '#fff',
      show: true,
    })
  })

  it('returns all defaults when values is empty', () => {
    const result = mergeSettingsWithDefaults(schema, {})
    expect(result).toEqual({
      title: 'Default',
      color: '#000',
      show: true,
    })
  })
})

// ── getDefaultSettings ───────────────────────────────────────────────

describe('getDefaultSettings', () => {
  it('extracts default values from schema', () => {
    const schema: ThemeSettingDefinition[] = [
      { key: 'title', type: 'text', label: { en: 'Title' }, default: 'Hello' },
      { key: 'visible', type: 'boolean', label: { en: 'Visible' }, default: false },
      { key: 'count', type: 'number', label: { en: 'Count' }, default: 10 },
    ]
    expect(getDefaultSettings(schema)).toEqual({
      title: 'Hello',
      visible: false,
      count: 10,
    })
  })

  it('returns empty object for empty schema', () => {
    expect(getDefaultSettings([])).toEqual({})
  })

  it('preserves null defaults', () => {
    const schema: ThemeSettingDefinition[] = [
      { key: 'image', type: 'image', label: { en: 'Image' }, default: null },
    ]
    expect(getDefaultSettings(schema)).toEqual({ image: null })
  })
})

// ── validateThemeConfig ──────────────────────────────────────────────

describe('validateThemeConfig', () => {
  const validConfig: ThemeConfig = {
    name: 'My Theme',
    version: '1.0.0',
    sdk_version: '1.0.0',
    locales: ['en'],
    settings: [],
  }

  it('returns no errors for a valid config', () => {
    expect(validateThemeConfig(validConfig)).toEqual([])
  })

  it('reports missing name', () => {
    const errors = validateThemeConfig({ ...validConfig, name: undefined as unknown as string })
    expect(errors).toContain('Theme name is required')
  })

  it('reports empty string name', () => {
    const errors = validateThemeConfig({ ...validConfig, name: '' })
    expect(errors).toContain('Theme name is required')
  })

  it('reports missing version', () => {
    const errors = validateThemeConfig({ ...validConfig, version: undefined as unknown as string })
    expect(errors).toContain('Theme version is required')
  })

  it('reports missing sdk_version', () => {
    const errors = validateThemeConfig({
      ...validConfig,
      sdk_version: undefined as unknown as string,
    })
    expect(errors).toContain('SDK version is required')
  })

  it('reports missing locales', () => {
    const errors = validateThemeConfig({
      ...validConfig,
      locales: undefined as unknown as string[],
    })
    expect(errors).toContain('At least one locale must be specified')
  })

  it('reports empty locales array', () => {
    const errors = validateThemeConfig({ ...validConfig, locales: [] })
    expect(errors).toContain('At least one locale must be specified')
  })

  it('reports duplicate setting keys', () => {
    const errors = validateThemeConfig({
      ...validConfig,
      settings: [
        { key: 'title', type: 'text', label: { en: 'Title' }, default: '' },
        { key: 'title', type: 'text', label: { en: 'Title 2' }, default: '' },
      ],
    })
    expect(errors).toContain('Duplicate setting key: title')
  })

  it('reports settings without a key', () => {
    const errors = validateThemeConfig({
      ...validConfig,
      settings: [
        { key: '', type: 'text', label: { en: 'No Key' }, default: '' },
      ],
    })
    expect(errors).toContain('Each setting must have a key')
  })

  it('reports settings without a type', () => {
    const errors = validateThemeConfig({
      ...validConfig,
      settings: [
        { key: 'title', type: '' as ThemeSettingDefinition['type'], label: { en: 'Title' }, default: '' },
      ],
    })
    expect(errors).toContain('Setting "title" must have a type')
  })

  it('reports settings without a label object', () => {
    const errors = validateThemeConfig({
      ...validConfig,
      settings: [
        {
          key: 'title',
          type: 'text',
          label: 'Not an object' as unknown as Record<string, string>,
          default: '',
        },
      ],
    })
    expect(errors).toContain('Setting "title" must have a label object')
  })

  it('reports multiple errors at once', () => {
    const errors = validateThemeConfig({})
    expect(errors.length).toBeGreaterThanOrEqual(3)
    expect(errors).toContain('Theme name is required')
    expect(errors).toContain('Theme version is required')
    expect(errors).toContain('SDK version is required')
  })
})
