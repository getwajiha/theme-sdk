// ── Provider ────────────────────────────────────────────────────────
export { ThemeProvider, ThemeContext, type ThemeProviderProps } from './provider'

// ── Hooks ───────────────────────────────────────────────────────────
export {
  useThemeData,
  useTenant,
  useProducts,
  useProduct,
  useLocale,
  useNavigation,
  useSettings,
  useCurrentPage,
  useUser,
  type UseLocaleReturn,
} from './hooks'

// ── Types ───────────────────────────────────────────────────────────
export type {
  ThemePageData,
  TenantInfo,
  Navigation,
  MenuItem,
  LocaleInfo,
  Appearance,
  PageType,
  PageMeta,
  PageInfo,
  UserInfo,
  Product,
  ErrorInfo,
  ThemeSettingType,
  ThemeSettingOption,
  ThemeSettingDefinition,
  ThemeConfig,
  ThemeRoutes,
  DataRequirements,
  ProductDataRequirement,
  TemplateProps,
  LayoutProps,
  SectionProps,
} from './types'

// ── Settings ────────────────────────────────────────────────────────
export {
  validateSettingValue,
  mergeSettingsWithDefaults,
  getDefaultSettings,
  validateThemeConfig,
} from './settings'

// ── Tokens (TypeScript contract — CSS available at './tokens.css') ──
export type {
  ThemeTokens,
  DocsSurfaceTokens,
  RadiusTokens,
  SpacingTokens,
  ElevationTokens,
  ZIndexTokens,
  MotionTokens,
  BreakpointTokens,
  FocusTokens,
  StatusPaletteTokens,
} from './types/tokens'
