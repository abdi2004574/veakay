import type { ReportStatus } from "../../types/common";

export interface ContentReport {
  id: string;
  targetType: "post" | "comment" | "review" | "message" | "campaign";
  targetId: string;
  reason: string;
  status: ReportStatus;
  reporter?: { id: string; displayName: string };
  resolvedBy?: { id: string; displayName: string };
  resolutionNote?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ReportFilters {
  status?: ReportStatus;
  targetType?: string;
  cursor?: string;
  limit?: number;
}