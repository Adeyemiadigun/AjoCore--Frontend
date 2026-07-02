import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { auth } from '@/api/endpoints'
import type { UserProfile } from '@/types/api'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: auth.profile,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => auth.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
