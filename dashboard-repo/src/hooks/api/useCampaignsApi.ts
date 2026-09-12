"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGetRaw, apiPatch } from "@/lib/api";
import type { AdminCampaign, ApiEnvelope, CursorPageResponse, UpdateCampaignFlag } from "@/types";

export const CAMPAIGNS_QUERY_KEY = "admin-campaigns";

interface CampaignsListParams {
  search?: string;
  status?: string;
  privacy?: string;
  flagged?: boolean;
  limit?: number;
}

export function useCampaignsList(params?: CampaignsListParams) {
  const limit = params?.limit ?? 20;
  return useInfiniteQuery({
    queryKey: [CAMPAIGNS_QUERY_KEY, { search: params?.search, status: params?.status, privacy: params?.privacy, flagged: params?.flagged, limit }],
    queryFn: async ({ pageParam }) => {
      const query = new URLSearchParams();
      if (params?.search) query.set("search", params.search);
      if (params?.status) query.set("status", params.status);
      if (params?.privacy) query.set("privacy", params.privacy);
      if (params?.flagged !== undefined) query.set("flagged", String(params.flagged));
      query.set("limit", String(limit));
      if (pageParam) query.set("cursor", pageParam);

      const env = await apiGetRaw<ApiEnvelope<AdminCampaign[]>>(`/admin/campaigns?${query.toString()}`);
      return {
        data: env.data,
        meta: env.meta as { cursor: string | null; hasMore: boolean },
      } as CursorPageResponse<AdminCampaign>;
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? lastPage.meta.cursor ?? undefined : undefined,
    getPreviousPageParam: (firstPage) => firstPage.meta.cursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  });
}

export function useUpdateCampaignFlag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ campaignId, dto }: { campaignId: string; dto: UpdateCampaignFlag }) =>
      apiPatch<AdminCampaign>(`/admin/campaigns/${campaignId}/flag`, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGNS_QUERY_KEY] });
    },
  });
}
