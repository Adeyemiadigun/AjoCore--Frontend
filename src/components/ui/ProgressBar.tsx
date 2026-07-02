import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ProgressBar({ value, max = 100, className, size = 'md' }: ProgressBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100)
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' }

  return (
    <div className={cn('w-full rounded-full bg-nomba-bg', heights[size], className)}>
      <div
        className={cn('rounded-full bg-nomba-yellow transition-all duration-500', heights[size])}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
