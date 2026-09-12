"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api";
import type { AdminAgency, AgencyTopPerformer, RejectAgency } from "@/types";

export const AGENCIES_PENDING_QUERY_KEY = "admin-agencies-pending";

export function usePendingAgencies() {
  return useQuery({
    queryKey: [AGENCIES_PENDING_QUERY_KEY],
    queryFn: () => apiGet<AdminAgency[]>("/admin/agencies/pending"),
  });
}

export function useAgencyTopPerformers() {
  return useQuery({
    queryKey: ["admin-agency-top-performers"],
    queryFn: () => apiGet<AgencyTopPerformer[]>("/admin/agencies/top-performers"),
  });
}

export function useApproveAgency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiPost<AdminAgency>("/admin/agencies/" + id + "/approve", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AGENCIES_PENDING_QUERY_KEY] });
    },
  });
}

export function useRejectAgency() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: RejectAgency }) =>
      apiPost<AdminAgency>("/admin/agencies/" + id + "/reject", dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AGENCIES_PENDING_QUERY_KEY] });
    },
  });
}
