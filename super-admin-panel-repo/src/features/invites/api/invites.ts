import { getApi, postApi } from "../../../utils/api";
import type {
  AcceptAdminInviteInput,
  AcceptAdminInviteResult,
  AdminInvite,
  CreateAdminInviteInput,
  CreateAdminInviteResult,
} from "../types";

export async function getInvites() {
  return getApi<AdminInvite[]>("/admin/invites");
}

export async function createInvite(input: CreateAdminInviteInput) {
  const { acceptUrl, ...invite } = input;

  return postApi<CreateAdminInviteResult>("/admin/invites", {
    ...invite,
    ...(acceptUrl ? { acceptUrl } : {}),
  });
}

export async function revokeInvite(inviteId: string) {
  return postApi<AdminInvite>(
    `/admin/invites/${encodeURIComponent(inviteId)}/revoke`,
    {},
  );
}

export async function acceptInvite(input: AcceptAdminInviteInput) {
  return postApi<AcceptAdminInviteResult>("/admin/invites/accept", input);
}
