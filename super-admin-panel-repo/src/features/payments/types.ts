import type { WithdrawalStatus } from '../../types/common';

export interface WithdrawalUser {
  id: string;
  email: string;
  username: string;
}

export interface AdminWithdrawal {
  id: string;
  userId: string;
  user?: WithdrawalUser;
  campaignId: string | null;
  payoutAccountId: string | null;
  amount: string;
  currency: string;
  status: WithdrawalStatus;
  highValueThreshold: string | null;
  walletTransactionId: string | null;
  rejectionReason: string | null;
  refundNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalsResponse {
  items: AdminWithdrawal[];
  nextCursor: string | null;
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
