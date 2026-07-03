import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  UsersThree,
  Handshake,
  ArrowsCounterClockwise,
  CheckCircle,
  XCircle,
} from '@phosphor-icons/react'
import { groups } from '@/api/endpoints'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDateTime } from '@/lib/utils'

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const queryClient = useQueryClient()

  const { data: group, isLoading } = useQuery({
    queryKey: ['groups', 'detail', groupId],
    queryFn: () => groups.get(groupId!),
    enabled: !!groupId,
  })

  const { data: pendingRequests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['groups', 'requests', groupId],
    queryFn: () => groups.getPendingRequests(groupId!),
    enabled: !!groupId,
  })

  const approveMutation = useMutation({
    mutationFn: groups.approveJoin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', 'requests', groupId] })
      queryClient.invalidateQueries({ queryKey: ['groups', 'detail', groupId] })
      queryClient.invalidateQueries({ queryKey: ['groups', 'list'] })
    },
  })

  const rejectMutation = useMutation({
    mutationFn: groups.rejectJoin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', 'requests', groupId] })
    },
  })

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-nomba-border border-t-nomba-yellow" />
      </div>
    )
  }

  if (!group) {
    return <div>Group not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-nomba-text">{group.groupName}</h1>
          <p className="text-sm text-nomba-text-secondary">
            {group.description || 'No description provided'}
          </p>
        </div>
        <Badge variant={group.isActive ? 'success' : 'default'} className="w-fit">
          {group.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-[var(--radius-md)] p-2.5 bg-nomba-info-bg text-nomba-info">
              <UsersThree size={24} />
            </div>
            <div>
              <p className="text-sm text-nomba-text-secondary">Members</p>
              <p className="text-xl font-bold text-nomba-text">{group.memberCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-[var(--radius-md)] p-2.5 bg-nomba-success-bg text-nomba-success">
              <Handshake size={24} />
            </div>
            <div>
              <p className="text-sm text-nomba-text-secondary">Total Saved</p>
              <p className="text-xl font-bold text-nomba-text">
                {formatCurrency(group.totalSaved)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-[var(--radius-md)] p-2.5 bg-admin-accent-light text-admin-accent">
              <ArrowsCounterClockwise size={24} />
            </div>
            <div>
              <p className="text-sm text-nomba-text-secondary">Savings Goal</p>
              <p className="text-xl font-bold text-nomba-text">
                {formatCurrency(group.savingsGoal)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Members Table */}
          <Card>
            <CardHeader>
              <CardTitle>Group Members</CardTitle>
            </CardHeader>
            <CardContent>
              {group.members.length === 0 ? (
                <div className="text-center py-6 text-sm text-nomba-text-secondary">
                  No members have joined this group yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-nomba-border text-nomba-text-secondary">
                        <th className="py-3 font-medium">Name</th>
                        <th className="py-3 font-medium">Joined At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-nomba-border">
                      {group.members.map((member: any) => (
                        <tr key={member.traderId}>
                          <td className="py-3 font-medium text-nomba-text">{member.traderName}</td>
                          <td className="py-3 text-nomba-text-secondary">
                            {formatDateTime(member.joinedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Cycles */}
          <Card>
            <CardHeader>
              <CardTitle>Active Cycles</CardTitle>
            </CardHeader>
            <CardContent>
              {group.activeCycles.length === 0 ? (
                <div className="text-center py-6 text-sm text-nomba-text-secondary">
                  No active cycles.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {group.activeCycles.map((cycle: any) => (
                    <div key={cycle.id} className="rounded border border-nomba-border p-3">
                      <p className="font-semibold text-nomba-text">{cycle.cycleName}</p>
                      <p className="text-xs text-nomba-text-secondary">
                        Goal: {formatCurrency(cycle.targetAmount)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingRequests ? (
                <p className="text-sm text-nomba-text-secondary animate-pulse">Loading...</p>
              ) : !pendingRequests || pendingRequests.length === 0 ? (
                <div className="text-center py-6 text-sm text-nomba-text-secondary">
                  No pending requests.
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((req: any) => (
                    <div
                      key={req.membershipId}
                      className="flex flex-col gap-2 rounded border border-nomba-border p-3"
                    >
                      <div>
                        <p className="font-medium text-nomba-text">{req.traderName}</p>
                        <p className="text-xs text-nomba-text-secondary">
                          {formatDateTime(req.requestedAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => approveMutation.mutate(req.membershipId)}
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                        >
                          <CheckCircle size={16} />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-nomba-error hover:bg-nomba-error/10 hover:text-nomba-error border-nomba-error"
                          onClick={() => rejectMutation.mutate(req.membershipId)}
                          disabled={approveMutation.isPending || rejectMutation.isPending}
                        >
                          <XCircle size={16} />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
