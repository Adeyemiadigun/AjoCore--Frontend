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
import type { CycleType, CycleStatus } from '@/types/enums'

const TYPE_MAP: Record<string, CycleType> = {
  Personal: 'Individual',
  Rosca: 'Group',
  Asca: 'Group',
  Individual: 'Individual',
  Group: 'Group',
}

const STATUS_MAP: Record<string, CycleStatus> = {
  Pending: 'Pending',
  Active: 'Active',
  Completed: 'Completed',
}

function mapCycle(be: any): SavingCycle {
  const targetAmount = Number(be.targetAmount ?? be.targetAmount ?? 0)
  const totalPaid = Number(be.totalPaid ?? 0)
  return {
    id: be.id ?? be.id ?? '',
    cycleType: TYPE_MAP[be.cycleType ?? be.cycleType ?? ''] ?? 'Individual',
    cycleName: be.name ?? be.cycleName ?? '',
    targetAmount,
    totalSaved: totalPaid,
    frequency: 'Weekly',
    contributionAmount: Number(be.contributionAmount ?? 0),
    startDate: be.startDate ?? be.startDate ?? '',
    endDate: be.endDate ?? be.endDate ?? '',
    status: STATUS_MAP[be.status ?? ''] ?? 'Active',
    memberCount: be.members?.length ?? be.memberCount ?? 0,
    nextContributionDate: be.nextContributionDate ?? be.startDate ?? '',
    progress: targetAmount > 0 ? Math.min(Math.round((totalPaid / targetAmount) * 100), 100) : 0,
  }
}

function mapGroup(be: any): CooperativeGroup {
  return {
    id: be.id ?? '',
    groupName: be.name ?? be.groupName ?? '',
    description: be.description ?? '',
    memberCount: be.memberCount ?? 0,
    savingsGoal: be.savingsGoal ?? 0,
    totalSaved: be.totalSaved ?? 0,
    createdBy: be.adminName ?? be.createdBy ?? '',
    createdAt: be.createdAt ?? '',
    isActive: be.isActive ?? true,
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
          totalGroupSavings: r.data.totalContributions ?? 0,
          totalMembers: 0,
          activeCycles: 0,
          totalGroups: 0,
        }) as BalanceInfo,
    ),
  system: () =>
    apiClient.get<any>('/balances/system').then(
      (r) =>
        ({
          totalGroupSavings: r.data.totalContributions ?? 0,
          activeCycles: 0,
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
  list: () => apiClient.get<{ success: boolean; data: Bank[] }>('/banks').then((r) => r.data.data),
  verifyAccount: (accountNumber: string, bankName: string) =>
    apiClient
      .get<{ success: boolean; data: { accountName: string } }>('/banks/lookup', {
        params: { accountNumber, bankName },
      })
      .then((r) => r.data.data),
}
