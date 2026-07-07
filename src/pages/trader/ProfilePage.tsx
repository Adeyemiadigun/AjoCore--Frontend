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
import { useProfile, useUpdateProfile, useUpdateBvn, useUpdatePayout } from '@/hooks/useProfile'
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
  const bvnMutation = useUpdateBvn()
  const payoutMutation = useUpdatePayout()

  const [editing, setEditing] = useState(false)
  const [editingBvn, setEditingBvn] = useState(false)
  const [editingPayout, setEditingPayout] = useState(false)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
  })

  const [bvnForm, setBvnForm] = useState({ bvn: '' })
  const [payoutForm, setPayoutForm] = useState({
    payoutAccountNumber: '',
    payoutBankName: '',
    payoutAccountName: '',
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

  async function handleSave() {
    await updateMutation.mutateAsync({
      firstName: form.firstName,
      lastName: form.lastName,
      phoneNumber: form.phoneNumber,
      dateOfBirth: form.dateOfBirth || undefined,
    })
    setEditing(false)
  }

  function startEditBvn() {
    if (!profile) return
    setBvnForm({ bvn: profile.bvn ?? '' })
    setEditingBvn(true)
  }

  async function handleSaveBvn() {
    await bvnMutation.mutateAsync(bvnForm.bvn)
    setEditingBvn(false)
  }

  function startEditPayout() {
    if (!profile) return
    setPayoutForm({
      payoutAccountNumber: profile.payoutAccountNumber ?? '',
      payoutBankName: profile.payoutBankName ?? '',
      payoutAccountName: profile.payoutAccountName ?? '',
    })
    setEditingPayout(true)
  }

  async function handleSavePayout() {
    await payoutMutation.mutateAsync({
      payoutAccountNumber: payoutForm.payoutAccountNumber,
      payoutBankName: payoutForm.payoutBankName,
      payoutAccountName: payoutForm.payoutAccountName,
    })
    setEditingPayout(false)
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
            Edit Profile
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
                <Button
                  variant="ghost"
                  onClick={() => setEditing(false)}
                  disabled={updateMutation.isPending}
                >
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
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-nomba-border mb-4">
            <CardTitle>
              <span className="flex items-center gap-2">
                <CheckCircle size={18} />
                Verification Status
              </span>
            </CardTitle>
            {!editingBvn && (
              <Button variant="ghost" size="sm" onClick={startEditBvn}>
                <PencilSimple size={16} />
                Update BVN
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {editingBvn ? (
              <div className="space-y-4 pt-2">
                <Input
                  label="BVN"
                  value={bvnForm.bvn}
                  onChange={(e) => setBvnForm({ bvn: e.target.value })}
                  placeholder="Enter 11-digit BVN"
                />
                <div className="flex items-center gap-3">
                  <Button onClick={handleSaveBvn} loading={bvnMutation.isPending} size="sm">
                    Save BVN
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setEditingBvn(false)}
                    size="sm"
                    disabled={bvnMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
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
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-nomba-border mb-4">
            <CardTitle>
              <span className="flex items-center gap-2">
                <Bank size={18} />
                Payout Account
              </span>
            </CardTitle>
            {!editingPayout && (
              <Button variant="ghost" size="sm" onClick={startEditPayout}>
                <PencilSimple size={16} />
                {profile.payoutAccountNumber ? 'Update' : 'Add Details'}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {editingPayout ? (
              <div className="space-y-4 pt-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Bank Name"
                    value={payoutForm.payoutBankName}
                    onChange={(e) =>
                      setPayoutForm({ ...payoutForm, payoutBankName: e.target.value })
                    }
                    placeholder="e.g. GTBank"
                  />
                  <Input
                    label="Account Number"
                    value={payoutForm.payoutAccountNumber}
                    onChange={(e) =>
                      setPayoutForm({ ...payoutForm, payoutAccountNumber: e.target.value })
                    }
                    placeholder="10 digit account number"
                  />
                </div>
                <Input
                  label="Account Name"
                  value={payoutForm.payoutAccountName}
                  onChange={(e) =>
                    setPayoutForm({ ...payoutForm, payoutAccountName: e.target.value })
                  }
                  placeholder="Exact name on account"
                />
                <div className="flex items-center gap-3">
                  <Button onClick={handleSavePayout} loading={payoutMutation.isPending} size="sm">
                    Save Payout
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setEditingPayout(false)}
                    size="sm"
                    disabled={payoutMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : profile.payoutAccountNumber ? (
              <div className="space-y-3 pt-2">
                <PayoutRow label="Account Name" value={profile.payoutAccountName ?? '-'} />
                <PayoutRow label="Account Number" value={profile.payoutAccountNumber} />
                <PayoutRow label="Bank" value={profile.payoutBankName ?? '-'} />
              </div>
            ) : (
              <div className="py-4 text-center text-sm text-nomba-text-secondary">
                No payout account configured yet.
              </div>
            )}
          </CardContent>
        </Card>
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
