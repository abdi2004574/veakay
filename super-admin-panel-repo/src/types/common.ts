export type UserRole = "traveler" | "agency" | "admin" | "super_admin";

export type AgencyStatus = "pending_verification" | "approved" | "rejected";

export type CampaignStatus = "draft" | "active" | "funded" | "booked" | "completed" | "canceled" | "expired";

export type CampaignPrivacy = "public" | "invite_only";

export type PackageStatus = "active" | "inactive" | "archived";

export type TripRequestStatus = "pending" | "in_discussion" | "confirmed" | "completed" | "declined" | "cancelled";

export type WithdrawalStatus = "requested" | "approved" | "rejected" | "paid";

export type ReportStatus = "pending" | "reviewed" | "actioned" | "dismissed";

export type UserStatus = "active" | "inactive" | "suspended";

export type AgencySubscriptionTier = "basic" | "premium" | "featured";

export type PlatformRole = "user" | "super_admin";

export type AuditAction =
  | "user.registered"
  | "user.login"
  | "user.logout"
  | "user.deactivated"
  | "user.reactivated"
  | "agency.registered"
  | "agency.approved"
  | "agency.rejected"
  | "campaign.created"
  | "campaign.edited"
  | "campaign.deleted"
  | "campaign.flagged"
  | "campaign.approved"
  | "donation.received"
  | "withdrawal.requested"
  | "withdrawal.completed"
  | "withdrawal.failed"
  | "refund.issued"
  | "review.created"
  | "review.removed_by_admin"
  | "admin.report_resolved"
  | "admin.report_dismissed"
  | "admin.content_removed"
  | "admin.broadcast_sent";