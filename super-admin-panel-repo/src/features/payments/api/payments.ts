import { getApi, patchApi } from '../../../utils/api';
import type {
  AdminWithdrawal,
  PaymentStats,
  WithdrawalFilters,
  WithdrawalsResponse,
} from '../types';

export async function getWithdrawals(filters?: WithdrawalFilters) {
  const params: Record<string, string> = {};
  if (filters?.status) params.status = filters.status;
  if (filters?.cursor) params.cursor = filters.cursor;
  if (filters?.limit) params.limit = String(filters.limit);

  return getApi<WithdrawalsResponse>('/admin/wallet/withdrawals', params);
}

export async function reviewWithdrawal(
  withdrawalId: string,
  decision: 'approved' | 'rejected',
  reason?: string,
) {
  return patchApi<AdminWithdrawal>(
    `/admin/wallet/withdrawals/${withdrawalId}/review`,
    { decision, reason },
  );
}

export async function getPaymentStats() {
  return getApi<PaymentStats>('/admin/dashboard/payment-stats');
}
