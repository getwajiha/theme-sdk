# @getwajiha/theme-sdk

Theme SDK for building Wajiha storefront themes. Provides React hooks, components, utilities, and TypeScript types that connect your theme to the platform's data layer.

## Install

```bash
npm install @getwajiha/theme-sdk
```

Peer dependencies: `react` (18 or 19), `react-dom` (18 or 19).

## Quick Start

Every theme is wrapped in a `ThemeProvider` by the platform at render time. Inside your theme components, use hooks to access tenant data, products, navigation, locale, settings, and more.

```tsx
import { useLocale, useTenant, useProducts } from '@getwajiha/theme-sdk'
import { Container, ProductGrid, LanguageSwitcher } from '@getwajiha/theme-sdk/components'

export default function HomePage() {
  const tenant = useTenant()
  const products = useProducts()
  const { t, isRTL } = useLocale()

  return (
    <Container maxWidth="xl">
      <header>
        {tenant.logo && <img src={tenant.logo} alt={tenant.name} />}
        <h1>{t('welcome')}</h1>
        <LanguageSwitcher />
      </header>
      <ProductGrid products={products} columns={3} />
    </Container>
  )
}
```

## Exports

The package exposes three entry points:

| Import path | Contents |
|---|---|
| `@getwajiha/theme-sdk` | Provider, hooks, types, settings utilities |
| `@getwajiha/theme-sdk/components` | Pre-built UI components |
| `@getwajiha/theme-sdk/utils` | `cn`, `getTranslation`, `formatDate`, `formatCurrency`, `clsx` |

---

## ThemeProvider

Wraps your theme and injects the `ThemePageData` context. The platform handles this automatically -- you do not need to render it yourself.

```tsx
import { ThemeProvider } from '@getwajiha/theme-sdk'

<ThemeProvider data={pageData}>
  <YourTheme />
</ThemeProvider>
```

**Props:**

| Prop | Type | Description |
|---|---|---|
| `data` | `ThemePageData` | Full page data object injected by the platform |
| `children` | `ReactNode` | Theme component tree |

---

## Hooks

All hooks must be called inside a `ThemeProvider`. They throw if called outside one.

### useThemeData

Returns the entire `ThemePageData` object. Use the more specific hooks below when you only need a slice.

```tsx
import { useThemeData } from '@getwajiha/theme-sdk'

const data = useThemeData()
// data.tenant, data.products, data.locale, data.settings, ...
```

**Returns:** `ThemePageData`

---

### useTenant

Returns tenant branding information.

```tsx
import { useTenant } from '@getwajiha/theme-sdk'

const tenant = useTenant()
// tenant.name, tenant.domain, tenant.logo, tenant.favicon, tenant.description
```

**Returns:** `TenantInfo`

| Field | Type |
|---|---|
| `name` | `string` |
| `domain` | `string` |
| `logo` | `string \| null` |
| `favicon` | `string \| null` |
| `description` | `string \| null` |

---

### useProducts

Returns the product list for the current page. Only populated if the template declares products in its `DataRequirements`. Returns an empty array if no products are available.

```tsx
import { useProducts } from '@getwajiha/theme-sdk'

const products = useProducts()

products.map(p => (
  <div key={p.id}>
    <h3>{p.name}</h3>
    <p>{p.description}</p>
  </div>
))
```

**Returns:** `Product[]`

| Field | Type |
|---|---|
| `id` | `string` |
| `name` | `string` |
| `slug` | `string` |
| `description` | `string \| null` |
| `logo` | `string \| null` |
| `status` | `string` |
| `isPublic` | `boolean` |
| `publishedAt` | `string \| null` |

---

### useLocale

Returns locale information plus a `t()` translation function and an `isRTL` flag.

```tsx
import { useLocale } from '@getwajiha/theme-sdk'

const { current, available, direction, isRTL, t } = useLocale()

// Translate a key from the theme's locale messages
<h1>{t('hero_title')}</h1>

// With parameter interpolation
<p>{t('greeting', { name: 'Ahmed' })}</p>
// Message "Hello, {name}!" becomes "Hello, Ahmed!"
```

**Returns:** `UseLocaleReturn`

| Field | Type | Description |
|---|---|---|
| `current` | `string` | Active locale code (e.g. `"en"`, `"ar"`) |
| `available` | `string[]` | All configured locale codes |
| `direction` | `'ltr' \| 'rtl'` | Text direction |
| `messages` | `Record<string, string>` | Raw message map |
| `isRTL` | `boolean` | `true` when direction is `'rtl'` |
| `t` | `(key: string, params?: Record<string, string>) => string` | Translation function with parameter interpolation |

---

### useNavigation

Returns the tenant's navigation menus. Menu items are nested (children support sub-menus).

```tsx
import { useNavigation } from '@getwajiha/theme-sdk'

const { main, footer } = useNavigation()

main.map(item => (
  <a key={item.id} href={item.url}>{item.label}</a>
))
```

**Returns:** `Navigation`

| Field | Type |
|---|---|
| `main` | `MenuItem[]` |
| `footer` | `MenuItem[]` |

Each `MenuItem`:

| Field | Type |
|---|---|
| `id` | `string` |
| `label` | `string` |
| `url` | `string` |
| `sortOrder` | `number` |
| `children` | `MenuItem[]` |

---

### useSettings

Returns theme settings configured by the tenant admin. Settings are defined in `wajiha.theme.json` and their values are set through the admin panel.

```tsx
import { useSettings } from '@getwajiha/theme-sdk'

const settings = useSettings()

// Direct access
const heroTitle = settings.hero_title as string

// Type-safe access with fallback
const columns = settings.get<number>('grid_columns', 3)
const accent = settings.get<string>('accent_color', '#3b82f6')
```

**Returns:** `Record<string, unknown> & { get: <T>(key: string, fallback: T) => T }`

The `get` method returns the setting value if it exists, otherwise returns the provided fallback.

---

### useCurrentPage

Returns metadata about the current page being rendered.

```tsx
import { useCurrentPage } from '@getwajiha/theme-sdk'

const page = useCurrentPage()
// page.type  -> 'index' | 'page' | 'products' | 'error'
// page.slug  -> URL slug (if applicable)
// page.meta  -> { title, description, ogImage? }
// page.content -> HTML content (for CMS pages)
```

**Returns:** `PageInfo`

---

### useUser

Returns the current user session. Returns an anonymous user object (`isAuthenticated: false`) when no user is logged in.

```tsx
import { useUser } from '@getwajiha/theme-sdk'

const user = useUser()

if (user.isAuthenticated) {
  return <span>Welcome, {user.name}</span>
}
return <a href="/login">Sign in</a>
```

**Returns:** `UserInfo`

| Field | Type |
|---|---|
| `id` | `string` |
| `name` | `string` |
| `email` | `string` |
| `avatar` | `string \| undefined` |
| `isAuthenticated` | `boolean` |

---

## Components

Import from `@getwajiha/theme-sdk/components`. All components accept a `className` prop for custom styling.

### Navigation

**`NavLink`** -- Renders an anchor with active state support.

```tsx
<NavLink href="/products" isActive={true} activeClassName="font-bold">
  Products
</NavLink>
```

**`NavMenu`** -- Renders a recursive navigation menu from `MenuItem[]`. Supports custom item rendering.

```tsx
const { main } = useNavigation()

<NavMenu
  items={main}
  currentPath="/products"
  itemClassName="nav-item"
  activeItemClassName="nav-item--active"
  renderItem={(item, isActive) => (
    <a href={item.url} className={isActive ? 'active' : ''}>{item.label}</a>
  )}
/>
```

### Content & Layout

| Component | Props | Description |
|---|---|---|
| `Container` | `maxWidth?: 'sm'\|'md'\|'lg'\|'xl'\|'2xl'\|'full'` | Centered container with max-width |
| `Section` | `id?: string` | Semantic `<section>` wrapper |
| `Grid` | `columns?: number`, `gap?: string` | CSS Grid layout |
| `Stack` | `direction?: 'horizontal'\|'vertical'`, `gap?: string`, `align?: 'start'\|'center'\|'end'\|'stretch'` | Flexbox stack layout |
| `RichText` | `content: string` | Renders sanitized HTML content |
| `Image` | `src`, `alt`, `width?`, `height?`, `loading?` | Image with lazy loading default |
| `Video` | `src`, `poster?`, `controls?`, `autoPlay?`, `muted?`, `loop?` | Video element |
| `Icon` | `name: string`, `size?: number` | Icon placeholder (override with your icon library) |

### Product

**`ProductCard`** -- Displays a single product with optional link and badge.

```tsx
<ProductCard
  product={product}
  href={`/products/${product.slug}`}
  renderBadge={(p) => <ProductBadge status={p.status} />}
/>
```

**`ProductGrid`** -- Renders products in a CSS grid. Supports custom product rendering.

```tsx
<ProductGrid
  products={products}
  columns={3}
  gap="2rem"
  renderProduct={(product) => <MyCustomCard product={product} />}
/>
```

**`ProductBadge`** -- Status badge. Renders the status string with a `data-status` attribute for styling.

### i18n

**`TranslatedText`** -- Renders a multilingual field value in the current locale.

```tsx
// product.name might be { en: "Widget", ar: "..." }
<TranslatedText value={product.name} as="h2" />
```

**`LanguageSwitcher`** -- Renders links for each available locale.

```tsx
<LanguageSwitcher
  itemClassName="lang-link"
  activeClassName="lang-link--active"
/>
```

**`RTLProvider`** -- Wraps children with the correct `dir` attribute based on the current locale.

```tsx
<RTLProvider>
  <main>{children}</main>
</RTLProvider>
```

### Interactive

**`Accordion`** -- Collapsible sections with single or multi-expand support.

```tsx
<Accordion
  items={[
    { id: '1', title: 'Getting Started', content: <p>...</p> },
    { id: '2', title: 'Configuration', content: <p>...</p> },
  ]}
  allowMultiple={true}
  defaultOpen={['1']}
/>
```

**`Tabs`** -- Tabbed interface with ARIA roles.

```tsx
<Tabs
  items={[
    { id: 'overview', label: 'Overview', content: <div>...</div> },
    { id: 'api', label: 'API', content: <div>...</div> },
  ]}
  defaultTab="overview"
/>
```

**`Modal`** -- Dialog overlay. Closes on backdrop click.

```tsx
const [open, setOpen] = useState(false)

<Modal isOpen={open} onClose={() => setOpen(false)} title="Details">
  <p>Modal content</p>
</Modal>
```

### SEO

**`SEOHead`** -- Renders `<title>` and Open Graph meta tags. Place in `<head>`.

```tsx
<SEOHead meta={page.meta} siteName={tenant.name} locale="en" />
```

**`StructuredData`** -- Renders a JSON-LD `<script>` tag.

```tsx
<StructuredData data={{ "@context": "https://schema.org", "@type": "Organization", name: tenant.name }} />
```

---

## Utilities

Import from `@getwajiha/theme-sdk/utils`.

| Function | Signature | Description |
|---|---|---|
| `cn` | `(...inputs: ClassValue[]) => string` | Merge class names (wraps `clsx`) |
| `getTranslation` | `(value: unknown, locale: string, fallbackLocale?: string) => string` | Extract a locale value from a multilingual field (`string` or `Record<string, string>`) |
| `formatDate` | `(dateStr: string \| Date, locale?: string, options?: Intl.DateTimeFormatOptions) => string` | Locale-aware date formatting |
| `formatCurrency` | `(amount: number, currency?: string, locale?: string) => string` | Locale-aware currency formatting |
| `clsx` | Re-exported from `clsx` | Conditional class names |

```tsx
import { getTranslation, formatDate, cn } from '@getwajiha/theme-sdk/utils'

const name = getTranslation(product.name, 'ar', 'en')
const date = formatDate(product.publishedAt, 'en')
const classes = cn('card', isActive && 'card--active')
```

---

## Settings Utilities

Imported from the main entry point. Useful when building admin tooling or validating theme configs.

| Function | Description |
|---|---|
| `validateSettingValue(definition, value)` | Validates a value against a `ThemeSettingDefinition`. Returns the validated value or the default. |
| `mergeSettingsWithDefaults(schema, values)` | Merges saved setting values with schema defaults. New fields get defaults, removed fields are pruned. |
| `getDefaultSettings(schema)` | Extracts default values from a settings schema. |
| `validateThemeConfig(config)` | Validates a `wajiha.theme.json` config object. Returns an array of error strings (empty if valid). |

---

## Theme Config (`wajiha.theme.json`)

Every theme must include a `wajiha.theme.json` at its root:

```json
{
  "name": "my-theme",
  "version": "1.0.0",
  "sdk_version": "1.0.0",
  "locales": ["en", "ar"],
  "author": "Your Name",
  "description": "A custom storefront theme",
  "settings": [
    {
      "key": "accent_color",
      "type": "color",
      "label": { "en": "Accent Color", "ar": "لون التمييز" },
      "default": "#3b82f6"
    },
    {
      "key": "show_hero",
      "type": "boolean",
      "label": { "en": "Show Hero Section", "ar": "إظهار قسم البطل" },
      "default": true
    },
    {
      "key": "grid_columns",
      "type": "number",
      "label": { "en": "Product Grid Columns", "ar": "أعمدة شبكة المنتجات" },
      "default": 3,
      "min": 1,
      "max": 6
    },
    {
      "key": "layout",
      "type": "select",
      "label": { "en": "Layout", "ar": "التخطيط" },
      "default": "wide",
      "options": [
        { "value": "wide", "label": { "en": "Wide", "ar": "عريض" } },
        { "value": "boxed", "label": { "en": "Boxed", "ar": "محاصر" } }
      ]
    }
  ],
  "routes": {
    "/": "HomePage",
    "/products": "ProductsPage"
  }
}
```

### Setting Types

| Type | Value | Constraints |
|---|---|---|
| `text` | `string` | `maxLength` |
| `color` | `string` (hex/rgb) | -- |
| `boolean` | `boolean` | -- |
| `number` | `number` | `min`, `max` |
| `select` | `string` | `options` (array of `{ value, label }`) |
| `image` | `string \| null` (URL) | -- |
| `array` | `unknown[]` | `maxItems`, `item_type` |
| `link` | `object` | -- |

---

## Type Reference

### Core Data

```typescript
interface ThemePageData {
  tenant: TenantInfo
  navigation: Navigation
  locale: LocaleInfo
  settings: Record<string, unknown>
  appearance: Appearance        // { colorMode: 'light' | 'dark' }
  page: PageInfo
  user?: UserInfo
  products?: Product[]
  error?: ErrorInfo             // { code, message, description? }
}
```

### Component Props

```typescript
interface TemplateProps {
  data: ThemePageData
}

interface LayoutProps {
  children: ReactNode
  data: ThemePageData
}

interface SectionProps {
  data: ThemePageData
  [key: string]: unknown
}
```

### Data Requirements

Declare what data your template needs. Attach to your template component.

```typescript
interface DataRequirements {
  products?: ProductDataRequirement | boolean
  navigation?: boolean
}

interface ProductDataRequirement {
  featured?: boolean
  limit?: number
}
```

---

## Full Theme Example

```tsx
// templates/HomePage.tsx
import {
  useTenant,
  useProducts,
  useLocale,
  useSettings,
  useNavigation,
  useCurrentPage,
} from '@getwajiha/theme-sdk'
import {
  Container,
  NavMenu,
  ProductGrid,
  LanguageSwitcher,
  RTLProvider,
  SEOHead,
} from '@getwajiha/theme-sdk/components'

export default function HomePage() {
  const tenant = useTenant()
  const products = useProducts()
  const { main, footer } = useNavigation()
  const { t, isRTL } = useLocale()
  const settings = useSettings()
  const page = useCurrentPage()

  const showHero = settings.get<boolean>('show_hero', true)
  const accentColor = settings.get<string>('accent_color', '#3b82f6')
  const columns = settings.get<number>('grid_columns', 3)

  return (
    <RTLProvider>
      <SEOHead meta={page.meta} siteName={tenant.name} />

      <header>
        {tenant.logo && <img src={tenant.logo} alt={tenant.name} />}
        <NavMenu items={main} />
        <LanguageSwitcher />
      </header>

      <main>
        {showHero && (
          <section style={{ borderColor: accentColor }}>
            <h1>{t('hero_title')}</h1>
            <p>{t('hero_subtitle')}</p>
          </section>
        )}

        <Container>
          <h2>{t('products_heading')}</h2>
          <ProductGrid products={products} columns={columns} />
        </Container>
      </main>

      <footer>
        <NavMenu items={footer} />
        <p>{tenant.name}</p>
      </footer>
    </RTLProvider>
  )
}
```
