/**
 * Theme SDK Types
 *
 * TypeScript interfaces for all data contexts available to themes.
 * These types define the contract between the platform and theme code.
 */

// ── Tenant ──────────────────────────────────────────────────────────

export interface TenantInfo {
  name: string
  domain: string
  logo: string | null
  favicon: string | null
  description: string | null
}

// ── Navigation ──────────────────────────────────────────────────────

export interface MenuItem {
  id: string
  label: string
  url: string
  sortOrder: number
  children: MenuItem[]
}

export interface Navigation {
  main: MenuItem[]
  footer: MenuItem[]
}

// ── Locale / i18n ───────────────────────────────────────────────────

export interface LocaleInfo {
  current: string
  available: string[]
  direction: 'ltr' | 'rtl'
  messages: Record<string, string>
}

// ── Theme Settings ──────────────────────────────────────────────────

export type ThemeSettingType = 'text' | 'color' | 'font' | 'boolean' | 'number' | 'select' | 'image' | 'array' | 'link'

export interface ThemeSettingOption {
  value: string
  label: Record<string, string>
}

export interface ThemeSettingDefinition {
  key: string
  type: ThemeSettingType
  label: Record<string, string>
  default: unknown
  options?: ThemeSettingOption[]
  item_type?: string
  min?: number
  max?: number
  maxLength?: number
  maxItems?: number
}

// ── Appearance ──────────────────────────────────────────────────────

export interface Appearance {
  colorMode: 'light' | 'dark'
}

// ── Page ────────────────────────────────────────────────────────────

export type PageType = 'index' | 'page' | 'products' | 'error'

export interface PageMeta {
  title: string
  description: string
  ogImage?: string
}

export interface PageInfo {
  type: PageType
  slug?: string
  meta: PageMeta
  content?: string
}

// ── User ────────────────────────────────────────────────────────────

export interface UserInfo {
  id: string
  name: string
  email: string
  avatar?: string
  isAuthenticated: boolean
}

// ── Products ────────────────────────────────────────────────────────

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  logo: string | null
  status: string
  isPublic: boolean
  publishedAt: string | null
}

// ── Error ───────────────────────────────────────────────────────────

export interface ErrorInfo {
  code: number
  message: string
  description?: string
}

// ── Main Data Context ───────────────────────────────────────────────

export interface ThemePageData {
  tenant: TenantInfo
  navigation: Navigation
  locale: LocaleInfo
  settings: Record<string, unknown>
  appearance: Appearance
  page: PageInfo
  user?: UserInfo
  products?: Product[]
  error?: ErrorInfo
}

// ── Data Requirements (per-template declarations) ───────────────────

export interface ProductDataRequirement {
  featured?: boolean
  limit?: number
}

export interface DataRequirements {
  products?: ProductDataRequirement | boolean
  navigation?: boolean
}

// ── Theme Config (wajiha.theme.json) ────────────────────────────────

export interface ThemeRoutes {
  [path: string]: string
}

export interface ThemeConfig {
  name: string
  version: string
  author?: string
  description?: string
  sdk_version: string
  settings: ThemeSettingDefinition[]
  routes?: ThemeRoutes
  locales: string[]
}

// ── Template Component Props ────────────────────────────────────────

export interface TemplateProps {
  data: ThemePageData
}

export interface LayoutProps {
  children: React.ReactNode
  data: ThemePageData
}

export interface SectionProps {
  data: ThemePageData
  [key: string]: unknown
}
