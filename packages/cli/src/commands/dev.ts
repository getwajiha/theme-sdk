/**
 * wajiha dev
 *
 * Starts a local development server on port 3100 (configurable) that:
 *   - Serves the theme with mock tenant data
 *   - Bundles template files on-the-fly with esbuild
 *   - Watches for file changes with chokidar
 *   - Pushes hot-reload signals to the browser over WebSocket
 *
 * The dev server renders each template with realistic mock data so
 * theme developers can iterate without a running platform instance.
 */

import chalk from 'chalk'
import ora from 'ora'
import { loadThemeConfig } from '../validation.js'
import { createDevServer } from '../dev-server/server.js'

// ── Command handler ─────────────────────────────────────────────────

export async function devCommand(options: { port: string }): Promise<void> {
  const port = parseInt(options.port, 10) || 3100
  const cwd = process.cwd()

  console.log('')
  console.log(chalk.bold('Wajiha Theme Dev Server'))
  console.log('')

  // Validate that we are inside a theme directory
  const spinner = ora('Loading theme config...').start()

  let config
  try {
    config = await loadThemeConfig(cwd)
    spinner.succeed(`Theme: ${chalk.cyan(config.name)} v${config.version}`)
  } catch (err) {
    spinner.fail(
      err instanceof Error ? err.message : 'Failed to load theme config.'
    )
    process.exit(1)
  }

  console.log(chalk.gray(`  Locales: ${config.locales.join(', ')}`))
  console.log(chalk.gray(`  Settings: ${config.settings.length} defined`))
  console.log('')

  // Start the dev server (Express + WebSocket + chokidar watcher)
  try {
    await createDevServer({ port, themeDir: cwd, config })
  } catch (err) {
    console.error(
      chalk.red('Error:'),
      err instanceof Error ? err.message : 'Failed to start dev server.'
    )
    process.exit(1)
  }
}
