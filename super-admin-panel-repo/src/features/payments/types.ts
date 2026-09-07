import type { WithdrawalStatus } from '../../types/common';

export interface AdminWithdrawal {
  id: string;
  userId: string;
  user: { email: string; displayName: string };
  amount: number;
  currency: string;
  status: WithdrawalStatus;
  campaignId?: string;
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface WithdrawalFilters {
  status?: WithdrawalStatus;
  cursor?: string;
  limit?: number;
}

export interface PaymentStats {
  totalWithdrawn: number;
  pendingReview: number;
  approved: number;
  rejected: number;
}
