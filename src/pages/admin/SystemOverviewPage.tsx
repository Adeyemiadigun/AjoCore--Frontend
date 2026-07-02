import { useQuery } from '@tanstack/react-query'
import {
  User,
  UsersThree,
  PiggyBank,
  ArrowsCounterClockwise,
  CheckCircle,
  Handshake,
} from '@phosphor-icons/react'
import { balances } from '@/api/endpoints'
import { Card, CardContent } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

export default function SystemOverviewPage() {
  const { data: balance, isLoading } = useQuery({
    queryKey: ['balance', 'system'],
    queryFn: balances.system,
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
          value: balance.systemStats.totalTraders,
          icon: UsersThree,
          color: 'text-nomba-success',
          bg: 'bg-nomba-success-bg',
        },
        {
          label: 'Coop Admins',
          value: balance.systemStats.totalCooperativeAdmins,
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
          value: balance.systemStats.totalActiveCycles,
          icon: ArrowsCounterClockwise,
          color: 'text-nomba-info',
          bg: 'bg-nomba-info-bg',
        },
        {
          label: 'Completed',
          value: balance.systemStats.totalCompletedCycles,
          icon: CheckCircle,
          color: 'text-nomba-success',
          bg: 'bg-nomba-success-bg',
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
                    {isLoading
                      ? '...'
                      : typeof stat.value === 'number'
                        ? stat.value.toLocaleString()
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

      {balance?.systemStats?.totalSavingsAcrossPlatform != null && (
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-2 text-sm font-medium text-nomba-text-secondary">
              Total Savings Across Platform
            </h3>
            <p className="text-4xl font-extrabold text-nomba-text">
              {formatCurrency(balance.systemStats.totalSavingsAcrossPlatform)}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
