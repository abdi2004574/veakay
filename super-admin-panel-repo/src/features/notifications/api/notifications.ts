import { getApi, postApi } from "../../../utils/api";
import type { BroadcastPayload, AdminNotification } from "../types";

export async function sendBroadcast(payload: BroadcastPayload) {
  return postApi<{ data: AdminNotification }>("/admin/notifications/broadcast", payload);
}

export async function getBroadcastHistory() {
  return getApi<{ data: AdminNotification[] }>("/admin/notifications/history");
}