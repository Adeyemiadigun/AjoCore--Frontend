import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UsersThree, MagnifyingGlass } from '@phosphor-icons/react'
import { users } from '@/api/endpoints'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { formatDate } from '@/lib/utils'

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const { data: allUsers, isLoading } = useQuery({
    queryKey: ['system', 'users'],
    queryFn: users.getAll,
  })

  const filteredUsers =
    allUsers?.filter(
      (user: any) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-nomba-text">System Users</h1>
          <p className="text-sm text-nomba-text-secondary">
            Manage all traders and cooperative admins
          </p>
        </div>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Input
              label=""
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<MagnifyingGlass className="h-5 w-5 text-nomba-text-secondary" />}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-nomba-border text-nomba-text-secondary">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Phone Number</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nomba-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-nomba-text-secondary">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user: any) => (
                  <tr key={user.id} className="transition-colors hover:bg-nomba-bg/50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-nomba-yellow-light/20 text-nomba-yellow-dark">
                          <UsersThree size={16} weight="fill" />
                        </div>
                        <span className="font-medium text-nomba-text">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-nomba-text">{user.email}</td>
                    <td className="py-4 text-nomba-text">{user.phoneNumber || 'N/A'}</td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.role === 'CooperativeAdmin'
                            ? 'bg-nomba-success-bg text-nomba-success'
                            : 'bg-nomba-info-bg text-nomba-info'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 text-nomba-text-secondary">{formatDate(user.createdAt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-nomba-text-secondary">
                    No users found matching your search.
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
