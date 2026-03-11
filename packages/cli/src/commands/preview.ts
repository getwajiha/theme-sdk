/**
 * wajiha preview
 *
 * Uploads the built theme to the platform in preview mode.
 * The theme is NOT activated -- it is accessible via a special preview URL
 * so the tenant admin can review before going live.
 *
 * Steps:
 *   1. Read the .wajiha-build/ output
 *   2. Authenticate with WAJIHA_API_URL / WAJIHA_API_KEY
 *   3. POST to /api/tenant/theme/upload with status "preview"
 *   4. Display the preview URL
 */

import { promises as fs } from 'fs'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
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

export async function previewCommand(): Promise<void> {
  const cwd = process.cwd()
  const buildDir = path.join(cwd, '.wajiha-build')

  console.log('')
  console.log(chalk.bold('Uploading theme for preview'))
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
  console.log('')

  // ── Authenticate ──────────────────────────────────────────────────

  const { apiUrl } = getApiConfig()

  // ── Collect and upload ────────────────────────────────────────────

  const spinner = ora('Packaging bundle...').start()

  const allFiles = await collectFiles(buildDir)
  const fileContents: Record<string, string> = {}
  for (const file of allFiles) {
    const content = await fs.readFile(file.absolute)
    fileContents[file.relative] = content.toString('base64')
  }

  spinner.text = 'Uploading preview...'

  let response: Response
  try {
    response = await authenticatedFetch(
      `${apiUrl}/api/tenant/theme/upload`,
      {
        method: 'POST',
        body: JSON.stringify({
          manifest,
          files: fileContents,
          status: 'preview',
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
    previewUrl: string
  }
  spinner.succeed('Preview uploaded!')

  // ── Report ────────────────────────────────────────────────────────

  console.log('')
  console.log(chalk.green.bold('Preview ready!'))
  console.log('')
  console.log('  Preview URL:')
  console.log(chalk.cyan(`    ${result.previewUrl}`))
  console.log('')
  console.log(
    chalk.gray(
      '  The preview is not visible to end users. Share the URL with your team to review.'
    )
  )
  console.log(
    chalk.gray(
      '  To activate, use "wajiha push --activate" or the admin panel.'
    )
  )
  console.log('')
}
