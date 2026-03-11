# @wajiha/cli

Command-line tool for building and deploying custom themes on the Wajiha multi-tenant platform.

## Installation

```bash
npm install -g @wajiha/cli
```

Or use directly with npx:

```bash
npx @wajiha/cli init my-theme
```

## Configuration

Remote commands (`push`, `pull`, `preview`) require two environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `WAJIHA_API_URL` | Platform API base URL | `https://api.wajiha.dev` |
| `WAJIHA_API_KEY` | Tenant API key | `wjh_...` |

```bash
export WAJIHA_API_URL=https://api.wajiha.dev
export WAJIHA_API_KEY=wjh_your_api_key_here
```

The `init`, `dev`, and `build` commands work entirely offline and do not require these variables.

## Commands

### `wajiha init [name]`

Scaffold a new theme project from the starter template.

```bash
wajiha init my-theme
```

Options:
- `-t, --template <name>` -- Template to use (default: `starter`)

This creates the following directory structure, installs npm dependencies, and patches the theme name into config files:

```
my-theme/
  wajiha.theme.json          # Theme configuration
  package.json               # Node dependencies (react, @wajiha/theme-sdk)
  layouts/
    default.tsx              # Default layout (header + footer)
  templates/
    index.tsx                # Home page
    page.tsx                 # Generic content page
    products.tsx             # Product listing
    error.tsx                # Error page
  locales/
    en.json                  # English strings
    ar.json                  # Arabic strings
  assets/
    styles/
      theme.css              # Starter stylesheet
  keycloak/
    styles.css               # Keycloak login page CSS overrides (optional)
```

### `wajiha dev`

Start a local development server with hot reload. Serves your theme with mock tenant data so you can iterate without a running platform instance.

```bash
cd my-theme
wajiha dev
wajiha dev --port 4000
```

Options:
- `-p, --port <number>` -- Port to run on (default: `3100`)

Dev server features:
- On-the-fly esbuild bundling of template/layout files
- File watching with chokidar (templates, layouts, assets, locales)
- WebSocket-based hot reload -- the browser refreshes automatically on file changes
- Mock data that mirrors the `@wajiha/theme-sdk` `ThemePageData` shape

Available routes:

| Route | Template | Description |
|-------|----------|-------------|
| `/` | `index.tsx` | Home page |
| `/products` | `products.tsx` | Product listing |
| `/page/:slug` | `page.tsx` | Generic content page |
| `/error` | `error.tsx` | Error page |

Add `?locale=ar` to any route to switch to Arabic / RTL mode.

### `wajiha build`

Validate and bundle the theme for deployment. Outputs to `.wajiha-build/`.

```bash
wajiha build
```

Build steps:
1. Validates `wajiha.theme.json` schema, required templates, locale files, settings, and Keycloak CSS (if present)
2. Bundles server-side code with esbuild (ESM, Node 20, React JSX, sourcemaps)
3. Bundles client-side code with esbuild (ESM, browser, minified, sourcemaps)
4. Copies locales, static assets, and `wajiha.theme.json`
5. Minifies `keycloak/styles.css` if present
6. Generates `manifest.json` with SHA-256 file hashes and a composite bundle hash

The build will fail if validation detects any issues (missing templates, invalid JSON in locales, duplicate setting keys, blocked CSS patterns in Keycloak files, etc.).

### `wajiha push`

Upload the built theme to the platform and optionally activate it. Requires a prior `wajiha build`.

```bash
wajiha push              # Upload, then prompt to activate
wajiha push --activate   # Upload and activate immediately
```

Options:
- `--activate` -- Skip the confirmation prompt and activate immediately

Steps:
1. Reads `.wajiha-build/` and `manifest.json`
2. Authenticates with `WAJIHA_API_URL` / `WAJIHA_API_KEY`
3. Uploads the bundle (base64-encoded files) to `/api/tenant/theme/upload`
4. Prompts to activate (or activates automatically with `--activate`)
5. If `keycloak/styles.css` is present in the bundle, deploys it to `/api/tenant/theme/keycloak-css`

### `wajiha pull`

Download the currently active theme from the platform. Useful for starting local development from an existing deployed theme.

```bash
wajiha pull                    # Extract to current directory
wajiha pull --output ./my-theme  # Extract to a specific directory
```

Options:
- `-o, --output <dir>` -- Output directory (default: `.`)

### `wajiha preview`

Upload the theme in preview mode without activating it. The theme is accessible via a special preview URL so the tenant admin can review before going live.

```bash
wajiha build && wajiha preview
```

The preview URL is displayed after upload. To activate a previewed theme, use `wajiha push --activate` or the admin panel.

## Typical Workflow

```bash
# 1. Create a new theme
wajiha init my-portal-theme
cd my-portal-theme

# 2. Develop locally
wajiha dev

# 3. Build for production
wajiha build

# 4. Upload a preview for review
export WAJIHA_API_URL=https://api.wajiha.dev
export WAJIHA_API_KEY=wjh_your_key
wajiha preview

# 5. Deploy to production
wajiha push --activate
```

## Theme Structure Reference

### `wajiha.theme.json`

The theme manifest. All fields except `author`, `description`, `routes`, and `keycloak` are required.

```jsonc
{
  "name": "my-theme",             // Theme identifier (string, required)
  "version": "1.0.0",            // Semver version (string, required)
  "author": "Your Name",         // Optional
  "description": "My theme",     // Optional
  "sdk_version": "1.0.0",        // Required SDK compatibility version
  "locales": ["en", "ar"],       // At least one locale required
  "settings": [                  // Theme settings array (see below)
    { ... }
  ],
  "routes": {                    // Optional custom route mapping
    "home": "index",
    "about": "page"
  },
  "keycloak": {                  // Optional Keycloak config
    "customCSS": true            // Enables keycloak/styles.css bundling
  }
}
```

### Settings Schema

Each entry in `settings` defines an admin-configurable value:

```jsonc
{
  "key": "primary_color",                    // Unique key (required)
  "type": "color",                           // Setting type (required)
  "label": { "en": "Primary Color", "ar": "..." },  // Localized labels (required)
  "default": "#2563eb"                       // Default value (required)
}
```

Supported setting types (with type-specific options):

| Type | Description | Extra Fields |
|------|-------------|-------------|
| `text` | Single-line text | `maxLength` |
| `color` | Color picker (hex) | -- |
| `boolean` | Toggle switch | -- |
| `number` | Numeric input | `min`, `max` |
| `select` | Dropdown | `options: [{ value, label }]` |

### Required Templates

Every theme must include these four template files in `templates/` (`.tsx` or `.jsx`):

| File | Page Type | Description |
|------|-----------|-------------|
| `index.tsx` | Home | Landing page, typically shows hero + product grid |
| `page.tsx` | Content | Generic content pages (about, privacy, etc.) |
| `products.tsx` | Product listing | Product catalog grid |
| `error.tsx` | Error | Error display (404, 500, etc.) |

Templates receive a `TemplateProps` object with `data: ThemePageData` containing tenant info, navigation, locale, settings, products, and error context.

### Layouts

Layout files in `layouts/` wrap page templates. The `default.tsx` layout receives `LayoutProps` with a `children` prop. Layouts typically render the header, footer, and navigation.

### Locale Files

JSON files in `locales/` provide translation strings. One file per locale declared in `wajiha.theme.json`:

```json
{
  "nav.home": "Home",
  "hero.title": "Build amazing products",
  "products.explore": "Explore"
}
```

Access translations in templates with `useLocale()`:

```tsx
const { t } = useLocale()
return <h1>{t('hero.title')}</h1>
```

### Theme SDK Hooks

Templates and layouts use hooks from `@wajiha/theme-sdk`:

| Hook | Returns | Usage |
|------|---------|-------|
| `useSettings()` | Settings accessor | `settings.get<string>('primary_color', '#2563eb')` |
| `useProducts()` | `Product[]` | Product catalog data |
| `useLocale()` | `{ t, current, available, direction, isRTL }` | i18n translation and RTL detection |
| `useTenant()` | `TenantInfo` | Tenant name, domain, logo, favicon |
| `useNavigation()` | `{ main, footer }` | Navigation menu items |

## Keycloak CSS Customization

Themes can optionally customize the Keycloak login page by placing a `keycloak/styles.css` file in the theme root. This CSS is injected after the platform's base brand variables on the Keycloak login page.

### Setup

1. The starter template includes `keycloak/styles.css` with commented-out examples
2. The `keycloak.customCSS` flag in `wajiha.theme.json` is set automatically during build if the file exists
3. On `wajiha push`, the CSS is deployed to the platform separately

### Available CSS Custom Properties

These are set by the platform and available for use in your CSS:

```css
--brand-primary        /* Primary brand color */
--brand-secondary      /* Secondary brand color */
--brand-font           /* Font family */
--brand-theme-mode     /* "light" or "dark" */
```

### Available CSS Classes

| Selector | Element |
|----------|---------|
| `.login-pf-page` | Outermost container |
| `.login-pf-header` | Header area (logo) |
| `.login-pf-header h1` | Page title |
| `.card-pf` | Main login card |
| `.form-control` | Input fields |
| `.btn-primary` | Primary action button |
| `.btn-default` | Secondary action button |
| `.login-pf-signup` | Registration link area |
| `.alert` | Alert/error messages |
| `.kc-feedback-text` | Feedback messages |

### Example

```css
/* Brand the primary button */
.btn-primary {
  background-color: var(--brand-primary);
  border-color: var(--brand-primary);
}

.btn-primary:hover {
  opacity: 0.9;
}

/* Round the login card */
.card-pf {
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

/* Custom input styling */
.form-control {
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 10px 14px;
}

.form-control:focus {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

### Security Restrictions

The following patterns are blocked in Keycloak CSS for security:

- `@import` -- use inline styles only
- `url()` with external domains (`http://` or `https://`) -- relative URLs and `data:` URIs are allowed
- `expression()` -- CSS expressions
- `behavior:` -- IE behavior property
- `-moz-binding:` -- Firefox XBL binding
- `javascript:` -- protocol in values
- Maximum file size: **100 KB**

The build and validation steps will reject CSS containing any of these patterns.

## Validation

The `wajiha build` command runs full validation before bundling. You can also trigger validation indirectly through `build`. Checks performed:

1. `wajiha.theme.json` exists and is valid JSON
2. Required fields: `name`, `version`, `sdk_version`, `locales` (non-empty array)
3. `settings` array (if present) has no duplicate keys, and each entry has `key`, `type`, and `label`
4. Required templates exist: `index`, `page`, `products`, `error` (`.tsx` or `.jsx`)
5. Locale JSON files exist for every locale in the `locales` array and contain valid JSON
6. Keycloak CSS (if `keycloak/` directory exists) has a `styles.css` file under 100 KB with no blocked patterns
