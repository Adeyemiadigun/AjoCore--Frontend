import { useQuery } from '@tanstack/react-query'
import {
  UsersThree,
  PiggyBank,
  ArrowsCounterClockwise,
  Handshake,
  Plus,
} from '@phosphor-icons/react'
import { balances, groups } from '@/api/endpoints'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // First fetch all groups to find the one managed by this admin
  const { data: groupList, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['groups', 'list'],
    queryFn: () => groups.list(),
  })

  const managedGroup = groupList?.find((g) => g.adminTraderId === user?.id)

  // Then fetch the balance for that specific group
  const { data: balance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['balance', 'admin', managedGroup?.id],
    queryFn: () => balances.admin(managedGroup!.id),
    enabled: !!managedGroup?.id,
  })

  const isLoading = isLoadingGroups || (!!managedGroup?.id && isLoadingBalance)

  const stats = [
    {
      label: 'Total Members',
      value: balance?.totalMembers ?? 0,
      icon: UsersThree,
      color: 'text-nomba-info',
      bg: 'bg-nomba-info-bg',
      isCurrency: false,
    },
    {
      label: 'Total Group Savings',
      value: balance?.totalGroupSavings ?? 0,
      icon: PiggyBank,
      color: 'text-nomba-success',
      bg: 'bg-nomba-success-bg',
      isCurrency: true,
    },
    {
      label: 'Active Cycles',
      value: balance?.activeCycles ?? 0,
      icon: ArrowsCounterClockwise,
      color: 'text-admin-accent',
      bg: 'bg-admin-accent-light',
      isCurrency: false,
    },
    {
      label: 'Pending Requests',
      value: managedGroup?.memberCount ?? 0, // Just a placeholder stat for now
      icon: Handshake,
      color: 'text-nomba-warning',
      bg: 'bg-nomba-warning-bg',
      isCurrency: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-nomba-text">Admin Dashboard</h1>
          <p className="text-sm text-nomba-text-secondary">
            {managedGroup
              ? `Overview for ${managedGroup.groupName}`
              : 'Cooperative overview and management'}
          </p>
        </div>
      </div>

      {!isLoadingGroups && !managedGroup && (
        <Card className="border-nomba-yellow bg-nomba-yellow/5">
          <CardContent className="p-8 text-center">
            <UsersThree size={48} className="mx-auto mb-4 text-nomba-yellow-dark" />
            <h2 className="text-xl font-bold text-nomba-text">Welcome to your Admin Dashboard</h2>
            <p className="mt-2 text-nomba-text-secondary">
              You haven't created a cooperative group yet. Create one to start managing members and
              savings cycles.
            </p>
            <Button className="mt-6" onClick={() => navigate('/dashboard/groups')}>
              <Plus size={18} weight="bold" />
              Create Your Group
            </Button>
          </CardContent>
        </Card>
      )}

      {managedGroup && (
        <>
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
                          : stat.isCurrency
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
                <p className="mt-1 text-sm text-nomba-text-secondary">
                  Across your cooperative group
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold text-nomba-text">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/dashboard/groups')}
                    className="w-full flex items-center gap-3 rounded-[var(--radius-md)] border-2 border-nomba-border p-3 text-sm font-medium text-nomba-text transition-colors hover:border-nomba-yellow hover:bg-nomba-yellow/5 focus-visible:ring-2 focus-visible:ring-nomba-yellow focus-visible:outline-none"
                  >
                    <Handshake size={20} className="text-nomba-yellow-dark" />
                    Manage group settings
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/groups/${managedGroup.id}`)}
                    className="w-full flex items-center gap-3 rounded-[var(--radius-md)] border-2 border-nomba-border p-3 text-sm font-medium text-nomba-text transition-colors hover:border-nomba-yellow hover:bg-nomba-yellow/5 focus-visible:ring-2 focus-visible:ring-nomba-yellow focus-visible:outline-none"
                  >
                    <UsersThree size={20} className="text-nomba-yellow-dark" />
                    View members and requests
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
