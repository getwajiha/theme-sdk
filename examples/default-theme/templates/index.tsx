'use client'

import { useSettings } from '@wajiha/theme-sdk'
import type { DataRequirements } from '@wajiha/theme-sdk'
import { HeroSection } from '../sections/hero'
import { ProductGridSection } from '../sections/product-grid'
import { FeaturesSection } from '../sections/features'
import { CTASection } from '../sections/cta'

export const dataRequirements: DataRequirements = {
  products: { limit: 6 },
}

export default function IndexTemplate() {
  const settings = useSettings()
  const showProducts = settings.get<boolean>('show_products', true)

  return (
    <>
      <HeroSection />
      {showProducts && <ProductGridSection />}
      <FeaturesSection />
      <CTASection />
    </>
  )
}
