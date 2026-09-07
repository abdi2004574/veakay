import type { CampaignStatus, CampaignPrivacy } from "../../types/common";

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
  creator: { id: string; displayName: string; email: string };
  createdAt: string;
  flaggedAt?: string;
  flagReason?: string;
}

export interface CampaignFilters {
  search?: string;
  status?: CampaignStatus;
  privacy?: CampaignPrivacy;
  flagged?: boolean;
  cursor?: string;
  limit?: number;
}