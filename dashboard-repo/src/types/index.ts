export type UserRole = "traveler" | "agency" | "admin";
export type PlatformRole = "user" | "super_admin";
export type AgencyStatus = "pending_verification" | "approved" | "rejected";
export type AgencySubscriptionTier = "basic" | "premium" | "featured";
export type AgencyDocumentType = "business_license" | "certification" | "legal_document";
export type CampaignStatus = "draft" | "active" | "funded" | "booked" | "completed" | "canceled" | "expired" | "flagged";
export type CampaignPrivacy = "public" | "invite_only";
export type VerificationStatus = "unverified" | "pending_review" | "verified" | "flagged" | "rejected";
export type ReportStatus = "pending" | "reviewing" | "resolved" | "dismissed" | "flagged" | "rejected";
export type ReportTargetType = "post" | "review" | "chat_message" | "campaign_media" | "agency_document";
export type WithdrawalStatus = "requested" | "approved" | "rejected" | "paid";
export type AdminInviteStatus = "pending" | "accepted" | "revoked" | "expired";
export type VerifiedBadgeSubjectType = "user" | "agency";
export type FraudFlagStatus = "open" | "reviewing" | "resolved" | "dismissed";
export type FraudFlagType = "frequent_profile_changes" | "payment_method_mismatch" | "withdrawal_anomaly" | "personal_info_mismatch";
export type FraudFlagSeverity = "low" | "medium" | "high" | "critical";

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface CursorPageMeta {
  cursor: string | null;
  hasMore: boolean;
}

export interface CursorPageResponse<T> {
  data: T[];
  meta: CursorPageMeta;
}

export interface CursorItemsResponse<T> {
  items: T[];
  nextCursor: string | null;
}

export interface AuthState {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  isEmailVerified: boolean;
  onboardingComplete: boolean;
}

export interface LoginStep1Response {
  pendingToken: string;
}

export interface LoginStep2Response {
  user: AuthState;
  accessToken: string;
  refreshToken: string;
}

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole | "super_admin";
  platformRole: PlatformRole;
  isActive: boolean;
  deactivatedAt?: string;
  createdAt: string;
  lastLoginAt?: string;
  profile?: {
    bio?: string;
    location?: string;
    badge?: string;
    walletConnected: boolean;
  };
  stats?: {
    campaignsCreated: number;
    campaignsFunded: number;
    donationsMade: number;
  };
}

export interface TopPerformer {
  id: string;
  username: string;
  displayName: string;
  photoMediaId: string | null;
  completedTripCount: number;
  badge?: string;
  createdAt: string;
}

export interface AgencyTopPerformer {
  id: string;
  agencyName: string;
  reputationScore: number | null;
  totalBookings: number;
  totalRevenue: number;
  status: AgencyStatus;
  subscriptionTier: AgencySubscriptionTier;
  logoMediaId: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    username: string;
  };
  documents: AdminAgencyDocument[];
}

export interface AdminAgencyDocument {
  id: string;
  type: AgencyDocumentType;
  mediaId: string;
  createdAt: string;
}

export interface AdminAgency {
  id: string;
  agencyName: string;
  businessContact: string | null;
  businessAddress: string | null;
  status: AgencyStatus;
  rejectionReason: string | null;
  reputationScore: number | null;
  subscriptionTier: AgencySubscriptionTier;
  logoMediaId: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    displayName: string;
    username: string;
  };
  documents: AdminAgencyDocument[];
}

export interface AdminCampaignCreator {
  id: string;
  displayName: string;
  email: string;
}

export interface AdminCampaign {
  id: string;
  title: string;
  destination: string;
  goalAmount: number;
  raisedAmount: number;
  currency: string;
  status: CampaignStatus;
  privacy: CampaignPrivacy;
  isGiftMode: boolean;
  creator: AdminCampaignCreator;
  createdAt: string;
  flaggedAt?: string;
  flagReason?: string;
}

export interface ContentReport {
  id: string;
  reporterId: string | null;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  status: ReportStatus;
  resolvedById: string | null;
  resolutionNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuditLogEntry {
  id: string;
  actorId: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  reason: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface AdminInvite {
  id: string;
  email: string;
  token: string;
  invitedById: string;
  status: AdminInviteStatus;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
}

export interface VerifiedBadge {
  id: string;
  subjectType: VerifiedBadgeSubjectType;
  subjectId: string;
  assignedById: string;
  assignedAt: string;
  revokedAt: string | null;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  campaignId: string | null;
  payoutAccountId: string | null;
  amount: number;
  currency: string;
  status: WithdrawalStatus;
  highValueThreshold: number | null;
  walletTransactionId: string | null;
  rejectionReason: string | null;
  refundNote: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface FraudFlag {
  id: string;
  userId: string;
  type: FraudFlagType;
  severity: FraudFlagSeverity;
  description: string;
  status: FraudFlagStatus;
  reviewedById: string | null;
  reviewedAt: string | null;
  resolutionNote: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

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

export interface UpdateUserStatus {
  isActive: boolean;
}

export interface VerifyKyc {
  status: VerificationStatus;
  note?: string;
}

export interface RejectAgency {
  reason: string;
}

export interface UpdateCampaignVerification {
  status: VerificationStatus;
  note?: string;
}

export interface UpdateCampaignFlag {
  reason?: string;
}

export interface ReviewReportRequest {
  status: ReportStatus;
  resolutionNote?: string;
}

export interface CreateAdminInvite {
  email: string;
  platformRole: "super_admin";
  acceptUrl: string;
}

export interface AssignBadgeRequest {
  subjectType: VerifiedBadgeSubjectType;
  subjectId: string;
}

export interface PlatformSetting {
  id: string;
  key: string;
  value: unknown;
  description?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformSettingsResponse {
  settings: PlatformSetting[];
}

export interface UpdateSettingsRequest {
  settings: Record<string, unknown>;
}
