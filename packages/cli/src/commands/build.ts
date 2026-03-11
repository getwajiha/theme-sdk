/**
 * wajiha build
 *
 * Validates the theme structure, then bundles all templates, layouts,
 * and assets into the .wajiha-build/ directory for deployment.
 *
 * Build steps:
 *   1. Load and validate wajiha.theme.json
 *   2. Validate templates and locales
 *   3. Bundle server-side code with esbuild (ESM, React JSX)
 *   4. Bundle client-side code with esbuild (IIFE, minified)
 *   5. Copy static assets
 *   6. Generate manifest.json with SHA-256 hash
 *   7. Report bundle sizes
 */

import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'
import chalk from 'chalk'
import ora from 'ora'
import * as esbuild from 'esbuild'
import { glob } from 'glob'
import { loadThemeConfig, validateAll } from '../validation.js'
import { buildKeycloakBundle } from '../keycloak/build.js'

// ── Helpers ─────────────────────────────────────────────────────────

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

async function hashFile(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath)
  return crypto.createHash('sha256').update(content).digest('hex')
}

async function collectFiles(
  dir: string,
  prefix = ''
): Promise<{ relative: string; absolute: string }[]> {
  const results: { relative: string; absolute: string }[] = []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name
    const absolute = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...(await collectFiles(absolute, relative)))
    } else {
      results.push({ relative, absolute })
    }
  }
  return results
}

async function copyDir(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath)
    } else {
      await fs.copyFile(srcPath, destPath)
    }
  }
}

// ── Command handler ─────────────────────────────────────────────────

export async function buildCommand(): Promise<void> {
  const cwd = process.cwd()
  const buildDir = path.join(cwd, '.wajiha-build')

  console.log('')
  console.log(chalk.bold('Building theme for deployment'))
  console.log('')

  // ── Step 1: Validate ──────────────────────────────────────────────

  const validateSpinner = ora('Validating theme structure...').start()

  let config
  try {
    config = await loadThemeConfig(cwd)
  } catch (err) {
    validateSpinner.fail(
      err instanceof Error ? err.message : 'Failed to load theme config.'
    )
    process.exit(1)
  }

  const errors = await validateAll(cwd)
  if (errors.length > 0) {
    validateSpinner.fail('Validation failed:')
    for (const error of errors) {
      console.error(chalk.red(`  - ${error}`))
    }
    process.exit(1)
  }
  validateSpinner.succeed('Theme structure is valid.')

  // ── Step 2: Clean build dir ───────────────────────────────────────

  await fs.rm(buildDir, { recursive: true, force: true })
  await fs.mkdir(buildDir, { recursive: true })

  // ── Step 3: Bundle server code ────────────────────────────────────

  const bundleSpinner = ora('Bundling server code...').start()

  const templateFiles = await glob('templates/*.{tsx,jsx}', { cwd })
  const layoutFiles = await glob('layouts/*.{tsx,jsx}', { cwd })
  const entryPoints = [...templateFiles, ...layoutFiles].map((f) =>
    path.join(cwd, f)
  )

  try {
    await esbuild.build({
      entryPoints,
      outdir: path.join(buildDir, 'server'),
      bundle: true,
      format: 'esm',
      platform: 'node',
      target: 'node20',
      jsx: 'automatic',
      external: ['react', 'react-dom', '@getwajiha/theme-sdk'],
      sourcemap: true,
      minify: false,
      logLevel: 'silent',
    })
    bundleSpinner.succeed('Server bundle created.')
  } catch (err) {
    bundleSpinner.fail('Server bundling failed.')
    console.error(
      chalk.red(
        err instanceof Error ? err.message : 'Unknown esbuild error.'
      )
    )
    process.exit(1)
  }

  // ── Step 4: Bundle client code ────────────────────────────────────

  const clientSpinner = ora('Bundling client code...').start()

  try {
    await esbuild.build({
      entryPoints,
      outdir: path.join(buildDir, 'client'),
      bundle: true,
      format: 'esm',
      platform: 'browser',
      target: ['es2020'],
      jsx: 'automatic',
      external: ['react', 'react-dom', '@getwajiha/theme-sdk'],
      sourcemap: true,
      minify: true,
      logLevel: 'silent',
    })
    clientSpinner.succeed('Client bundle created.')
  } catch (err) {
    clientSpinner.fail('Client bundling failed.')
    console.error(
      chalk.red(
        err instanceof Error ? err.message : 'Unknown esbuild error.'
      )
    )
    process.exit(1)
  }

  // ── Step 5: Copy static assets ────────────────────────────────────

  const assetsSpinner = ora('Copying static assets...').start()

  // Copy locales
  const localesDir = path.join(cwd, 'locales')
  try {
    await copyDir(localesDir, path.join(buildDir, 'locales'))
  } catch {
    // Non-critical, validation already checked this
  }

  // Copy assets directory
  const assetsDir = path.join(cwd, 'assets')
  try {
    await fs.access(assetsDir)
    await copyDir(assetsDir, path.join(buildDir, 'assets'))
  } catch {
    // No assets directory is fine
  }

  // Copy wajiha.theme.json
  await fs.copyFile(
    path.join(cwd, 'wajiha.theme.json'),
    path.join(buildDir, 'wajiha.theme.json')
  )

  // Bundle Keycloak CSS if present
  const keycloakDir = path.join(cwd, 'keycloak')
  let hasKeycloakCSS = false
  try {
    await fs.access(path.join(keycloakDir, 'styles.css'))
    const cssContent = await fs.readFile(path.join(keycloakDir, 'styles.css'), 'utf-8')

    // Minify CSS with esbuild
    const minified = await esbuild.transform(cssContent, {
      loader: 'css',
      minify: true,
    })

    const keycloakBuildDir = path.join(buildDir, 'keycloak')
    await fs.mkdir(keycloakBuildDir, { recursive: true })
    await fs.writeFile(path.join(keycloakBuildDir, 'styles.css'), minified.code)
    hasKeycloakCSS = true
  } catch {
    // No keycloak directory or styles.css — skip
  }

  assetsSpinner.succeed('Static assets copied.')

  // ── Step 5b: Build Keycloak React bundle (if present) ─────────────

  let hasKeycloakReact = false
  const keycloakReactSpinner = ora('Checking for Keycloak React components...').start()
  try {
    hasKeycloakReact = await buildKeycloakBundle(cwd, buildDir)
    if (hasKeycloakReact) {
      keycloakReactSpinner.succeed('Keycloak React bundle created.')
    } else {
      keycloakReactSpinner.info('No Keycloak React components found (skipped).')
    }
  } catch (err) {
    keycloakReactSpinner.fail('Keycloak React bundling failed.')
    console.error(
      chalk.red(
        err instanceof Error ? err.message : 'Unknown esbuild error.'
      )
    )
    process.exit(1)
  }

  // ── Step 6: Generate manifest ─────────────────────────────────────

  const manifestSpinner = ora('Generating manifest...').start()

  const allFiles = await collectFiles(buildDir)
  const fileHashes: Record<string, string> = {}
  let totalSize = 0

  for (const file of allFiles) {
    const stat = await fs.stat(file.absolute)
    totalSize += stat.size
    fileHashes[file.relative] = await hashFile(file.absolute)
  }

  // Compute a single bundle hash from all file hashes
  const bundleHash = crypto
    .createHash('sha256')
    .update(Object.values(fileHashes).sort().join(''))
    .digest('hex')

  const manifest: Record<string, unknown> = {
    name: config.name,
    version: config.version,
    sdk_version: config.sdk_version,
    locales: config.locales,
    bundleHash,
    totalFiles: allFiles.length,
    totalSize,
    builtAt: new Date().toISOString(),
    files: fileHashes,
  }

  if (hasKeycloakCSS || hasKeycloakReact) {
    manifest.keycloak = { customCSS: hasKeycloakCSS, reactBundle: hasKeycloakReact }
  }

  await fs.writeFile(
    path.join(buildDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  )

  manifestSpinner.succeed('Manifest generated.')

  // ── Step 7: Report ────────────────────────────────────────────────

  console.log('')
  console.log(chalk.green.bold('Build complete!'))
  console.log('')
  console.log(chalk.gray('  Output:'), '.wajiha-build/')
  console.log(chalk.gray('  Theme:'), config.name, `v${config.version}`)
  console.log(chalk.gray('  Files:'), manifest.totalFiles)
  console.log(chalk.gray('  Size:'), formatSize(totalSize))
  console.log(chalk.gray('  Hash:'), bundleHash.slice(0, 16))
  console.log('')
  console.log('  Next steps:')
  console.log(chalk.cyan('    wajiha push       Deploy to the platform'))
  console.log(chalk.cyan('    wajiha preview    Upload as preview'))
  console.log('')
}
