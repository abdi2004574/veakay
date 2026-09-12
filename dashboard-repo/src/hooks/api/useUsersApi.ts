"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGetRaw, apiPatch } from "@/lib/api";
import type { AdminUser, ApiEnvelope, CursorPageResponse, UpdateUserStatus, VerifyKyc } from "@/types";

export const USERS_QUERY_KEY = "admin-users";

interface UsersListParams {
  search?: string;
  role?: string;
  status?: string;
  limit?: number;
}

export function useUsersList(params?: UsersListParams) {
  const limit = params?.limit ?? 20;
  return useInfiniteQuery({
    queryKey: [USERS_QUERY_KEY, { search: params?.search, role: params?.role, status: params?.status, limit }],
    queryFn: async ({ pageParam }) => {
      const query = new URLSearchParams();
      if (params?.search) query.set("search", params.search);
      if (params?.role) query.set("role", params.role);
      if (params?.status) query.set("status", params.status);
      query.set("limit", String(limit));
      if (pageParam) query.set("cursor", pageParam);

      const env = await apiGetRaw<ApiEnvelope<AdminUser[]>>(`/admin/users?${query.toString()}`);
      return {
        data: env.data,
        meta: env.meta as { cursor: string | null; hasMore: boolean },
      } as CursorPageResponse<AdminUser>;
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasMore ? lastPage.meta.cursor ?? undefined : undefined,
    getPreviousPageParam: (firstPage) => firstPage.meta.cursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUserStatus }) =>
      apiPatch<AdminUser>(`/admin/users/${id}`, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
}

export function useVerifyKyc() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, dto }: { userId: string; dto: VerifyKyc }) =>
      apiPatch(`/admin/users/${userId}/kyc`, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["admin-kyc"] });
    },
  });
}
