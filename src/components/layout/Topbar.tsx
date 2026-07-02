import { List } from '@phosphor-icons/react'

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-nomba-border bg-nomba-surface px-6">
      <button
        onClick={onMenuClick}
        aria-label="Toggle navigation menu"
        className="cursor-pointer rounded-[var(--radius-md)] p-2 text-nomba-text-secondary hover:bg-nomba-bg focus-visible:ring-2 focus-visible:ring-nomba-yellow focus-visible:outline-none lg:hidden"
      >
        <List size={24} />
      </button>
      <div className="flex-1" />
    </header>
  )
}
