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
import { CycleType, CycleStatus, ContributionFrequency, UserRole } from '@/types/enums'

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
    nextContributionDate:
      be.NextContributionDate ?? be.nextContributionDate ?? be.StartDate ?? null,
    progress: targetAmount > 0 ? Math.min(Math.round((totalSaved / targetAmount) * 100), 100) : 0,
    groupId: be.CooperativeGroupId ?? be.cooperativeGroupId ?? null,
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
    membershipStatus: be.MembershipStatus ?? be.membershipStatus ?? null,
  }
}

export const auth = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),
  register: async (data: RegisterRequest) => {
    const res = await apiClient.post<{ message: string }>('/auth/register', data)
    return res.data.message
  },
  adminLogin: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/admin-login', data).then((r) => r.data),
  verifyEmail: (data: { email: string; token: string }) =>
    apiClient.post<{ success: boolean }>('/auth/verify-email', data).then((r) => r.data),
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
          walletBalance: r.data.overallTotalPaid ?? r.data.OverallTotalPaid ?? 0,
          totalSavings: (r.data.cycleBalances || r.data.CycleBalances || []).reduce(
            (acc: number, cycle: any) => acc + (cycle.TargetAmount ?? cycle.targetAmount ?? 0),
            0,
          ),
          activeCycles: (r.data.cycleBalances || r.data.CycleBalances || []).length,
          pendingContributions: r.data.pendingContributions ?? r.data.PendingContributions ?? 0,
        }) as BalanceInfo,
    ),
  admin: (groupId: string) =>
    apiClient.get<any>(`/balances/cooperative/${groupId}`).then(
      (r) =>
        ({
          walletBalance: r.data.groupWalletBalance ?? r.data.GroupWalletBalance ?? 0,
          totalSavings: r.data.totalContributions ?? r.data.TotalContributions ?? 0,
          activeCycles: r.data.activeCycles ?? r.data.ActiveCycles ?? 0,
          pendingContributions: r.data.pendingContributions ?? r.data.PendingContributions ?? 0,
          totalGroupSavings: r.data.totalContributions ?? r.data.TotalContributions ?? 0,
          totalMembers: r.data.totalMembers ?? r.data.TotalMembers ?? 0,
          totalGroups: r.data.totalGroups ?? r.data.TotalGroups ?? 0,
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
  myAll: () =>
    apiClient.get<any>('/balances/my-balances').then((r) =>
      (r.data.cycleBalances || r.data.CycleBalances || []).map(
        (cb: any) =>
          ({
            id: cb.CycleId ?? cb.cycleId ?? '',
            cycleName: cb.CycleName ?? cb.cycleName ?? '',
            cycleType: TYPE_MAP[cb.CycleType ?? cb.cycleType ?? ''] ?? CycleType.Individual,
            targetAmount: Number(cb.TargetAmount ?? cb.targetAmount ?? 0),
            totalSaved: Number(cb.TotalPaid ?? cb.totalPaid ?? 0),
            contributionAmount: 0,
            frequency: ContributionFrequency.Monthly,
            startDate: '',
            endDate: '',
            status: CycleStatus.Active,
            memberCount: 1,
            nextContributionDate: null,
            progress:
              (cb.TargetAmount ?? cb.targetAmount ?? 0) > 0
                ? Math.min(
                    Math.round(
                      ((cb.TotalPaid ?? cb.totalPaid ?? 0) /
                        (cb.TargetAmount ?? cb.targetAmount ?? 0)) *
                        100,
                    ),
                    100,
                  )
                : 0,
            groupId: cb.CooperativeGroupId ?? cb.cooperativeGroupId ?? null,
          }) as SavingCycle,
      ),
    ),
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
          members: (r.data.members ?? r.data.Members ?? []).map((m: any) => ({
            id: m.id ?? m.Id ?? '',
            userId: m.userId ?? m.UserId ?? '',
            fullName: m.traderName ?? m.TraderName ?? '',
            email: m.traderEmail ?? m.TraderEmail ?? '',
            totalContributed: m.totalContributed ?? m.TotalContributed ?? 0,
            payoutOrder: m.payoutOrder ?? m.PayoutOrder ?? 0,
            joinDate: m.joinedAt ?? m.JoinedAt ?? '',
            status: m.status ?? m.Status ?? '',
          })) as CycleMember[],
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
        intervalDays: data.intervalDays,
        startDate: data.startDate,
        endDate: data.endDate,
      })
      .then((r) => r.data),
  createGroupCycle: (data: {
    name: string
    cycleType: string
    contributionAmount: number
    intervalDays: number
    cooperativeGroupId: string
  }) => apiClient.post<any>('/saving-cycles', data).then((r) => r.data),
  liquidate: (id: string) =>
    apiClient.post(`/saving-cycles/${id}/liquidate-early`).then((r) => r.data),
  joinCycle: (cycleId: string) =>
    apiClient.post<any>(`/saving-cycles/${cycleId}/join`).then((r) => r.data),
  start: (id: string) => apiClient.post(`/saving-cycles/${id}/start`).then((r) => r.data),
  reorderMembers: (data: { id: string; members: { memberId: string; payoutOrder: number }[] }) =>
    apiClient.post(`/saving-cycles/${data.id}/members/reorder`, data.members).then((r) => r.data),
  getMyDetails: (cycleId: string, cycleType: string) => {
    const typeRoute =
      cycleType === 'Personal' || cycleType === 'Individual'
        ? 'personal'
        : cycleType === 'Rosca' || cycleType === 'ROSCA'
          ? 'rosca'
          : 'asca'
    return apiClient.get<any>(`/saving-cycles/${typeRoute}/${cycleId}`).then((r) => ({
      cycleId: r.data.cycleId ?? r.data.CycleId ?? '',
      name: r.data.name ?? r.data.Name ?? '',
      cycleType: r.data.cycleType ?? r.data.CycleType ?? '',
      contributionAmount: r.data.contributionAmount ?? r.data.ContributionAmount ?? 0,
      intervalDays: r.data.intervalDays ?? r.data.IntervalDays ?? 0,
      status: r.data.status ?? r.data.Status ?? '',
      startDate: r.data.startDate ?? r.data.StartDate ?? '',
      endDate: r.data.endDate ?? r.data.EndDate ?? null,
      virtualAccountNumber: r.data.virtualAccountNumber ?? r.data.VirtualAccountNumber ?? null,
      virtualAccountBank: r.data.virtualAccountBank ?? r.data.VirtualAccountBank ?? null,
      virtualAccountName: r.data.virtualAccountName ?? r.data.VirtualAccountName ?? null,
      payoutOrder: r.data.payoutOrder ?? r.data.PayoutOrder ?? 0,
    }))
  },
  getContributions: (memberId: string) =>
    apiClient.get<any>(`/saving-cycles/members/${memberId}/contributions`).then((r) => ({
      memberName: r.data.memberName ?? r.data.MemberName ?? '',
      totalContributed: r.data.totalContributed ?? r.data.TotalContributed ?? 0,
      contributions: (r.data.contributions ?? r.data.Contributions ?? []).map((c: any) => ({
        amount: c.amount ?? c.Amount ?? 0,
        paidAt: c.paidAt ?? c.PaidAt ?? '',
        webhookId: c.nombaWebhookRequestId ?? c.NombaWebhookRequestId ?? '',
      })),
    })),
}

export const groups = {
  list: (search?: string) =>
    apiClient.get<any[]>('/groups', { params: { search } }).then((r) => r.data.map(mapGroup)),
  get: (id: string) =>
    apiClient.get<any>(`/groups/${id}`).then(
      (r) =>
        ({
          ...mapGroup(r.data),
          members: (r.data.members ?? r.data.Members ?? []).map((m: any) => ({
            traderId: m.traderId ?? m.TraderId ?? '',
            traderName: m.traderName ?? m.TraderName ?? '',
            joinedAt: m.joinedAt ?? m.JoinedAt ?? '',
          })),
          activeCycles: r.data.activeCycles ?? r.data.ActiveCycles ?? [],
          completedCycles: r.data.completedCycles ?? r.data.CompletedCycles ?? [],
          pendingRequests: (r.data.pendingRequests ?? r.data.PendingRequests ?? []).map(
            (p: any) => ({
              membershipId: p.membershipId ?? p.Id ?? '',
              traderId: p.traderId ?? p.TraderId ?? '',
              traderName: p.traderName ?? p.TraderName ?? '',
              requestedAt: p.requestedAt ?? p.RequestedAt ?? '',
            }),
          ),
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
  getPendingRequests: (groupId: string) =>
    apiClient.get<any[]>(`/groups/${groupId}/requests`).then((r) =>
      r.data.map((m: any) => ({
        membershipId: m.id ?? m.Id ?? '',
        traderId: m.traderId ?? m.TraderId ?? '',
        traderName: m.traderName ?? m.TraderName ?? '',
        requestedAt: m.createdAt ?? m.CreatedAt ?? '',
      })),
    ),
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
