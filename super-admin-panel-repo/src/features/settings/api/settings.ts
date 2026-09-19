import { getApi, patchApi } from "../../../utils/api";
import type {
  AdminProfile,
  NotificationPreference,
  PlatformSettingsResponse,
  UpdateSettingsRequest,
} from "../types";

export async function getAdminProfile() {
  return getApi<AdminProfile>("/me");
}

export async function updateAdminProfile(data: {
  displayName?: string;
  username?: string;
}) {
  return patchApi<AdminProfile>("/me/profile", data);
}

export async function getNotificationPreferences() {
  return getApi<NotificationPreference[]>("/me/notification-preferences");
}

export async function updateNotificationPreferences(
  prefs: Partial<NotificationPreference>,
) {
  return patchApi<NotificationPreference>(
    "/me/notification-preferences",
    prefs,
  );
}

export async function getPlatformSettings() {
  return getApi<PlatformSettingsResponse>("/admin/settings");
}

export async function updatePlatformSettings(request: UpdateSettingsRequest) {
  return patchApi<PlatformSettingsResponse>("/admin/settings", request);
}
