import { getApi } from "../../../utils/api";
import type { AuditLogEntry, AuditLogFilters } from "../types";

export async function getAuditLogs(filters?: AuditLogFilters) {
  const params: Record<string, string> = {};
  if (filters?.action) params.action = filters.action;
  if (filters?.actorRole) params.actorRole = filters.actorRole;
  if (filters?.targetType) params.targetType = filters.targetType;
  if (filters?.cursor) params.cursor = filters.cursor;
  if (filters?.limit) params.limit = String(filters.limit);
  return getApi<{ data: AuditLogEntry[]; meta: { cursor: string; hasMore: boolean } }>(
    "/admin/audit-log",
    params
  );
}