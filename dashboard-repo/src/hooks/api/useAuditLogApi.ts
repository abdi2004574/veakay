"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { AdminAuditLogEntry, CursorItemsResponse } from "@/types";

export const AUDIT_LOG_QUERY_KEY = "admin-audit-log";

interface AuditLogParams {
  action?: string;
  targetType?: string;
  targetId?: string;
  actorId?: string;
  cursor?: string;
  limit?: number;
}

export function useAuditLog(params?: AuditLogParams) {
  const limit = params?.limit ?? 20;
  return useInfiniteQuery({
    queryKey: [AUDIT_LOG_QUERY_KEY, { action: params?.action, targetType: params?.targetType, targetId: params?.targetId, actorId: params?.actorId, limit }],
    queryFn: async ({ pageParam }) => {
      const query = new URLSearchParams();
      if (params?.action) query.set("action", params.action);
      if (params?.targetType) query.set("targetType", params.targetType);
      if (params?.targetId) query.set("targetId", params.targetId);
      if (params?.actorId) query.set("actorId", params.actorId);
      if (pageParam) query.set("cursor", pageParam);
      query.set("limit", String(limit));

      const data = await apiGet<CursorItemsResponse<AdminAuditLogEntry>>(`/admin/audit-log?${query.toString()}`);
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    getPreviousPageParam: (firstPage) => firstPage.nextCursor,
    initialPageParam: undefined as string | undefined,
  });
}
