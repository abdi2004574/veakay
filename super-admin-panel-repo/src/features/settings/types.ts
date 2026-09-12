export interface AdminProfile {
  id: string;
  email: string;
  displayName: string;
  platformRole: "super_admin";
}

export interface NotificationPreferences {
  newSignUps: boolean;
  agencyVerificationRequests: boolean;
  reportedIssues: boolean;
  suspiciousActivity: boolean;
}
