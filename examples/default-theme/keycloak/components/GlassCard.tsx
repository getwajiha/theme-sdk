/**
 * Wajiha Default — Login surface card
 *
 * Light, soft-shadow card matching the Wajiha DS docs canvas. The name
 * `GlassCard` is preserved for compatibility with the existing Login /
 * Register imports — only the styling changed.
 */

import React from 'react'

export function GlassCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        background: '#ffffff',                    // --ds-bg
        border: '1px solid #e5e8eb',              // --ds-border
        borderRadius: '10px',                     // --ds-radius-xl
        padding: '40px',
        boxShadow: '0 10px 28px rgba(15, 23, 41, 0.10)', // --ds-elevation-e3
        width: '100%',
        maxWidth: '400px',
      }}
    >
      {children}
    </div>
  )
}
