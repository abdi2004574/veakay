import { getApi } from "../../../utils/api";
import type {
  DashboardMetrics,
  TopDestination,
  TravelerPreference,
} from "../types";
import type { FundingTrendsResponse } from "../../analytics/types";

export async function getDashboardMetrics() {
  return getApi<DashboardMetrics>("/admin/dashboard/kpis");
}
export async function getFundingTrends(range: "7d" | "30d" | "90d" = "30d") {
  return getApi<FundingTrendsResponse>(
    "/admin/dashboard/funding-trends",
    { range },
  );
}
export async function getTopDestinations() {
  return getApi<TopDestination[]>(
    "/admin/dashboard/top-destinations",
  );
}
export async function getTravelerPreferences() {
  return getApi<TravelerPreference[]>(
    "/admin/dashboard/traveler-distribution",
  );
}
