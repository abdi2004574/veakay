export interface ApiResponse<T = unknown> {
  data?: T;
  meta?: Record<string, unknown>;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: "traveler" | "agency" | "admin";
  platformRole: "user" | "super_admin";
  isEmailVerified: boolean;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
  status?: "active" | "deactivated" | "deleted";
}

export interface Agency {
  id: string;
  name: string;
  email: string;
  verificationStatus: "pending" | "verified" | "rejected";
  subscriptionTier: "basic" | "premium" | "featured";
  reputationScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  status: "draft" | "pending" | "active" | "completed" | "flagged";
  privacy: "public" | "friends";
  giftMode: boolean;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  type: "donation" | "withdrawal" | "payout";
  amount: number;
  currency: string;
  status: "pending" | "processing" | "completed" | "failed";
  userId?: string;
  agencyId?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actorId: string;
  actorEmail: string;
  resource: string;
  resourceId: string;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardKPIs {
  totalUsers: number;
  activeCampaigns: number;
  totalFundsRaised: number;
  platformRevenue: number;
  totalAgencies: number;
  pendingVerifications: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginStep1Response {
  pendingToken: string;
  requires2FA: boolean;
}

export interface LoginStep2Response {
  user: User;
  accessToken: string;
  refreshToken: string;
}