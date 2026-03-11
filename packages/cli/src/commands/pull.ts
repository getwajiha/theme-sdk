/**
 * wajiha pull
 *
 * Downloads the currently active theme from the platform and writes
 * the files to the local directory. Useful for starting local development
 * from an existing deployed theme.
 *
 * Steps:
 *   1. Authenticate with WAJIHA_API_URL / WAJIHA_API_KEY
 *   2. GET /api/tenant/theme/bundle to download the active theme
 *   3. Extract files to the output directory
 */

import { promises as fs } from 'fs'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import { getApiConfig, authenticatedFetch } from '../auth.js'

// ── Command handler ─────────────────────────────────────────────────

export async function pullCommand(options: { output: string }): Promise<void> {
  const outputDir = path.resolve(process.cwd(), options.output)

  console.log('')
  console.log(chalk.bold('Pulling active theme from the platform'))
  console.log('')

  // ── Authenticate ──────────────────────────────────────────────────

  const { apiUrl } = getApiConfig()

  // ── Download ──────────────────────────────────────────────────────

  const spinner = ora('Downloading theme bundle...').start()

  let response: Response
  try {
    response = await authenticatedFetch(
      `${apiUrl}/api/tenant/theme/bundle`,
      { method: 'GET' }
    )
  } catch (err) {
    spinner.fail('Download failed.')
    console.error(
      chalk.red('Error:'),
      err instanceof Error ? err.message : 'Network error.'
    )
    process.exit(1)
  }

  if (!response.ok) {
    if (response.status === 404) {
      spinner.fail('No active theme found on the platform.')
      console.log(chalk.gray('Deploy a theme first with "wajiha push".'))
      return
    }
    spinner.fail('Download failed.')
    const body = await response.json().catch(() => ({
      message: response.statusText,
    }))
    console.error(
      chalk.red('Error:'),
      (body as { message?: string }).message || `HTTP ${response.status}`
    )
    process.exit(1)
  }

  const data = (await response.json()) as {
    version: string
    name: string
    files: Record<string, string>
  }

  spinner.text = 'Extracting files...'

  // ── Write files ───────────────────────────────────────────────────

  let fileCount = 0
  for (const [filePath, content] of Object.entries(data.files)) {
    const fullPath = path.join(outputDir, filePath)
    await fs.mkdir(path.dirname(fullPath), { recursive: true })
    await fs.writeFile(fullPath, Buffer.from(content, 'base64'))
    fileCount++
  }

  spinner.succeed(`Extracted ${fileCount} files.`)

  // ── Report ────────────────────────────────────────────────────────

  console.log('')
  console.log(chalk.green.bold('Pull complete!'))
  console.log(chalk.gray(`  Theme: ${data.name} v${data.version}`))
  console.log(chalk.gray(`  Files: ${fileCount}`))
  console.log(chalk.gray(`  Output: ${outputDir}`))
  console.log('')
}
