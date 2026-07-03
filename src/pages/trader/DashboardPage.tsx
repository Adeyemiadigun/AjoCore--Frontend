import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Wallet,
  PiggyBank,
  ArrowsCounterClockwise,
  CalendarBlank,
  UsersThree,
  User,
  Lightning,
} from '@phosphor-icons/react'
import { balances, cycles, groups } from '@/api/endpoints'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CycleStatus } from '@/types/enums'

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  [CycleStatus.Active]: 'success',
  [CycleStatus.Completed]: 'info',
  [CycleStatus.Liquidated]: 'warning',
  [CycleStatus.Defaulted]: 'error',
  [CycleStatus.Pending]: 'default',
}

export default function TraderDashboard() {
  const { data: balance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['balance', 'trader'],
    queryFn: balances.trader,
  })

  const { data: myCycles, isLoading: isLoadingCycles } = useQuery({
    queryKey: ['cycles', 'my', 'all'],
    queryFn: cycles.myAll,
  })

  const { data: myGroups, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['groups', 'list'],
    queryFn: () => groups.list(),
  })

  const recentCycles = myCycles?.slice(0, 3) || []
  const hasActiveCycles = myCycles?.some((c: any) => c.status === CycleStatus.Active) || false

  const stats = [
    {
      label: 'Total Paid',
      value: balance?.walletBalance ?? 0,
      icon: Wallet,
      color: 'text-nomba-success',
      bg: 'bg-nomba-success-bg',
      format: 'currency' as const,
    },
    {
      label: 'Savings Target',
      value: balance?.totalSavings ?? 0,
      icon: PiggyBank,
      color: 'text-nomba-info',
      bg: 'bg-nomba-info-bg',
      format: 'currency' as const,
    },
    {
      label: 'Active Cycles',
      value: balance?.activeCycles ?? 0,
      icon: ArrowsCounterClockwise,
      color: 'text-admin-accent',
      bg: 'bg-admin-accent-light',
      format: 'number' as const,
    },
    {
      label: 'Pending Contributions',
      value: balance?.pendingContributions ?? 0,
      icon: CalendarBlank,
      color: 'text-nomba-warning',
      bg: 'bg-nomba-warning-bg',
      format: 'currency' as const,
    },
  ]

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold font-display text-nomba-text text-balance">Dashboard</h1>
        <p className="text-sm text-nomba-text-secondary">Overview of your savings activity</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-nomba-text-secondary">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-nomba-text">
                    {isLoadingBalance
                      ? '...'
                      : stat.format === 'currency'
                        ? formatCurrency(stat.value)
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Savings Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {balance && balance.totalSavings > 0 ? (
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-nomba-text-secondary">Overall progress</span>
                    <span className="font-medium">
                      {Math.min(
                        Math.round((balance.walletBalance / balance.totalSavings) * 100),
                        100,
                      )}
                      %
                    </span>
                  </div>
                  <ProgressBar value={balance.walletBalance} max={balance.totalSavings} size="lg" />
                </div>
                <div className="grid grid-cols-3 gap-4 rounded-[var(--radius-md)] bg-nomba-bg p-4 text-center">
                  <div>
                    <p className="text-xs text-nomba-text-secondary">Total Paid</p>
                    <p className="mt-1 text-sm font-bold text-nomba-success">
                      {formatCurrency(balance.walletBalance)}
                    </p>
                  </div>
                  <div className="border-x border-nomba-border">
                    <p className="text-xs text-nomba-text-secondary">Remaining</p>
                    <p className="mt-1 text-sm font-bold text-nomba-warning">
                      {formatCurrency(Math.max(0, balance.totalSavings - balance.walletBalance))}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-nomba-text-secondary">Total Target</p>
                    <p className="mt-1 text-sm font-bold text-nomba-text">
                      {formatCurrency(balance.totalSavings)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-nomba-text-secondary">
                <PiggyBank size={40} className="mx-auto mb-2 opacity-40" />
                <p>No savings progress to display.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/dashboard/cycles"
              className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] border-2 border-nomba-border p-4 text-sm font-medium text-nomba-text transition-colors hover:border-nomba-yellow hover:bg-nomba-yellow/5 focus-visible:ring-2 focus-visible:ring-nomba-yellow focus-visible:outline-none"
            >
              <PiggyBank size={24} className="text-nomba-yellow-dark" />
              <span>Create personal cycle</span>
            </Link>
            <Link
              to="/dashboard/groups"
              className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] border-2 border-nomba-border p-4 text-sm font-medium text-nomba-text transition-colors hover:border-nomba-yellow hover:bg-nomba-yellow/5 focus-visible:ring-2 focus-visible:ring-nomba-yellow focus-visible:outline-none"
            >
              <UsersThree size={24} className="text-nomba-yellow-dark" />
              <span>Join group</span>
            </Link>
            <Link
              to="/dashboard/profile"
              className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] border-2 border-nomba-border p-4 text-sm font-medium text-nomba-text transition-colors hover:border-nomba-yellow hover:bg-nomba-yellow/5 focus-visible:ring-2 focus-visible:ring-nomba-yellow focus-visible:outline-none"
            >
              <User size={24} className="text-nomba-yellow-dark" />
              <span>View Profile</span>
            </Link>
            {hasActiveCycles ? (
              <Link
                to="/dashboard/cycles"
                className="flex flex-col items-center gap-2 rounded-[var(--radius-md)] border-2 border-nomba-border p-4 text-sm font-medium text-nomba-text transition-colors hover:border-nomba-error hover:bg-nomba-error/5 focus-visible:ring-2 focus-visible:ring-nomba-error focus-visible:outline-none"
              >
                <Lightning size={24} className="text-nomba-error" />
                <span>Liquidate cycle</span>
              </Link>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed border-nomba-border bg-nomba-bg/50 p-4 text-sm font-medium text-nomba-text-secondary opacity-50">
                <Lightning size={24} />
                <span>No active cycles</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Recent Cycles</CardTitle>
              <Link
                to="/dashboard/cycles"
                className="text-sm font-medium text-nomba-yellow-dark hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {isLoadingCycles ? (
                <div className="py-8 text-center text-sm text-nomba-text-secondary">
                  Loading cycles...
                </div>
              ) : recentCycles.length > 0 ? (
                <div className="space-y-4">
                  {recentCycles.map((cycle: any) => (
                    <div
                      key={cycle.id}
                      className="flex flex-col gap-4 rounded-[var(--radius-md)] border border-nomba-border bg-nomba-bg/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-nomba-text">{cycle.cycleName}</h4>
                          <Badge variant={statusVariant[cycle.status] ?? 'default'}>
                            {cycle.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-nomba-text-secondary">
                          {formatCurrency(cycle.contributionAmount)} /{' '}
                          {cycle.frequency.toLowerCase()}
                        </p>
                      </div>
                      <div className="w-full shrink-0 sm:w-40">
                        <div className="mb-1 flex justify-between text-xs text-nomba-text-secondary">
                          <span>{Math.round(cycle.progress)}%</span>
                          <span>{formatCurrency(cycle.targetAmount)}</span>
                        </div>
                        <ProgressBar value={cycle.progress} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-nomba-text-secondary">
                  <ArrowsCounterClockwise size={32} className="mx-auto mb-2 opacity-40" />
                  <p>You haven't joined any cycles yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>My Groups</CardTitle>
              <Link
                to="/dashboard/groups"
                className="text-sm font-medium text-nomba-yellow-dark hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {isLoadingGroups ? (
                <div className="py-8 text-center text-sm text-nomba-text-secondary">
                  Loading groups...
                </div>
              ) : myGroups && myGroups.length > 0 ? (
                <div className="space-y-4">
                  <div className="rounded-[var(--radius-md)] bg-nomba-bg p-4 text-center">
                    <p className="text-3xl font-bold text-nomba-text">{myGroups.length}</p>
                    <p className="text-xs text-nomba-text-secondary">Total groups joined</p>
                  </div>
                  <div className="space-y-2">
                    {myGroups.slice(0, 4).map((group) => (
                      <div
                        key={group.id}
                        className="flex items-center gap-3 rounded-[var(--radius-md)] border border-nomba-border p-3"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-nomba-yellow-light/20 text-nomba-yellow-dark">
                          <UsersThree size={20} weight="fill" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-nomba-text text-sm">
                            {group.groupName}
                          </p>
                          <p className="truncate text-xs text-nomba-text-secondary">
                            {group.memberCount} members
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-nomba-text-secondary">
                  <UsersThree size={32} className="mx-auto mb-2 opacity-40" />
                  <p>You are not in any groups.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
