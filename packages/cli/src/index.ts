/**
 * Wajiha CLI
 *
 * Command-line tool for building and deploying custom themes
 * on the Wajiha multi-tenant platform.
 */

import { Command } from 'commander'
import chalk from 'chalk'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { initCommand } from './commands/init.js'
import { devCommand } from './commands/dev.js'
import { buildCommand } from './commands/build.js'
import { pushCommand } from './commands/push.js'
import { pullCommand } from './commands/pull.js'
import { previewCommand } from './commands/preview.js'

const pkg = JSON.parse(
  readFileSync(fileURLToPath(new URL('../package.json', import.meta.url)), 'utf-8')
) as { version: string }

const program = new Command()

program
  .name('wajiha')
  .description('Build, preview, and deploy themes for the Wajiha platform.')
  .version(pkg.version, '-V, --version', 'Print the CLI version')
  .addHelpText(
    'after',
    `
${chalk.bold('Typical workflow:')}
  $ wajiha init my-theme          ${chalk.gray('# scaffold a new theme')}
  $ cd my-theme && npm install
  $ npm run dev                   ${chalk.gray('# preview locally at http://localhost:3100')}
  $ wajiha build                  ${chalk.gray('# bundle to .wajiha-build/')}
  $ wajiha preview                ${chalk.gray('# upload to platform, get a shareable URL')}
  $ wajiha push --activate        ${chalk.gray('# deploy to tenant')}

${chalk.bold('Environment variables (push, pull, preview):')}
  WAJIHA_API_URL                  Platform base URL (e.g. https://api.wajiha.app)
  WAJIHA_API_KEY                  Tenant API key with theme-write scope

${chalk.gray('Docs:')} https://github.com/getwajiha/theme-sdk
`
  )

// ── init ────────────────────────────────────────────────────────────

program
  .command('init')
  .description('Scaffold a new theme project from the starter template')
  .argument('[name]', 'Directory to create the theme in', 'my-wajiha-theme')
  .option('-t, --template <name>', 'Starter template to use', 'starter')
  .addHelpText(
    'after',
    `
Example:
  $ wajiha init acme-portal
  $ cd acme-portal && npm install
`
  )
  .action(initCommand)

// ── dev ─────────────────────────────────────────────────────────────

program
  .command('dev')
  .description(
    'Start a local dev server that renders the theme with mock data and hot reload'
  )
  .option('-p, --port <number>', 'Port to listen on', '3100')
  .addHelpText(
    'after',
    `
Routes served:
  /              Home (templates/index.tsx)
  /products      Products (templates/products.tsx)
  /page/:slug    Generic page (templates/page.tsx)
  /error         Error page (templates/error.tsx)

Append ?locale=ar to any route to preview RTL.
`
  )
  .action(devCommand)

// ── build ───────────────────────────────────────────────────────────

program
  .command('build')
  .description(
    'Validate wajiha.theme.json and bundle the theme into .wajiha-build/'
  )
  .action(buildCommand)

// ── push ────────────────────────────────────────────────────────────

program
  .command('push')
  .description(
    'Upload .wajiha-build/ to the platform and (optionally) activate it'
  )
  .option('--activate', 'Activate immediately without confirmation', false)
  .addHelpText(
    'after',
    `
Requires WAJIHA_API_URL and WAJIHA_API_KEY to be set.
Run "wajiha build" first to produce .wajiha-build/.
`
  )
  .action(pushCommand)

// ── pull ────────────────────────────────────────────────────────────

program
  .command('pull')
  .description('Download the currently active theme from the platform')
  .option('-o, --output <dir>', 'Directory to write the theme into', '.')
  .addHelpText(
    'after',
    `
Requires WAJIHA_API_URL and WAJIHA_API_KEY to be set.
`
  )
  .action(pullCommand)

// ── preview ─────────────────────────────────────────────────────────

program
  .command('preview')
  .description(
    'Upload .wajiha-build/ to the platform in preview mode (not activated) and print a shareable URL'
  )
  .addHelpText(
    'after',
    `
Requires WAJIHA_API_URL and WAJIHA_API_KEY to be set.
For local preview without a platform, use "wajiha dev" instead.
`
  )
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
