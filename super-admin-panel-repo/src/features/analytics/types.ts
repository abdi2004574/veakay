export interface DashboardMetrics {
  totalUsers: number;
  totalAgencies: number;
  totalCampaigns: number;
  totalDonations: number;
  activeCampaigns: number;
  pendingAgencies: number;
}

export interface FundingTrendPoint {
  date: string;
  amount: number;
}

export interface FundingTrendsResponse {
  trends: FundingTrendPoint[];
}

export interface TopDestination {
  name: string;
  count: number;
}

export interface TravelerPreference {
  label: string;
  count: number;
}

export type AnalyticsTimeRange = "7d" | "30d" | "90d";

export interface AnalyticsFilters {
  timeRange: AnalyticsTimeRange;
}

export interface CampaignStatusDistribution {
  status: string;
  count: number;
}

export interface AgencyStatusDistribution {
  status: string;
  count: number;
}

export interface UserGrowthPoint {
  date: string;
  users: number;
  agencies: number;
}

export interface UserGrowthResponse {
  growth: UserGrowthPoint[];
}

export interface RevenueMetrics {
  totalRevenue: number;
  platformFees: number;
  agencyPayouts: number;
  travelerPayouts: number;
  averageDonation: number;
  donationCount: number;
}

export interface EngagementMetrics {
  activeUsers: number;
  sessionCount: number;
  averageSessionDuration: number;
  retentionRate: number;
}
