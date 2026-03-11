'use client'

import { useState, type ReactNode } from 'react'

// ── Accordion ───────────────────────────────────────────────────────

export interface AccordionItem {
  id: string
  title: string | ReactNode
  content: string | ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  className?: string
  itemClassName?: string
  triggerClassName?: string
  contentClassName?: string
  defaultOpen?: string[]
  allowMultiple?: boolean
}

export function Accordion({
  items,
  className = '',
  itemClassName = '',
  triggerClassName = '',
  contentClassName = '',
  defaultOpen = [],
  allowMultiple = false,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen))

  const toggle = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(allowMultiple ? prev : [])
      if (prev.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className={className}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id)
        return (
          <div key={item.id} className={itemClassName}>
            <button
              type="button"
              className={triggerClassName}
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
            >
              {item.title}
            </button>
            {isOpen && (
              <div
                id={`accordion-content-${item.id}`}
                className={contentClassName}
                role="region"
              >
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Tabs ─────────────────────────────────────────────────────────────

export interface TabItem {
  id: string
  label: string | ReactNode
  content: ReactNode
}

export interface TabsProps {
  items: TabItem[]
  className?: string
  tabListClassName?: string
  tabClassName?: string
  activeTabClassName?: string
  panelClassName?: string
  defaultTab?: string
}

export function Tabs({
  items,
  className = '',
  tabListClassName = '',
  tabClassName = '',
  activeTabClassName = '',
  panelClassName = '',
  defaultTab,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? items[0]?.id ?? '')
  const activeItem = items.find((item) => item.id === activeTab)

  return (
    <div className={className}>
      <div className={tabListClassName} role="tablist">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            className={`${tabClassName} ${item.id === activeTab ? activeTabClassName : ''}`.trim()}
            onClick={() => setActiveTab(item.id)}
            aria-selected={item.id === activeTab}
            aria-controls={`tabpanel-${item.id}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {activeItem && (
        <div
          id={`tabpanel-${activeItem.id}`}
          className={panelClassName}
          role="tabpanel"
          aria-labelledby={`tab-${activeItem.id}`}
        >
          {activeItem.content}
        </div>
      )}
    </div>
  )
}

// ── Modal ────────────────────────────────────────────────────────────

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  overlayClassName?: string
  title?: string
}

export function Modal({
  isOpen,
  onClose,
  children,
  className = '',
  overlayClassName = '',
  title,
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      className={overlayClassName}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={className}>
        {children}
      </div>
    </div>
  )
}
