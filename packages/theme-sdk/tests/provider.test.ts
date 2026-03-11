import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { renderHook } from '@testing-library/react'
import { ThemeProvider, ThemeContext } from '../src/provider'
import type { ThemePageData } from '../src/types'
import { useContext } from 'react'

/**
 * Build a minimal but complete ThemePageData fixture.
 */
function makePageData(overrides?: Partial<ThemePageData>): ThemePageData {
  return {
    tenant: {
      name: 'Test Tenant',
      domain: 'test.example.com',
      logo: null,
      favicon: null,
      description: null,
    },
    navigation: {
      main: [],
      footer: [],
    },
    locale: {
      current: 'en',
      available: ['en'],
      direction: 'ltr',
      messages: {},
    },
    settings: {},
    appearance: {
      colorMode: 'light',
    },
    page: {
      type: 'index',
      meta: {
        title: 'Home',
        description: 'Welcome',
      },
    },
    ...overrides,
  }
}

describe('ThemeContext', () => {
  it('has a default value of null', () => {
    const { result } = renderHook(() => useContext(ThemeContext))
    expect(result.current).toBeNull()
  })
})

describe('ThemeProvider', () => {
  it('provides ThemePageData to children via context', () => {
    const data = makePageData()

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(ThemeProvider, { data }, children)

    const { result } = renderHook(() => useContext(ThemeContext), { wrapper })
    expect(result.current).not.toBeNull()
    expect(result.current!.tenant.name).toBe('Test Tenant')
    expect(result.current!.tenant.domain).toBe('test.example.com')
  })

  it('provides all required fields', () => {
    const data = makePageData({
      settings: { primaryColor: '#ff0000' },
      appearance: { colorMode: 'dark' },
    })

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(ThemeProvider, { data }, children)

    const { result } = renderHook(() => useContext(ThemeContext), { wrapper })
    expect(result.current!.settings).toEqual({ primaryColor: '#ff0000' })
    expect(result.current!.appearance.colorMode).toBe('dark')
    expect(result.current!.navigation).toEqual({ main: [], footer: [] })
    expect(result.current!.locale.current).toBe('en')
    expect(result.current!.page.type).toBe('index')
  })

  it('passes through optional user data', () => {
    const data = makePageData({
      user: {
        id: 'user-1',
        name: 'Alice',
        email: 'alice@example.com',
        isAuthenticated: true,
      },
    })

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(ThemeProvider, { data }, children)

    const { result } = renderHook(() => useContext(ThemeContext), { wrapper })
    expect(result.current!.user).toBeDefined()
    expect(result.current!.user!.name).toBe('Alice')
    expect(result.current!.user!.isAuthenticated).toBe(true)
  })

  it('passes through optional products data', () => {
    const data = makePageData({
      products: [
        {
          id: 'p1',
          name: 'Product 1',
          slug: 'product-1',
          description: 'A product',
          logo: null,
          status: 'active',
          isPublic: true,
          publishedAt: '2025-01-01',
        },
      ],
    })

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(ThemeProvider, { data }, children)

    const { result } = renderHook(() => useContext(ThemeContext), { wrapper })
    expect(result.current!.products).toHaveLength(1)
    expect(result.current!.products![0].slug).toBe('product-1')
  })

  it('passes through optional error data', () => {
    const data = makePageData({
      error: { code: 404, message: 'Not Found', description: 'Page not found' },
    })

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(ThemeProvider, { data }, children)

    const { result } = renderHook(() => useContext(ThemeContext), { wrapper })
    expect(result.current!.error).toBeDefined()
    expect(result.current!.error!.code).toBe(404)
    expect(result.current!.error!.message).toBe('Not Found')
  })

  it('provides navigation with menu items', () => {
    const data = makePageData({
      navigation: {
        main: [
          {
            id: 'nav-1',
            label: 'Home',
            url: '/',
            sortOrder: 0,
            children: [],
          },
          {
            id: 'nav-2',
            label: 'About',
            url: '/about',
            sortOrder: 1,
            children: [
              {
                id: 'nav-2-1',
                label: 'Team',
                url: '/about/team',
                sortOrder: 0,
                children: [],
              },
            ],
          },
        ],
        footer: [],
      },
    })

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(ThemeProvider, { data }, children)

    const { result } = renderHook(() => useContext(ThemeContext), { wrapper })
    expect(result.current!.navigation.main).toHaveLength(2)
    expect(result.current!.navigation.main[1].children).toHaveLength(1)
    expect(result.current!.navigation.main[1].children[0].label).toBe('Team')
  })
})
