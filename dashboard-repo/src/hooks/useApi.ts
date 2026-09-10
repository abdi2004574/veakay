import { useMemo } from "react";
import { apiClient } from "@/lib/api";

export function useApi() {
  return useMemo(() => apiClient, []);
}