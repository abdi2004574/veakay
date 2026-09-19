import { useEffect, useState } from "react";
import { useAdminProfile, useUpdateAdminProfile } from "../hooks/use-settings";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/DataState";

export default function ProfileForm() {
  const { data, isLoading, isError, error, refetch } = useAdminProfile();
  const update = useUpdateAdminProfile();
  const profile = data?.data;

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName ?? "");
      setUsername(profile.username ?? "");
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-4 w-56" />
        </div>
        <Card className="rounded-xl border border-border bg-card shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl">
        <ErrorState
          title="Failed to load profile"
          message={error?.message}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl">
        <ErrorState
          title="No profile"
          message="Could not retrieve your admin profile."
        />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update.mutate({
      displayName: displayName || undefined,
      username: username || undefined,
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your admin profile and preferences
        </p>
      </div>
      <Card className="rounded-xl border border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                className="rounded-2xl border border-border bg-[var(--input-background)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-2xl border border-border bg-[var(--input-background)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                name="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="rounded-2xl border border-border bg-[var(--input-background)]"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={profile.role}
                disabled
                className="rounded-2xl border border-border bg-[var(--input-background)]"
              />
            </div>
            <GradientButton
              type="submit"
              disabled={update.isPending}
              variant="primary"
              size="default"
            >
              {update.isPending ? "Saving..." : "Save Changes"}
            </GradientButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
