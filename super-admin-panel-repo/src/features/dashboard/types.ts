export interface DashboardMetrics {
  totalUsers: number;
  totalAgencies: number;
  totalCampaigns: number;
  totalDonations: number;
  activeCampaigns: number;
  pendingAgencies: number;
}
export interface FundingTrendPoint { date: string; amount: number; }
export interface TopDestination { name: string; count: number; }
export interface TravelerPreference { label: string; count: number; }
