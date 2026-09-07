import type { AgencyStatus } from "../../types/common";

export interface AdminAgency {
  id: string;
  agencyName: string;
  businessContact: string;
  businessAddress: string;
  status: AgencyStatus;
  reputationScore?: number;
  subscriptionTier: "basic" | "premium" | "featured";
  description?: string;
  createdAt: string;
  user: { id: string; email: string; displayName: string; isActive: boolean };
}

export interface AgencyDocument {
  id: string;
  type: "business_license" | "certification" | "legal_document";
  createdAt: string;
}

export interface AgencyDetail extends AdminAgency {
  documents: AgencyDocument[];
  stats: { totalPackages: number; totalRequests: number; totalBookings: number };
}

export interface AgencyFilters {
  search?: string;
  status?: AgencyStatus;
  subscriptionTier?: string;
  cursor?: string;
  limit?: number;
}
