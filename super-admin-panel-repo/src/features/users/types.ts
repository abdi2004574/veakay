export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: "traveler" | "agency" | "admin" | "super_admin";
  platformRole: "user" | "super_admin";
  isActive: boolean;
  deactivatedAt?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: "active" | "deactivated";
  cursor?: string;
  limit?: number;
}

export interface UserDetail extends AdminUser {
  profile?: {
    bio?: string;
    location?: string;
    badge?: string;
    walletConnected: boolean;
  };
  stats: {
    campaignsCreated: number;
    campaignsFunded: number;
    donationsMade: number;
  };
}
