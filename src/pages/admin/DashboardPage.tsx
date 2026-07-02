import { useQuery } from '@tanstack/react-query'
import { UsersThree, PiggyBank, ArrowsCounterClockwise, Handshake } from '@phosphor-icons/react'
import { balances } from '@/api/endpoints'
import { Card, CardContent } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

export default function AdminDashboard() {
  const { data: balance, isLoading } = useQuery({
    queryKey: ['balance', 'admin'],
    queryFn: () => balances.admin().catch(() => balances.system()),
  })

  const stats = [
    {
      label: 'Total Members',
      value: balance?.totalMembers ?? 0,
      icon: UsersThree,
      color: 'text-nomba-info',
      bg: 'bg-nomba-info-bg',
    },
    {
      label: 'Total Group Savings',
      value: balance?.totalGroupSavings ?? 0,
      icon: PiggyBank,
      color: 'text-nomba-success',
      bg: 'bg-nomba-success-bg',
    },
    {
      label: 'Active Cycles',
      value: balance?.activeCycles ?? 0,
      icon: ArrowsCounterClockwise,
      color: 'text-admin-accent',
      bg: 'bg-admin-accent-light',
    },
    {
      label: 'Groups',
      value: balance?.totalGroups ?? 0,
      icon: Handshake,
      color: 'text-nomba-warning',
      bg: 'bg-nomba-warning-bg',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-nomba-text">Admin Dashboard</h1>
        <p className="text-sm text-nomba-text-secondary">Cooperative overview and management</p>
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
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold text-nomba-text">Total Savings</h3>
            <p className="text-3xl font-bold text-nomba-text">
              {formatCurrency(balance?.totalGroupSavings ?? 0)}
            </p>
            <p className="mt-1 text-sm text-nomba-text-secondary">Across all groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold text-nomba-text">Quick Actions</h3>
            <div className="space-y-2">
              <a
                href="/dashboard/groups"
                className="flex items-center gap-3 rounded-[var(--radius-md)] border-2 border-nomba-border p-3 text-sm font-medium text-nomba-text transition-colors hover:border-nomba-yellow hover:bg-nomba-yellow/5 focus-visible:ring-2 focus-visible:ring-nomba-yellow focus-visible:outline-none"
              >
                <Handshake size={20} className="text-nomba-yellow-dark" />
                Manage groups
              </a>
              <a
                href="/dashboard/members"
                className="flex items-center gap-3 rounded-[var(--radius-md)] border-2 border-nomba-border p-3 text-sm font-medium text-nomba-text transition-colors hover:border-nomba-yellow hover:bg-nomba-yellow/5 focus-visible:ring-2 focus-visible:ring-nomba-yellow focus-visible:outline-none"
              >
                <UsersThree size={20} className="text-nomba-yellow-dark" />
                View members
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
