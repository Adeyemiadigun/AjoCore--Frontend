import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Copy,
  CheckCircle,
  CurrencyNgn,
  Bank,
  WarningCircle,
} from '@phosphor-icons/react'
import { cycles } from '@/api/endpoints'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'
import { CycleStatus, UserRole } from '@/types/enums'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/Input'

export default function CycleDetailPage() {
  const { cycleId } = useParams<{ cycleId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const searchParams = new URLSearchParams(location.search)
  const cycleType = searchParams.get('type') ?? 'Personal'
  const isAdmin = user?.role === UserRole.CooperativeAdmin

  const [copied, setCopied] = useState(false)
  const [payoutOrders, setPayoutOrders] = useState<Record<string, number>>({})

  const { data: cycleDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['cycle', cycleId, cycleType],
    queryFn: () => cycles.getMyDetails(cycleId!, cycleType),
    enabled: !!cycleId,
  })

  // Full cycle details to get members
  const { data: fullCycle } = useQuery({
    queryKey: ['cycle-full', cycleId],
    queryFn: () => cycles.get(cycleId!),
    enabled: !!cycleId,
  })

  const memberEntry = fullCycle?.members?.find((m: any) => m.userId === user?.id)
  const memberId = memberEntry?.id

  // Contributions data for the logged in user (Trader)
  const { data: contributionsData, isLoading: isLoadingContributions } = useQuery({
    queryKey: ['contributions', memberId],
    queryFn: () => cycles.getContributions(memberId!),
    enabled: !!memberId && !isAdmin,
  })

  // Payouts data for the logged in user
  const { data: payoutsData, isLoading: isLoadingPayouts } = useQuery({
    queryKey: ['payouts', memberId],
    queryFn: () => cycles.getPayouts(memberId!),
    enabled: !!memberId && !isAdmin,
  })

  const [activeTab, setActiveTab] = useState<'contributions' | 'payouts'>('contributions')

  const startMutation = useMutation({
    mutationFn: cycles.start,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycle', cycleId] })
      queryClient.invalidateQueries({ queryKey: ['cycle-full', cycleId] })
    },
  })

  const reorderMutation = useMutation({
    mutationFn: cycles.reorderMembers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycle-full', cycleId] })
    },
  })

  const approveMutation = useMutation({
    mutationFn: (memberId: string) => cycles.approveMember({ cycleId: cycleId!, memberId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycle-full', cycleId] })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (memberId: string) => cycles.rejectMember({ cycleId: cycleId!, memberId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycle-full', cycleId] })
    },
  })

  const handleCopy = () => {
    if (cycleDetails?.virtualAccountNumber) {
      navigator.clipboard.writeText(cycleDetails.virtualAccountNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSaveReorder = () => {
    if (!fullCycle?.members) return
    const orderedMembers = fullCycle.members.map((m: any) => ({
      memberId: m.id,
      payoutOrder: payoutOrders[m.id] !== undefined ? payoutOrders[m.id] : (m.payoutOrder ?? 0),
    }))
    reorderMutation.mutate({ id: cycleId!, members: orderedMembers })
  }

  if (isLoadingDetails) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-nomba-border border-t-nomba-yellow" />
      </div>
    )
  }

  if (!cycleDetails) {
    return (
      <div className="py-12 text-center text-nomba-text-secondary">Cycle details not found.</div>
    )
  }

  const targetAmount = fullCycle?.targetAmount ?? 0

  const totalPaid = contributionsData?.totalContributed ?? 0
  let currentIntervalSaved = totalPaid
  let currentIntervalTarget = cycleDetails?.contributionAmount ?? 0
  let progress =
    currentIntervalTarget > 0
      ? Math.min(100, Math.round((currentIntervalSaved / currentIntervalTarget) * 100))
      : 0
  let currentInterval = 1

  const now = new Date()
  const start = cycleDetails?.startDate ? new Date(cycleDetails.startDate) : null

  let intervalStart = start
  let intervalEnd = cycleDetails?.endDate ? new Date(cycleDetails.endDate) : null

  if (start && start <= now && cycleDetails?.intervalDays > 0) {
    const daysElapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    currentInterval = Math.floor(daysElapsed / cycleDetails.intervalDays) + 1

    intervalStart = new Date(
      start.getTime() + (currentInterval - 1) * cycleDetails.intervalDays * 24 * 60 * 60 * 1000,
    )
    intervalEnd = new Date(
      intervalStart.getTime() + cycleDetails.intervalDays * 24 * 60 * 60 * 1000,
    )

    if (contributionsData?.contributions) {
      currentIntervalSaved = contributionsData.contributions
        .filter((c: any) => {
          const d = new Date(c.paidAt)
          return d >= intervalStart! && d < intervalEnd!
        })
        .reduce((sum: number, c: any) => sum + c.amount, 0)
    }
    progress =
      currentIntervalTarget > 0
        ? Math.min(100, Math.round((currentIntervalSaved / currentIntervalTarget) * 100))
        : 0
  }

  const activePayoutRound =
    cycleDetails.status === CycleStatus.Active && start && now >= start ? currentInterval : 0

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] border border-nomba-border bg-nomba-bg text-nomba-text-secondary transition-colors hover:bg-nomba-surface hover:text-nomba-text"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold font-display text-nomba-text">Cycle Details</h1>
          <p className="text-sm text-nomba-text-secondary">
            {isAdmin ? 'Manage this saving cycle' : 'Manage your contributions and view history'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Overview Card */}
          <Card>
            <CardHeader className="flex flex-row items-start justify-between pb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-xl">{cycleDetails.name}</CardTitle>
                  <Badge variant="default">{cycleDetails.cycleType}</Badge>
                  <Badge
                    variant={
                      cycleDetails.status === CycleStatus.Active
                        ? 'success'
                        : cycleDetails.status === CycleStatus.Pending
                          ? 'default'
                          : 'info'
                    }
                  >
                    {cycleDetails.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                <div className="rounded-[var(--radius-md)] bg-nomba-bg p-3">
                  <p className="text-xs text-nomba-text-secondary">Contribution</p>
                  <p className="mt-1 font-semibold text-nomba-text">
                    {formatCurrency(cycleDetails.contributionAmount)}
                  </p>
                </div>
                <div className="rounded-[var(--radius-md)] bg-nomba-bg p-3">
                  <p className="text-xs text-nomba-text-secondary">Interval</p>
                  <p className="mt-1 font-semibold text-nomba-text">
                    Every {cycleDetails.intervalDays} days
                  </p>
                </div>
                <div className="rounded-[var(--radius-md)] bg-nomba-bg p-3">
                  <p className="text-xs text-nomba-text-secondary">Round Start</p>
                  <p className="mt-1 font-semibold text-nomba-text">
                    {intervalStart ? formatDate(intervalStart.toISOString()) : 'N/A'}
                  </p>
                </div>
                <div className="rounded-[var(--radius-md)] bg-nomba-bg p-3">
                  <p className="text-xs text-nomba-text-secondary">Next Due Date</p>
                  <p className="mt-1 font-semibold text-nomba-text">
                    {intervalEnd ? formatDate(intervalEnd.toISOString()) : 'N/A'}
                  </p>
                </div>
                {!isAdmin && (
                  <div className="rounded-[var(--radius-md)] bg-nomba-bg p-3">
                    <p className="text-xs text-nomba-text-secondary">Payout Order</p>
                    <p className="mt-1 font-semibold text-nomba-text">
                      #{cycleDetails.payoutOrder}
                    </p>
                  </div>
                )}
              </div>

              {!isAdmin && (
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-nomba-text">
                      Round {currentInterval} Progress ({progress}%)
                    </span>
                    <span className="text-nomba-text-secondary">
                      {formatCurrency(currentIntervalSaved)} /{' '}
                      {formatCurrency(currentIntervalTarget)}
                    </span>
                  </div>
                  <ProgressBar value={progress} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin Start Cycle Card */}
          {isAdmin && cycleDetails.status === CycleStatus.Pending && (
            <Card className="border-nomba-yellow bg-nomba-yellow/5">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-nomba-text text-lg">Start Saving Cycle</h3>
                  <p className="text-sm text-nomba-text-secondary">
                    Make sure all members have joined and the payout order is correct before
                    starting.
                  </p>
                </div>
                <Button
                  onClick={() => startMutation.mutate(cycleId!)}
                  loading={startMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  Start Cycle Now
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Members Table for Admin */}
          {isAdmin && fullCycle && fullCycle.members && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Cycle Members</CardTitle>
                {cycleDetails.cycleType === 'Rosca' &&
                  cycleDetails.status === CycleStatus.Pending && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSaveReorder}
                      loading={reorderMutation.isPending}
                    >
                      Save Payout Order
                    </Button>
                  )}
              </CardHeader>
              <CardContent>
                {fullCycle.members.length === 0 ? (
                  <div className="text-center py-6 text-sm text-nomba-text-secondary">
                    No members have joined this cycle yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-nomba-border text-nomba-text-secondary">
                          <th className="py-3 font-medium">Name</th>
                          {cycleDetails.cycleType === 'Rosca' && (
                            <th className="py-3 font-medium">Payout Order</th>
                          )}
                          <th className="py-3 font-medium">Total Contributed</th>
                          <th className="py-3 font-medium">Status</th>
                          <th className="py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-nomba-border">
                        {fullCycle.members.map((member: any) => {
                          const expectedContribution =
                            activePayoutRound * cycleDetails.contributionAmount
                          const isDefaulting =
                            cycleDetails.status === CycleStatus.Active &&
                            member.totalContributed < expectedContribution

                          return (
                            <tr key={member.id}>
                              <td className="py-3 font-medium text-nomba-text">
                                {member.fullName}
                                {isDefaulting && (
                                  <Badge
                                    variant="error"
                                    className="ml-2 inline-flex gap-1 items-center bg-nomba-error/10 text-nomba-error border-nomba-error"
                                  >
                                    <WarningCircle size={12} /> Defaulting
                                  </Badge>
                                )}
                              </td>
                              {cycleDetails.cycleType === 'Rosca' && (
                                <td className="py-3">
                                  {cycleDetails.status === CycleStatus.Pending ? (
                                    <Input
                                      type="number"
                                      min="1"
                                      className="w-20 text-center"
                                      value={
                                        payoutOrders[member.id] !== undefined
                                          ? payoutOrders[member.id]
                                          : member.payoutOrder
                                      }
                                      onChange={(e) =>
                                        setPayoutOrders({
                                          ...payoutOrders,
                                          [member.id]: parseInt(e.target.value) || 0,
                                        })
                                      }
                                    />
                                  ) : (
                                    <span className="font-semibold px-4">{member.payoutOrder}</span>
                                  )}
                                </td>
                              )}
                              <td className="py-3 font-medium text-nomba-text">
                                {formatCurrency(member.totalContributed)}
                              </td>
                              <td className="py-3">
                                {member.approvalStatus === 'Pending' ? (
                                  <Badge variant="warning">Pending Approval</Badge>
                                ) : member.approvalStatus === 'Rejected' ? (
                                  <Badge variant="error">Rejected</Badge>
                                ) : (
                                  <Badge variant="default">{member.status}</Badge>
                                )}
                              </td>
                              <td className="py-3 text-right space-x-2">
                                {cycleDetails.status === CycleStatus.Pending &&
                                  member.approvalStatus === 'Pending' && (
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        size="sm"
                                        onClick={() => approveMutation.mutate(member.id)}
                                        loading={approveMutation.isPending}
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-red-500 border-red-500 hover:bg-red-50"
                                        onClick={() => rejectMutation.mutate(member.id)}
                                        loading={rejectMutation.isPending}
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* History (Trader only) */}
          {!isAdmin && (
            <Card>
              <CardHeader className="border-b border-nomba-border pb-0">
                <div className="flex gap-6">
                  <button
                    className={`pb-4 text-sm font-medium transition-colors ${activeTab === 'contributions' ? 'border-b-2 border-nomba-yellow text-nomba-text' : 'text-nomba-text-secondary hover:text-nomba-text'}`}
                    onClick={() => setActiveTab('contributions')}
                  >
                    Contributions
                  </button>
                  <button
                    className={`pb-4 text-sm font-medium transition-colors ${activeTab === 'payouts' ? 'border-b-2 border-nomba-yellow text-nomba-text' : 'text-nomba-text-secondary hover:text-nomba-text'}`}
                    onClick={() => setActiveTab('payouts')}
                  >
                    Payout History
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {activeTab === 'contributions' ? (
                  isLoadingContributions ? (
                    <div className="flex h-32 items-center justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-nomba-border border-t-nomba-yellow" />
                    </div>
                  ) : !contributionsData || contributionsData.contributions.length === 0 ? (
                    <div className="py-8 text-center text-sm text-nomba-text-secondary">
                      No contributions recorded yet. Make your first payment to the virtual account.
                    </div>
                  ) : (
                    <div className="divide-y divide-nomba-border">
                      {contributionsData.contributions.map((c: any) => (
                        <div key={c.webhookId} className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-nomba-success-bg text-nomba-success">
                              <CheckCircle size={20} weight="fill" />
                            </div>
                            <div>
                              <p className="font-medium text-nomba-text">
                                {formatCurrency(c.amount)}
                              </p>
                              <p className="text-xs text-nomba-text-secondary">
                                {formatDateTime(c.paidAt)}
                              </p>
                            </div>
                          </div>
                          <Badge variant="success">Confirmed</Badge>
                        </div>
                      ))}
                    </div>
                  )
                ) : isLoadingPayouts ? (
                  <div className="flex h-32 items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-nomba-border border-t-nomba-yellow" />
                  </div>
                ) : !payoutsData || payoutsData.length === 0 ? (
                  <div className="py-8 text-center text-sm text-nomba-text-secondary">
                    No payouts received yet.
                  </div>
                ) : (
                  <div className="divide-y divide-nomba-border">
                    {payoutsData.map((p: any) => (
                      <div key={p.ref} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-nomba-info-bg text-nomba-info">
                            <CurrencyNgn size={20} weight="bold" />
                          </div>
                          <div>
                            <p className="font-medium text-nomba-text">
                              {formatCurrency(p.amount)}
                            </p>
                            <p className="text-xs text-nomba-text-secondary">
                              {formatDateTime(p.date)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="info">Paid Out</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Virtual Account Card (Trader only) */}
        {!isAdmin && (
          <div className="space-y-6">
            <Card className="border-nomba-yellow bg-nomba-yellow/5">
              <CardHeader>
                <div className="flex items-center gap-2 text-nomba-yellow-dark">
                  <CurrencyNgn size={24} weight="bold" />
                  <CardTitle>Make a Contribution</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-nomba-text">
                  Transfer exactly{' '}
                  <span className="font-bold">
                    {formatCurrency(cycleDetails.contributionAmount + 20)}
                  </span>{' '}
                  to the account below (Includes 20 NGN flat fee).
                </p>

                <div className="rounded-[var(--radius-lg)] border-2 border-nomba-border bg-nomba-surface p-4 shadow-sm">
                  <div className="mb-4">
                    <p className="text-xs font-medium text-nomba-text-secondary uppercase tracking-wider">
                      Account Number
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-mono text-2xl font-bold tracking-widest text-nomba-text">
                        {cycleDetails.virtualAccountNumber || 'Pending...'}
                      </span>
                      <button
                        onClick={handleCopy}
                        disabled={!cycleDetails.virtualAccountNumber}
                        className="rounded p-2 text-nomba-text-secondary transition-colors hover:bg-nomba-bg hover:text-nomba-text disabled:opacity-50"
                        title="Copy account number"
                      >
                        {copied ? (
                          <CheckCircle size={20} className="text-nomba-success" />
                        ) : (
                          <Copy size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-nomba-border pt-4">
                    <div className="flex items-center gap-3">
                      <Bank size={18} className="text-nomba-text-secondary" />
                      <div>
                        <p className="text-xs text-nomba-text-secondary">Bank Name</p>
                        <p className="font-medium text-nomba-text">
                          {cycleDetails.virtualAccountBank || 'Nomba MFB'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-4 w-4 items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-nomba-text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs text-nomba-text-secondary">Account Name</p>
                        <p className="font-medium text-nomba-text">
                          {cycleDetails.virtualAccountName || 'Your AjoCore Account'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[var(--radius-md)] bg-white p-4 shadow-sm border border-nomba-border">
                  <p className="text-sm font-medium text-nomba-warning">Important:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-nomba-text-secondary">
                    <li>
                      Transfers MUST exactly match the required amount (Contribution + 20 NGN flat
                      fee). Any overpayments or underpayments will be automatically reversed.
                    </li>
                    <li>
                      Your payment will be automatically recorded once the bank confirms the
                      transfer (usually within 1-5 minutes).
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
