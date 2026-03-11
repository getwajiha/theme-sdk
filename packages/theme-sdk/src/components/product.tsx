'use client'

import type { ReactNode } from 'react'
import type { Product } from '../types'

// ── ProductCard ─────────────────────────────────────────────────────

export interface ProductCardProps {
  product: Product
  locale?: string
  className?: string
  href?: string
  renderBadge?: (product: Product) => ReactNode
}

export function ProductCard({
  product,
  className = '',
  href,
  renderBadge,
}: ProductCardProps) {
  const Wrapper = href ? 'a' : 'div'
  const wrapperProps = href ? { href } : {}

  return (
    <Wrapper className={className} {...wrapperProps}>
      {product.logo && (
        <img
          src={product.logo}
          alt={product.name}
          loading="lazy"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}
      <div>
        <h3>{product.name}</h3>
        {product.description && <p>{product.description}</p>}
        {renderBadge?.(product)}
      </div>
    </Wrapper>
  )
}

// ── ProductGrid ─────────────────────────────────────────────────────

export interface ProductGridProps {
  products: Product[]
  columns?: number
  gap?: string
  className?: string
  renderProduct?: (product: Product) => ReactNode
  locale?: string
}

export function ProductGrid({
  products,
  columns = 3,
  gap = '1.5rem',
  className = '',
  renderProduct,
}: ProductGridProps) {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
      }}
    >
      {products.map((product) =>
        renderProduct ? (
          <div key={product.id}>{renderProduct(product)}</div>
        ) : (
          <ProductCard key={product.id} product={product} />
        )
      )}
    </div>
  )
}

// ── ProductBadge ────────────────────────────────────────────────────

export interface ProductBadgeProps {
  status: string
  className?: string
}

export function ProductBadge({ status, className = '' }: ProductBadgeProps) {
  return (
    <span className={className} data-status={status}>
      {status}
    </span>
  )
}
