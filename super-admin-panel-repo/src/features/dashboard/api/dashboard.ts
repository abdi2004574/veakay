import { getApi } from "../../../utils/api";
import type { DashboardMetrics, FundingTrendPoint, TopDestination, TravelerPreference } from "../types";

export async function getDashboardMetrics() {
  return getApi<{ data: DashboardMetrics }>("/admin/dashboard/kpis");
}
export async function getFundingTrends(range: "7d" | "30d" | "90d" = "30d") {
  return getApi<{ data: { trends: FundingTrendPoint[] } }>("/admin/dashboard/funding-trends", { range });
}
export async function getTopDestinations() {
  return getApi<{ data: TopDestination[] }>("/admin/dashboard/top-destinations");
}
export async function getTravelerPreferences() {
  return getApi<{ data: TravelerPreference[] }>("/admin/dashboard/traveler-distribution");
}
