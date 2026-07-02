import { useQuery } from '@tanstack/react-query'
import {
  Wallet,
  PiggyBank,
  ArrowsCounterClockwise,
  CalendarBlank,
  UsersThree,
} from '@phosphor-icons/react'
import { balances } from '@/api/endpoints'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatCurrency } from '@/lib/utils'

export default function TraderDashboard() {
  const { data: balance, isLoading } = useQuery({
    queryKey: ['balance', 'trader'],
    queryFn: balances.trader,
  })

  const stats = [
    {
      label: 'Wallet Balance',
      value: balance?.walletBalance ?? 0,
      icon: Wallet,
      color: 'text-nomba-success',
      bg: 'bg-nomba-success-bg',
    },
    {
      label: 'Total Savings',
      value: balance?.totalSavings ?? 0,
      icon: PiggyBank,
      color: 'text-nomba-info',
      bg: 'bg-nomba-info-bg',
    },
    {
      label: 'Active Cycles',
      value: balance?.activeCycles ?? 0,
      icon: ArrowsCounterClockwise,
      color: 'text-admin-accent',
      bg: 'bg-admin-accent-light',
    },
    {
      label: 'Pending Contributions',
      value: balance?.pendingContributions ?? 0,
      icon: CalendarBlank,
      color: 'text-nomba-warning',
      bg: 'bg-nomba-warning-bg',
    },
  ]

  return (
    <div className="space-y-6">
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
                    {isLoading
                      ? '...'
                      : typeof stat.value === 'number'
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
                    <span className="text-nomba-text-secondary">Target progress</span>
                    <span className="font-medium">
                      {Math.min(
                        Math.round(
                          (balance.walletBalance / Math.max(balance.totalSavings, 1)) * 100,
                        ),
                        100,
                      )}
                      %
                    </span>
                  </div>
                  <ProgressBar
                    value={balance.walletBalance}
                    max={Math.max(balance.totalSavings, 1)}
                    size="lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-[var(--radius-md)] bg-nomba-bg p-4">
                  <div>
                    <p className="text-xs text-nomba-text-secondary">Saved</p>
                    <p className="text-lg font-bold text-nomba-text">
                      {formatCurrency(balance.totalSavings)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-nomba-text-secondary">Balance</p>
                    <p className="text-lg font-bold text-nomba-success">
                      {formatCurrency(balance.walletBalance)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-nomba-text-secondary">
                <PiggyBank size={40} className="mx-auto mb-2 opacity-40" />
                <p>No savings yet. Start by creating a saving cycle!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/dashboard/cycles"
              className="flex items-center gap-3 rounded-[var(--radius-md)] border-2 border-nomba-border p-3 text-sm font-medium text-nomba-text transition-colors hover:border-nomba-yellow hover:bg-nomba-yellow/5 focus-visible:ring-2 focus-visible:ring-nomba-yellow focus-visible:outline-none"
            >
              <PiggyBank size={20} className="text-nomba-yellow-dark" />
              Create a saving cycle
            </a>
            <a
              href="/dashboard/groups"
              className="flex items-center gap-3 rounded-[var(--radius-md)] border-2 border-nomba-border p-3 text-sm font-medium text-nomba-text transition-colors hover:border-nomba-yellow hover:bg-nomba-yellow/5 focus-visible:ring-2 focus-visible:ring-nomba-yellow focus-visible:outline-none"
            >
              <UsersThree size={20} className="text-nomba-yellow-dark" />
              Join a cooperative group
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
