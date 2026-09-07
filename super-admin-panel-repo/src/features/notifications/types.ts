export interface BroadcastPayload {
  target: "all" | "role" | "user";
  role?: "traveler" | "agency";
  userId?: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export interface AdminNotification {
  id: string;
  title: string;
  body: string;
  sentAt: string;
  target: string;
}