import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EnvelopeSimple } from '@phosphor-icons/react'

export default function RegisterSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const email = location.state?.email

  if (!email) {
    return <Navigate to="/register" replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-nomba-bg px-4 py-8">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mb-6 flex justify-center text-nomba-yellow-dark">
          <EnvelopeSimple className="h-16 w-16" weight="duotone" />
        </div>

        <h1 className="mb-2 text-2xl font-extrabold font-display text-nomba-text text-balance">
          Registration Successful!
        </h1>

        <p className="mb-6 text-sm text-nomba-text-secondary">
          We've sent a verification link to{' '}
          <span className="font-semibold text-nomba-text">{email}</span>. Please check your email
          and click the link to verify your account.
        </p>

        <Button onClick={() => navigate('/login')} className="w-full">
          Go to Login
        </Button>
      </Card>
    </div>
  )
}
