import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, ArrowsCounterClockwise } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { cycles, groups } from '@/api/endpoints'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

export default function AdminCyclesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    cycleType: 'Rosca',
    contributionAmount: '',
    intervalDays: '30',
    cooperativeGroupId: '',
  })

  const { data: groupList } = useQuery({
    queryKey: ['groups', 'list'],
    queryFn: () => groups.list(),
  })

  const myGroups = groupList?.filter((g) => g.adminTraderId === user?.id) || []
  const managedGroupIds = myGroups.map((g) => g.id)

  const { data: allCycles, isLoading } = useQuery({
    queryKey: ['cycles'],
    queryFn: cycles.list,
  })

  const adminCycles =
    allCycles?.filter((c) => c.groupId && managedGroupIds.includes(c.groupId)) || []
  const pendingCycles = adminCycles.filter((c) => c.status === 'Pending')
  const activeCycles = adminCycles.filter((c) => c.status === 'Active')
  const completedCycles = adminCycles.filter(
    (c) => c.status === 'Completed' || c.status === 'Liquidated',
  )

  const createMutation = useMutation({
    mutationFn: cycles.createGroupCycle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycles'] })
      setIsCreateModalOpen(false)
      setFormData({
        name: '',
        cycleType: 'Rosca',
        contributionAmount: '',
        intervalDays: '30',
        cooperativeGroupId: myGroups[0]?.id || '',
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.cooperativeGroupId || !formData.contributionAmount) return
    createMutation.mutate({
      name: formData.name,
      cycleType: formData.cycleType,
      contributionAmount: Number(formData.contributionAmount),
      intervalDays: Number(formData.intervalDays),
      cooperativeGroupId: formData.cooperativeGroupId,
    })
  }

  const renderCycleList = (title: string, cycleList: any[]) => (
    <div className="space-y-4 mb-8">
      <h2 className="text-xl font-bold font-display text-nomba-text">
        {title} ({cycleList.length})
      </h2>
      {cycleList.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-nomba-text-secondary">
            No {title.toLowerCase()} found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cycleList.map((cycle) => (
            <Card
              key={cycle.id}
              hover
              className="cursor-pointer"
              onClick={() => navigate(`/dashboard/cycles/${cycle.id}?type=${cycle.cycleType}`)}
            >
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-nomba-text">{cycle.name}</h3>
                    <p className="mt-0.5 text-xs text-nomba-text-secondary flex items-center gap-1">
                      <ArrowsCounterClockwise size={12} /> {cycle.cycleType.toUpperCase()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      cycle.status === 'Active'
                        ? 'success'
                        : cycle.status === 'Pending'
                          ? 'warning'
                          : 'default'
                    }
                  >
                    {cycle.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-[var(--radius-md)] bg-nomba-bg p-3 text-sm">
                  <div>
                    <p className="text-xs text-nomba-text-secondary">Contribution</p>
                    <p className="font-semibold text-nomba-text">
                      {formatCurrency(cycle.contributionAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-nomba-text-secondary">Start Date</p>
                    <p className="font-semibold text-nomba-text">
                      {formatDateTime(cycle.startDate)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-nomba-text text-balance">
            Group Cycles Management
          </h1>
          <p className="text-sm text-nomba-text-secondary">
            Manage ROSCA and ASCA cycles for your groups
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} disabled={myGroups.length === 0}>
          <Plus size={18} weight="bold" />
          Create Cycle
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-nomba-text-secondary animate-pulse">Loading cycles...</p>
      ) : (
        <>
          {renderCycleList('Pending Cycles', pendingCycles)}
          {renderCycleList('Active Cycles', activeCycles)}
          {renderCycleList('Completed Cycles', completedCycles)}
        </>
      )}

      <Modal
        open={isCreateModalOpen}
        onClose={() => !createMutation.isPending && setIsCreateModalOpen(false)}
        title="Create Group Saving Cycle"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-nomba-text">Cycle Name *</label>
            <Input
              placeholder="e.g. Weekly Traders ASCA"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-nomba-text">Cycle Type *</label>
              <select
                className="w-full rounded-[var(--radius-md)] border border-nomba-border bg-nomba-bg px-3 py-2 text-sm text-nomba-text focus:border-nomba-yellow focus:outline-none focus:ring-1 focus:ring-nomba-yellow"
                value={formData.cycleType}
                onChange={(e) => setFormData({ ...formData, cycleType: e.target.value })}
                required
              >
                <option value="Rosca">ROSCA (Rotational)</option>
                <option value="Asca">ASCA (Accumulating)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-nomba-text">Contribution Amount *</label>
              <Input
                type="number"
                min="100"
                step="100"
                placeholder="0.00"
                value={formData.contributionAmount}
                onChange={(e) => setFormData({ ...formData, contributionAmount: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-nomba-text">Interval *</label>
              <select
                className="w-full rounded-[var(--radius-md)] border border-nomba-border bg-nomba-bg px-3 py-2 text-sm text-nomba-text focus:border-nomba-yellow focus:outline-none focus:ring-1 focus:ring-nomba-yellow"
                value={formData.intervalDays}
                onChange={(e) => setFormData({ ...formData, intervalDays: e.target.value })}
                required
              >
                <option value="1">Daily</option>
                <option value="7">Weekly</option>
                <option value="14">Bi-weekly</option>
                <option value="30">Monthly</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-nomba-text">Target Group *</label>
              <select
                className="w-full rounded-[var(--radius-md)] border border-nomba-border bg-nomba-bg px-3 py-2 text-sm text-nomba-text focus:border-nomba-yellow focus:outline-none focus:ring-1 focus:ring-nomba-yellow"
                value={formData.cooperativeGroupId}
                onChange={(e) => setFormData({ ...formData, cooperativeGroupId: e.target.value })}
                required
              >
                <option value="" disabled>
                  Select Group
                </option>
                {myGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.groupName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {createMutation.isError && (
            <p className="text-sm text-nomba-error">
              Failed to create cycle. Please check your inputs.
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={createMutation.isPending}>
              Create Cycle
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
