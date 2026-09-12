"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPatch } from "@/lib/api";
import type { ContentReport, CursorItemsResponse, ReviewReportRequest } from "@/types";

export const REPORTS_QUERY_KEY = "admin-reports";

interface ReportsListParams {
  status?: string;
  targetType?: string;
  reporterId?: string;
  limit?: number;
}

export function useReportsList(params?: ReportsListParams) {
  const limit = params?.limit ?? 20;
  return useInfiniteQuery({
    queryKey: [REPORTS_QUERY_KEY, { status: params?.status, targetType: params?.targetType, reporterId: params?.reporterId, limit }],
    queryFn: async ({ pageParam }) => {
      const query = new URLSearchParams();
      if (params?.status) query.set("status", params.status);
      if (params?.targetType) query.set("targetType", params.targetType);
      if (params?.reporterId) query.set("reporterId", params.reporterId);
      query.set("limit", String(limit));
      if (pageParam) query.set("cursor", pageParam);

      const data = await apiGet<CursorItemsResponse<ContentReport>>(`/reports/admin/reports?${query.toString()}`);
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    getPreviousPageParam: (firstPage) => firstPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  });
}

export function useReviewReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: ReviewReportRequest }) =>
      apiPatch<ContentReport>(`/reports/admin/reports/${id}`, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REPORTS_QUERY_KEY] });
    },
  });
}
