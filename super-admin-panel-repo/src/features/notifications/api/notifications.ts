import { getApi, postApi } from "../../../utils/api";
import type {
  BroadcastPayload,
  BroadcastResult,
  SegmentPreviewResponse,
  SegmentPreviewFilters,
} from "../types";

export async function getSegmentPreview(filters?: SegmentPreviewFilters) {
  const params: Record<string, string> = {};

  if (filters?.target) {
    params.target = filters.target;
  }

  if (filters?.role) {
    params.role = filters.role;
  }

  return getApi<SegmentPreviewResponse>(
    "/admin/notifications/segments/preview",
    params,
  );
}

export async function sendBroadcast(payload: BroadcastPayload) {
  return postApi<BroadcastResult>("/admin/notifications/broadcast", payload);
}
