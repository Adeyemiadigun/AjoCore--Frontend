import { apiClient } from './client'
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserProfile,
  SavingCycle,
  SavingCycleDetail,
  CreateCycleRequest,
  CooperativeGroup,
  GroupDetail,
  CreateGroupRequest,
  ApproveRejectRequest,
  BalanceInfo,
  Bank,
  ContributionLedger,
  CycleMember,
} from '@/types/api'
import type { CycleType, CycleStatus, ContributionFrequency, UserRole } from '@/types/enums'

const TYPE_MAP: Record<string, CycleType> = {
  Personal: CycleType.Individual,
  Rosca: CycleType.Group,
  Asca: CycleType.Group,
  Individual: CycleType.Individual,
  Group: CycleType.Group,
}

const STATUS_MAP: Record<string, CycleStatus> = {
  Pending: CycleStatus.Pending,
  Active: CycleStatus.Active,
  Completed: CycleStatus.Completed,
}

function intervalToFrequency(days: number): ContributionFrequency {
  if (days >= 28) return ContributionFrequency.Monthly
  if (days >= 14) return ContributionFrequency.BiWeekly
  if (days >= 7) return ContributionFrequency.Weekly
  return ContributionFrequency.Daily
}

function mapCycle(be: any): SavingCycle {
  const targetAmount = Number(be.TargetAmount ?? be.targetAmount ?? 0)
  const totalSaved = Number(be.TotalSaved ?? be.totalSaved ?? 0)
  return {
    id: be.Id ?? be.id ?? '',
    cycleType: TYPE_MAP[be.CycleType ?? be.cycleType ?? ''] ?? CycleType.Individual,
    cycleName: be.Name ?? be.name ?? be.cycleName ?? '',
    targetAmount,
    totalSaved,
    frequency: intervalToFrequency(be.IntervalDays ?? be.intervalDays ?? 7),
    contributionAmount: Number(be.ContributionAmount ?? be.contributionAmount ?? 0),
    startDate: be.StartDate ?? be.startDate ?? '',
    endDate: be.EndDate ?? be.endDate ?? '',
    status: STATUS_MAP[be.Status ?? be.status ?? ''] ?? CycleStatus.Active,
    memberCount: be.Members?.length ?? be.memberCount ?? 0,
    nextContributionDate: be.NextContributionDate ?? be.nextContributionDate ?? be.StartDate ?? '',
    progress: targetAmount > 0 ? Math.min(Math.round((totalSaved / targetAmount) * 100), 100) : 0,
  }
}

function mapProfile(be: any): UserProfile {
  return {
    id: be.Id ?? be.id ?? '',
    firstName: be.FirstName ?? be.firstName ?? '',
    lastName: be.LastName ?? be.lastName ?? '',
    email: be.Email ?? be.email ?? '',
    phoneNumber: be.PhoneNumber ?? be.phoneNumber ?? '',
    role: be.Role ?? be.role ?? 'Trader',
    bvn: be.Bvn ?? be.bvn ?? undefined,
    dateOfBirth: be.DateOfBirth ?? be.dateOfBirth ?? undefined,
    payoutAccountNumber: be.PayoutAccountNumber ?? be.payoutAccountNumber ?? undefined,
    payoutBankName: be.PayoutBankName ?? be.payoutBankName ?? undefined,
    payoutAccountName: be.PayoutAccountName ?? be.payoutAccountName ?? undefined,
    isActive: be.IsKycCompleted ?? be.isKycCompleted ?? be.IsEmailVerified ?? true,
    createdAt: be.CreatedAt ?? be.createdAt ?? '',
  }
}

function mapGroup(be: any): CooperativeGroup {
  return {
    id: be.Id ?? be.id ?? '',
    groupName: be.Name ?? be.name ?? be.groupName ?? '',
    description: be.Description ?? be.description ?? '',
    memberCount: be.MemberCount ?? be.memberCount ?? 0,
    savingsGoal: Number(be.SavingsGoal ?? be.savingsGoal ?? 0),
    totalSaved: Number(be.TotalSaved ?? be.totalSaved ?? 0),
    createdBy: be.AdminName ?? be.adminName ?? be.createdBy ?? '',
    createdAt: be.CreatedAt ?? be.createdAt ?? '',
    isActive: be.IsActive ?? be.isActive ?? true,
  }
}

export const auth = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),
  register: async (data: RegisterRequest) => {
    await apiClient.post('/auth/register', data)
    return auth.login({ email: data.email, password: data.password })
  },
  adminLogin: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/admin-login', data).then((r) => r.data),
  refreshToken: (token: string, refreshToken: string) =>
    apiClient.post<AuthResponse>('/auth/refresh', { token, refreshToken }).then((r) => r.data),
  profile: async () => {
    const stored = localStorage.getItem('ajocore_user')
    const role: UserRole = stored ? (JSON.parse(stored) as any).role : 'Trader'
    const endpoint = role === 'CooperativeAdmin' ? '/profile/cooperative-admin' : '/profile/trader'
    const res = await apiClient.get<{ success: boolean; data: any }>(endpoint)
    return mapProfile(res.data.data)
  },
  updateProfile: async (data: Partial<UserProfile>) => {
    const payload: Record<string, any> = {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
    }
    if (data.dateOfBirth) payload.dateOfBirth = data.dateOfBirth
    const stored = localStorage.getItem('ajocore_user')
    const role: UserRole = stored ? (JSON.parse(stored) as any).role : 'Trader'
    const endpoint = role === 'CooperativeAdmin' ? '/profile/cooperative-admin' : '/profile/trader'
    const res = await apiClient.put<{ success: boolean; data: any }>(endpoint, payload)
    return mapProfile(res.data.data)
  },
}

export const balances = {
  trader: () =>
    apiClient.get<any>('/balances/my-balances').then(
      (r) =>
        ({
          walletBalance: r.data.overallTotalPaid ?? 0,
          totalSavings: r.data.overallTotalPaid ?? 0,
          activeCycles: r.data.cycleBalances?.length ?? 0,
          pendingContributions: 0,
        }) as BalanceInfo,
    ),
  admin: (groupId?: string) =>
    apiClient.get<any>(groupId ? `/balances/cooperative/${groupId}` : '/balances/cooperative').then(
      (r) =>
        ({
          walletBalance: r.data.groupWalletBalance ?? 0,
          totalSavings: r.data.totalContributions ?? 0,
          activeCycles: 0,
          pendingContributions: 0,
          totalGroupSavings: r.data.totalContributions ?? 0,
          totalMembers: 0,
          totalGroups: 0,
        }) as BalanceInfo,
    ),
  system: () =>
    apiClient.get<any>('/balances/system').then(
      (r) =>
        ({
          walletBalance: r.data.systemWalletBalance ?? 0,
          totalSavings: r.data.totalContributions ?? 0,
          activeCycles: 0,
          pendingContributions: 0,
          totalGroupSavings: r.data.totalContributions ?? 0,
          totalGroups: 0,
          totalMembers: 0,
        }) as BalanceInfo,
    ),
}

export const cycles = {
  list: () => apiClient.get<any[]>('/saving-cycles').then((r) => r.data.map(mapCycle)),
  myCycles: () =>
    apiClient.get<any[]>('/saving-cycles/my-personal').then((r) => r.data.map(mapCycle)),
  get: (id: string) =>
    apiClient.get<any>(`/saving-cycles/${id}`).then(
      (r) =>
        ({
          ...mapCycle(r.data),
          contributions: (r.data.contributions ??
            r.data.memberContributions ??
            []) as ContributionLedger[],
          members: (r.data.members ?? []) as CycleMember[],
          totalContributions: r.data.totalContributions ?? 0,
          totalPayouts: r.data.totalPayouts ?? 0,
        }) as SavingCycleDetail,
    ),
  create: (data: CreateCycleRequest) =>
    apiClient
      .post<any>('/saving-cycles/individual', {
        name: data.cycleName,
        cycleType: 'Personal',
        contributionAmount: data.contributionAmount,
        intervalDays: 7,
      })
      .then((r) => r.data),
  liquidate: (id: string) =>
    apiClient.post(`/saving-cycles/${id}/liquidate-early`).then((r) => r.data),
}

export const groups = {
  list: () => apiClient.get<any[]>('/groups').then((r) => r.data.map(mapGroup)),
  get: (id: string) =>
    apiClient.get<any>(`/groups/${id}`).then(
      (r) =>
        ({
          ...mapGroup(r.data),
          members: [],
          activeCycles: [],
          completedCycles: [],
          pendingRequests: [],
        }) as GroupDetail,
    ),
  create: (data: CreateGroupRequest) =>
    apiClient
      .post<any>('/groups', { name: data.groupName, description: data.description ?? '' })
      .then((r) => r.data),
  join: (groupId: string) => apiClient.post(`/groups/${groupId}/join`).then((r) => r.data),
  approveJoin: (membershipId: string) =>
    apiClient.post(`/groups/requests/${membershipId}/approve`).then((r) => r.data),
  rejectJoin: (membershipId: string) =>
    apiClient.post(`/groups/requests/${membershipId}/reject`).then((r) => r.data),
}

export const banks = {
  list: () =>
    apiClient.get<{ success: boolean; data: any[] }>('/banks').then((r) =>
      r.data.data.map((b) => ({
        bankName: b.Name ?? b.name ?? '',
        bankCode: b.Code ?? b.code ?? '',
      })),
    ),
  verifyAccount: (accountNumber: string, bankName: string) =>
    apiClient
      .get<{ success: boolean; data: { accountName: string } }>('/banks/lookup', {
        params: { accountNumber, bankName },
      })
      .then((r) => r.data.data),
}
