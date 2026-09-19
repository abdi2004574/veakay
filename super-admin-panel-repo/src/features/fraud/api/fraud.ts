import { getApi, patchApi } from "../../../utils/api";
import type { FraudFlag, FraudFlagFilters, FraudFlagsResponse } from "../types";

export async function getFraudFlags(filters?: FraudFlagFilters) {
  const params: Record<string, string> = {};
  if (filters?.status) params.status = filters.status;
  if (filters?.severity) params.severity = filters.severity;
  if (filters?.type) params.type = filters.type;
  if (filters?.search) params.search = filters.search;
  if (filters?.cursor) params.cursor = filters.cursor;
  if (filters?.limit) params.limit = String(filters.limit);
  return getApi<FraudFlagsResponse>("/admin/fraud/flags", params);
}

export async function getFraudFlag(id: string) {
  return getApi<FraudFlag>(`/admin/fraud/flags/${id}`);
}

export async function reviewFraudFlag(
  id: string,
  status: FraudFlag["status"],
  resolutionNote?: string,
) {
  return patchApi<FraudFlag>(`/admin/fraud/flags/${id}`, {
    status,
    resolutionNote,
  });
}
