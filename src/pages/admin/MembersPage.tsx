import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table } from '@/components/ui/Table'
import { groups } from '@/api/endpoints'
import { useAuth } from '@/context/AuthContext'
import { formatDateTime } from '@/lib/utils'

interface GroupMember {
  id: string
  traderId: string
  traderName: string
  traderEmail: string
  status: string
  approvedAt: string
}

const columns = [
  {
    key: 'traderName',
    header: 'Name',
    render: (m: GroupMember) => <span className="font-medium text-nomba-text">{m.traderName}</span>,
  },
  { key: 'traderEmail', header: 'Email', render: (m: GroupMember) => m.traderEmail },
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
]

export default function MembersPage() {
  const { user } = useAuth()
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
            className="w-full sm:w-auto min-w-[200px] cursor-pointer appearance-none rounded-[var(--radius-md)] border-2 border-nomba-border bg-white px-4 py-2 pr-10 text-sm font-medium text-nomba-text transition-colors hover:border-nomba-yellow focus:border-nomba-yellow focus:ring-0 focus:outline-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%20stroke%3D%22%231A1A1A%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_12px_center] bg-no-repeat"
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
