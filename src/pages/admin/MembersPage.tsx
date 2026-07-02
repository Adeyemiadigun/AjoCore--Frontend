import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table } from '@/components/ui/Table'
import { useMembers } from '@/hooks/useMembers'

interface Member {
  id: string
  fullName: string
  email: string
  role: string
}

const columns = [
  {
    key: 'fullName',
    header: 'Name',
    render: (m: Member) => <span className="font-medium text-nomba-text">{m.fullName}</span>,
  },
  { key: 'email', header: 'Email', render: (m: Member) => m.email },
  { key: 'role', header: 'Role', render: (m: Member) => m.role },
  {
    key: 'status',
    header: 'Status',
    render: () => <Badge variant="success">Active</Badge>,
  },
]

export default function MembersPage() {
  const { data: members, isLoading, error } = useMembers()

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

  if (error) {
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
      <div>
        <h1 className="text-2xl font-bold font-display text-nomba-text">Members</h1>
        <p className="text-sm text-nomba-text-secondary">Manage cooperative members</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table columns={columns} data={members ?? []} />
        </CardContent>
      </Card>
    </div>
  )
}
