'use client'

import { useThemeData, useLocale } from '@getwajiha/theme-sdk'
import type { DataRequirements } from '@getwajiha/theme-sdk'

export const dataRequirements: DataRequirements = {}

export default function ErrorTemplate() {
  const { error } = useThemeData()
  const { t } = useLocale()

  const code = error?.code ?? 500
  const message = error?.message ?? t(`error.${code}`)
  const description = error?.description ?? t(`error.${code}Desc`)

  return (
    <div className="mp-error mp-gradient-hero">
      <div className="mp-error__code mp-animate-scale-in">
        {code}
      </div>
      <h1 className="mp-error__message mp-animate-slide-up mp-delay-1">
        {message}
      </h1>
      <p className="mp-error__desc mp-animate-slide-up mp-delay-2">
        {description}
      </p>
      <a href="/" className="mp-btn mp-btn--primary mp-btn--lg mp-animate-slide-up mp-delay-3">
        {t('error.backHome')}
      </a>
    </div>
  )
}
