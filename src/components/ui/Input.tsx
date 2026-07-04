import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  suffix?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, suffix, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-nomba-text">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className={cn(
              'block w-full rounded-[var(--radius-md)] border-2 border-nomba-border bg-white px-3 py-2 text-sm',
              'text-nomba-text placeholder:text-nomba-text-secondary/80',
              'transition-all duration-200',
              'focus:border-nomba-yellow focus:outline-none focus:ring-2 focus:ring-nomba-yellow/20',
              error && 'border-nomba-error focus:border-nomba-error focus:ring-nomba-error/20',
              suffix && 'pr-10',
              className,
            )}
            {...props}
          />
          {suffix && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">{suffix}</div>
          )}
        </div>
        {error && (
          <p id={`${id}-error`} className="text-xs text-nomba-error" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'
