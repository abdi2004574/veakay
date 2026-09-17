import { getApi } from '../../../utils/api';
import type {
  DashboardMetrics,
  FundingTrendsResponse,
  TopDestination,
  TravelerPreference,
  AnalyticsTimeRange,
} from '../types';

export async function getDashboardMetrics() {
  return getApi<DashboardMetrics>('/admin/dashboard/kpis');
}

export async function getFundingTrends(range: AnalyticsTimeRange = '30d') {
  return getApi<FundingTrendsResponse>('/admin/dashboard/funding-trends', { range });
}

export async function getTopDestinations() {
  return getApi<TopDestination[]>('/admin/dashboard/top-destinations');
}

export async function getTravelerPreferences() {
  return getApi<TravelerPreference[]>('/admin/dashboard/traveler-distribution');
}
