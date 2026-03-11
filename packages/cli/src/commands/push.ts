/**
 * wajiha push
 *
 * Uploads the built theme bundle to the platform and optionally activates it.
 *
 * Steps:
 *   1. Read the .wajiha-build/ output (requires a prior "wajiha build")
 *   2. Authenticate with WAJIHA_API_URL / WAJIHA_API_KEY env vars
 *   3. POST the bundle to /api/tenant/theme/upload
 *   4. Prompt the user to confirm activation
 *   5. Report success or failure
 */

import { promises as fs } from 'fs'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import prompts from 'prompts'
import { getApiConfig, authenticatedFetch } from '../auth.js'

// ── Helpers ─────────────────────────────────────────────────────────

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

// ── Command handler ─────────────────────────────────────────────────

export async function pushCommand(options: {
  activate: boolean
}): Promise<void> {
  const cwd = process.cwd()
  const buildDir = path.join(cwd, '.wajiha-build')

  console.log('')
  console.log(chalk.bold('Pushing theme to the platform'))
  console.log('')

  // ── Check build output exists ─────────────────────────────────────

  try {
    await fs.access(buildDir)
  } catch {
    console.error(
      chalk.red('Error:'),
      '.wajiha-build/ directory not found.'
    )
    console.error(chalk.gray('Run "wajiha build" first.'))
    process.exit(1)
  }

  // ── Read manifest ─────────────────────────────────────────────────

  const manifestPath = path.join(buildDir, 'manifest.json')
  let manifest: Record<string, unknown>
  try {
    manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'))
  } catch {
    console.error(
      chalk.red('Error:'),
      'manifest.json not found in .wajiha-build/. Re-run "wajiha build".'
    )
    process.exit(1)
  }

  console.log(chalk.gray(`  Theme: ${manifest.name} v${manifest.version}`))
  console.log(
    chalk.gray(`  Hash:  ${(manifest.bundleHash as string).slice(0, 16)}`)
  )
  console.log('')

  // ── Authenticate ──────────────────────────────────────────────────

  const { apiUrl } = getApiConfig()

  // ── Collect files ─────────────────────────────────────────────────

  const spinner = ora('Packaging bundle...').start()

  const allFiles = await collectFiles(buildDir)
  const fileContents: Record<string, string> = {}
  for (const file of allFiles) {
    const content = await fs.readFile(file.absolute)
    fileContents[file.relative] = content.toString('base64')
  }

  spinner.text = 'Uploading to platform...'

  // ── Upload ────────────────────────────────────────────────────────

  let response: Response
  try {
    response = await authenticatedFetch(
      `${apiUrl}/api/tenant/theme/upload`,
      {
        method: 'POST',
        body: JSON.stringify({
          manifest,
          files: fileContents,
        }),
      }
    )
  } catch (err) {
    spinner.fail('Upload failed.')
    console.error(
      chalk.red('Error:'),
      err instanceof Error ? err.message : 'Network error.'
    )
    process.exit(1)
  }

  if (!response.ok) {
    spinner.fail('Upload rejected by the platform.')
    const body = await response.json().catch(() => ({
      message: response.statusText,
    }))
    console.error(
      chalk.red('Error:'),
      (body as { message?: string }).message || `HTTP ${response.status}`
    )
    process.exit(1)
  }

  const result = (await response.json()) as {
    themeId: string
    previewUrl?: string
  }
  spinner.succeed('Bundle uploaded.')

  // ── Activate ──────────────────────────────────────────────────────

  let shouldActivate = options.activate

  if (!shouldActivate) {
    const answer = await prompts({
      type: 'confirm',
      name: 'activate',
      message: 'Activate this theme now?',
      initial: true,
    })
    shouldActivate = answer.activate
  }

  if (shouldActivate) {
    const activateSpinner = ora('Activating theme...').start()
    try {
      const activateRes = await authenticatedFetch(
        `${apiUrl}/api/tenant/theme/activate`,
        {
          method: 'POST',
          body: JSON.stringify({ themeId: result.themeId }),
        }
      )

      if (!activateRes.ok) {
        activateSpinner.fail('Activation failed.')
        const body = await activateRes.json().catch(() => ({
          message: activateRes.statusText,
        }))
        console.error(
          chalk.red('Error:'),
          (body as { message?: string }).message ||
            `HTTP ${activateRes.status}`
        )
        process.exit(1)
      }

      activateSpinner.succeed('Theme activated!')
    } catch (err) {
      activateSpinner.fail('Activation failed.')
      console.error(
        chalk.red('Error:'),
        err instanceof Error ? err.message : 'Network error.'
      )
      process.exit(1)
    }
  }

  // ── Deploy Keycloak CSS (if present) ─────────────────────────────

  const keycloakManifest = manifest.keycloak as
    | { customCSS?: boolean; reactBundle?: boolean }
    | undefined
  if (keycloakManifest?.customCSS || keycloakManifest?.reactBundle) {
    const keycloakSpinner = ora('Deploying Keycloak assets...').start()
    try {
      const payload: Record<string, string> = {}

      // Include CSS if present
      if (keycloakManifest.customCSS) {
        const cssPath = path.join(buildDir, 'keycloak', 'styles.css')
        const css = await fs.readFile(cssPath, 'utf-8')
        payload.css = Buffer.from(css).toString('base64')
      }

      // Include React bundle if present
      if (keycloakManifest.reactBundle) {
        const bundlePath = path.join(buildDir, 'keycloak', 'bundle.js')
        const bundle = await fs.readFile(bundlePath, 'utf-8')
        payload.bundle = Buffer.from(bundle).toString('base64')
      }

      const kcRes = await authenticatedFetch(
        `${apiUrl}/api/tenant/theme/keycloak-css`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      )

      if (kcRes.ok) {
        const parts = []
        if (keycloakManifest.customCSS) parts.push('CSS')
        if (keycloakManifest.reactBundle) parts.push('React bundle')
        keycloakSpinner.succeed(`Keycloak ${parts.join(' + ')} deployed.`)
      } else {
        keycloakSpinner.warn('Keycloak assets upload failed (non-critical).')
      }
    } catch {
      keycloakSpinner.warn('Keycloak assets upload failed (non-critical).')
    }
  }

  // ── Report ────────────────────────────────────────────────────────

  console.log('')
  console.log(chalk.green.bold('Push complete!'))
  if (shouldActivate) {
    console.log(chalk.gray('  Your theme is now live.'))
  } else {
    console.log(
      chalk.gray(
        '  Theme uploaded but not activated. Use the admin panel to activate.'
      )
    )
  }
  console.log('')
}
