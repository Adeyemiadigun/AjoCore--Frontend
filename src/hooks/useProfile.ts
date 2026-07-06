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

export function useUpdateBvn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bvn: string) => auth.updateBvn(bvn),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useUpdatePayout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      payoutAccountNumber: string
      payoutBankName: string
      payoutAccountName: string
    }) => auth.updatePayout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
