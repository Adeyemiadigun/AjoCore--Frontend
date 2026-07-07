import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Coins, Funnel } from '@phosphor-icons/react'
import { cycles } from '@/api/endpoints'
import { Card } from '@/components/ui/Card'
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

export default function SystemCyclesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const { data: allCycles, isLoading } = useQuery({
    queryKey: ['system', 'cycles'],
    queryFn: cycles.systemAll,
  })

  const filteredCycles =
    allCycles?.filter((cycle: any) =>
      statusFilter === 'All' ? true : cycle.status === statusFilter,
    ) || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-nomba-text">System Cycles</h1>
          <p className="text-sm text-nomba-text-secondary">
            Monitor all savings cycles on the platform
          </p>
        </div>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Funnel className="text-nomba-text-secondary" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-[var(--radius-md)] border border-nomba-border bg-white px-3 py-2 text-sm text-nomba-text focus:border-nomba-yellow focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value={CycleStatus.Pending}>Pending</option>
              <option value={CycleStatus.Active}>Active</option>
              <option value={CycleStatus.Completed}>Completed</option>
              <option value={CycleStatus.Liquidated}>Liquidated</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-nomba-border text-nomba-text-secondary">
                <th className="pb-3 font-medium">Cycle Name</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Target Amount</th>
                <th className="pb-3 font-medium">Progress</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Start Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nomba-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-nomba-text-secondary">
                    Loading cycles...
                  </td>
                </tr>
              ) : filteredCycles.length > 0 ? (
                filteredCycles.map((cycle: any) => (
                  <tr key={cycle.id} className="transition-colors hover:bg-nomba-bg/50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-nomba-yellow-light/20 text-nomba-yellow-dark">
                          <Coins size={16} weight="fill" />
                        </div>
                        <span className="font-medium text-nomba-text">{cycle.cycleName}</span>
                      </div>
                    </td>
                    <td className="py-4 text-nomba-text">{cycle.cycleType}</td>
                    <td className="py-4 text-nomba-text">{formatCurrency(cycle.targetAmount)}</td>
                    <td className="py-4">
                      <span className="text-nomba-text font-medium">{cycle.progress}%</span>
                      <span className="text-nomba-text-secondary text-xs ml-1">
                        ({formatCurrency(cycle.totalSaved)})
                      </span>
                    </td>
                    <td className="py-4">
                      <Badge variant={statusVariant[cycle.status] ?? 'default'}>
                        {cycle.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-nomba-text-secondary">
                      {cycle.startDate ? formatDate(cycle.startDate) : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-nomba-text-secondary">
                    No cycles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
