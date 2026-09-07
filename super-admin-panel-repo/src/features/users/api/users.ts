import { getApi, patchApi } from "../../../utils/api";
import type { AdminUser, UserFilters, UserDetail } from "../types";

export async function getUsers(filters?: UserFilters) {
  const params: Record<string, string> = {};
  if (filters?.search) params.search = filters.search;
  if (filters?.role) params.role = filters.role;
  if (filters?.status) params.status = filters.status;
  if (filters?.cursor) params.cursor = filters.cursor;
  if (filters?.limit) params.limit = String(filters.limit);
  return getApi<{ data: AdminUser[]; meta: { cursor: string; hasMore: boolean } }>(
    "/admin/users",
    params
  );
}

export async function getUser(userId: string) {
  return getApi<{ data: UserDetail }>(`/admin/users/${userId}`);
}

export async function updateUserStatus(userId: string, isActive: boolean) {
  return patchApi<{ data: AdminUser }>(`/admin/users/${userId}`, { isActive });
}
