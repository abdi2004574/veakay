export type AdminInviteStatus = "pending" | "accepted" | "revoked" | "expired";

export interface AdminInvite {
  id: string;
  email: string;
  invitedById: string;
  status: AdminInviteStatus;
  expiresAt: string;
  acceptedAt?: string | null;
  createdAt: string;
}

export interface CreateAdminInviteInput {
  email: string;
  platformRole: "super_admin";
  acceptUrl?: string;
}

export interface CreateAdminInviteResult {
  invite: AdminInvite;
  rawToken: string;
  acceptUrl: string;
}

export type CreateInviteMutationResult = Pick<
  CreateAdminInviteResult,
  "invite" | "acceptUrl"
>;

export interface AcceptAdminInviteInput {
  token: string;
}

export interface AcceptAdminInviteResult {
  message: string;
}