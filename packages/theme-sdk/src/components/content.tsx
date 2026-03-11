'use client'

import type { ReactNode } from 'react'

// ── RichText ────────────────────────────────────────────────────────

export interface RichTextProps {
  content: string
  className?: string
}

/**
 * RichText - Renders HTML content from CMS pages.
 * Uses dangerouslySetInnerHTML since content is sanitized on the server.
 */
export function RichText({ content, className = '' }: RichTextProps) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

// ── Image ───────────────────────────────────────────────────────────

export interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  loading?: 'lazy' | 'eager'
}

export function Image({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
    />
  )
}

// ── Video ───────────────────────────────────────────────────────────

export interface VideoProps {
  src: string
  poster?: string
  className?: string
  controls?: boolean
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
}

export function Video({
  src,
  poster,
  className = '',
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
}: VideoProps) {
  return (
    <video
      src={src}
      poster={poster}
      className={className}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
    />
  )
}

// ── Icon ────────────────────────────────────────────────────────────

export interface IconProps {
  name: string
  size?: number
  className?: string
}

/**
 * Icon component - renders an SVG icon by name.
 * Themes should override this with their icon library of choice.
 */
export function Icon({ name, size = 24, className = '' }: IconProps) {
  return (
    <span
      className={className}
      style={{ width: size, height: size, display: 'inline-flex' }}
      aria-hidden="true"
      data-icon={name}
    />
  )
}

// ── Container ───────────────────────────────────────────────────────

export interface ContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

const maxWidthMap = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
}

export function Container({
  children,
  className = '',
  maxWidth = 'xl',
}: ContainerProps) {
  return (
    <div
      className={className}
      style={{ maxWidth: maxWidthMap[maxWidth], marginInline: 'auto', paddingInline: '1rem' }}
    >
      {children}
    </div>
  )
}

// ── Section ─────────────────────────────────────────────────────────

export interface SectionProps {
  children: ReactNode
  className?: string
  id?: string
}

export function Section({ children, className = '', id }: SectionProps) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  )
}

// ── Grid ────────────────────────────────────────────────────────────

export interface GridProps {
  children: ReactNode
  columns?: number
  gap?: string
  className?: string
}

export function Grid({
  children,
  columns = 3,
  gap = '1.5rem',
  className = '',
}: GridProps) {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
      }}
    >
      {children}
    </div>
  )
}

// ── Stack ───────────────────────────────────────────────────────────

export interface StackProps {
  children: ReactNode
  direction?: 'horizontal' | 'vertical'
  gap?: string
  align?: 'start' | 'center' | 'end' | 'stretch'
  className?: string
}

export function Stack({
  children,
  direction = 'vertical',
  gap = '1rem',
  align = 'stretch',
  className = '',
}: StackProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        gap,
        alignItems: align,
      }}
    >
      {children}
    </div>
  )
}
