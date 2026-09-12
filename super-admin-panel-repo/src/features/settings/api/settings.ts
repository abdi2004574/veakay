import { getApi, patchApi } from "../../../utils/api";
import type { AdminProfile, NotificationPreferences } from "../types";

export async function getAdminProfile() {
  return getApi<{ data: AdminProfile }>("/admin/profile");
}

export async function updateAdminProfile(data: { displayName?: string }) {
  return patchApi<{ data: AdminProfile }>("/admin/profile", data);
}

export async function getNotificationPreferences() {
  return getApi<{ data: NotificationPreferences }>("/admin/settings/notification-preferences");
}

export async function updateNotificationPreferences(prefs: Partial<NotificationPreferences>) {
  return patchApi<{ data: NotificationPreferences }>("/admin/settings/notification-preferences", prefs);
}
