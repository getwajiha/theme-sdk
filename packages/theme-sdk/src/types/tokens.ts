/**
 * Wajiha DS — TypeScript token contract
 *
 * Mirrors the CSS custom properties exported by `@getwajiha/theme-sdk/tokens.css`.
 * Useful when:
 *   - building admin UI that lets a tenant override individual tokens
 *   - typing the optional `tokens` field on `ThemeConfig` (wajiha.theme.json)
 *   - generating documentation from a single source of truth
 *
 * Every token is typed as `string` because CSS custom properties are stored as
 * untyped text. The JSDoc on each field documents the *role* — what the token
 * represents and where it should be applied. This keeps the type interchange
 * lightweight while preserving design intent.
 *
 * The interface is split into nested groups so consumers can pick a subset
 * (e.g. `Pick<ThemeTokens['surface'], 'bg' | 'fg'>`).
 */

export interface DocsSurfaceTokens {
  /** Page canvas — true white in light mode, near-black in dark. */
  '--ds-bg': string
  /** Card / panel surface, slightly off the canvas. */
  '--ds-surface': string
  /** Secondary surface — striped tables, subdued tiles. */
  '--ds-surface-alt': string
  /** Standard border for cards, tables, inputs. */
  '--ds-border': string
  /** Soft border for hairline dividers. */
  '--ds-border-soft': string
  /** Primary text — headings and body. */
  '--ds-fg': string
  /** Muted text — captions and secondary copy. */
  '--ds-fg-muted': string
  /** Faint text — placeholders and helper hints. */
  '--ds-fg-faint': string
  /** Inline code text colour. */
  '--ds-code': string
  /** Inline code background. */
  '--ds-code-bg': string
  /** Docs accent — references `--brand-primary-hex` with deep-teal fallback. */
  '--ds-accent': string
  /** Tinted background for accent chips and accent rows. */
  '--ds-accent-soft': string
  /** Hover state for accent buttons / links. */
  '--ds-accent-hover': string
  /** Documentation page bg — warm off-white shell. */
  '--ds-page-bg': string
  /** Toggle off-state track — neutral grey distinct from any status hue. */
  '--ds-toggle-track': string
  /** Selected/highlighted row in tables and pickers. */
  '--ds-selected-row': string
}

export interface RadiusTokens {
  /** kbd · inline code · tags inside dense rows. */
  '--ds-radius-xs': string
  /** enum chips · status badges · file pills. */
  '--ds-radius-sm': string
  /** docs inputs · docs buttons · search field. */
  '--ds-radius-md': string
  /** docs cards · docs tables · admin inputs · admin buttons. */
  '--ds-radius-lg': string
  /** admin cards · panels · modals · drawers · top bar. */
  '--ds-radius-xl': string
  /** avatars · tabs (pill variant) · toggle · user menu. */
  '--ds-radius-pill': string
}

export interface SpacingTokens {
  '--ds-space-0': string
  '--ds-space-1': string
  '--ds-space-1-5': string
  '--ds-space-2': string
  '--ds-space-3': string
  '--ds-space-4': string
  '--ds-space-5': string
  '--ds-space-6': string
  '--ds-space-8': string
  '--ds-space-10': string
  '--ds-space-14': string
  '--ds-space-20': string
}

export interface ElevationTokens {
  '--ds-elevation-e0': string
  '--ds-elevation-e1': string
  '--ds-elevation-e2': string
  '--ds-elevation-e3': string
  '--ds-elevation-e4': string
  '--ds-elevation-e5': string
}

export interface ZIndexTokens {
  '--ds-z-base': string
  '--ds-z-raised': string
  '--ds-z-dropdown': string
  '--ds-z-banner': string
  '--ds-z-drawer': string
  '--ds-z-modal': string
  '--ds-z-toast': string
}

export interface MotionTokens {
  '--ds-motion-instant': string
  '--ds-motion-fast': string
  '--ds-motion-base': string
  '--ds-motion-slow': string
  '--ds-motion-lazy': string
  '--ds-ease-out': string
  '--ds-ease-in': string
  '--ds-ease-in-out': string
  '--ds-ease-spring': string
}

export interface BreakpointTokens {
  '--ds-bp-sm': string
  '--ds-bp-md': string
  '--ds-bp-lg': string
  '--ds-bp-xl': string
  '--ds-bp-2xl': string
}

export interface FocusTokens {
  /** Single focus-ring recipe used across the system. */
  '--ds-focus-ring': string
}

/**
 * Canonical status palette — single source of truth for status / signal
 * colour. Re-use these tokens; do not introduce new status hues.
 *
 * Pairs:
 *   - `*-fg`     foreground (text) colour
 *   - `*-bg`     soft tinted background
 *   - `*-solid`  solid pill / dot colour
 */
export interface StatusPaletteTokens {
  /** ok — 2xx · GET */
  '--status-ok-fg': string
  '--status-ok-bg': string
  '--status-ok-solid': string

  /** info — POST · informational */
  '--status-info-fg': string
  '--status-info-bg': string
  '--status-info-solid': string

  /** warn — 429 · cautionary */
  '--status-warn-fg': string
  '--status-warn-bg': string
  '--status-warn-solid': string

  /** danger — 4xx · DELETE · required */
  '--status-danger-fg': string
  '--status-danger-bg': string
  '--status-danger-solid': string

  /** serverErr — 5xx */
  '--status-serverErr-fg': string
  '--status-serverErr-bg': string
  '--status-serverErr-solid': string

  /** patch — PATCH */
  '--status-patch-fg': string
  '--status-patch-bg': string
  '--status-patch-solid': string

  /** neutral — 1xx · 3xx · default */
  '--status-neutral-fg': string
  '--status-neutral-bg': string
  '--status-neutral-solid': string
}

/**
 * Complete Wajiha DS token contract.
 *
 * A theme may declare its overrides in `wajiha.theme.json` via:
 *
 *   {
 *     "tokens": {
 *       "--ds-accent": "#7c3aed",
 *       "--ds-radius-lg": "12px"
 *     }
 *   }
 *
 * Runtime currently treats this as documentation only; per-tenant brand colour
 * still flows through `--brand-primary-hex` (set by the platform's globals).
 * The flat shape is convenient for `style={{ ... }}` injection.
 */
export type ThemeTokens =
  & DocsSurfaceTokens
  & RadiusTokens
  & SpacingTokens
  & ElevationTokens
  & ZIndexTokens
  & MotionTokens
  & BreakpointTokens
  & FocusTokens
  & StatusPaletteTokens
