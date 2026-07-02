import { useQuery } from '@tanstack/react-query'
import { User, Envelope, Phone, CalendarBlank, IdentificationCard } from '@phosphor-icons/react'
import { auth } from '@/api/endpoints'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

export default function ProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: auth.profile,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="animate-pulse space-y-4">
            <div className="h-16 w-16 rounded-full bg-nomba-bg" />
            <div className="h-4 w-1/3 rounded bg-nomba-bg" />
            <div className="h-4 w-1/2 rounded bg-nomba-bg" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const details = [
    {
      label: 'Full Name',
      value: `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`,
      icon: User,
    },
    { label: 'Email', value: profile?.email, icon: Envelope },
    { label: 'Phone', value: profile?.phoneNumber, icon: Phone },
    {
      label: 'Date of Birth',
      value: profile?.dateOfBirth ? formatDate(profile.dateOfBirth) : 'Not set',
      icon: CalendarBlank,
    },
    {
      label: 'BVN',
      value: profile?.bvn ? `****${profile.bvn.slice(-4)}` : 'Not provided',
      icon: IdentificationCard,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-nomba-text text-balance">Profile</h1>
        <p className="text-sm text-nomba-text-secondary">Your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <Badge variant={profile?.role === 'SystemAdmin' ? 'admin' : 'info'}>
            {profile?.role === 'CooperativeAdmin' ? 'Cooperative Admin' : profile?.role}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {details.map((detail) => {
              const Icon = detail.icon
              return (
                <div key={detail.label} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-nomba-bg">
                    <Icon size={18} className="text-nomba-text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-nomba-text-secondary">{detail.label}</p>
                    <p className="text-sm font-medium text-nomba-text">{detail.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {profile?.payoutAccountNumber && (
        <Card>
          <CardHeader>
            <CardTitle>Payout Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-nomba-text-secondary">Account Name</span>
                <span className="font-medium text-nomba-text">{profile.payoutAccountName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-nomba-text-secondary">Account Number</span>
                <span className="font-medium text-nomba-text">{profile.payoutAccountNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-nomba-text-secondary">Bank</span>
                <span className="font-medium text-nomba-text">{profile.payoutBankName}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
