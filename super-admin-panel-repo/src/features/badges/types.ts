export type VerifiedBadgeSubjectType = "user" | "agency";

export interface VerifiedBadge {
  id: string;
  subjectType: VerifiedBadgeSubjectType;
  subjectId: string;
  assignedById: string;
  assignedAt: string;
  revokedAt: string | null;
}

export interface AssignBadgeRequest {
  subjectType: VerifiedBadgeSubjectType;
  subjectId: string;
}
