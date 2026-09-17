import { useQuery } from "@tanstack/react-query";
import { getFraudFlags, getFraudFlag } from "../api/fraud";
import type { FraudFlagFilters } from "../types";

export const FRAUD_FLAGS_QUERY_KEY = "fraud-flags";

export function useFraudFlags(filters?: FraudFlagFilters) {
  return useQuery({
    queryKey: [FRAUD_FLAGS_QUERY_KEY, filters ?? {}],
    queryFn: () => getFraudFlags(filters),
  });
}

export function useFraudFlag(id: string) {
  return useQuery({
    queryKey: [FRAUD_FLAGS_QUERY_KEY, "detail", id],
    queryFn: () => getFraudFlag(id),
    enabled: !!id,
  });
}
