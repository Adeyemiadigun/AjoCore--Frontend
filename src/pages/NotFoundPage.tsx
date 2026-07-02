import { Link } from 'react-router-dom'
import { WarningCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-nomba-bg px-4 text-center">
      <WarningCircle size={64} className="text-nomba-text-secondary mb-4" />
      <h1 className="text-4xl font-extrabold text-nomba-text mb-2 text-balance">404</h1>
      <p className="text-nomba-text-secondary mb-8 max-w-sm">
        This page doesn&apos;t exist. It might have been moved or the link is incorrect.
      </p>
      <Link to="/dashboard">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  )
}
