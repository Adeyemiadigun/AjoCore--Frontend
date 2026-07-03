import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { UsersThree, MagnifyingGlass, Handshake } from '@phosphor-icons/react'
import { groups } from '@/api/endpoints'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatCurrency } from '@/lib/utils'

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState<'joined' | 'discover'>('joined')
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  const { data: groupList, isLoading } = useQuery({
    queryKey: ['groups', 'list', searchTerm],
    queryFn: () => groups.list(searchTerm || undefined),
  })

  const joinMutation = useMutation({
    mutationFn: groups.join,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', 'list'] })
    },
  })

  const joinedGroups = groupList?.filter((g) => g.membershipStatus === 'Approved') || []
  const discoverGroups = groupList?.filter((g) => g.membershipStatus !== 'Approved') || []

  const displayList = activeTab === 'joined' ? joinedGroups : discoverGroups

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-nomba-text text-balance">
            Cooperative Groups
          </h1>
          <p className="text-sm text-nomba-text-secondary">
            Manage and discover cooperative savings groups
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-nomba-border pb-4">
        <div className="flex items-center gap-4">
          <button
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === 'joined'
                ? 'border-b-2 border-nomba-primary text-nomba-primary'
                : 'text-nomba-text-secondary hover:text-nomba-text'
            }`}
            onClick={() => setActiveTab('joined')}
          >
            Joined Groups
          </button>
          <button
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === 'discover'
                ? 'border-b-2 border-nomba-primary text-nomba-primary'
                : 'text-nomba-text-secondary hover:text-nomba-text'
            }`}
            onClick={() => setActiveTab('discover')}
          >
            Discover Groups
          </button>
        </div>

        {activeTab === 'discover' && (
          <div className="relative w-full sm:w-64">
            <MagnifyingGlass
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-nomba-text-secondary"
            />
            <Input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
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
      ) : displayList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <UsersThree size={40} className="mx-auto mb-2 text-nomba-text-secondary opacity-40" />
            <p className="text-nomba-text-secondary">
              {activeTab === 'joined'
                ? "You haven't joined any groups yet"
                : 'No groups found matching your search'}
            </p>
            {activeTab === 'joined' && (
              <Button className="mt-4" onClick={() => setActiveTab('discover')}>
                Browse available groups
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {displayList.map((group) => (
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

                {activeTab === 'discover' && (
                  <div className="border-t border-nomba-border pt-4">
                    {group.membershipStatus === 'Pending' ? (
                      <Badge
                        variant="default"
                        className="w-full justify-center py-2 text-sm bg-nomba-bg text-nomba-text-secondary"
                      >
                        Pending Approval
                      </Badge>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => joinMutation.mutate(group.id)}
                        disabled={joinMutation.isPending}
                      >
                        <Handshake size={18} weight="bold" />
                        {joinMutation.isPending ? 'Requesting...' : 'Request to Join'}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
