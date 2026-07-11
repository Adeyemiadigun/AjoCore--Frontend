import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table } from '@/components/ui/Table'
import { groups } from '@/api/endpoints'
import { useAuth } from '@/context/AuthContext'
import { formatDateTime } from '@/lib/utils'

import { Button } from '@/components/ui/Button'
import { extractApiError } from '@/lib/api-utils'

interface GroupMember {
  id: string
  traderId: string
  traderName: string
  traderEmail: string
  traderPhone?: string
  status: string
  approvedAt: string
}

export default function MembersPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [selectedGroupId, setSelectedGroupId] = useState<string>('')

  // First fetch all groups to find the ones managed by this admin
  const { data: groupList, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['groups', 'list'],
    queryFn: () => groups.list(),
  })

  const managedGroups = groupList?.filter((g) => g.adminTraderId === user?.id) || []

  // Set default selected group when data loads
  useEffect(() => {
    if (managedGroups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(managedGroups[0]?.id || '')
    }
  }, [managedGroups, selectedGroupId])

  const managedGroup = managedGroups.find((g) => g.id === selectedGroupId) || managedGroups[0]

  const columns = [
    {
      key: 'traderName',
      header: 'Name',
      render: (m: GroupMember) => (
        <span className="font-medium text-nomba-text">{m.traderName}</span>
      ),
    },
    { key: 'traderEmail', header: 'Email', render: (m: GroupMember) => m.traderEmail },
    { key: 'traderPhone', header: 'Phone', render: (m: GroupMember) => m.traderPhone || '-' },
    { key: 'role', header: 'Role', render: () => 'Trader' },
    {
      key: 'status',
      header: 'Status',
      render: (m: GroupMember) => (
        <Badge variant={m.status.toLowerCase() === 'approved' ? 'success' : 'warning'}>
          {m.status}
        </Badge>
      ),
    },
    {
      key: 'approvedAt',
      header: 'Joined At',
      render: (m: GroupMember) => (m.approvedAt ? formatDateTime(m.approvedAt) : '-'),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (m: GroupMember) => (
        <Button
          variant="outline"
          size="sm"
          className="text-nomba-error border-nomba-error hover:bg-nomba-error/10"
          onClick={() => {
            if (!managedGroup) return
            if (
              window.confirm(`Are you sure you want to remove ${m.traderName} from this group?`)
            ) {
              groups
                .removeMember(managedGroup.id, m.id)
                .then(() => {
                  queryClient.invalidateQueries({
                    queryKey: ['groups', 'members', managedGroup.id],
                  })
                  queryClient.invalidateQueries({ queryKey: ['groups', 'detail', managedGroup.id] })
                  alert('Member removed successfully')
                })
                .catch((err) => alert(extractApiError(err, 'Failed to remove member')))
            }
          }}
        >
          Remove
        </Button>
      ),
    },
  ]

  const {
    data: members,
    isLoading: isLoadingMembers,
    error,
  } = useQuery({
    queryKey: ['groups', 'members', managedGroup?.id],
    queryFn: () => groups.getMembers(managedGroup!.id),
    enabled: !!managedGroup?.id,
  })

  const isLoading = isLoadingGroups || isLoadingMembers

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-nomba-text">Members</h1>
          <p className="text-sm text-nomba-text-secondary">Manage cooperative members</p>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-center py-12 text-nomba-text-secondary">
              Loading members...
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && managedGroup?.id) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-nomba-text">Members</h1>
          <p className="text-sm text-nomba-text-secondary">Manage cooperative members</p>
        </div>
        <Card>
          <CardContent>
            <p className="text-nomba-error">Failed to load members.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-nomba-text">Members</h1>
          <p className="text-sm text-nomba-text-secondary">
            {managedGroup ? `Members of ${managedGroup.groupName}` : 'Manage cooperative members'}
          </p>
        </div>

        {managedGroups.length > 0 && (
          <select
            value={selectedGroupId || managedGroup?.id || ''}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="w-full sm:w-auto min-w-[200px] cursor-pointer appearance-none rounded-[var(--radius-md)] border-2 border-nomba-border bg-white px-4 py-2 text-sm font-medium text-nomba-text transition-colors hover:border-nomba-yellow focus:border-nomba-yellow focus:ring-0 focus:outline-none"
          >
            {managedGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.groupName}
              </option>
            ))}
          </select>
        )}
      </div>

      {!managedGroup ? (
        <Card className="border-nomba-yellow bg-nomba-yellow/5">
          <CardContent className="p-8 text-center text-nomba-text-secondary">
            You don't have any cooperative groups yet.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table columns={columns} data={members ?? []} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
