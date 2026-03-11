/**
 * Wajiha CLI
 *
 * Command-line tool for building and deploying custom themes
 * on the Wajiha multi-tenant platform.
 *
 * Usage:
 *   wajiha init [name]     Create a new theme project
 *   wajiha dev              Start the local dev server with hot reload
 *   wajiha build            Bundle the theme for production
 *   wajiha push             Upload and activate the theme
 *   wajiha pull             Download the currently active theme
 *   wajiha preview          Upload theme in preview mode (not activated)
 */

import { Command } from 'commander'
import chalk from 'chalk'
import { initCommand } from './commands/init.js'
import { devCommand } from './commands/dev.js'
import { buildCommand } from './commands/build.js'
import { pushCommand } from './commands/push.js'
import { pullCommand } from './commands/pull.js'
import { previewCommand } from './commands/preview.js'

const program = new Command()

program
  .name('wajiha')
  .description('CLI tool for Wajiha theme development')
  .version('1.0.0')

// ── init ────────────────────────────────────────────────────────────

program
  .command('init')
  .description('Create a new theme project from the starter template')
  .argument('[name]', 'Theme directory name', 'my-wajiha-theme')
  .option('-t, --template <name>', 'Template to use', 'starter')
  .action(initCommand)

// ── dev ─────────────────────────────────────────────────────────────

program
  .command('dev')
  .description('Start the development server with hot reload')
  .option('-p, --port <number>', 'Port to run on', '3100')
  .action(devCommand)

// ── build ───────────────────────────────────────────────────────────

program
  .command('build')
  .description('Validate and bundle the theme for deployment')
  .action(buildCommand)

// ── push ────────────────────────────────────────────────────────────

program
  .command('push')
  .description('Upload and activate the built theme on the platform')
  .option('--activate', 'Activate immediately without confirmation', false)
  .action(pushCommand)

// ── pull ────────────────────────────────────────────────────────────

program
  .command('pull')
  .description('Download the currently active theme from the platform')
  .option('-o, --output <dir>', 'Output directory', '.')
  .action(pullCommand)

// ── preview ─────────────────────────────────────────────────────────

program
  .command('preview')
  .description('Upload the theme in preview mode without activating it')
  .action(previewCommand)

// ── Error handling ──────────────────────────────────────────────────

program.exitOverride((err) => {
  if (err.code === 'commander.helpDisplayed' || err.code === 'commander.version') {
    process.exit(0)
  }
  console.error(chalk.red('Error:'), err.message)
  process.exit(1)
})

program.parse()
