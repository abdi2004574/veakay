import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  getAdminProfile,
  updateAdminProfile,
  getNotificationPreferences,
  updateNotificationPreferences,
  getPlatformSettings,
  updatePlatformSettings,
} from "../api/settings";
import type { UpdateSettingsRequest } from "../types";

export const SETTINGS_QUERY_KEYS = {
  profile: ["settings", "profile"] as const,
  notificationPreferences: ["settings", "notification-preferences"] as const,
  platformSettings: ["settings", "platform-settings"] as const,
};

export function useAdminProfile() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.profile,
    queryFn: getAdminProfile,
  });
}

export function useUpdateAdminProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateAdminProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEYS.profile });
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    },
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.notificationPreferences,
    queryFn: getNotificationPreferences,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SETTINGS_QUERY_KEYS.notificationPreferences,
      });
      toast({
        title: "Preferences updated",
        description: "Your notification preferences have been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update preferences.",
        variant: "destructive",
      });
    },
  });
}

export function usePlatformSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEYS.platformSettings,
    queryFn: getPlatformSettings,
  });
}

export function useUpdatePlatformSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: UpdateSettingsRequest) => updatePlatformSettings(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SETTINGS_QUERY_KEYS.platformSettings,
      });
      toast({
        title: "Settings saved",
        description: "Platform settings have been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update platform settings.",
        variant: "destructive",
      });
    },
  });
}
