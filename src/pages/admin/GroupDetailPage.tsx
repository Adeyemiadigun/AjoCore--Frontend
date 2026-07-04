import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  UsersThree,
  Handshake,
  ArrowsCounterClockwise,
  CheckCircle,
  XCircle,
  Copy,
  Plus,
} from '@phosphor-icons/react'
import { groups } from '@/api/endpoints'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { extractApiError } from '@/lib/api-utils'
import { formatCurrency, formatDateTime } from '@/lib/utils'

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const queryClient = useQueryClient()

  const { data: group, isLoading } = useQuery({
    queryKey: ['groups', 'detail', groupId],
    queryFn: () => groups.get(groupId!),
    enabled: !!groupId,
  })

  const { data: pendingRequests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['groups', 'requests', groupId],
    queryFn: () => groups.getPendingRequests(groupId!),
    enabled: !!groupId,
  })

  const approveMutation = useMutation({
    mutationFn: groups.approveJoin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', 'requests', groupId] })
      queryClient.invalidateQueries({ queryKey: ['groups', 'detail', groupId] })
      queryClient.invalidateQueries({ queryKey: ['groups', 'list'] })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: groups.rejectJoin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', 'requests', groupId] })
    },
  })

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
  const [memberError, setMemberError] = useState('')
  const [newMemberForm, setNewMemberForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    payoutAccountNumber: '',
    payoutBankName: '',
    payoutAccountName: '',
  })

  const resetForm = () => {
    setNewMemberForm({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      payoutAccountNumber: '',
      payoutBankName: '',
      payoutAccountName: '',
    })
    setMemberError('')
  }

  const addMemberMutation = useMutation({
    mutationFn: (data: typeof newMemberForm) => groups.addMembers(groupId!, [data]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', 'detail', groupId] })
      setIsAddMemberModalOpen(false)
      resetForm()
      alert('Member added successfully!')
    },
    onError: (err) => {
      setMemberError(extractApiError(err, 'Failed to add member.'))
    },
  })

  const [isGeneratingLink, setIsGeneratingLink] = useState(false)
  const handleCopyInviteLink = async () => {
    try {
      setIsGeneratingLink(true)
      // Use Vite env var if available (Vercel), otherwise fallback to origin
      const baseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin
      const link = await groups.generateInviteLink(groupId!, baseUrl)
      await navigator.clipboard.writeText(link)
      alert('Invite link copied to clipboard!')
    } catch (err) {
      alert('Failed to generate invite link')
    } finally {
      setIsGeneratingLink(false)
    }
  }

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMemberError('')
    addMemberMutation.mutate(newMemberForm)
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-nomba-border border-t-nomba-yellow" />
      </div>
    )
  }

  if (!group) {
    return <div>Group not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-nomba-text">{group.groupName}</h1>
          <p className="text-sm text-nomba-text-secondary">
            {group.description || 'No description provided'}
          </p>
        </div>
        <Badge variant={group.isActive ? 'success' : 'default'} className="w-fit">
          {group.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-[var(--radius-md)] p-2.5 bg-nomba-info-bg text-nomba-info">
              <UsersThree size={24} />
            </div>
            <div>
              <p className="text-sm text-nomba-text-secondary">Members</p>
              <p className="text-xl font-bold text-nomba-text">{group.memberCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-[var(--radius-md)] p-2.5 bg-nomba-success-bg text-nomba-success">
              <Handshake size={24} />
            </div>
            <div>
              <p className="text-sm text-nomba-text-secondary">Total Saved</p>
              <p className="text-xl font-bold text-nomba-text">
                {formatCurrency(group.totalSaved)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-[var(--radius-md)] p-2.5 bg-admin-accent-light text-admin-accent">
              <ArrowsCounterClockwise size={24} />
            </div>
            <div>
              <p className="text-sm text-nomba-text-secondary">Savings Goal</p>
              <p className="text-xl font-bold text-nomba-text">
                {formatCurrency(group.savingsGoal)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Members Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Group Members</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyInviteLink}
                  disabled={isGeneratingLink}
                >
                  <Copy size={16} className="mr-2" />
                  {isGeneratingLink ? 'Generating...' : 'Invite Link'}
                </Button>
                <Button size="sm" onClick={() => setIsAddMemberModalOpen(true)}>
                  <Plus size={16} className="mr-2" />
                  Add Member
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {group.members.length === 0 ? (
                <div className="text-center py-6 text-sm text-nomba-text-secondary">
                  No members have joined this group yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-nomba-border text-nomba-text-secondary">
                        <th className="py-3 font-medium">Name</th>
                        <th className="py-3 font-medium">Joined At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-nomba-border">
                      {group.members.map((member: any) => (
                        <tr key={member.traderId}>
                          <td className="py-3 font-medium text-nomba-text">{member.traderName}</td>
                          <td className="py-3 text-nomba-text-secondary">
                            {formatDateTime(member.joinedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Cycles */}
          <Card>
            <CardHeader>
              <CardTitle>Active Cycles</CardTitle>
            </CardHeader>
            <CardContent>
              {group.activeCycles.length === 0 ? (
                <div className="text-center py-6 text-sm text-nomba-text-secondary">
                  No active cycles.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {group.activeCycles.map((cycle: any) => (
                    <div key={cycle.id} className="rounded border border-nomba-border p-3">
                      <p className="font-semibold text-nomba-text">{cycle.cycleName}</p>
                      <p className="text-xs text-nomba-text-secondary">
                        Goal: {formatCurrency(cycle.targetAmount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingRequests ? (
                <p className="text-sm text-nomba-text-secondary animate-pulse">Loading...</p>
              ) : !pendingRequests || pendingRequests.length === 0 ? (
                <div className="text-center py-6 text-sm text-nomba-text-secondary">
                  No pending requests.
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((req: any) => (
                    <div
                      key={req.membershipId}
                      className="flex flex-col gap-2 rounded border border-nomba-border p-3"
                    >
                      <div>
                        <p className="font-medium text-nomba-text">{req.traderName}</p>
                        <p className="text-xs text-nomba-text-secondary">
                          {formatDateTime(req.requestedAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => approveMutation.mutate(req.membershipId)}
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                        >
                          <CheckCircle size={16} />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-nomba-error hover:bg-nomba-error/10 hover:text-nomba-error border-nomba-error"
                          onClick={() => rejectMutation.mutate(req.membershipId)}
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                        >
                          <XCircle size={16} />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal
        open={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        title="Add Member"
      >
        <form
          onSubmit={handleAddMemberSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
        >
          {memberError && (
            <div className="rounded-[var(--radius-md)] bg-nomba-error-bg px-3 py-2 text-sm text-nomba-error">
              {memberError}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-nomba-text">First Name</label>
              <Input
                value={newMemberForm.firstName}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-nomba-text">Last Name</label>
              <Input
                value={newMemberForm.lastName}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-nomba-text">Email</label>
              <Input
                type="email"
                value={newMemberForm.email}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-nomba-text">Phone Number</label>
              <Input
                value={newMemberForm.phoneNumber}
                onChange={(e) =>
                  setNewMemberForm({ ...newMemberForm, phoneNumber: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-nomba-text">Date of Birth</label>
            <Input
              type="date"
              value={newMemberForm.dateOfBirth}
              onChange={(e) => setNewMemberForm({ ...newMemberForm, dateOfBirth: e.target.value })}
              required
            />
          </div>

          <div className="pt-2">
            <h4 className="text-sm font-semibold text-nomba-text mb-2">
              Payout Details (Optional)
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-nomba-text">Bank Name</label>
                <Input
                  value={newMemberForm.payoutBankName}
                  onChange={(e) =>
                    setNewMemberForm({ ...newMemberForm, payoutBankName: e.target.value })
                  }
                  placeholder="e.g. GTBank"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-nomba-text">Account Number</label>
                  <Input
                    value={newMemberForm.payoutAccountNumber}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, payoutAccountNumber: e.target.value })
                    }
                    placeholder="10 digits"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-nomba-text">Account Name</label>
                  <Input
                    value={newMemberForm.payoutAccountName}
                    onChange={(e) =>
                      setNewMemberForm({ ...newMemberForm, payoutAccountName: e.target.value })
                    }
                    placeholder="Account holder name"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3 pt-4 border-t border-nomba-border">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsAddMemberModalOpen(false)}
              disabled={addMemberMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={addMemberMutation.isPending}>
              Add Member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
