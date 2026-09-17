import { useQuery } from '@tanstack/react-query';
import {
  getDashboardMetrics,
  getFundingTrends,
  getTopDestinations,
  getTravelerPreferences,
} from '../api/analytics';
import type { AnalyticsTimeRange } from '../types';

export const ANALYTICS_QUERY_KEYS = {
  metrics: ['analytics', 'metrics'] as const,
  fundingTrends: (range: AnalyticsTimeRange) => ['analytics', 'funding-trends', range] as const,
  topDestinations: ['analytics', 'top-destinations'] as const,
  travelerPreferences: ['analytics', 'traveler-preferences'] as const,
};

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.metrics,
    queryFn: getDashboardMetrics,
  });
}

export function useFundingTrends(range: AnalyticsTimeRange = '30d') {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.fundingTrends(range),
    queryFn: () => getFundingTrends(range),
  });
}

export function useTopDestinations() {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.topDestinations,
    queryFn: getTopDestinations,
  });
}

export function useTravelerPreferences() {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.travelerPreferences,
    queryFn: getTravelerPreferences,
  });
}
