/**
 * tokens.css regression guard
 *
 * Asserts that the canonical Wajiha DS token names exported by
 * `src/tokens/wajiha-ds.css` remain stable. If a token is removed or
 * renamed (a breaking change for downstream themes that imported it),
 * this test fails with a clear diff.
 *
 * Adding NEW tokens is allowed — the test only locks the existing ones.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const CSS_PATH = resolve(__dirname, '../src/tokens/wajiha-ds.css')

function extractTokenNames(css: string): string[] {
  const matches = css.matchAll(/--[a-zA-Z0-9-]+(?=\s*:)/g)
  const names = new Set<string>()
  for (const m of matches) names.add(m[0])
  return Array.from(names).sort()
}

describe('@getwajiha/theme-sdk/tokens.css', () => {
  it('exports the locked Wajiha DS token surface', () => {
    const css = readFileSync(CSS_PATH, 'utf-8')
    const tokens = extractTokenNames(css)

    // Locked baseline — additions are fine, removals/renames are breaking.
    const expected = [
      // Docs surface
      '--ds-accent',
      '--ds-accent-hover',
      '--ds-accent-soft',
      '--ds-bg',
      '--ds-border',
      '--ds-border-soft',
      '--ds-code',
      '--ds-code-bg',
      '--ds-fg',
      '--ds-fg-faint',
      '--ds-fg-muted',
      '--ds-page-bg',
      '--ds-selected-row',
      '--ds-surface',
      '--ds-surface-alt',
      '--ds-toggle-track',
      // Radius
      '--ds-radius-lg',
      '--ds-radius-md',
      '--ds-radius-pill',
      '--ds-radius-sm',
      '--ds-radius-xl',
      '--ds-radius-xs',
      // Spacing
      '--ds-space-0',
      '--ds-space-1',
      '--ds-space-1-5',
      '--ds-space-10',
      '--ds-space-14',
      '--ds-space-2',
      '--ds-space-20',
      '--ds-space-3',
      '--ds-space-4',
      '--ds-space-5',
      '--ds-space-6',
      '--ds-space-8',
      // Elevation
      '--ds-elevation-e0',
      '--ds-elevation-e1',
      '--ds-elevation-e2',
      '--ds-elevation-e3',
      '--ds-elevation-e4',
      '--ds-elevation-e5',
      // z-index
      '--ds-z-banner',
      '--ds-z-base',
      '--ds-z-drawer',
      '--ds-z-dropdown',
      '--ds-z-modal',
      '--ds-z-raised',
      '--ds-z-toast',
      // motion
      '--ds-motion-base',
      '--ds-motion-fast',
      '--ds-motion-instant',
      '--ds-motion-lazy',
      '--ds-motion-slow',
      '--ds-ease-in',
      '--ds-ease-in-out',
      '--ds-ease-out',
      '--ds-ease-spring',
      // breakpoints
      '--ds-bp-2xl',
      '--ds-bp-lg',
      '--ds-bp-md',
      '--ds-bp-sm',
      '--ds-bp-xl',
      // focus
      '--ds-focus-ring',
      // status palette
      '--status-danger-bg',
      '--status-danger-fg',
      '--status-danger-solid',
      '--status-info-bg',
      '--status-info-fg',
      '--status-info-solid',
      '--status-neutral-bg',
      '--status-neutral-fg',
      '--status-neutral-solid',
      '--status-ok-bg',
      '--status-ok-fg',
      '--status-ok-solid',
      '--status-patch-bg',
      '--status-patch-fg',
      '--status-patch-solid',
      '--status-serverErr-bg',
      '--status-serverErr-fg',
      '--status-serverErr-solid',
      '--status-warn-bg',
      '--status-warn-fg',
      '--status-warn-solid',
    ].sort()

    // Every locked token must still be present.
    for (const name of expected) {
      expect(tokens).toContain(name)
    }
  })

  it('declares both light (:root) and dark (.dark) selectors', () => {
    const css = readFileSync(CSS_PATH, 'utf-8')
    expect(css).toMatch(/:root\s*\{/)
    expect(css).toMatch(/\.dark\s*\{/)
  })

  it('includes the wajiha-pulse keyframes used by status dots', () => {
    const css = readFileSync(CSS_PATH, 'utf-8')
    expect(css).toMatch(/@keyframes\s+wajiha-pulse/)
  })

  it('uses --brand-primary-hex with a fallback for the docs accent', () => {
    const css = readFileSync(CSS_PATH, 'utf-8')
    expect(css).toMatch(/--ds-accent:\s*var\(--brand-primary-hex,\s*#[0-9a-fA-F]{3,8}\)/)
  })
})
