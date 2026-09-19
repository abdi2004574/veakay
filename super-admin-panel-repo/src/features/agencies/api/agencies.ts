import { getApi, postApi } from "../../../utils/api";
import type { AdminAgency, AgencyFilters } from "../types";

export async function getAgencies(filters?: AgencyFilters) {
  const params: Record<string, string> = {};
  if (filters?.search) params.search = filters.search;
  if (filters?.status) params.status = filters.status;
  if (filters?.subscriptionTier)
    params.subscriptionTier = filters.subscriptionTier;
  if (filters?.cursor) params.cursor = filters.cursor;
  if (filters?.limit) params.limit = String(filters.limit);
  return getApi<AdminAgency[]>("/admin/agencies", params);
}

export async function approveAgency(agencyId: string) {
  return postApi<AdminAgency>(`/admin/agencies/${agencyId}/approve`);
}

export async function rejectAgency(agencyId: string, reason: string) {
  return postApi<AdminAgency>(`/admin/agencies/${agencyId}/reject`, { reason });
}
