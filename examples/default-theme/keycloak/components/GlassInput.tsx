/**
 * Glass-styled input field for Midnight Prism theme.
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
          fontSize: '13px',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.7)',
          letterSpacing: '0.5px',
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
          padding: '12px 16px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          color: '#fff',
          fontSize: '15px',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}
