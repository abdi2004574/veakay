"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api";

export const BROADCAST_PREVIEW_QUERY_KEY = "admin-broadcast-preview";

export interface BroadcastPreviewParams {
  target?: "all" | "role" | "user";
  role?: "traveler" | "agency";
}

export interface BroadcastPreviewResponse {
  estimatedReach: number;
  breakdown: {
    travelers: number;
    agencies: number;
    admins: number;
  };
}

export interface BroadcastNotificationDto {
  type: string;
  title: string;
  body: string;
  target: "all" | "role" | "user";
  role?: "traveler" | "agency";
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface BroadcastResponse {
  sentCount: number;
  failedCount: number;
}

export function useBroadcastPreview(params?: BroadcastPreviewParams) {
  return useQuery<BroadcastPreviewResponse>({
    queryKey: [BROADCAST_PREVIEW_QUERY_KEY, params],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (params?.target) query.set("target", params.target);
      if (params?.role) query.set("role", params.role);
      const response = await apiGet<BroadcastPreviewResponse>(
        `/admin/notifications/segments/preview?${query.toString()}`
      );
      return response;
    },
    enabled: !!params,
  });
}

export function useSendBroadcast() {
  return useMutation<BroadcastResponse, Error, BroadcastNotificationDto>({
    mutationFn: (dto) =>
      apiPost<BroadcastResponse>("/admin/notifications/broadcast", dto),
  });
}
