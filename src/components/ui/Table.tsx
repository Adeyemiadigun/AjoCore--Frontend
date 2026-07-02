import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: string
  header: string
  render: (item: T) => ReactNode
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  className?: string
  emptyMessage?: string
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  className,
  emptyMessage = 'No data',
}: TableProps<T>) {
  return (
    <div className={cn('overflow-x-auto rounded-[var(--radius-md)]', className)}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-nomba-border bg-nomba-bg">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-nomba-text-secondary',
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-sm text-nomba-text-secondary"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'border-b border-nomba-border transition-colors last:border-0',
                  onRowClick && 'cursor-pointer hover:bg-nomba-bg/50',
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3', col.className)}>
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
