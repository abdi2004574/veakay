import { useSegmentPreview } from "../hooks/use-notifications";
import type { NotificationRole, NotificationTarget } from "../types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Building2,
  Inbox,
  Loader2,
  Shield,
  Users,
} from "lucide-react";

interface SegmentPreviewProps {
  target: NotificationTarget;
  role?: NotificationRole;
  userId?: string;
}

const targetLabels: Record<NotificationTarget, string> = {
  all: "All active users",
  role: "Role segment",
  user: "Specific user",
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function SegmentPreview({
  target,
  role,
  userId,
}: SegmentPreviewProps) {
  const { data, error, isError, isFetching, isLoading, refetch } =
    useSegmentPreview({ target, role });
  const preview = data?.data;
  const label =
    target === "role"
      ? `${targetLabels[target]}: ${role ?? "Select role"}`
      : targetLabels[target];

  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle>Segment preview</CardTitle>
            <CardDescription>
              Estimate recipients before sending
            </CardDescription>
          </div>
          <Badge variant="outline" className="capitalize">
            {label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {userId && target === "user" && (
          <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            User ID: <span className="font-mono text-foreground">{userId}</span>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3" aria-live="polite">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Preview unavailable</AlertTitle>
            <AlertDescription className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
              <span>{error.message || "Unable to estimate this segment."}</span>
              <button
                type="button"
                onClick={() => void refetch()}
                className="inline-flex w-fit items-center rounded-md border border-current px-2 py-1 text-xs font-medium hover:bg-destructive/10"
              >
                Retry
              </button>
            </AlertDescription>
          </Alert>
        ) : !preview ? (
          <div className="flex min-h-[140px] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <Inbox className="h-6 w-6" />
            <p className="text-sm">No preview data</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Estimated reach
                  </span>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-2 text-2xl font-semibold tabular-nums">
                  {formatNumber(preview.estimatedReach)}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Active accounts
                  </span>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-2 text-2xl font-semibold tabular-nums">
                  {formatNumber(
                    preview.breakdown.travelers +
                      preview.breakdown.agencies +
                      preview.breakdown.admins,
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" /> Travelers
                </span>
                <span className="font-medium tabular-nums">
                  {formatNumber(preview.breakdown.travelers)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" /> Agencies
                </span>
                <span className="font-medium tabular-nums">
                  {formatNumber(preview.breakdown.agencies)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-4 w-4" /> Admins
                </span>
                <span className="font-medium tabular-nums">
                  {formatNumber(preview.breakdown.admins)}
                </span>
              </div>
            </div>

            {preview.estimatedReach === 0 && (
              <Alert variant="warning">
                <Inbox className="h-4 w-4" />
                <AlertTitle>No recipients in this segment</AlertTitle>
                <AlertDescription>
                  Choose another target before sending.
                </AlertDescription>
              </Alert>
            )}

            {isFetching && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Refreshing estimate
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
