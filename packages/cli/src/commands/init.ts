/**
 * wajiha init [name]
 *
 * Scaffolds a new theme directory from the starter template.
 * Creates the standard file structure that the platform expects:
 *
 *   <name>/
 *     wajiha.theme.json     Theme configuration
 *     package.json          Node dependencies
 *     layouts/
 *       default.tsx         Default layout (header + footer)
 *     templates/
 *       index.tsx           Home page
 *       page.tsx            Generic content page
 *       products.tsx        Product listing page
 *       error.tsx           Error page
 *     locales/
 *       en.json             English strings
 *       ar.json             Arabic strings
 *     assets/
 *       styles/
 *         theme.css         Starter stylesheet
 */

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import chalk from 'chalk'
import ora from 'ora'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ── Template source directory ───────────────────────────────────────

/**
 * Resolve the path to the bundled starter template.
 * tsup bundles everything into a single dist/index.js file, so
 * __dirname is the dist/ directory. We go up one level to the
 * package root, then into templates/starter/.
 */
function getTemplateDir(): string {
  // From dist/index.js -> ../templates/starter
  return path.resolve(__dirname, '..', 'templates', 'starter')
}

// ── File copying ────────────────────────────────────────────────────

async function copyDir(src: string, dest: string): Promise<number> {
  let count = 0
  await fs.mkdir(dest, { recursive: true })
  const entries = await fs.readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      count += await copyDir(srcPath, destPath)
    } else {
      await fs.copyFile(srcPath, destPath)
      count++
    }
  }

  return count
}

// ── Command handler ─────────────────────────────────────────────────

export async function initCommand(
  name: string,
  _options: { template: string }
): Promise<void> {
  const targetDir = path.resolve(process.cwd(), name)

  console.log('')
  console.log(chalk.bold('Creating a new Wajiha theme:'), chalk.cyan(name))
  console.log(chalk.gray(`  Directory: ${targetDir}`))
  console.log('')

  // Guard: directory already exists
  try {
    const stat = await fs.stat(targetDir)
    if (stat.isDirectory()) {
      const entries = await fs.readdir(targetDir)
      if (entries.length > 0) {
        console.error(
          chalk.red('Error:'),
          `Directory "${name}" already exists and is not empty.`
        )
        process.exit(1)
      }
    }
  } catch {
    // Directory does not exist yet -- this is the happy path
  }

  // Copy template files
  const spinner = ora('Copying starter template...').start()

  const templateDir = getTemplateDir()
  try {
    await fs.access(templateDir)
  } catch {
    spinner.fail('Starter template not found.')
    console.error(
      chalk.gray('Expected template at:'),
      templateDir
    )
    process.exit(1)
  }

  const fileCount = await copyDir(templateDir, targetDir)
  spinner.succeed(`Copied ${fileCount} files.`)

  // Patch the theme name into wajiha.theme.json
  const configPath = path.join(targetDir, 'wajiha.theme.json')
  try {
    const raw = await fs.readFile(configPath, 'utf-8')
    const patched = raw.replace(/"name":\s*"[^"]*"/, `"name": "${name}"`)
    await fs.writeFile(configPath, patched)
  } catch {
    // Non-critical -- the user can rename manually
  }

  // Patch package.json name
  const pkgPath = path.join(targetDir, 'package.json')
  try {
    const raw = await fs.readFile(pkgPath, 'utf-8')
    const patched = raw.replace(/"name":\s*"[^"]*"/, `"name": "${name}"`)
    await fs.writeFile(pkgPath, patched)
  } catch {
    // Non-critical
  }

  // Install dependencies
  const installSpinner = ora('Installing dependencies...').start()
  try {
    execSync('npm install', { cwd: targetDir, stdio: 'pipe' })
    installSpinner.succeed('Dependencies installed.')
  } catch {
    installSpinner.warn(
      'Could not install dependencies. Run "npm install" manually.'
    )
  }

  // Done
  console.log('')
  console.log(chalk.green.bold('Theme created successfully!'))
  console.log('')
  console.log('  Get started:')
  console.log(chalk.cyan(`    cd ${name}`))
  console.log(chalk.cyan('    wajiha dev'))
  console.log('')
  console.log('  Available commands:')
  console.log(chalk.gray('    wajiha dev       Start the dev server'))
  console.log(chalk.gray('    wajiha build     Bundle for production'))
  console.log(chalk.gray('    wajiha push      Deploy to the platform'))
  console.log(chalk.gray('    wajiha pull      Download active theme'))
  console.log(chalk.gray('    wajiha preview   Upload as preview'))
  console.log('')
}
