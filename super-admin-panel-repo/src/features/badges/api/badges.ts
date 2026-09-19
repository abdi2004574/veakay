import { deleteApi, getApi, postApi } from "../../../utils/api";
import type { AssignBadgeRequest, VerifiedBadge } from "../types";

export async function getBadges() {
  return getApi<VerifiedBadge[]>("/admin/badges");
}

export async function assignBadge(dto: AssignBadgeRequest) {
  return postApi<VerifiedBadge>("/admin/badges", dto);
}

export async function revokeBadge(id: string) {
  return deleteApi<VerifiedBadge>(`/admin/badges/${encodeURIComponent(id)}`);
}
