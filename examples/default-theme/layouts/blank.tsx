'use client'

import type { ReactNode } from 'react'
import { useLocale } from '@getwajiha/theme-sdk'

interface BlankLayoutProps {
  children: ReactNode
}

export default function BlankLayout({ children }: BlankLayoutProps) {
  const { direction } = useLocale()

  return (
    <div className="mp-theme" dir={direction}>
      {children}
    </div>
  )
}
