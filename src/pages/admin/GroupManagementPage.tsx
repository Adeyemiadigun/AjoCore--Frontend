import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, UsersThree } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { groups } from '@/api/endpoints'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { formatCurrency } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

export default function GroupManagementPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [formData, setFormData] = useState({ groupName: '', description: '' })

  const { data: groupList, isLoading } = useQuery({
    queryKey: ['groups', 'list'],
    queryFn: () => groups.list(),
  })

  const createMutation = useMutation({
    mutationFn: groups.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups', 'list'] })
      setIsCreateModalOpen(false)
      setFormData({ groupName: '', description: '' })
    },
  })

  const myGroups = groupList?.filter((g) => g.adminTraderId === user?.id) || []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.groupName) return
    createMutation.mutate({
      groupName: formData.groupName,
      description: formData.description,
      savingsGoal: 0, // Defaults to 0 since it's computed from cycles
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-nomba-text text-balance">
            My Cooperative Groups
          </h1>
          <p className="text-sm text-nomba-text-secondary">Manage groups you have created</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={18} weight="bold" />
          Create Group
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
      ) : myGroups.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <UsersThree size={40} className="mx-auto mb-2 text-nomba-text-secondary opacity-40" />
            <p className="text-nomba-text-secondary">You haven't created any groups yet</p>
            <Button className="mt-4" onClick={() => setIsCreateModalOpen(true)}>
              Create your first group
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {myGroups.map((group) => (
            <Card
              key={group.id}
              hover
              className="cursor-pointer"
              onClick={() => navigate(`/dashboard/groups/${group.id}`)}
            >
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

      <Modal
        open={isCreateModalOpen}
        onClose={() => !createMutation.isPending && setIsCreateModalOpen(false)}
        title="Create Cooperative Group"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="groupName" className="text-sm font-medium text-nomba-text">
              Group Name <span className="text-nomba-error">*</span>
            </label>
            <Input
              id="groupName"
              placeholder="e.g. Lagos Traders Coop"
              value={formData.groupName}
              onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-nomba-text">
              Description
            </label>
            <Input
              id="description"
              placeholder="Briefly describe the purpose of this group..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {createMutation.isError && (
            <p className="text-sm text-nomba-error">Failed to create group. Please try again.</p>
          )}

          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={createMutation.isPending}>
              Create Group
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
