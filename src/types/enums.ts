export enum UserRole {
  Trader = 'Trader',
  CooperativeAdmin = 'CooperativeAdmin',
  SystemAdmin = 'SystemAdmin',
}

export enum CycleStatus {
  Active = 'Active',
  Completed = 'Completed',
  Liquidated = 'Liquidated',
  Defaulted = 'Defaulted',
}

export enum CycleType {
  Individual = 'Individual',
  Group = 'Group',
}

export enum ContributionFrequency {
  Daily = 'Daily',
  Weekly = 'Weekly',
  BiWeekly = 'BiWeekly',
  Monthly = 'Monthly',
}

export enum MembershipStatus {
  Active = 'Active',
  PendingApproval = 'PendingApproval',
  Rejected = 'Rejected',
  Left = 'Left',
}

export enum TransactionType {
  Contribution = 'Contribution',
  Payout = 'Payout',
  Bonus = 'Bonus',
  Fee = 'Fee',
  LiquidationPenalty = 'LiquidationPenalty',
}

export enum TransactionStatus {
  Pending = 'Pending',
  Successful = 'Successful',
  Failed = 'Failed',
  Reversed = 'Reversed',
}
