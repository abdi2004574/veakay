"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPatch } from "@/lib/api";
import type { PlatformSettingsResponse, UpdateSettingsRequest } from "@/types";

export const SETTINGS_QUERY_KEY = "admin-settings";

export function useSettings() {
  return useQuery({
    queryKey: [SETTINGS_QUERY_KEY],
    queryFn: () => apiGet<PlatformSettingsResponse>("/admin/settings"),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateSettingsRequest) =>
      apiPatch<PlatformSettingsResponse>("/admin/settings", dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SETTINGS_QUERY_KEY] });
    },
  });
}

