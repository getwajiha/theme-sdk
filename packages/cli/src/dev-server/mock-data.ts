/**
 * Mock Data for Dev Server
 *
 * Provides realistic ThemePageData for each page type so theme developers
 * can preview their templates without a running platform instance.
 *
 * The data mirrors the shape defined in @wajiha/theme-sdk types.
 */

import type { ThemeConfig } from '../validation.js'

import type {
  ThemePageData,
  TenantInfo,
  MenuItem,
  Navigation,
  LocaleInfo,
  Appearance,
  PageInfo,
  UserInfo,
  Product,
  ErrorInfo,
} from '@wajiha/theme-sdk'

export type { ThemePageData }

// ── Mock tenant ─────────────────────────────────────────────────────

const mockTenant: TenantInfo = {
  name: 'Acme Developer Portal',
  domain: 'localhost',
  logo: null,
  favicon: null,
  description: 'A sample developer portal for theme development.',
}

// ── Mock navigation ─────────────────────────────────────────────────

const mockNavigation: Navigation = {
  main: [
    { id: 'nav-home', label: 'Home', url: '/', sortOrder: 0, children: [] },
    {
      id: 'nav-products',
      label: 'Products',
      url: '/products',
      sortOrder: 1,
      children: [],
    },
    {
      id: 'nav-docs',
      label: 'Documentation',
      url: '/docs',
      sortOrder: 2,
      children: [
        {
          id: 'nav-docs-getting-started',
          label: 'Getting Started',
          url: '/docs/getting-started',
          sortOrder: 0,
          children: [],
        },
        {
          id: 'nav-docs-api-ref',
          label: 'API Reference',
          url: '/docs/api-reference',
          sortOrder: 1,
          children: [],
        },
      ],
    },
    {
      id: 'nav-about',
      label: 'About',
      url: '/about',
      sortOrder: 3,
      children: [],
    },
  ],
  footer: [
    {
      id: 'footer-privacy',
      label: 'Privacy Policy',
      url: '/privacy',
      sortOrder: 0,
      children: [],
    },
    {
      id: 'footer-terms',
      label: 'Terms of Service',
      url: '/terms',
      sortOrder: 1,
      children: [],
    },
    {
      id: 'footer-contact',
      label: 'Contact',
      url: '/contact',
      sortOrder: 2,
      children: [],
    },
  ],
}

// ── Mock products ───────────────────────────────────────────────────

const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Payment Gateway API',
    slug: 'payment-gateway',
    description:
      'Process payments securely with our comprehensive gateway API. Supports credit cards, bank transfers, and digital wallets.',
    logo: null,
    status: 'published',
    isPublic: true,
    publishedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Identity & Auth SDK',
    slug: 'identity-auth',
    description:
      'User authentication and authorization made simple. OAuth 2.0, SAML, and OpenID Connect support.',
    logo: null,
    status: 'published',
    isPublic: true,
    publishedAt: '2025-02-20T14:30:00Z',
  },
  {
    id: 'prod-3',
    name: 'Messaging Service',
    slug: 'messaging',
    description:
      'Send SMS, email, and push notifications through a unified API. Built-in templating and delivery tracking.',
    logo: null,
    status: 'published',
    isPublic: true,
    publishedAt: '2025-03-10T09:00:00Z',
  },
  {
    id: 'prod-4',
    name: 'Analytics Dashboard',
    slug: 'analytics',
    description:
      'Real-time analytics and reporting for your applications. Custom dashboards and data export.',
    logo: null,
    status: 'published',
    isPublic: true,
    publishedAt: '2025-04-05T16:00:00Z',
  },
]

// ── Mock user ───────────────────────────────────────────────────────

const mockUser: UserInfo = {
  id: 'user-1',
  name: 'Jane Developer',
  email: 'jane@example.com',
  isAuthenticated: true,
}

// ── Locale messages ─────────────────────────────────────────────────

const enMessages: Record<string, string> = {
  'nav.home': 'Home',
  'nav.products': 'Products',
  'nav.docs': 'Documentation',
  'nav.about': 'About',
  'hero.title': 'Build amazing products',
  'hero.subtitle': 'Your developer portal, your way.',
  'products.title': 'Our Products',
  'products.explore': 'Explore',
  'footer.copyright': '(c) 2025 Acme Developer Portal. All rights reserved.',
  'error.title': 'Something went wrong',
  'error.back': 'Go back home',
  'page.readMore': 'Read more',
  'lang.switch': 'Language',
}

const arMessages: Record<string, string> = {
  'nav.home': '\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629',
  'nav.products': '\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A',
  'nav.docs': '\u0627\u0644\u0648\u062B\u0627\u0626\u0642',
  'nav.about': '\u062D\u0648\u0644',
  'hero.title': '\u0627\u0628\u0646\u0650 \u0645\u0646\u062A\u062C\u0627\u062A \u0631\u0627\u0626\u0639\u0629',
  'hero.subtitle': '\u0628\u0648\u0627\u0628\u0629 \u0627\u0644\u0645\u0637\u0648\u0631\u064A\u0646 \u0627\u0644\u062E\u0627\u0635\u0629 \u0628\u0643\u060C \u0628\u0637\u0631\u064A\u0642\u062A\u0643.',
  'products.title': '\u0645\u0646\u062A\u062C\u0627\u062A\u0646\u0627',
  'products.explore': '\u0627\u0633\u062A\u0643\u0634\u0641',
  'footer.copyright': '\u00A9 2025 Acme Developer Portal. \u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629.',
  'error.title': '\u062D\u062F\u062B \u062E\u0637\u0623',
  'error.back': '\u0627\u0644\u0639\u0648\u062F\u0629 \u0644\u0644\u0631\u0626\u064A\u0633\u064A\u0629',
  'page.readMore': '\u0627\u0642\u0631\u0623 \u0627\u0644\u0645\u0632\u064A\u062F',
  'lang.switch': '\u0627\u0644\u0644\u063A\u0629',
}

// ── Default settings ────────────────────────────────────────────────

function buildDefaultSettings(config: ThemeConfig): Record<string, unknown> {
  const defaults: Record<string, unknown> = {}
  for (const setting of config.settings) {
    defaults[setting.key] = setting.default
  }
  return defaults
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Build a complete ThemePageData object for the given page type.
 * Uses the theme config to populate settings defaults and locale info.
 */
export function createMockPageData(
  pageType: 'index' | 'page' | 'products' | 'error',
  config: ThemeConfig,
  locale: string = 'en'
): ThemePageData {
  const isRTL = locale === 'ar'
  const messages = locale === 'ar' ? arMessages : enMessages

  const base: ThemePageData = {
    tenant: mockTenant,
    navigation: mockNavigation,
    locale: {
      current: locale,
      available: config.locales,
      direction: isRTL ? 'rtl' : 'ltr',
      messages,
    },
    settings: buildDefaultSettings(config),
    appearance: { colorMode: 'light' },
    page: { type: pageType, meta: { title: '', description: '' } },
    user: mockUser,
  }

  switch (pageType) {
    case 'index':
      base.page = {
        type: 'index',
        meta: {
          title: 'Home - Acme Developer Portal',
          description: 'Welcome to the Acme Developer Portal.',
        },
      }
      base.products = mockProducts
      break

    case 'products':
      base.page = {
        type: 'products',
        meta: {
          title: 'Products - Acme Developer Portal',
          description: 'Browse our API products and services.',
        },
      }
      base.products = mockProducts
      break

    case 'page':
      base.page = {
        type: 'page',
        slug: 'about',
        meta: {
          title: 'About - Acme Developer Portal',
          description: 'Learn more about the Acme Developer Portal.',
        },
        content:
          '<h2>About Us</h2><p>We provide developer tools and APIs that help teams build better software. Our platform powers thousands of applications worldwide.</p><p>Founded in 2020, we are committed to making API integration as seamless as possible.</p>',
      }
      break

    case 'error':
      base.page = {
        type: 'error',
        meta: {
          title: '404 - Page Not Found',
          description: 'The page you are looking for does not exist.',
        },
      }
      base.error = {
        code: 404,
        message: 'Page Not Found',
        description:
          'The page you are looking for does not exist or has been moved.',
      }
      break
  }

  return base
}
