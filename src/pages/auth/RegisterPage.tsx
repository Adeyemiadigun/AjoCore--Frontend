import { useState } from 'react'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { UserRole } from '@/types/enums'
import { extractApiError } from '@/lib/api-utils'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: UserRole.Trader,
    dateOfBirth: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/dashboard', { replace: true })
    } catch (err: unknown) {
      setError(extractApiError(err, 'Registration failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-nomba-bg px-4 py-8">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-extrabold font-display text-nomba-text text-balance">
            Join AjoCore
          </h1>
          <p className="mt-1 text-sm text-nomba-text-secondary">Create your savings account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="firstName"
              label="First Name"
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              required
            />
            <Input
              id="lastName"
              label="Last Name"
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              required
            />
          </div>
          <Input
            id="reg-email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
          />
          <Input
            id="phone"
            label="Phone Number"
            type="tel"
            value={form.phoneNumber}
            onChange={(e) => update('phoneNumber', e.target.value)}
            required
          />
          <Input
            id="reg-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            required
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
          <Input
            id="dob"
            label="Date of Birth"
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => update('dateOfBirth', e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-nomba-text">Account Type</label>
            <select
              value={form.role}
              onChange={(e) => update('role', e.target.value)}
              className="block w-full rounded-[var(--radius-md)] border-2 border-nomba-border bg-white px-3 py-2 text-sm text-nomba-text focus:border-nomba-yellow focus:outline-none focus:ring-2 focus:ring-nomba-yellow/20"
            >
              <option value={UserRole.Trader}>Individual Saver (Trader)</option>
              <option value={UserRole.CooperativeAdmin}>Cooperative Admin</option>
            </select>
          </div>

          {error && (
            <p className="rounded-[var(--radius-md)] bg-nomba-error-bg px-3 py-2 text-sm text-nomba-error">
              {error}
            </p>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-nomba-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-nomba-yellow-dark hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}
