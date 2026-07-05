import { useState } from 'react'
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { PiggyBank, Eye, EyeSlash } from '@phosphor-icons/react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { extractApiError } from '@/lib/api-utils'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, adminLogin, isLoading, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminCode, setAdminCode] = useState('')
  const [error, setError] = useState('')

  const fromPath = location.state?.from?.pathname
  const fromSearch = location.state?.from?.search || ''

  // Only redirect to saved URL if it's an invite link to prevent unexpected redirects
  const from = fromPath?.startsWith('/join-group') ? fromPath + fromSearch : '/dashboard'

  if (isAuthenticated) return <Navigate to={from} replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (isAdmin) {
        await adminLogin({ email, password, adminCode })
      } else {
        await login({ email, password })
      }
      navigate(from, { replace: true })
    } catch (err: unknown) {
      setError(extractApiError(err, 'Login failed.'))
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-nomba-bg px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-nomba-yellow shadow-card-hover shadow-nomba-yellow/30">
            <PiggyBank className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-nomba-text">AjoCore</span>
        </Link>
        <Card className="p-8">
          <h1 className="text-2xl font-bold font-display text-nomba-text mb-1 text-balance">
            Welcome back
          </h1>
          <p className="text-sm text-nomba-text-secondary mb-6">Sign in to your savings account</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
            <Input
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-nomba-text-secondary hover:text-nomba-text focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeSlash className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              }
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="rounded border-nomba-border text-nomba-yellow focus:ring-nomba-yellow"
              />
              <span className="text-sm text-nomba-text-secondary">Admin login</span>
            </label>
            {isAdmin && (
              <Input
                id="adminCode"
                label="Admin Code"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                required
                placeholder="Enter admin code"
              />
            )}
            {error && (
              <p className="rounded-[var(--radius-md)] bg-nomba-error-bg px-3 py-2 text-sm text-nomba-error">
                {error}
              </p>
            )}
            <Button type="submit" loading={isLoading} className="w-full">
              Sign In
            </Button>
          </form>
          <p className="text-center text-sm text-nomba-text-secondary mt-6">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              state={{ from: location.state?.from }}
              className="font-semibold text-nomba-yellow-dark hover:underline"
            >
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
