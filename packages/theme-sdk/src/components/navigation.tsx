'use client'

import type { ReactNode } from 'react'
import type { MenuItem } from '../types'

// ── NavLink ─────────────────────────────────────────────────────────

export interface NavLinkProps {
  href: string
  children: ReactNode
  className?: string
  activeClassName?: string
  isActive?: boolean
}

export function NavLink({
  href,
  children,
  className = '',
  activeClassName = '',
  isActive = false,
}: NavLinkProps) {
  return (
    <a
      href={href}
      className={`${className} ${isActive ? activeClassName : ''}`.trim()}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </a>
  )
}

// ── NavMenu ─────────────────────────────────────────────────────────

export interface NavMenuProps {
  items: MenuItem[]
  className?: string
  itemClassName?: string
  activeItemClassName?: string
  currentPath?: string
  renderItem?: (item: MenuItem, isActive: boolean) => ReactNode
}

export function NavMenu({
  items,
  className = '',
  itemClassName = '',
  activeItemClassName = '',
  currentPath = '',
  renderItem,
}: NavMenuProps) {
  return (
    <nav className={className}>
      <ul>
        {items.map((item) => {
          const isActive = currentPath === item.url
          return (
            <li key={item.id}>
              {renderItem ? (
                renderItem(item, isActive)
              ) : (
                <NavLink
                  href={item.url}
                  className={itemClassName}
                  activeClassName={activeItemClassName}
                  isActive={isActive}
                >
                  {item.label}
                </NavLink>
              )}
              {item.children.length > 0 && (
                <NavMenu
                  items={item.children}
                  className={className}
                  itemClassName={itemClassName}
                  activeItemClassName={activeItemClassName}
                  currentPath={currentPath}
                  renderItem={renderItem}
                />
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
