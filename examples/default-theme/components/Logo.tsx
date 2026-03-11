'use client'

import { useTenant } from '@wajiha/theme-sdk'

interface LogoProps {
  className?: string
}

export function Logo({ className = '' }: LogoProps) {
  const tenant = useTenant()

  return (
    <a href="/" className={`mp-logo ${className}`}>
      {tenant.logo ? (
        <img
          src={tenant.logo}
          alt={tenant.name}
          className="mp-logo__image"
        />
      ) : (
        <span>{tenant.name}</span>
      )}
    </a>
  )
}
