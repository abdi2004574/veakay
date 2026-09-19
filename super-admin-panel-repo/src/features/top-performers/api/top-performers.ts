import { getApi } from "../../../utils/api";
import type { TopPerformingTraveler, TopPerformingAgency } from "../types";

export async function getTopPerformingTravelers() {
  return getApi<TopPerformingTraveler[]>("/admin/users/top-performers");
}

export async function getTopPerformingAgencies(limit?: number) {
  const params: Record<string, string> = {};
  if (limit) params.limit = String(limit);
  return getApi<TopPerformingAgency[]>(
    "/admin/agencies/top-performers",
    params,
  );
}
