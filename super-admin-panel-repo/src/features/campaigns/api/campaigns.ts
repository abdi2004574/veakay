import { getApi, patchApi } from "../../../utils/api";
import type { AdminCampaign, CampaignFilters } from "../types";

export async function getCampaigns(filters?: CampaignFilters) {
  const params: Record<string, string> = {};
  if (filters?.search) params.search = filters.search;
  if (filters?.status) params.status = filters.status;
  if (filters?.privacy) params.privacy = filters.privacy;
  if (filters?.flagged !== undefined) params.flagged = String(filters.flagged);
  if (filters?.cursor) params.cursor = filters.cursor;
  if (filters?.limit) params.limit = String(filters.limit);
  return getApi<{ data: AdminCampaign[]; meta: { cursor: string; hasMore: boolean } }>(
    "/admin/campaigns",
    params
  );
}

export async function flagCampaign(campaignId: string, reason: string) {
  return patchApi<{ data: AdminCampaign }>(`/admin/campaigns/${campaignId}/flag`, { reason });
}

export async function unflagCampaign(campaignId: string) {
  return patchApi<{ data: AdminCampaign }>(`/admin/campaigns/${campaignId}/flag`, { reason: "" });
}