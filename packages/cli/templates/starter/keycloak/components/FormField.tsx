/**
 * Reusable form field component for Keycloak pages.
 */

import React from 'react'

interface FormFieldProps {
  id: string
  name: string
  label: string
  type?: string
  defaultValue?: string
  autoComplete?: string
  autoFocus?: boolean
  required?: boolean
}

export function FormField({
  id,
  name,
  label,
  type = 'text',
  defaultValue = '',
  autoComplete,
  autoFocus,
  required = true,
}: FormFieldProps) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label
        htmlFor={id}
        style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}
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
      />
    </div>
  )
}
