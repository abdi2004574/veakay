export type FraudFlagStatus = "open" | "reviewing" | "resolved" | "dismissed";

export type FraudFlagType =
  | "frequent_profile_changes"
  | "payment_method_mismatch"
  | "withdrawal_anomaly"
  | "personal_info_mismatch";

export type FraudFlagSeverity = "low" | "medium" | "high" | "critical";

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

export interface FraudFlagFilters {
  status?: FraudFlagStatus;
  severity?: FraudFlagSeverity;
  type?: FraudFlagType;
  search?: string;
  cursor?: string;
  limit?: number;
}

export interface FraudFlagsResponse {
  items: FraudFlag[];
  nextCursor: string | null;
}
