# Changelog

All notable changes to this monorepo are documented here. The repo follows
[Semantic Versioning](https://semver.org/) per package.

## [unreleased]

### `@getwajiha/theme-sdk` 1.1.0

Additive release — no breaking changes. Existing themes built against 1.0.0
continue to work unchanged.

**Added**

- New optional CSS export: `@getwajiha/theme-sdk/tokens.css` ships the
  canonical Wajiha DS token surface (`--ds-*`, `--status-*`, system scales
  for radius / spacing / elevation / motion / breakpoints / focus). Themes
  may import the file and reference tokens directly, or opt out and supply
  their own.
- New TypeScript export: `ThemeTokens` (plus the granular building-block
  interfaces `DocsSurfaceTokens`, `RadiusTokens`, `SpacingTokens`,
  `ElevationTokens`, `ZIndexTokens`, `MotionTokens`, `BreakpointTokens`,
  `FocusTokens`, `StatusPaletteTokens`). Mirrors the CSS token contract for
  use in admin tooling and theme config typing.
- `ThemeConfig` gained an optional `tokens?: Record<string, string>` field.
  Themes may declare token overrides in their `wajiha.theme.json`. Runtime
  treats this as documentation only — tenant brand colour still flows
  through `--brand-primary-hex`.
- New regression test (`tests/tokens.test.ts`) locks the exported token
  surface against accidental rename / removal.
- README "Tokens" section documents the optional CSS scaffold and the
  TypeScript contract.

**Changed**

- Build script now runs `tsup && build:tokens`, copying `src/tokens/wajiha-ds.css`
  to `dist/tokens.css` so the new export resolves correctly.

### `@getwajiha/cli` 1.2.0

**Changed**

- Starter scaffold (`templates/starter/`) rewritten to consume the new SDK
  tokens. The starter `assets/styles/theme.css` now imports
  `@getwajiha/theme-sdk/tokens.css` and binds its `.theme-*` selectors to
  `--ds-*`, `--ds-radius-*`, and `--ds-space-*` tokens.
- Starter `wajiha.theme.json` default `primary_color` changed from `#2563eb`
  → `#0e6e6e` (Wajiha deep teal). Description updated to reference the
  shared design system.
- Starter `sdk_version` bumped to `^1.1.0`.

### `examples/default-theme` 1.1.0 (private)

Effective rewrite of the reference theme on top of the new SDK tokens.

**Changed**

- Renamed from "Midnight Prism" to "Wajiha Default" — the theme is no
  longer a violet-on-dark statement piece; it adopts the Wajiha DS canvas
  (light first, optional `.dark`).
- `assets/styles/theme.css` rewritten — every `--mp-*` token replaced with
  `--ds-*` / `--ds-radius-*` / `--ds-space-*` / `--ds-elevation-*` /
  `--status-*` references via `@import '@getwajiha/theme-sdk/tokens.css'`.
- `layouts/default.tsx` removed `adjustBrightness` / `hexToRgba` helpers
  and the inline `--mp-primary` override; brand colour now flows through
  `--brand-primary-hex` set by the platform.
- `wajiha.theme.json` dropped the `primary_color` and `accent_color`
  settings (handled at the platform level via `--brand-primary-hex`).
  `sdk_version` bumped to `^1.1.0`.
- Keycloak login bundle (`keycloak/styles.css`, `keycloak/components/*`,
  `keycloak/Login.tsx`, `keycloak/Register.tsx`) updated to reference DS
  tokens. `GlassCard` and `GlassInput` retain the visual idiom but
  renamed the namespace to align with the new theme.

---

## 1.0.0 — 2025-03-11

Initial public release. `@getwajiha/theme-sdk@1.0.0` and `@getwajiha/cli@1.1.0`
on npm. `examples/default-theme@1.0.0` private in-repo example
("Midnight Prism", violet-on-dark).
