import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { auth } from '@/api/endpoints'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CheckCircle, XCircle } from '@phosphor-icons/react'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const email = searchParams.get('email')
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const hasVerified = useRef(false)

  useEffect(() => {
    if (!email || !token) {
      setStatus('error')
      setMessage('Invalid verification link. Missing email or token.')
      return
    }

    if (hasVerified.current) return
    hasVerified.current = true

    async function verify() {
      try {
        await auth.verifyEmail({ email: email!, token: token! })
        setStatus('success')
        setMessage('Your email has been verified! You can now log in to your account.')
      } catch (err: any) {
        setStatus('error')
        const apiError = err?.response?.data?.message || err?.response?.data?.error?.message
        setMessage(apiError || 'Failed to verify email. The link may have expired or is invalid.')
      }
    }

    verify()
  }, [email, token])

  return (
    <div className="flex min-h-screen items-center justify-center bg-nomba-bg px-4 py-8">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mb-6 flex justify-center">
          {status === 'loading' && (
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-nomba-border border-t-nomba-yellow" />
          )}
          {status === 'success' && (
            <CheckCircle className="h-16 w-16 text-green-500" weight="fill" />
          )}
          {status === 'error' && <XCircle className="h-16 w-16 text-nomba-error" weight="fill" />}
        </div>

        <h1 className="mb-2 text-2xl font-extrabold font-display text-nomba-text text-balance">
          {status === 'loading' && 'Verifying Email...'}
          {status === 'success' && 'Email Verified!'}
          {status === 'error' && 'Verification Failed'}
        </h1>

        <p className="mb-8 text-sm text-nomba-text-secondary">
          {status === 'loading' ? 'Please wait while we verify your email address.' : message}
        </p>

        {status !== 'loading' && (
          <Button onClick={() => navigate('/login')} className="w-full">
            Go to Login
          </Button>
        )}
      </Card>
    </div>
  )
}
