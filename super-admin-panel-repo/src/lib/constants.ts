export const API_BASE = import.meta.env.VITE_API_URL || "/api/v1";
export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "Veakay Super Admin";

export const ROUTES = {
  LOGIN: "/login",
  TWO_FACTOR: "/2fa",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  USERS: "/users",
  AGENCIES: "/agencies",
  CAMPAIGNS: "/campaigns",
  PAYMENTS: "/payments",
  CONTENT: "/content",
  NOTIFICATIONS: "/notifications",
  AUDIT: "/audit",
  SETTINGS: "/settings",
} as const;

export const PAGINATION_DEFAULTS = {
  LIMIT: 20,
  MAX_LIMIT: 50,
} as const;

export const USER_ROLES = {
  TRAVELER: "traveler",
  AGENCY: "agency",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

export const CAMPAIGN_STATUSES = {
  DRAFT: "draft",
  ACTIVE: "active",
  FUNDED: "funded",
  BOOKED: "booked",
  COMPLETED: "completed",
  CANCELED: "canceled",
  EXPIRED: "expired",
} as const;

export const WITHDRAWAL_STATUSES = {
  REQUESTED: "requested",
  APPROVED: "approved",
  REJECTED: "rejected",
  PAID: "paid",
} as const;

export const AGENCY_STATUSES = {
  PENDING_VERIFICATION: "pending_verification",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const REPORT_STATUSES = {
  PENDING: "pending",
  REVIEWED: "reviewed",
  ACTIONED: "actioned",
  DISMISSED: "dismissed",
} as const;