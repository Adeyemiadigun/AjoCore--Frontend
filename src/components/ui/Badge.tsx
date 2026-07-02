import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'admin'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-nomba-bg text-nomba-text-secondary',
  success: 'bg-nomba-success-bg text-nomba-success',
  warning: 'bg-nomba-warning-bg text-nomba-warning',
  error: 'bg-nomba-error-bg text-nomba-error',
  info: 'bg-nomba-info-bg text-nomba-info',
  admin: 'bg-admin-accent-light text-admin-accent',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
