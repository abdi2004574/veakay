"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { CursorItemsResponse, WithdrawalRequest, WithdrawalStatus } from "@/types";

export const WITHDRAWALS_QUERY_KEY = "admin-withdrawals";

interface WithdrawalsParams {
  status?: WithdrawalStatus;
  cursor?: string;
  limit?: number;
}

export function useWithdrawalsList(params?: WithdrawalsParams) {
  const limit = params?.limit ?? 20;
  return useInfiniteQuery({
    queryKey: [WITHDRAWALS_QUERY_KEY, { status: params?.status, limit }],
    queryFn: async ({ pageParam }) => {
      const query = new URLSearchParams();
      if (params?.status) query.set("status", params.status);
      if (pageParam) query.set("cursor", pageParam);
      query.set("limit", String(limit));

      const data = await apiGet<CursorItemsResponse<WithdrawalRequest>>(
        `/admin/wallet/withdrawals?${query.toString()}`,
      );
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    getPreviousPageParam: (firstPage) => firstPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  });
}
