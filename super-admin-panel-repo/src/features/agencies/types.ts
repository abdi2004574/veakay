import type { AgencyStatus, AgencySubscriptionTier } from "../../types/common";

export interface AdminAgency {
  id: string;
  agencyName: string;
  businessContact: string | null;
  businessAddress: string | null;
  status: AgencyStatus;
  rejectionReason: string | null;
  reputationScore: number | null;
  subscriptionTier: AgencySubscriptionTier;
  createdAt: string;
  userId: string;
  userEmail: string;
  userDisplayName: string | null;
}

export interface AgencyDocument {
  id: string;
  type: "business_license" | "certification" | "legal_document";
  createdAt: string;
}

export interface AgencyDetail extends AdminAgency {
  documents: AgencyDocument[];
  stats: {
    totalPackages: number;
    totalRequests: number;
    totalBookings: number;
  };
}

export interface AgencyFilters {
  search?: string;
  status?: AgencyStatus;
  subscriptionTier?: AgencySubscriptionTier;
  cursor?: string;
  limit?: number;
}
