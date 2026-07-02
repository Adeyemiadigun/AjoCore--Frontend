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
} from '@/types/api'

export const auth = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),
  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/auth/register', data).then((r) => r.data),
  adminLogin: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/admin-login', data).then((r) => r.data),
  refreshToken: (refreshToken: string) =>
    apiClient.post<AuthResponse>('/auth/refresh-token', { refreshToken }).then((r) => r.data),
  profile: () => apiClient.get<UserProfile>('/auth/profile').then((r) => r.data),
  updateProfile: (data: Partial<RegisterRequest>) =>
    apiClient.put<UserProfile>('/auth/profile', data).then((r) => r.data),
}

export const balances = {
  trader: () => apiClient.get<BalanceInfo>('/balances/trader').then((r) => r.data),
  admin: () => apiClient.get<BalanceInfo>('/balances/admin').then((r) => r.data),
  system: () => apiClient.get<BalanceInfo>('/balances/system').then((r) => r.data),
}

export const cycles = {
  list: () => apiClient.get<SavingCycle[]>('/saving-cycles').then((r) => r.data),
  myCycles: () => apiClient.get<SavingCycle[]>('/saving-cycles/my').then((r) => r.data),
  get: (id: string) => apiClient.get<SavingCycleDetail>(`/saving-cycles/${id}`).then((r) => r.data),
  create: (data: CreateCycleRequest) =>
    apiClient.post<SavingCycle>('/saving-cycles', data).then((r) => r.data),
  liquidate: (id: string) =>
    apiClient.post<SavingCycleDetail>(`/saving-cycles/${id}/liquidate`).then((r) => r.data),
}

export const groups = {
  list: () => apiClient.get<CooperativeGroup[]>('/groups').then((r) => r.data),
  myGroups: () => apiClient.get<CooperativeGroup[]>('/groups/my').then((r) => r.data),
  get: (id: string) => apiClient.get<GroupDetail>(`/groups/${id}`).then((r) => r.data),
  create: (data: CreateGroupRequest) =>
    apiClient.post<CooperativeGroup>('/groups', data).then((r) => r.data),
  join: (groupId: string) => apiClient.post(`/groups/${groupId}/join`).then((r) => r.data),
  approveJoin: (data: ApproveRejectRequest) =>
    apiClient.post('/groups/requests/approve', data).then((r) => r.data),
  rejectJoin: (data: ApproveRejectRequest) =>
    apiClient.post('/groups/requests/reject', data).then((r) => r.data),
}

export const banks = {
  list: () => apiClient.get<Bank[]>('/banks').then((r) => r.data),
  verifyAccount: (accountNumber: string, bankCode: string) =>
    apiClient
      .post<{ accountName: string }>('/banks/verify', { accountNumber, bankCode })
      .then((r) => r.data),
}
