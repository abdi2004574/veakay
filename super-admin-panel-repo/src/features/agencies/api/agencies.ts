import { getApi, patchApi } from "../../../utils/api";
import type { AdminAgency, AgencyDetail, AgencyFilters } from "../types";

export async function getAgencies(filters?: AgencyFilters) {
  const params: Record<string, string> = {};
  if (filters?.search) params.search = filters.search;
  if (filters?.status) params.status = filters.status;
  if (filters?.subscriptionTier) params.subscriptionTier = filters.subscriptionTier;
  if (filters?.cursor) params.cursor = filters.cursor;
  if (filters?.limit) params.limit = String(filters.limit);
  return getApi<{ data: AdminAgency[]; meta: { cursor: string; hasMore: boolean } }>(
    "/admin/agencies",
    params
  );
}

export async function getAgency(agencyId: string) {
  return getApi<{ data: AgencyDetail }>(`/admin/agencies/${agencyId}`);
}

export async function approveAgency(agencyId: string) {
  return patchApi<{ data: AdminAgency }>(`/admin/agencies/${agencyId}`, { status: "approved" });
}

export async function rejectAgency(agencyId: string, reason: string) {
  return patchApi<{ data: AdminAgency }>(`/admin/agencies/${agencyId}`, {
    status: "rejected",
    rejectionReason: reason,
  });
}
