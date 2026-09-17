export type NotificationTarget = "all" | "role" | "user";
export type NotificationRole = "traveler" | "agency";

export const notificationTypeValues = [
  "donation",
  "milestone",
  "agency_response",
  "chat_message",
  "like",
  "comment",
  "share",
  "review_received",
  "verification_status",
  "account_status",
  "campaign_flagged",
  "admin_broadcast",
  "new_request",
  "booking_update",
  "payment_received",
  "withdrawal_status",
  "friend_request",
  "shared_file",
  "new_call",
  "system_alert",
] as const;

export type NotificationType = (typeof notificationTypeValues)[number];
export type AdminNotificationType = NotificationType;

export interface BroadcastPayload {
  type: NotificationType;
  target: NotificationTarget;
  role?: NotificationRole;
  userId?: string;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
}

export interface BroadcastResult {
  sentCount: number;
  failedCount: number;
}

export interface SegmentBreakdown {
  travelers: number;
  agencies: number;
  admins: number;
}

export interface SegmentPreviewResponse {
  estimatedReach: number;
  breakdown: SegmentBreakdown;
}

export interface SegmentPreviewFilters {
  target?: NotificationTarget;
  role?: NotificationRole;
}

export type NotificationDeliveryStatus = "sent" | "partial" | "failed";

/**
 * @deprecated Broadcast history endpoint not yet implemented in backend.
 * Kept for future compatibility when GET /admin/notifications/broadcast is added.
 */
export interface AdminNotification {
  id: string;
  title: string;
  body?: string;
  target: NotificationTarget | string;
  role?: NotificationRole;
  userId?: string;
  sentAt?: string;
  createdAt?: string;
  sentCount?: number;
  failedCount?: number;
  status?: NotificationDeliveryStatus;
}

export type SegmentPreviewData = SegmentPreviewResponse;
export type BroadcastPreviewParams = SegmentPreviewFilters;
export type BroadcastPreviewResponse = SegmentPreviewResponse;
export type BroadcastNotificationDto = BroadcastPayload;
export type BroadcastResponse = BroadcastResult;
