import { useEffect, type ReactNode } from 'react'
import { X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const modal = document.getElementById('modal-content')
    const focusable = modal?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    const first = focusable?.[0]
    const last = focusable?.[focusable.length - 1]

    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !focusable?.length) return
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }

    first?.focus()
    window.addEventListener('keydown', handleTab)
    return () => window.removeEventListener('keydown', handleTab)
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        id="modal-content"
        className={cn(
          'relative z-[var(--z-modal)] w-full max-w-lg rounded-[var(--radius-xl)] bg-nomba-surface p-6 shadow-modal',
          className,
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-nomba-text">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="cursor-pointer rounded-[var(--radius-md)] p-1 text-nomba-text-secondary hover:bg-nomba-bg hover:text-nomba-text focus-visible:ring-2 focus-visible:ring-nomba-yellow focus-visible:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
