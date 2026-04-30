/**
 * Wajiha Default — Login text input
 *
 * Renders a label + input pair styled with the Wajiha DS surface palette.
 * The `form-control` class is kept on the input so the companion
 * `keycloak/styles.css` can apply focus rings consistently across both
 * the React-rendered and the FTL-rendered Keycloak pages.
 */

import React from 'react'

interface GlassInputProps {
  id: string
  name: string
  label: string
  type?: string
  defaultValue?: string
  autoComplete?: string
  autoFocus?: boolean
  required?: boolean
}

export function GlassInput({
  id,
  name,
  label,
  type = 'text',
  defaultValue = '',
  autoComplete,
  autoFocus,
  required = true,
}: GlassInputProps) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#5a6472',           // --ds-fg-muted
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        required={required}
        className="form-control"
        style={{
          width: '100%',
          padding: '12px 14px',
          background: '#ffffff',          // --ds-bg
          border: '1px solid #e5e8eb',    // --ds-border
          borderRadius: '6px',            // --ds-radius-md
          color: '#0a0e14',               // --ds-fg
          fontSize: '15px',
          outline: 'none',
          transition: 'border-color 0.12s, box-shadow 0.12s',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}
