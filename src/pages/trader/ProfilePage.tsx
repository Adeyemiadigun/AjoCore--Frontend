import { useState } from 'react'
import {
  User,
  Envelope,
  Phone,
  CalendarBlank,
  IdentificationCard,
  Bank,
  CheckCircle,
  PencilSimple,
  X,
  FloppyDisk,
  ArrowClockwise,
} from '@phosphor-icons/react'
import { useProfile, useUpdateProfile } from '@/hooks/useProfile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { UserRole } from '@/types/enums'

function initials(firstName?: string, lastName?: string): string {
  const f = firstName?.charAt(0) ?? ''
  const l = lastName?.charAt(0) ?? ''
  return `${f}${l}`.toUpperCase() || '?'
}

function roleLabel(role?: UserRole): string {
  switch (role) {
    case UserRole.CooperativeAdmin:
      return 'Cooperative Admin'
    case UserRole.SystemAdmin:
      return 'System Admin'
    default:
      return 'Trader'
  }
}

export default function ProfilePage() {
  const { data: profile, isLoading, isError, error, refetch } = useProfile()
  const updateMutation = useUpdateProfile()
  const { user: authUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
  })

  function startEdit() {
    if (!profile) return
    setForm({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber,
      dateOfBirth: profile.dateOfBirth ?? '',
    })
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
  }

  async function handleSave() {
    await updateMutation.mutateAsync({
      firstName: form.firstName,
      lastName: form.lastName,
      phoneNumber: form.phoneNumber,
      dateOfBirth: form.dateOfBirth || undefined,
    })
    setEditing(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-nomba-bg" />
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-nomba-bg" />
                <div className="h-3 w-24 rounded bg-nomba-bg" />
              </div>
            </div>
            <div className="h-4 w-1/2 rounded bg-nomba-bg" />
            <div className="h-4 w-2/3 rounded bg-nomba-bg" />
            <div className="h-4 w-1/3 rounded bg-nomba-bg" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-nomba-error-bg">
              <ArrowClockwise size={24} className="text-nomba-error" />
            </div>
            <p className="text-sm text-nomba-text-secondary">
              {error instanceof Error ? error.message : 'Failed to load profile'}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) return null

  const gradient = 'bg-gradient-to-br from-nomba-yellow to-nomba-yellow-dark'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-nomba-text text-balance">Profile</h1>
          <p className="text-sm text-nomba-text-secondary">Your account information</p>
        </div>
        {!editing && (
          <Button variant="outline" size="sm" onClick={startEdit}>
            <PencilSimple size={16} />
            Edit
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ${gradient} text-lg font-bold text-nomba-text shadow-card`}
            >
              {initials(profile.firstName, profile.lastName)}
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold font-display text-nomba-text">
                {profile.firstName} {profile.lastName}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant={profile.role === UserRole.SystemAdmin ? 'admin' : 'info'}>
                  {roleLabel(profile.role)}
                </Badge>
              </div>
            </div>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="First Name"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
                <Input
                  label="Last Name"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
              <Input
                label="Phone Number"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              />
              <div className="flex items-center gap-3 pt-2">
                <Button onClick={handleSave} loading={updateMutation.isPending}>
                  <FloppyDisk size={16} />
                  Save Changes
                </Button>
                <Button variant="ghost" onClick={cancelEdit} disabled={updateMutation.isPending}>
                  <X size={16} />
                  Cancel
                </Button>
              </div>
              {updateMutation.isError && (
                <p className="text-sm text-nomba-error">
                  {updateMutation.error instanceof Error
                    ? updateMutation.error.message
                    : 'Failed to update profile'}
                </p>
              )}
              {updateMutation.isSuccess && (
                <p className="text-sm text-nomba-success">Profile updated successfully</p>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              <ProfileDetail
                icon={User}
                label="Full Name"
                value={`${profile.firstName} ${profile.lastName}`}
              />
              <ProfileDetail icon={Envelope} label="Email" value={profile.email} />
              <ProfileDetail icon={Phone} label="Phone" value={profile.phoneNumber} />
              <ProfileDetail
                icon={CalendarBlank}
                label="Date of Birth"
                value={profile.dateOfBirth ? formatDate(profile.dateOfBirth) : 'Not set'}
              />
              <ProfileDetail
                icon={IdentificationCard}
                label="BVN"
                value={profile.bvn ? `****${profile.bvn.slice(-4)}` : 'Not provided'}
              />
              <ProfileDetail
                icon={User}
                label="Member Since"
                value={profile.createdAt ? formatDate(profile.createdAt) : '-'}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <span className="flex items-center gap-2">
                <CheckCircle size={18} />
                Verification Status
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-nomba-text-secondary">Email Verified</span>
                <Badge variant="success">Verified</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-nomba-text-secondary">KYC Completed</span>
                <Badge variant={profile.bvn ? 'success' : 'warning'}>
                  {profile.bvn ? 'Completed' : 'Pending'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {profile.payoutAccountNumber && (
          <Card>
            <CardHeader>
              <CardTitle>
                <span className="flex items-center gap-2">
                  <Bank size={18} />
                  Payout Account
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <PayoutRow label="Account Name" value={profile.payoutAccountName ?? '-'} />
                <PayoutRow label="Account Number" value={profile.payoutAccountNumber} />
                <PayoutRow label="Bank" value={profile.payoutBankName ?? '-'} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function ProfileDetail({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-nomba-bg">
        <Icon size={18} className="text-nomba-text-secondary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-nomba-text-secondary">{label}</p>
        <p className="text-sm font-medium text-nomba-text truncate">{value}</p>
      </div>
    </div>
  )
}

function PayoutRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-nomba-text-secondary">{label}</span>
      <span className="text-sm font-medium text-nomba-text">{value}</span>
    </div>
  )
}
