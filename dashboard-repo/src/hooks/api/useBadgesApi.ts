"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPost } from "@/lib/api";
import type { VerifiedBadge, AssignBadgeRequest } from "@/types";

export const BADGES_QUERY_KEY = "admin-badges";

export function useBadgesList() {
  return useQuery({
    queryKey: [BADGES_QUERY_KEY],
    queryFn: () => apiGet<VerifiedBadge[]>("/admin/badges/"),
  });
}

export function useAssignBadge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: AssignBadgeRequest) => apiPost<VerifiedBadge>("/admin/badges/", dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BADGES_QUERY_KEY] });
    },
  });
}

export function useRevokeBadge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiDelete<{ message: string }>(`/admin/badges/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BADGES_QUERY_KEY] });
    },
  });
}
