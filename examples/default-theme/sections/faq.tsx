'use client'

import { Accordion, type AccordionItem } from '@wajiha/theme-sdk/components'
import { useLocale } from '@wajiha/theme-sdk'

interface FAQSectionProps {
  items?: AccordionItem[]
}

export function FAQSection({ items }: FAQSectionProps) {
  const { t } = useLocale()

  const defaultItems: AccordionItem[] = items ?? [
    {
      id: 'faq-1',
      title: t('faq.q1'),
      content: t('faq.a1'),
    },
    {
      id: 'faq-2',
      title: t('faq.q2'),
      content: t('faq.a2'),
    },
    {
      id: 'faq-3',
      title: t('faq.q3'),
      content: t('faq.a3'),
    },
  ]

  return (
    <section className="mp-section">
      <div className="mp-container" style={{ maxWidth: '48rem' }}>
        <div className="mp-text-center mp-mb-lg">
          <h2 className="mp-heading-lg">{t('faq.title')}</h2>
          <p className="mp-body-lg mp-text-muted" style={{ marginTop: '0.75rem' }}>
            {t('faq.subtitle')}
          </p>
        </div>

        <Accordion
          items={defaultItems}
          allowMultiple
          className="mp-animate-slide-up"
          itemClassName="mp-faq__item"
          triggerClassName="mp-faq__trigger"
          contentClassName="mp-faq__content"
        />
      </div>
    </section>
  )
}
