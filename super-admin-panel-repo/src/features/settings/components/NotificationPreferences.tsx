import { useState } from "react";
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from "../hooks/use-settings";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState, EmptyState } from "@/components/shared/DataState";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Bell, Mail, Smartphone } from "lucide-react";
import type { NotificationPreference } from "../types";

function formatTypeLabel(type: string): string {
  return type
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function NotificationPreferences() {
  const { data, isLoading, isError, error, refetch } =
    useNotificationPreferences();
  const update = useUpdateNotificationPreferences();
  const [draft, setDraft] = useState<Record<string, NotificationPreference>>(
    {},
  );

  const prefs = data?.data ?? [];

  if (isLoading) {
    return (
      <Card className="rounded-xl border border-border bg-card shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <Skeleton className="h-4 w-40" />
              <div className="flex gap-4">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load preferences"
        message={error?.message}
        onRetry={() => refetch()}
      />
    );
  }

  if (prefs.length === 0) {
    return (
      <EmptyState
        title="No notification preferences"
        description="There are no notification preferences configured yet."
      />
    );
  }

  const current = (type: string): NotificationPreference => {
    const found = draft[type] ?? prefs.find((p) => p.type === type);
    if (found) return found;
    return {
      type,
      inAppEnabled: true,
      pushEnabled: true,
      emailEnabled: false,
    };
  };

  const toggle = (
    type: string,
    field: "inAppEnabled" | "pushEnabled" | "emailEnabled",
  ) => {
    const next = !current(type)[field];
    setDraft((prev) => ({
      ...prev,
      [type]: {
        ...current(type),
        [field]: next,
      },
    }));
  };

  const handleSave = (type: string) => {
    const pref = current(type);
    update.mutate({
      type: pref.type,
      inAppEnabled: pref.inAppEnabled,
      pushEnabled: pref.pushEnabled,
      emailEnabled: pref.emailEnabled,
    });
  };

  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {prefs.map((pref) => {
          const state = current(pref.type);
          return (
            <div
              key={pref.type}
              className="flex items-center justify-between gap-4 rounded-lg border border-border p-4"
            >
              <div className="space-y-1">
                <div className="font-medium">
                  {formatTypeLabel(pref.type)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Configure how you receive {formatTypeLabel(pref.type).toLowerCase()}{" "}
                  notifications
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <Switch
                    checked={state.inAppEnabled}
                    onCheckedChange={() => toggle(pref.type, "inAppEnabled")}
                  />
                  <Label className="text-xs text-muted-foreground">In-app</Label>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <Switch
                    checked={state.pushEnabled}
                    onCheckedChange={() => toggle(pref.type, "pushEnabled")}
                  />
                  <Label className="text-xs text-muted-foreground">Push</Label>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Switch
                    checked={state.emailEnabled}
                    onCheckedChange={() => toggle(pref.type, "emailEnabled")}
                  />
                  <Label className="text-xs text-muted-foreground">Email</Label>
                </div>
                <GradientButton
                  size="sm"
                  variant="outline"
                  onClick={() => handleSave(pref.type)}
                  disabled={update.isPending}
                >
                  Save
                </GradientButton>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
