"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { TopPerformer } from "@/types";

export const TOP_PERFORMERS_QUERY_KEY = "admin-top-performers";

export function useTopPerformers() {
  return useQuery({
    queryKey: [TOP_PERFORMERS_QUERY_KEY],
    queryFn: () => apiGet<TopPerformer[]>("/admin/users/top-performers"),
  });
}