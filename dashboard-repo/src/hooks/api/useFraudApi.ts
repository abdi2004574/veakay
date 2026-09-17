"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPatch } from "@/lib/api";
import type { CursorItemsResponse, FraudFlag, FraudFlagStatus, FraudFlagType, FraudFlagSeverity } from "@/types";

export const FRAUD_FLAGS_QUERY_KEY = "admin-fraud-flags";

interface FraudFlagsParams {
  status?: FraudFlagStatus;
  type?: FraudFlagType | string;
  userId?: string;
  severity?: FraudFlagSeverity | string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}

export function useFraudFlagsList(params?: FraudFlagsParams) {
  const limit = params?.limit ?? 20;
  return useInfiniteQuery({
    queryKey: [
      FRAUD_FLAGS_QUERY_KEY,
      { status: params?.status, type: params?.type, userId: params?.userId, severity: params?.severity, dateFrom: params?.dateFrom, dateTo: params?.dateTo, limit },
    ],
    queryFn: async ({ pageParam }) => {
      const query = new URLSearchParams();
      if (params?.status) query.set("status", params.status);
      if (params?.type) query.set("type", String(params.type));
      if (params?.userId) query.set("userId", params.userId);
      // Backend only supports status, type, userId, cursor, limit
      // severity, dateFrom, dateTo are not supported by backend API
      query.set("limit", String(limit));
      if (pageParam) query.set("cursor", pageParam);

      const data = await apiGet<CursorItemsResponse<FraudFlag>>(`/admin/fraud/flags?${query.toString()}`);
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    getPreviousPageParam: (firstPage) => firstPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  });
}

export function useUpdateFraudFlag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: string;
      dto: { status: FraudFlagStatus; resolutionNote?: string };
    }) => apiPatch<FraudFlag>(`/admin/fraud/flags/${id}`, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FRAUD_FLAGS_QUERY_KEY] });
    },
  });
}
