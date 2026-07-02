import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

interface Member {
  id: string
  fullName: string
  email: string
  role: string
}

export function useMembers() {
  return useQuery({
    queryKey: ['admin', 'members'] as const,
    queryFn: () => apiClient.get<Member[]>('/admin/members').then((r) => r.data),
  })
}
