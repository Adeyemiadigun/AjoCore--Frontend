import type {
  UserRole,
  CycleStatus,
  CycleType,
  ContributionFrequency,
  MembershipStatus,
} from './enums'

export interface AuthResponse {
  token: string
  email: string
  fullName: string
  role: UserRole
  userId: string
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  role: UserRole
  bvn?: string
  dateOfBirth?: string
  payoutAccountNumber?: string
  payoutBankName?: string
  payoutAccountName?: string
}

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: UserRole
  bvn?: string
  dateOfBirth?: string
  payoutAccountNumber?: string
  payoutBankName?: string
  payoutAccountName?: string
  isActive: boolean
  createdAt: string
}

export interface SavingCycle {
  id: string
  cycleType: CycleType
  cycleName: string
  targetAmount: number
  totalSaved: number
  frequency: ContributionFrequency
  contributionAmount: number
  startDate: string
  endDate: string
  status: CycleStatus
  memberCount: number
  nextContributionDate: string
  progress: number
}

export interface SavingCycleDetail extends SavingCycle {
  description?: string
  groupId?: string
  contributions: ContributionLedger[]
  members?: CycleMember[]
  totalContributions: number
  totalPayouts: number
  penaltyCharged?: number
  liquidatedAt?: string
}

export interface CreateCycleRequest {
  cycleName: string
  targetAmount: number
  frequency: ContributionFrequency
  contributionAmount: number
  startDate: string
  endDate: string
  description?: string
  groupId?: string
}

export interface CycleMember {
  id: string
  userId: string
  fullName: string
  email: string
  totalContributed: number
  joinDate: string
  status: MembershipStatus
}

export interface ContributionLedger {
  id: string
  amount: number
  transactionDate: string
  transactionReference: string
  status: string
}

export interface PayoutLedger {
  id: string
  cycleId: string
  userId: string
  amount: number
  payoutDate: string
  payoutMethod?: string
  reference: string
  status: string
}

export interface CooperativeGroup {
  id: string
  groupName: string
  description?: string
  memberCount: number
  savingsGoal: number
  totalSaved: number
  createdBy: string
  createdAt: string
  isActive: boolean
}

export interface GroupDetail extends CooperativeGroup {
  members: GroupMember[]
  activeCycles: SavingCycle[]
  completedCycles: SavingCycle[]
  pendingRequests: GroupJoinRequest[]
}

export interface GroupMember {
  id: string
  userId: string
  fullName: string
  email: string
  phoneNumber: string
  roleInGroup: string
  totalContributed: number
  joinedAt: string
  status: MembershipStatus
}

export interface CreateGroupRequest {
  groupName: string
  description?: string
  savingsGoal: number
}

export interface GroupJoinRequest {
  membershipId: string
  userId: string
  fullName: string
  email: string
  requestedAt: string
}

export interface ApproveRejectRequest {
  membershipId: string
  approve: boolean
}

export interface BalanceInfo {
  walletBalance: number
  totalSavings: number
  totalEarnings?: number
  activeCycles: number
  pendingContributions: number
  nextDueDate?: string
  totalGroupSavings?: number
  totalMembers?: number
  systemStats?: SystemStats
}

export interface SystemStats {
  totalUsers: number
  totalTraders: number
  totalCooperativeAdmins: number
  totalGroups: number
  totalSavingsAcrossPlatform: number
  totalActiveCycles: number
  totalCompletedCycles: number
}

export interface Bank {
  bankName: string
  bankCode: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}
