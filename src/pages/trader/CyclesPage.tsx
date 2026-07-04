import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, UsersThree, Spinner } from '@phosphor-icons/react'
import { Link, useNavigate } from 'react-router-dom'
import { cycles, groups } from '@/api/endpoints'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CycleStatus, CycleType } from '@/types/enums'

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  [CycleStatus.Active]: 'success',
  [CycleStatus.Completed]: 'info',
  [CycleStatus.Liquidated]: 'warning',
  [CycleStatus.Defaulted]: 'error',
  [CycleStatus.Pending]: 'default',
}

export default function CyclesPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active')

  // Modal States
  const [isJoinGroupModalOpen, setIsJoinGroupModalOpen] = useState(false)
  const [isNewPersonalModalOpen, setIsNewPersonalModalOpen] = useState(false)

  // Join Group Cycle State
  const [selectedGroupId, setSelectedGroupId] = useState<string>('')
  const [joinError, setJoinError] = useState<string>('')

  // New Personal Cycle State
  const [cycleName, setCycleName] = useState('')
  const [contributionAmount, setContributionAmount] = useState('')
  const [intervalDays, setIntervalDays] = useState('30')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [createError, setCreateError] = useState<string>('')

  // Queries
  const { data: cycleList, isLoading } = useQuery({
    queryKey: ['cycles', 'my', 'all'],
    queryFn: cycles.myAll,
  })

  const { data: allGroups } = useQuery({
    queryKey: ['groups'],
    queryFn: () => groups.list(),
  })

  const myGroups = allGroups?.filter((g) => g.membershipStatus?.toLowerCase() === 'approved') || []

  const { data: allCycles } = useQuery({
    queryKey: ['cycles'],
    queryFn: cycles.list,
  })

  // Mutations
  const joinMutation = useMutation({
    mutationFn: (cycleId: string) => cycles.joinCycle(cycleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycles'] })
      queryClient.invalidateQueries({ queryKey: ['balance'] })
      setIsJoinGroupModalOpen(false)
      setSelectedGroupId('')
      setJoinError('')
    },
    onError: (err: any) => {
      setJoinError(err?.response?.data?.message || 'Failed to join cycle')
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => cycles.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycles'] })
      queryClient.invalidateQueries({ queryKey: ['balance'] })
      setIsNewPersonalModalOpen(false)
      setCycleName('')
      setContributionAmount('')
      setStartDate('')
      setEndDate('')
      setCreateError('')
    },
    onError: (err: any) => {
      setCreateError(err?.response?.data?.message || 'Failed to create personal cycle')
    },
  })

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError('')
    if (cycleName.length < 3) return setCreateError('Name must be at least 3 characters')
    if (Number(contributionAmount) < 100) return setCreateError('Amount must be at least ₦100')
    if (!startDate) return setCreateError('Start date is required')
    if (!endDate) return setCreateError('End date is required')
    if (new Date(endDate) <= new Date(startDate))
      return setCreateError('End date must be after start date')
    if (new Date(startDate) < new Date(new Date().setHours(0, 0, 0, 0)))
      return setCreateError('Start date must be in the future')

    createMutation.mutate({
      cycleName,
      contributionAmount: Number(contributionAmount),
      intervalDays: Number(intervalDays),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    })
  }

  // Filter cycles for display
  const activeCycles =
    cycleList?.filter(
      (c: any) => c.status === CycleStatus.Active || c.status === CycleStatus.Pending,
    ) || []
  const pastCycles =
    cycleList?.filter(
      (c: any) =>
        c.status === CycleStatus.Completed ||
        c.status === CycleStatus.Liquidated ||
        c.status === CycleStatus.Defaulted,
    ) || []

  const displayCycles = activeTab === 'active' ? activeCycles : pastCycles

  // Filter joinable cycles based on selected group
  const joinableCycles = selectedGroupId
    ? allCycles?.filter(
        (c: any) => c.groupId === selectedGroupId && c.status === CycleStatus.Pending,
      ) || []
    : []

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-nomba-text text-balance">
            My Saving Cycles
          </h1>
          <p className="text-sm text-nomba-text-secondary">
            Track and manage your savings across all groups
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsJoinGroupModalOpen(true)}>
            <UsersThree size={18} weight="bold" className="mr-2" />
            Join Group Cycle
          </Button>
          <Button onClick={() => setIsNewPersonalModalOpen(true)}>
            <Plus size={18} weight="bold" className="mr-2" />
            New Personal Cycle
          </Button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-nomba-border">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'active'
              ? 'border-b-2 border-nomba-yellow-dark text-nomba-text'
              : 'text-nomba-text-secondary hover:text-nomba-text'
          }`}
        >
          Active Cycles ({activeCycles.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === 'past'
              ? 'border-b-2 border-nomba-yellow-dark text-nomba-text'
              : 'text-nomba-text-secondary hover:text-nomba-text'
          }`}
        >
          Past Cycles ({pastCycles.length})
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="animate-pulse space-y-3 p-6">
                <div className="h-4 w-2/3 rounded bg-nomba-bg" />
                <div className="h-8 w-1/2 rounded bg-nomba-bg" />
                <div className="h-2 w-full rounded bg-nomba-bg" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : displayCycles.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-nomba-text-secondary">
              {activeTab === 'active'
                ? "You don't have any active saving cycles."
                : "You don't have any completed or past saving cycles yet."}
            </p>
            {activeTab === 'active' && (
              <div className="mt-6 flex justify-center gap-3">
                <Button variant="outline" onClick={() => setIsJoinGroupModalOpen(true)}>
                  Join a Group Cycle
                </Button>
                <Button onClick={() => setIsNewPersonalModalOpen(true)}>
                  Create Personal Cycle
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayCycles.map((cycle: any) => (
            <div
              key={cycle.id}
              onClick={() => navigate(`/dashboard/cycles/${cycle.id}?type=${cycle.cycleType}`)}
              className="cursor-pointer transition-transform hover:-translate-y-1"
            >
              <Card hover className="h-full">
                <CardContent className="space-y-4 p-5 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1">
                      <h3 className="truncate font-semibold text-nomba-text">{cycle.cycleName}</h3>
                      <div className="flex items-center gap-2 text-xs text-nomba-text-secondary">
                        <Badge variant="default" className="px-1.5 py-0 text-[10px]">
                          {cycle.cycleType}
                        </Badge>
                        {cycle.contributionAmount > 0 && (
                          <span>
                            {formatCurrency(cycle.contributionAmount)} /{' '}
                            {cycle.frequency.toLowerCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant={statusVariant[cycle.status] ?? 'default'} className="shrink-0">
                      {cycle.status}
                    </Badge>
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-xs text-nomba-text-secondary">
                      <span>Progress</span>
                      <span className="font-medium text-nomba-text">
                        {Math.round(cycle.progress)}%
                      </span>
                    </div>
                    <ProgressBar value={cycle.progress} />
                  </div>

                  <div className="rounded-[var(--radius-md)] bg-nomba-bg p-3 mt-auto">
                    <div className="flex justify-between text-sm">
                      <span className="text-nomba-text-secondary">Target</span>
                      <span className="font-bold text-nomba-text">
                        {formatCurrency(cycle.targetAmount)}
                      </span>
                    </div>
                    <div className="mt-1 flex justify-between text-sm">
                      <span className="text-nomba-text-secondary">Total Paid</span>
                      <span className="font-bold text-nomba-success">
                        {formatCurrency(cycle.totalSaved)}
                      </span>
                    </div>
                    <div className="mt-1 flex justify-between text-sm">
                      <span className="text-nomba-text-secondary">Remaining</span>
                      <span className="font-bold text-nomba-warning">
                        {formatCurrency(Math.max(0, cycle.targetAmount - cycle.totalSaved))}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-nomba-text-secondary">
                    <div className="flex items-center gap-1">
                      <UsersThree size={14} />
                      <span>
                        {cycle.memberCount} member{cycle.memberCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {cycle.nextContributionDate && (
                      <span>Due: {formatDate(cycle.nextContributionDate)}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* JOIN GROUP CYCLE MODAL */}
      <Modal
        open={isJoinGroupModalOpen}
        onClose={() => setIsJoinGroupModalOpen(false)}
        title="Join Group Cycle"
      >
        <div className="space-y-4">
          {!myGroups || myGroups.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-nomba-text-secondary mb-4">
                You haven't joined any cooperative groups yet.
              </p>
              <Button
                onClick={() => {
                  setIsJoinGroupModalOpen(false)
                  navigate('/dashboard/groups')
                }}
              >
                Explore Groups
              </Button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-nomba-text mb-1">
                  Select your group
                </label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full rounded-[var(--radius-md)] border border-nomba-border bg-nomba-bg px-3 py-2 text-sm text-nomba-text focus:border-nomba-yellow focus:outline-none focus:ring-1 focus:ring-nomba-yellow"
                >
                  <option value="">-- Choose a group --</option>
                  {myGroups.map((g: any) => (
                    <option key={g.id} value={g.id}>
                      {g.groupName}
                    </option>
                  ))}
                </select>
              </div>

              {selectedGroupId && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-semibold text-nomba-text">
                    Available Pending Cycles
                  </h3>
                  {joinableCycles.length === 0 ? (
                    <p className="text-sm text-nomba-text-secondary">
                      No pending cycles available to join in this group.
                    </p>
                  ) : (
                    joinableCycles.map((c: any) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between border border-nomba-border p-3 rounded-[var(--radius-md)] bg-nomba-surface"
                      >
                        <div>
                          <p className="font-medium text-nomba-text text-sm">{c.cycleName}</p>
                          <div className="flex items-center gap-2 text-xs text-nomba-text-secondary mt-1">
                            <Badge variant="default" className="text-[10px] py-0 px-1.5">
                              {c.cycleType}
                            </Badge>
                            <span>{formatCurrency(c.contributionAmount)} contribution</span>
                            <span>•</span>
                            <span>{c.memberCount} members</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => joinMutation.mutate(c.id)}
                          disabled={joinMutation.isPending}
                        >
                          {joinMutation.isPending ? <Spinner className="animate-spin" /> : 'Join'}
                        </Button>
                      </div>
                    ))
                  )}
                  {joinError && <p className="text-sm text-nomba-error">{joinError}</p>}
                </div>
              )}
            </>
          )}
        </div>
      </Modal>

      {/* NEW PERSONAL CYCLE MODAL */}
      <Modal
        open={isNewPersonalModalOpen}
        onClose={() => setIsNewPersonalModalOpen(false)}
        title="New Personal Cycle"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-nomba-text mb-1">Cycle Name</label>
            <Input
              value={cycleName}
              onChange={(e) => setCycleName(e.target.value)}
              placeholder="e.g. My MacBook Fund"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-nomba-text mb-1">
              Contribution Amount (₦)
            </label>
            <Input
              type="number"
              min="100"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              placeholder="5000"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-nomba-text mb-1">
              Contribution Interval
            </label>
            <select
              value={intervalDays}
              onChange={(e) => setIntervalDays(e.target.value)}
              className="w-full rounded-[var(--radius-md)] border border-nomba-border bg-nomba-bg px-3 py-2 text-sm text-nomba-text focus:border-nomba-yellow focus:outline-none focus:ring-1 focus:ring-nomba-yellow"
            >
              <option value="1">Daily</option>
              <option value="7">Weekly</option>
              <option value="14">Bi-Weekly</option>
              <option value="30">Monthly</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-nomba-text mb-1">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-nomba-text mb-1">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          {createError && <p className="text-sm text-nomba-error">{createError}</p>}

          <div className="pt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsNewPersonalModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? <Spinner className="animate-spin" /> : 'Create Cycle'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
