"use client";

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type {
  DashboardMetrics,
  FundingTrendsResponse,
  TopDestination,
  TravelerPreference,
} from "@/types";

export const DASHBOARD_KPIS_QUERY_KEY = "admin-dashboard-kpis";
export const FUNDING_TRENDS_QUERY_KEY = "admin-funding-trends";
export const TOP_DESTINATIONS_QUERY_KEY = "admin-top-destinations";
export const TRAVEL_PREFERENCES_QUERY_KEY = "admin-traveler-distribution";

export function useDashboardKpis() {
  return useQuery({
    queryKey: [DASHBOARD_KPIS_QUERY_KEY],
    queryFn: () => apiGet<DashboardMetrics>("/admin/dashboard/kpis"),
  });
}

export function useFundingTrends(range: "7d" | "30d" | "90d" = "30d") {
  return useQuery({
    queryKey: [FUNDING_TRENDS_QUERY_KEY, range],
    queryFn: () => apiGet<FundingTrendsResponse>(`/admin/dashboard/funding-trends?range=${range}`),
  });
}

export function useTopDestinations() {
  return useQuery({
    queryKey: [TOP_DESTINATIONS_QUERY_KEY],
    queryFn: () => apiGet<TopDestination[]>("/admin/dashboard/top-destinations"),
  });
}

export function useTravelerPreferences() {
  return useQuery({
    queryKey: [TRAVEL_PREFERENCES_QUERY_KEY],
    queryFn: () => apiGet<TravelerPreference[]>("/admin/dashboard/traveler-distribution"),
  });
}
