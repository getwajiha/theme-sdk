/**
 * Dev Server
 *
 * Express application that serves theme renders with mock data.
 * Includes:
 *   - On-the-fly esbuild bundling of template and layout files
 *   - Client-side rendering with React via import maps
 *   - SDK bundled for browser and served locally
 *   - WebSocket server for hot reload
 *   - chokidar file watcher that triggers re-bundles on change
 *
 * Routes:
 *   GET /                          -> index template
 *   GET /products                  -> products template
 *   GET /page/:slug                -> page template
 *   GET /error                     -> error template
 *   GET /__wajiha/bundle/:type/:name.js -> Bundled template/layout
 *   GET /__wajiha/sdk.js           -> SDK bundle for browser
 *   GET /__wajiha/sdk-components.js -> SDK components bundle
 *   GET /__wajiha/sdk-utils.js     -> SDK utils bundle
 *   GET /__wajiha/reload.js        -> Hot-reload client script
 *   WS  /__wajiha/ws               -> Hot-reload WebSocket
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
    external: ['react', 'react-dom', 'react/jsx-runtime', '@getwajiha/theme-sdk', '@getwajiha/theme-sdk/components', '@getwajiha/theme-sdk/utils'],
    sourcemap: 'inline',
    logLevel: 'silent',
    absWorkingDir: themeDir,
  })

  const code = result.outputFiles?.[0]?.text ?? ''
  bundleCache.set(filePath, code)
  return code
}

// ── SDK bundling ────────────────────────────────────────────────────

const sdkBundleCache = new Map<string, string>()

/**
 * Bundle an SDK entry point for browser use.
 * Externalizes react/react-dom so they come from the import map.
 */
async function bundleSdkEntry(
  entryImport: string,
  themeDir: string
): Promise<string> {
  if (sdkBundleCache.has(entryImport)) {
    return sdkBundleCache.get(entryImport)!
  }

  const result = await esbuild.build({
    stdin: {
      contents: `export * from '${entryImport}'`,
      resolveDir: themeDir,
      loader: 'ts',
    },
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'browser',
    target: ['es2020'],
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    logLevel: 'silent',
  })

  const code = result.outputFiles?.[0]?.text ?? ''
  sdkBundleCache.set(entryImport, code)
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

// ── Locale loader ───────────────────────────────────────────────────

async function loadLocaleMessages(
  themeDir: string,
  locale: string
): Promise<Record<string, string>> {
  const localePath = path.join(themeDir, 'locales', `${locale}.json`)
  try {
    const raw = await fs.readFile(localePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

// ── HTML shell with CSR ─────────────────────────────────────────────

function buildHtmlShell(
  pageTitle: string,
  templateName: string,
  pageDataJson: string
): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${pageTitle}</title>
  <link rel="stylesheet" href="/__wajiha/assets/styles/theme.css" />
  <script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@19.1.0?dev",
      "react/jsx-runtime": "https://esm.sh/react@19.1.0/jsx-runtime?dev",
      "react-dom": "https://esm.sh/react-dom@19.1.0?dev",
      "react-dom/client": "https://esm.sh/react-dom@19.1.0/client?dev",
      "@getwajiha/theme-sdk": "/__wajiha/sdk.js",
      "@getwajiha/theme-sdk/components": "/__wajiha/sdk-components.js",
      "@getwajiha/theme-sdk/utils": "/__wajiha/sdk-utils.js"
    }
  }
  </script>
</head>
<body>
  <div id="root"></div>
  <script id="__THEME_DATA__" type="application/json">${pageDataJson}</script>
  <script type="module">
    import React from 'react';
    import { createRoot } from 'react-dom/client';
    import { ThemeProvider } from '@getwajiha/theme-sdk';

    const pageData = JSON.parse(document.getElementById('__THEME_DATA__').textContent);

    async function main() {
      const [layoutMod, templateMod] = await Promise.all([
        import('/__wajiha/bundle/layouts/default.js'),
        import('/__wajiha/bundle/templates/${templateName}.js'),
      ]);

      const Layout = layoutMod.default;
      const Template = templateMod.default;

      const root = createRoot(document.getElementById('root'));
      root.render(
        React.createElement(ThemeProvider, { data: pageData },
          React.createElement(Layout, null,
            React.createElement(Template, { data: pageData })
          )
        )
      );
    }

    main().catch(function(err) {
      console.error('[wajiha] Render error:', err);
      document.getElementById('root').innerHTML =
        '<div style="max-width:700px;margin:40px auto;padding:20px;font-family:system-ui">' +
        '<h2 style="color:#b91c1c">Theme Render Error</h2>' +
        '<pre style="background:#fef2f2;padding:16px;border-radius:8px;overflow-x:auto;white-space:pre-wrap;color:#991b1b">' +
        err.message + '\\n\\n' + (err.stack || '') +
        '</pre></div>';
    });
  </script>
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

    // Invalidate the bundle cache for changed template/layout files
    if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx') || filePath.endsWith('.ts')) {
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

  // ── SDK bundles ───────────────────────────────────────────────────

  app.get('/__wajiha/sdk.js', async (_req, res) => {
    try {
      const code = await bundleSdkEntry('@getwajiha/theme-sdk', themeDir)
      res.type('application/javascript').send(code)
    } catch (err) {
      res.status(500).type('application/javascript').send(
        `// SDK bundle error:\n// ${err instanceof Error ? err.message : 'Unknown error'}`
      )
    }
  })

  app.get('/__wajiha/sdk-components.js', async (_req, res) => {
    try {
      const code = await bundleSdkEntry('@getwajiha/theme-sdk/components', themeDir)
      res.type('application/javascript').send(code)
    } catch (err) {
      res.status(500).type('application/javascript').send(
        `// SDK components bundle error:\n// ${err instanceof Error ? err.message : 'Unknown error'}`
      )
    }
  })

  app.get('/__wajiha/sdk-utils.js', async (_req, res) => {
    try {
      const code = await bundleSdkEntry('@getwajiha/theme-sdk/utils', themeDir)
      res.type('application/javascript').send(code)
    } catch (err) {
      res.status(500).type('application/javascript').send(
        `// SDK utils bundle error:\n// ${err instanceof Error ? err.message : 'Unknown error'}`
      )
    }
  })

  // ── Bundle endpoint (templates and layouts) ───────────────────────

  app.get('/__wajiha/bundle/:type/:name.js', async (req, res) => {
    const { type, name } = req.params
    if (type !== 'templates' && type !== 'layouts') {
      res.status(400).send('// Invalid bundle type. Use "templates" or "layouts".')
      return
    }

    const tsxPath = path.join(themeDir, type, `${name}.tsx`)
    const jsxPath = path.join(themeDir, type, `${name}.jsx`)

    let filePath: string | null = null
    try {
      await fs.access(tsxPath)
      filePath = tsxPath
    } catch {
      try {
        await fs.access(jsxPath)
        filePath = jsxPath
      } catch {
        res.status(404).type('application/javascript').send(
          `// ${type}/${name} not found`
        )
        return
      }
    }

    try {
      const code = bundleCache.get(filePath) ?? (await bundleFile(filePath, themeDir))
      res.type('application/javascript').send(code)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error(chalk.red(`  Build error in ${type}/${name}:`), message)
      res.status(500).type('application/javascript').send(
        `// Build error in ${type}/${name}:\n// ${message}`
      )
    }
  })

  // ── Page routes ───────────────────────────────────────────────────

  function getLocale(req: express.Request): string {
    const locale = req.query.locale as string | undefined
    if (locale && config.locales.includes(locale)) {
      return locale
    }
    return config.locales[0] || 'en'
  }

  async function renderPage(
    req: express.Request,
    res: express.Response,
    pageType: 'index' | 'page' | 'products' | 'error',
    templateName: string,
    title: string
  ) {
    const locale = getLocale(req)
    const data = createMockPageData(pageType, config, locale)

    // Load locale messages from the theme's locale files
    const messages = await loadLocaleMessages(themeDir, locale)
    if (Object.keys(messages).length > 0) {
      data.locale.messages = messages
    }

    const json = JSON.stringify(data)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e')
      .replace(/&/g, '\\u0026')

    res.type('html').send(buildHtmlShell(title, templateName, json))
  }

  app.get('/', (req, res) => {
    renderPage(req, res, 'index', 'index', `${config.name} - Home`)
  })

  app.get('/products', (req, res) => {
    renderPage(req, res, 'products', 'products', `${config.name} - Products`)
  })

  app.get('/page/:slug', (req, res) => {
    renderPage(req, res, 'page', 'page', `${config.name} - ${req.params.slug}`)
  })

  app.get('/error', (req, res) => {
    renderPage(req, res, 'error', 'error', `${config.name} - Error`)
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
