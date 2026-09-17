export interface TopPerformingTraveler {
  id: string;
  username: string;
  displayName: string;
  photoMediaId: string | null;
  completedTripCount: number;
}

export interface TopPerformingAgency {
  id: string;
  agencyName: string;
  reputationScore: number | null;
  totalBookings: number;
  totalRevenue: number;
  status: string;
  subscriptionTier: string;
}
