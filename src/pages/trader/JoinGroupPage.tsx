import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, XCircle } from '@phosphor-icons/react'
import { groups } from '@/api/endpoints'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { extractApiError } from '@/lib/api-utils'

export default function JoinGroupPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const groupId = searchParams.get('groupId')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const hasRequested = useRef(false)

  const joinMutation = useMutation({
    mutationFn: groups.join,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      setStatus('success')
      setMessage(
        'Your request to join the group has been sent! You will be notified once the admin approves it.',
      )
    },
    onError: (err) => {
      setStatus('error')
      setMessage(extractApiError(err, 'Failed to join the group.'))
    },
  })

  useEffect(() => {
    if (!groupId) {
      setStatus('error')
      setMessage('Invalid invite link. Missing group ID.')
      return
    }

    if (hasRequested.current) return
    hasRequested.current = true

    joinMutation.mutate(groupId)
  }, [groupId])

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
          {status === 'loading' && 'Joining Group...'}
          {status === 'success' && 'Request Sent!'}
          {status === 'error' && 'Failed to Join'}
        </h1>

        <p className="mb-8 text-sm text-nomba-text-secondary">
          {status === 'loading' ? 'Please wait while we process your request.' : message}
        </p>

        {status !== 'loading' && (
          <Button onClick={() => navigate('/dashboard')} className="w-full">
            Go to Dashboard
          </Button>
        )}
      </Card>
    </div>
  )
}
