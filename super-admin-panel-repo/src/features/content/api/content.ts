import { getApi, patchApi } from "../../../utils/api";
import type { ContentReport, ReportFilters } from "../types";

export async function getReports(filters?: ReportFilters) {
  const params: Record<string, string> = {};
  if (filters?.status) params.status = filters.status;
  if (filters?.targetType) params.targetType = filters.targetType;
  if (filters?.cursor) params.cursor = filters.cursor;
  if (filters?.limit) params.limit = String(filters.limit);
  return getApi<{ data: ContentReport[]; meta: { cursor: string; hasMore: boolean } }>(
    "/admin/reports",
    params
  );
}

export async function resolveReport(reportId: string, action: "dismissed" | "actioned", note?: string) {
  return patchApi<{ data: ContentReport }>(`/admin/reports/${reportId}`, {
    status: action,
    resolutionNote: note,
  });
}