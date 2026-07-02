import { useQuery } from '@tanstack/react-query'
import { UsersThree, Plus } from '@phosphor-icons/react'
import { groups } from '@/api/endpoints'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'

export default function GroupsPage() {
  const { data: groupList, isLoading } = useQuery({
    queryKey: ['groups', 'my'],
    queryFn: groups.myGroups,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-nomba-text text-balance">
            Cooperative Groups
          </h1>
          <p className="text-sm text-nomba-text-secondary">
            Manage your cooperative savings groups
          </p>
        </div>
        <Button>
          <Plus size={18} weight="bold" />
          Join Group
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="animate-pulse space-y-3">
                <div className="h-4 w-2/3 rounded bg-nomba-bg" />
                <div className="h-8 w-1/2 rounded bg-nomba-bg" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : groupList?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <UsersThree size={40} className="mx-auto mb-2 text-nomba-text-secondary opacity-40" />
            <p className="text-nomba-text-secondary">You haven&apos;t joined any groups yet</p>
            <Button className="mt-4">Browse available groups</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {groupList?.map((group) => (
            <Card key={group.id} hover>
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-nomba-text">{group.groupName}</h3>
                    {group.description && (
                      <p className="mt-0.5 text-xs text-nomba-text-secondary line-clamp-2">
                        {group.description}
                      </p>
                    )}
                  </div>
                  <Badge variant={group.isActive ? 'success' : 'default'}>
                    {group.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 rounded-[var(--radius-md)] bg-nomba-bg p-3 text-center text-xs">
                  <div>
                    <p className="font-semibold text-nomba-text">{group.memberCount}</p>
                    <p className="text-nomba-text-secondary">Members</p>
                  </div>
                  <div>
                    <p className="font-semibold text-nomba-text">
                      {formatCurrency(group.totalSaved)}
                    </p>
                    <p className="text-nomba-text-secondary">Saved</p>
                  </div>
                  <div>
                    <p className="font-semibold text-nomba-text">
                      {formatCurrency(group.savingsGoal)}
                    </p>
                    <p className="text-nomba-text-secondary">Goal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
