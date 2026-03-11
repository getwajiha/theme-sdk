import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { renderHook } from '@testing-library/react'
import { ThemeProvider } from '../src/provider'
import {
  useThemeData,
  useTenant,
  useProducts,
  useLocale,
  useNavigation,
  useSettings,
  useCurrentPage,
  useUser,
} from '../src/hooks'
import type { ThemePageData, Product } from '../src/types'

/**
 * Build a minimal but complete ThemePageData fixture.
 */
function makePageData(overrides?: Partial<ThemePageData>): ThemePageData {
  return {
    tenant: {
      name: 'Test Tenant',
      domain: 'test.example.com',
      logo: 'https://example.com/logo.png',
      favicon: 'https://example.com/favicon.ico',
      description: 'A test tenant',
    },
    navigation: {
      main: [
        {
          id: 'nav-1',
          label: 'Home',
          url: '/',
          sortOrder: 0,
          children: [],
        },
      ],
      footer: [
        {
          id: 'footer-1',
          label: 'Privacy',
          url: '/privacy',
          sortOrder: 0,
          children: [],
        },
      ],
    },
    locale: {
      current: 'en',
      available: ['en', 'ar'],
      direction: 'ltr',
      messages: {
        'nav.home': 'Home',
        'nav.about': 'About Us',
        'greeting': 'Hello, {name}!',
        'items.count': '{count} items remaining',
      },
    },
    settings: {
      primaryColor: '#3b82f6',
      showHeader: true,
      columns: 3,
    },
    appearance: {
      colorMode: 'light',
    },
    page: {
      type: 'index',
      slug: 'home',
      meta: {
        title: 'Home Page',
        description: 'Welcome to our site',
        ogImage: 'https://example.com/og.png',
      },
      content: '<h1>Welcome</h1>',
    },
    ...overrides,
  }
}

/**
 * Creates a wrapper that provides ThemeProvider with given data.
 */
function createWrapper(data: ThemePageData) {
  return ({ children }: { children: React.ReactNode }) =>
    createElement(ThemeProvider, { data }, children)
}

// ── useThemeData ─────────────────────────────────────────────────────

describe('useThemeData', () => {
  it('returns the full ThemePageData object', () => {
    const data = makePageData()
    const { result } = renderHook(() => useThemeData(), {
      wrapper: createWrapper(data),
    })
    expect(result.current).toEqual(data)
  })

  it('throws when used outside ThemeProvider', () => {
    expect(() => {
      renderHook(() => useThemeData())
    }).toThrow('useThemeData must be used within a ThemeProvider')
  })
})

// ── useTenant ────────────────────────────────────────────────────────

describe('useTenant', () => {
  it('returns tenant info', () => {
    const data = makePageData()
    const { result } = renderHook(() => useTenant(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.name).toBe('Test Tenant')
    expect(result.current.domain).toBe('test.example.com')
    expect(result.current.logo).toBe('https://example.com/logo.png')
    expect(result.current.favicon).toBe('https://example.com/favicon.ico')
    expect(result.current.description).toBe('A test tenant')
  })

  it('handles null optional fields', () => {
    const data = makePageData({
      tenant: {
        name: 'Minimal',
        domain: 'minimal.com',
        logo: null,
        favicon: null,
        description: null,
      },
    })
    const { result } = renderHook(() => useTenant(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.logo).toBeNull()
    expect(result.current.favicon).toBeNull()
    expect(result.current.description).toBeNull()
  })

  it('throws when used outside ThemeProvider', () => {
    expect(() => {
      renderHook(() => useTenant())
    }).toThrow('useTenant must be used within a ThemeProvider')
  })
})

// ── useProducts ──────────────────────────────────────────────────────

describe('useProducts', () => {
  const sampleProducts: Product[] = [
    {
      id: 'p1',
      name: 'API Gateway',
      slug: 'api-gateway',
      description: 'Enterprise API management',
      logo: 'https://example.com/api.png',
      status: 'active',
      isPublic: true,
      publishedAt: '2025-01-01T00:00:00Z',
    },
    {
      id: 'p2',
      name: 'Auth Service',
      slug: 'auth-service',
      description: null,
      logo: null,
      status: 'draft',
      isPublic: false,
      publishedAt: null,
    },
  ]

  it('returns products when available', () => {
    const data = makePageData({ products: sampleProducts })
    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(data),
    })
    expect(result.current).toHaveLength(2)
    expect(result.current[0].slug).toBe('api-gateway')
    expect(result.current[1].slug).toBe('auth-service')
  })

  it('returns empty array when products is undefined', () => {
    const data = makePageData({ products: undefined })
    const { result } = renderHook(() => useProducts(), {
      wrapper: createWrapper(data),
    })
    expect(result.current).toEqual([])
  })

  it('throws when used outside ThemeProvider', () => {
    expect(() => {
      renderHook(() => useProducts())
    }).toThrow('useProducts must be used within a ThemeProvider')
  })
})

// ── useLocale ────────────────────────────────────────────────────────

describe('useLocale', () => {
  it('returns locale information', () => {
    const data = makePageData()
    const { result } = renderHook(() => useLocale(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.current).toBe('en')
    expect(result.current.available).toEqual(['en', 'ar'])
    expect(result.current.direction).toBe('ltr')
  })

  it('provides a t() function that translates keys', () => {
    const data = makePageData()
    const { result } = renderHook(() => useLocale(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.t('nav.home')).toBe('Home')
    expect(result.current.t('nav.about')).toBe('About Us')
  })

  it('t() returns the key itself when translation is not found', () => {
    const data = makePageData()
    const { result } = renderHook(() => useLocale(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.t('nonexistent.key')).toBe('nonexistent.key')
  })

  it('t() interpolates parameters', () => {
    const data = makePageData()
    const { result } = renderHook(() => useLocale(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.t('greeting', { name: 'Alice' })).toBe('Hello, Alice!')
    expect(result.current.t('items.count', { count: '5' })).toBe('5 items remaining')
  })

  it('t() handles missing parameters gracefully (leaves placeholder)', () => {
    const data = makePageData()
    const { result } = renderHook(() => useLocale(), {
      wrapper: createWrapper(data),
    })
    // When no params provided, placeholder stays as-is
    expect(result.current.t('greeting')).toBe('Hello, {name}!')
  })

  it('isRTL returns true for rtl direction', () => {
    const data = makePageData({
      locale: {
        current: 'ar',
        available: ['en', 'ar'],
        direction: 'rtl',
        messages: {},
      },
    })
    const { result } = renderHook(() => useLocale(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.isRTL).toBe(true)
    expect(result.current.direction).toBe('rtl')
  })

  it('isRTL returns false for ltr direction', () => {
    const data = makePageData()
    const { result } = renderHook(() => useLocale(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.isRTL).toBe(false)
  })

  it('throws when used outside ThemeProvider', () => {
    expect(() => {
      renderHook(() => useLocale())
    }).toThrow('useLocale must be used within a ThemeProvider')
  })
})

// ── useNavigation ────────────────────────────────────────────────────

describe('useNavigation', () => {
  it('returns navigation with main and footer menus', () => {
    const data = makePageData()
    const { result } = renderHook(() => useNavigation(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.main).toHaveLength(1)
    expect(result.current.main[0].label).toBe('Home')
    expect(result.current.footer).toHaveLength(1)
    expect(result.current.footer[0].label).toBe('Privacy')
  })

  it('returns empty arrays when no navigation items', () => {
    const data = makePageData({
      navigation: { main: [], footer: [] },
    })
    const { result } = renderHook(() => useNavigation(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.main).toEqual([])
    expect(result.current.footer).toEqual([])
  })

  it('throws when used outside ThemeProvider', () => {
    expect(() => {
      renderHook(() => useNavigation())
    }).toThrow('useNavigation must be used within a ThemeProvider')
  })
})

// ── useSettings ──────────────────────────────────────────────────────

describe('useSettings', () => {
  it('returns settings values as properties', () => {
    const data = makePageData()
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.primaryColor).toBe('#3b82f6')
    expect(result.current.showHeader).toBe(true)
    expect(result.current.columns).toBe(3)
  })

  it('provides a get() method for typed access with fallback', () => {
    const data = makePageData()
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.get('primaryColor', '#000')).toBe('#3b82f6')
    expect(result.current.get('showHeader', false)).toBe(true)
    expect(result.current.get('columns', 1)).toBe(3)
  })

  it('get() returns fallback for missing keys', () => {
    const data = makePageData()
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.get('nonExistentKey', 'fallback')).toBe('fallback')
    expect(result.current.get('missingNumber', 42)).toBe(42)
  })

  it('get() returns the value even when it is falsy', () => {
    const data = makePageData({
      settings: {
        emptyString: '',
        zero: 0,
        isFalse: false,
      },
    })
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(data),
    })
    // These are defined (not undefined), so they should be returned, not the fallback
    expect(result.current.get('emptyString', 'default')).toBe('')
    expect(result.current.get('zero', 99)).toBe(0)
    expect(result.current.get('isFalse', true)).toBe(false)
  })

  it('returns empty settings when none provided', () => {
    const data = makePageData({ settings: {} })
    const { result } = renderHook(() => useSettings(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.get('anything', 'fallback')).toBe('fallback')
  })

  it('throws when used outside ThemeProvider', () => {
    expect(() => {
      renderHook(() => useSettings())
    }).toThrow('useSettings must be used within a ThemeProvider')
  })
})

// ── useCurrentPage ───────────────────────────────────────────────────

describe('useCurrentPage', () => {
  it('returns page info with all fields', () => {
    const data = makePageData()
    const { result } = renderHook(() => useCurrentPage(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.type).toBe('index')
    expect(result.current.slug).toBe('home')
    expect(result.current.meta.title).toBe('Home Page')
    expect(result.current.meta.description).toBe('Welcome to our site')
    expect(result.current.meta.ogImage).toBe('https://example.com/og.png')
    expect(result.current.content).toBe('<h1>Welcome</h1>')
  })

  it('handles page without optional fields', () => {
    const data = makePageData({
      page: {
        type: 'error',
        meta: { title: 'Error', description: '' },
      },
    })
    const { result } = renderHook(() => useCurrentPage(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.type).toBe('error')
    expect(result.current.slug).toBeUndefined()
    expect(result.current.content).toBeUndefined()
  })

  it('supports different page types', () => {
    const pageTypes = ['index', 'page', 'products', 'error'] as const
    for (const type of pageTypes) {
      const data = makePageData({
        page: { type, meta: { title: type, description: '' } },
      })
      const { result } = renderHook(() => useCurrentPage(), {
        wrapper: createWrapper(data),
      })
      expect(result.current.type).toBe(type)
    }
  })

  it('throws when used outside ThemeProvider', () => {
    expect(() => {
      renderHook(() => useCurrentPage())
    }).toThrow('useCurrentPage must be used within a ThemeProvider')
  })
})

// ── useUser ──────────────────────────────────────────────────────────

describe('useUser', () => {
  it('returns authenticated user info when provided', () => {
    const data = makePageData({
      user: {
        id: 'user-1',
        name: 'Alice',
        email: 'alice@example.com',
        avatar: 'https://example.com/alice.png',
        isAuthenticated: true,
      },
    })
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.id).toBe('user-1')
    expect(result.current.name).toBe('Alice')
    expect(result.current.email).toBe('alice@example.com')
    expect(result.current.avatar).toBe('https://example.com/alice.png')
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('returns anonymous user when user is undefined', () => {
    const data = makePageData({ user: undefined })
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.id).toBe('')
    expect(result.current.name).toBe('')
    expect(result.current.email).toBe('')
    expect(result.current.isAuthenticated).toBe(false)
  })

  it('anonymous user does not have avatar', () => {
    const data = makePageData({ user: undefined })
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.avatar).toBeUndefined()
  })

  it('returns user without avatar when not provided', () => {
    const data = makePageData({
      user: {
        id: 'user-2',
        name: 'Bob',
        email: 'bob@example.com',
        isAuthenticated: true,
      },
    })
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(data),
    })
    expect(result.current.name).toBe('Bob')
    expect(result.current.avatar).toBeUndefined()
  })

  it('throws when used outside ThemeProvider', () => {
    expect(() => {
      renderHook(() => useUser())
    }).toThrow('useUser must be used within a ThemeProvider')
  })
})
