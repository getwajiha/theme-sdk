/**
 * Dev Server
 *
 * Express application that serves theme renders with mock data.
 * Includes:
 *   - On-the-fly esbuild bundling of template files
 *   - WebSocket server for hot reload
 *   - chokidar file watcher that triggers re-bundles on change
 *
 * Routes:
 *   GET /                   -> index template
 *   GET /products           -> products template
 *   GET /page/:slug         -> page template
 *   GET /error              -> error template
 *   GET /__wajiha/reload.js -> Hot-reload client script
 *   WS  /__wajiha/ws        -> Hot-reload WebSocket
 */

import express from 'express'
import path from 'path'
import { promises as fs } from 'fs'
import { createServer } from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import chokidar from 'chokidar'
import * as esbuild from 'esbuild'
import chalk from 'chalk'
import type { ThemeConfig } from '../validation.js'
import { createMockPageData } from './mock-data.js'

// ── Types ───────────────────────────────────────────────────────────

interface DevServerOptions {
  port: number
  themeDir: string
  config: ThemeConfig
}

// ── Bundle cache ────────────────────────────────────────────────────

const bundleCache = new Map<string, string>()

/**
 * Bundle a single template or layout file with esbuild and cache the result.
 */
async function bundleFile(
  filePath: string,
  themeDir: string
): Promise<string> {
  const result = await esbuild.build({
    entryPoints: [filePath],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    target: ['es2020'],
    jsx: 'automatic',
    external: ['react', 'react-dom', '@wajiha/theme-sdk'],
    sourcemap: 'inline',
    logLevel: 'silent',
    absWorkingDir: themeDir,
  })

  const code = result.outputFiles?.[0]?.text ?? ''
  bundleCache.set(filePath, code)
  return code
}

// ── Hot-reload client script ────────────────────────────────────────

const HOT_RELOAD_SCRIPT = `
(function() {
  var protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  var ws = new WebSocket(protocol + '//' + location.host + '/__wajiha/ws');

  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);
    if (data.type === 'reload') {
      console.log('[wajiha] File changed:', data.file, '- reloading...');
      location.reload();
    }
  };

  ws.onclose = function() {
    console.log('[wajiha] Dev server disconnected. Attempting to reconnect...');
    setTimeout(function() { location.reload(); }, 2000);
  };
})();
`

// ── HTML shell ──────────────────────────────────────────────────────

function buildHtmlShell(
  pageTitle: string,
  themeDir: string,
  pageDataJson: string
): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${pageTitle}</title>
  <link rel="stylesheet" href="/__wajiha/assets/styles/theme.css" />
</head>
<body>
  <div id="root">
    <div style="max-width:800px;margin:40px auto;padding:0 20px;font-family:system-ui,sans-serif">
      <h1>${pageTitle}</h1>
      <p style="color:#666">This is the Wajiha dev server rendering with mock data.</p>
      <p style="color:#666">The theme templates are being bundled on-the-fly.</p>
      <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb" />
      <h3>Page Data (injected):</h3>
      <pre style="background:#f3f4f6;padding:16px;border-radius:8px;overflow-x:auto;font-size:13px">${pageDataJson}</pre>
      <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb" />
      <p style="color:#999;font-size:13px">
        Hot reload is active. Edit your templates and this page will refresh automatically.
      </p>
    </div>
  </div>
  <script src="/__wajiha/reload.js"></script>
</body>
</html>`
}

// ── Server factory ──────────────────────────────────────────────────

export async function createDevServer(options: DevServerOptions): Promise<void> {
  const { port, themeDir, config } = options
  const app = express()
  const server = createServer(app)

  // ── WebSocket ───────────────────────────────────────────────────

  const wss = new WebSocketServer({ server, path: '/__wajiha/ws' })
  const clients = new Set<WebSocket>()

  wss.on('connection', (ws) => {
    clients.add(ws)
    ws.on('close', () => clients.delete(ws))
  })

  function notifyClients(file: string) {
    const message = JSON.stringify({ type: 'reload', file })
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    }
  }

  // ── File watcher ──────────────────────────────────────────────────

  const watchPaths = [
    path.join(themeDir, 'templates'),
    path.join(themeDir, 'layouts'),
    path.join(themeDir, 'assets'),
    path.join(themeDir, 'locales'),
  ]

  const watcher = chokidar.watch(watchPaths, {
    ignoreInitial: true,
    ignored: /node_modules/,
  })

  watcher.on('all', (event, filePath) => {
    const relative = path.relative(themeDir, filePath)
    console.log(chalk.gray(`  [${event}] ${relative}`))

    // Invalidate the bundle cache for changed template files
    if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
      bundleCache.delete(filePath)
    }

    notifyClients(relative)
  })

  // ── Static assets ─────────────────────────────────────────────────

  app.use(
    '/__wajiha/assets',
    express.static(path.join(themeDir, 'assets'))
  )

  // ── Hot-reload script ─────────────────────────────────────────────

  app.get('/__wajiha/reload.js', (_req, res) => {
    res.type('application/javascript').send(HOT_RELOAD_SCRIPT)
  })

  // ── Page routes ───────────────────────────────────────────────────

  // Determine locale from query param: ?locale=ar
  function getLocale(req: express.Request): string {
    const locale = req.query.locale as string | undefined
    if (locale && config.locales.includes(locale)) {
      return locale
    }
    return config.locales[0] || 'en'
  }

  app.get('/', (req, res) => {
    const locale = getLocale(req)
    const data = createMockPageData('index', config, locale)
    const json = JSON.stringify(data, null, 2)
    res.type('html').send(
      buildHtmlShell(`${config.name} - Home`, themeDir, escapeHtml(json))
    )
  })

  app.get('/products', (req, res) => {
    const locale = getLocale(req)
    const data = createMockPageData('products', config, locale)
    const json = JSON.stringify(data, null, 2)
    res.type('html').send(
      buildHtmlShell(`${config.name} - Products`, themeDir, escapeHtml(json))
    )
  })

  app.get('/page/:slug', (req, res) => {
    const locale = getLocale(req)
    const data = createMockPageData('page', config, locale)
    data.page.slug = req.params.slug
    const json = JSON.stringify(data, null, 2)
    res.type('html').send(
      buildHtmlShell(`${config.name} - ${req.params.slug}`, themeDir, escapeHtml(json))
    )
  })

  app.get('/error', (req, res) => {
    const locale = getLocale(req)
    const data = createMockPageData('error', config, locale)
    const json = JSON.stringify(data, null, 2)
    res.type('html').send(
      buildHtmlShell(`${config.name} - Error`, themeDir, escapeHtml(json))
    )
  })

  // ── Bundle endpoint (for future client-side rendering) ────────────

  app.get('/__wajiha/bundle/:template', async (req, res) => {
    const templateName = req.params.template.replace(/\.js$/, '')
    const tsxPath = path.join(themeDir, 'templates', `${templateName}.tsx`)
    const jsxPath = path.join(themeDir, 'templates', `${templateName}.jsx`)

    let filePath: string | null = null
    try {
      await fs.access(tsxPath)
      filePath = tsxPath
    } catch {
      try {
        await fs.access(jsxPath)
        filePath = jsxPath
      } catch {
        res.status(404).send('Template not found')
        return
      }
    }

    try {
      const code = bundleCache.get(filePath) ?? (await bundleFile(filePath, themeDir))
      res.type('application/javascript').send(code)
    } catch (err) {
      res.status(500).send(
        `// Build error:\n// ${err instanceof Error ? err.message : 'Unknown error'}`
      )
    }
  })

  // ── Start ─────────────────────────────────────────────────────────

  return new Promise<void>((resolve) => {
    server.listen(port, () => {
      console.log(
        chalk.green.bold(`  Dev server running at http://localhost:${port}`)
      )
      console.log('')
      console.log('  Routes:')
      console.log(chalk.gray(`    http://localhost:${port}/             Home`))
      console.log(chalk.gray(`    http://localhost:${port}/products     Products`))
      console.log(chalk.gray(`    http://localhost:${port}/page/about   Generic page`))
      console.log(chalk.gray(`    http://localhost:${port}/error        Error page`))
      console.log('')
      console.log(chalk.gray('  Add ?locale=ar to switch to Arabic / RTL'))
      console.log(chalk.gray('  Watching for file changes...'))
      console.log('')

      // Handle graceful shutdown
      process.on('SIGINT', () => {
        console.log('')
        console.log(chalk.gray('Shutting down dev server...'))
        watcher.close()
        wss.close()
        server.close()
        process.exit(0)
      })

      resolve()
    })
  })
}

// ── Utils ───────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
