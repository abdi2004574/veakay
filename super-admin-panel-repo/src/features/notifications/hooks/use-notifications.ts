import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getSegmentPreview,
  sendBroadcast,
} from "../api/notifications";
import type { BroadcastPayload, SegmentPreviewFilters } from "../types";

export const NOTIFICATIONS_QUERY_KEYS = {
  preview: ["notifications", "segments", "preview"] as const,
};

export function useSegmentPreview(filters?: SegmentPreviewFilters) {
  const target = filters?.target ?? "all";
  const role = filters?.role;

  return useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEYS.preview, target, role ?? ""],
    queryFn: () => getSegmentPreview({ target, role }),
  });
}

export function useBroadcastNotification() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: BroadcastPayload) => sendBroadcast(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATIONS_QUERY_KEYS.preview,
      });

      const { sentCount, failedCount } = response.data;
      const partial = failedCount > 0;

      toast({
        title: partial ? "Broadcast partially sent" : "Broadcast sent",
        description: partial
          ? `${sentCount} delivered, ${failedCount} failed.`
          : `${sentCount} recipients received the notification.`,
        variant: partial ? "destructive" : "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Broadcast failed",
        description: error.message || "The notification could not be sent.",
        variant: "destructive",
      });
    },
  });
}
