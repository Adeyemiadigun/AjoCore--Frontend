import { Component, type ReactNode, type ErrorInfo } from 'react'
import { WarningCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/Button'

interface Props {
  children: ReactNode
}
interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-nomba-bg px-4 text-center">
          <WarningCircle size={64} className="text-nomba-error mb-4" />
          <h1 className="text-2xl font-bold text-nomba-text mb-2">Something went wrong</h1>
          <p className="text-nomba-text-secondary mb-6 max-w-sm">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      )
    }
    return this.props.children
  }
}
