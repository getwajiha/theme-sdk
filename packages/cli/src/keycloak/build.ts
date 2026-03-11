/**
 * Keycloak React Bundle Builder
 *
 * Builds React-based login page components into a self-contained IIFE bundle
 * that can be loaded by the Keycloak FTL template. React is bundled in.
 *
 * Theme developers place components at:
 *   keycloak/Login.tsx   (required if keycloak/ has any .tsx/.jsx)
 *   keycloak/Register.tsx (optional)
 *
 * The bundle reads `window.__KC_CONTEXT__` and renders the matching page
 * into `#kc-app`, hiding the FTL fallback content on success.
 */

import { promises as fs } from 'fs'
import path from 'path'
import * as esbuild from 'esbuild'

const MAX_BUNDLE_SIZE = 500 * 1024 // 500KB

/**
 * Check if a Keycloak React login component exists in the theme.
 */
async function findEntryComponent(
  keycloakDir: string
): Promise<string | null> {
  for (const ext of ['.tsx', '.jsx']) {
    const p = path.join(keycloakDir, `Login${ext}`)
    try {
      await fs.access(p)
      return p
    } catch {
      // continue
    }
  }
  return null
}

/**
 * Check if Register component exists.
 */
async function findRegisterComponent(
  keycloakDir: string
): Promise<string | null> {
  for (const ext of ['.tsx', '.jsx']) {
    const p = path.join(keycloakDir, `Register${ext}`)
    try {
      await fs.access(p)
      return p
    } catch {
      // continue
    }
  }
  return null
}

/**
 * Build Keycloak React components into an IIFE bundle.
 *
 * @returns true if a bundle was created, false if no React components found
 */
export async function buildKeycloakBundle(
  themeDir: string,
  buildDir: string
): Promise<boolean> {
  const keycloakDir = path.join(themeDir, 'keycloak')

  // Check if keycloak directory exists
  try {
    await fs.access(keycloakDir)
  } catch {
    return false
  }

  // Check for Login component
  const loginEntry = await findEntryComponent(keycloakDir)
  if (!loginEntry) {
    return false
  }

  const registerEntry = await findRegisterComponent(keycloakDir)

  // Generate virtual entry point
  const loginImport = path.relative(keycloakDir, loginEntry).replace(/\\/g, '/')
  const registerImport = registerEntry
    ? path.relative(keycloakDir, registerEntry).replace(/\\/g, '/')
    : null

  const entrySource = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Login } from './${loginImport.replace(/\.\w+$/, '')}';
${registerImport ? `import { Register } from './${registerImport.replace(/\.\w+$/, '')}';` : ''}

(function() {
  var ctx = window.__KC_CONTEXT__;
  if (!ctx) return;

  var appEl = document.getElementById('kc-app');
  if (!appEl) return;

  var Component = null;
  if (ctx.pageId === 'login.ftl') {
    Component = Login;
  }${registerImport ? ` else if (ctx.pageId === 'register.ftl') {
    Component = Register;
  }` : ''}

  if (!Component) return;

  try {
    var root = createRoot(appEl);
    root.render(React.createElement(Component, { kcContext: ctx }));
    appEl.style.display = 'block';
    // Hide FTL fallback content
    var ftlContent = document.querySelector('.login-container');
    if (ftlContent) ftlContent.style.display = 'none';
  } catch (e) {
    console.error('[Keycloak React] Render failed:', e);
    // FTL stays visible as fallback
  }
})();
`

  // Write virtual entry to a temp file
  const entryPath = path.join(keycloakDir, '__kc_entry__.tsx')
  await fs.writeFile(entryPath, entrySource)

  try {
    // Bundle with esbuild
    const outDir = path.join(buildDir, 'keycloak')
    await fs.mkdir(outDir, { recursive: true })

    await esbuild.build({
      entryPoints: [entryPath],
      outfile: path.join(outDir, 'bundle.js'),
      bundle: true,
      format: 'iife',
      platform: 'browser',
      target: ['es2020'],
      jsx: 'automatic',
      minify: true,
      logLevel: 'silent',
      // React is bundled IN (not external) for self-contained execution
    })

    // Check bundle size
    const stat = await fs.stat(path.join(outDir, 'bundle.js'))
    if (stat.size > MAX_BUNDLE_SIZE) {
      throw new Error(
        `Keycloak bundle exceeds ${MAX_BUNDLE_SIZE / 1024}KB limit (${(stat.size / 1024).toFixed(1)}KB)`
      )
    }

    return true
  } finally {
    // Clean up temp entry file
    await fs.unlink(entryPath).catch(() => {})
  }
}
