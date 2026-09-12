"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api";
import type { AdminInvite, CreateAdminInvite } from "@/types";

export const INVITES_QUERY_KEY = "admin-invites";

export function useInvitesList() {
  return useQuery({
    queryKey: [INVITES_QUERY_KEY],
    queryFn: () => apiGet<AdminInvite[]>("/admin/invites/"),
  });
}

export function useCreateInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateAdminInvite) => apiPost<AdminInvite>("/admin/invites/", dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVITES_QUERY_KEY] });
    },
  });
}

export function useRevokeInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiPost<AdminInvite>(`/admin/invites/${id}/revoke`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INVITES_QUERY_KEY] });
    },
  });
}
