import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  User,
  UsersThree,
  PiggyBank,
  ArrowsCounterClockwise,
  CheckCircle,
  Handshake,
} from '@phosphor-icons/react'
import { balances, groups, cycles } from '@/api/endpoints'
import { Card, CardContent } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { WithdrawFundsModal } from '@/components/WithdrawFundsModal'
import { Badge } from '@/components/ui/Badge'

export default function SystemOverviewPage() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const { data: balance, isLoading } = useQuery({
    queryKey: ['balance', 'system'],
    queryFn: balances.system,
  })

  const {
    data: nombaBalance,
    isLoading: isLoadingNombaBalance,
    refetch: refetchNombaBalance,
  } = useQuery({
    queryKey: ['balance', 'nomba'],
    queryFn: () => balances.nombaWallet(),
  })

  const { data: groupList, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['groups', 'list'],
    queryFn: () => groups.list(),
  })

  const { data: cycleList, isLoading: isLoadingCycles } = useQuery({
    queryKey: ['cycles', 'list'],
    queryFn: () => cycles.list(),
  })

  const stats = balance?.systemStats
    ? [
        {
          label: 'Total Users',
          value: balance.systemStats.totalUsers,
          icon: User,
          color: 'text-nomba-info',
          bg: 'bg-nomba-info-bg',
        },
        {
          label: 'Traders',
          value: balance.systemStats.traders,
          icon: UsersThree,
          color: 'text-nomba-success',
          bg: 'bg-nomba-success-bg',
        },
        {
          label: 'Coop Admins',
          value: balance.systemStats.cooperativeAdmins,
          icon: Handshake,
          color: 'text-admin-accent',
          bg: 'bg-admin-accent-light',
        },
        {
          label: 'Groups',
          value: balance.systemStats.totalGroups,
          icon: UsersThree,
          color: 'text-nomba-warning',
          bg: 'bg-nomba-warning-bg',
        },
        {
          label: 'Active Cycles',
          value: balance.systemStats.activeCycles,
          icon: ArrowsCounterClockwise,
          color: 'text-nomba-info',
          bg: 'bg-nomba-info-bg',
        },
        {
          label: 'Nomba Wallet Balance',
          value: nombaBalance?.balance ?? 0,
          icon: PiggyBank,
          color: 'text-nomba-yellow',
          bg: 'bg-nomba-yellow/10',
          isCurrency: true,
        },
      ]
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-nomba-text text-balance">
          System Overview
        </h1>
        <p className="text-sm text-nomba-text-secondary">Platform-wide statistics and metrics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-nomba-text-secondary">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-nomba-text">
                    {isLoading || isLoadingNombaBalance
                      ? '...'
                      : typeof stat.value === 'number'
                        ? stat.isCurrency
                          ? formatCurrency(stat.value)
                          : stat.value.toLocaleString()
                        : stat.value}
                  </p>
                </div>
                <div className={`rounded-[var(--radius-md)] p-2.5 ${stat.bg}`}>
                  <Icon size={22} className={stat.color} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {balance?.systemStats?.totalContributions != null && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="mb-2 text-sm font-medium text-nomba-text-secondary">
                  Total Savings Across Platform
                </h3>
                <p className="text-4xl font-extrabold text-nomba-text">
                  {formatCurrency(balance.systemStats.totalContributions)}
                </p>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="flex items-center gap-2 rounded-[var(--radius-md)] bg-nomba-yellow px-4 py-2 text-sm font-medium text-nomba-text transition-colors hover:bg-nomba-yellow-dark focus-visible:ring-2 focus-visible:ring-nomba-yellow focus-visible:outline-none"
              >
                <PiggyBank size={20} className="text-nomba-text" />
                Withdraw unrecorded funds
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <WithdrawFundsModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onSuccess={() => {
          refetchNombaBalance()
        }}
      />

      <div className="grid gap-6 lg:grid-cols-2 mt-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold text-nomba-text">All Cooperative Groups</h3>
            {isLoadingGroups ? (
              <p className="text-sm text-nomba-text-secondary">Loading groups...</p>
            ) : groupList?.length === 0 ? (
              <p className="text-sm text-nomba-text-secondary">No groups found.</p>
            ) : (
              <div className="space-y-4">
                {groupList?.map((group) => (
                  <div
                    key={group.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-[var(--radius-md)] border-2 border-nomba-border p-3"
                  >
                    <div>
                      <p className="font-medium text-nomba-text">{group.groupName}</p>
                      <p className="text-xs text-nomba-text-secondary">Admin: {group.createdBy}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold text-nomba-text">
                          {formatCurrency(group.totalSaved)}
                        </p>
                        <p className="text-xs text-nomba-text-secondary">
                          {group.memberCount} members
                        </p>
                      </div>
                      <Badge variant={group.isActive ? 'success' : 'default'}>
                        {group.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold text-nomba-text">All Saving Cycles</h3>
            {isLoadingCycles ? (
              <p className="text-sm text-nomba-text-secondary">Loading cycles...</p>
            ) : cycleList?.length === 0 ? (
              <p className="text-sm text-nomba-text-secondary">No cycles found.</p>
            ) : (
              <div className="space-y-4">
                {cycleList?.map((cycle) => (
                  <div
                    key={cycle.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-[var(--radius-md)] border-2 border-nomba-border p-3"
                  >
                    <div>
                      <p className="font-medium text-nomba-text">{cycle.cycleName}</p>
                      <p className="text-xs text-nomba-text-secondary">Type: {cycle.cycleType}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold text-nomba-text">
                          {formatCurrency(cycle.totalSaved)}
                        </p>
                        <p className="text-xs text-nomba-text-secondary">
                          {cycle.memberCount} members
                        </p>
                      </div>
                      <Badge
                        variant={
                          cycle.status === 'Completed'
                            ? 'success'
                            : cycle.status === 'Active'
                              ? 'info'
                              : 'warning'
                        }
                      >
                        {cycle.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
