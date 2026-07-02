import { useQuery } from '@tanstack/react-query'
import { Plus } from '@phosphor-icons/react'
import { cycles } from '@/api/endpoints'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CycleStatus } from '@/types/enums'

const statusVariant: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  [CycleStatus.Active]: 'success',
  [CycleStatus.Completed]: 'info',
  [CycleStatus.Liquidated]: 'warning',
  [CycleStatus.Defaulted]: 'error',
}

export default function CyclesPage() {
  const { data: cycleList, isLoading } = useQuery({
    queryKey: ['cycles', 'my'],
    queryFn: cycles.myCycles,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-nomba-text text-balance">
            My Saving Cycles
          </h1>
          <p className="text-sm text-nomba-text-secondary">Track and manage your savings</p>
        </div>
        <Button>
          <Plus size={18} weight="bold" />
          New Cycle
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="animate-pulse space-y-3">
                <div className="h-4 w-2/3 rounded bg-nomba-bg" />
                <div className="h-8 w-1/2 rounded bg-nomba-bg" />
                <div className="h-2 w-full rounded bg-nomba-bg" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : cycleList?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-nomba-text-secondary">No saving cycles yet</p>
            <Button className="mt-4">Create your first cycle</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cycleList?.map((cycle) => (
            <Card key={cycle.id} hover>
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-nomba-text">{cycle.cycleName}</h3>
                    <p className="text-xs text-nomba-text-secondary">
                      {formatCurrency(cycle.contributionAmount)} / {cycle.frequency.toLowerCase()}
                    </p>
                  </div>
                  <Badge variant={statusVariant[cycle.status] ?? 'default'}>{cycle.status}</Badge>
                </div>

                <div>
                  <div className="mb-1 flex justify-between text-xs text-nomba-text-secondary">
                    <span>Progress</span>
                    <span>{Math.round(cycle.progress)}%</span>
                  </div>
                  <ProgressBar value={cycle.progress} />
                </div>

                <div className="flex justify-between text-xs text-nomba-text-secondary">
                  <span>
                    <span className="font-medium text-nomba-text">
                      {formatCurrency(cycle.totalSaved)}
                    </span>{' '}
                    saved
                  </span>
                  <span>Target: {formatCurrency(cycle.targetAmount)}</span>
                </div>

                <div className="flex justify-between text-xs text-nomba-text-secondary">
                  <span>Members: {cycle.memberCount}</span>
                  <span>Due: {formatDate(cycle.nextContributionDate)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
