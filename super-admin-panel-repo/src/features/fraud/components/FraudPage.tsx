import { useState } from "react";
import FraudTable from "./FraudTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useReviewFraudFlag } from "../hooks/use-fraud-mutations";
import { useFraudFlags } from "../hooks/use-fraud-queries";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";
import type { BadgeProps } from "@/components/ui/badge";
import type { FraudFlag, FraudFlagStatus } from "../types";

const statusLabels: Record<string, string> = {
  open: "Open",
  reviewing: "Reviewing",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

const statusVariant: Record<string, BadgeProps["variant"]> = {
  open: "destructive",
  reviewing: "warning",
  resolved: "success",
  dismissed: "outline",
};

export default function FraudPage() {
  const [selectedFlag, setSelectedFlag] = useState<FraudFlag | null>(null);
  const [newStatus, setNewStatus] = useState<FraudFlagStatus>("reviewing");
  const [resolutionNote, setResolutionNote] = useState("");
  const { toast } = useToast();

  const { data, isLoading, isError, error, refetch } = useFraudFlags();

  const { mutate: reviewFlag, isPending: isReviewing } = useReviewFraudFlag();

  const flags = data?.data?.items ?? [];

  const openFlagsCount = flags.filter((f) => f.status === "open").length;
  const criticalFlagsCount = flags.filter(
    (f) => f.severity === "critical",
  ).length;

  const handleReview = (flag: FraudFlag) => {
    setSelectedFlag(flag);
    setNewStatus(flag.status === "open" ? "reviewing" : flag.status);
    setResolutionNote("");
  };

  const handleClose = () => {
    setSelectedFlag(null);
    setResolutionNote("");
  };

  const handleSubmit = () => {
    if (!selectedFlag) return;
    reviewFlag(
      {
        id: selectedFlag.id,
        status: newStatus,
        resolutionNote: resolutionNote || undefined,
      },
      {
        onSuccess: () => {
          toast({ description: "Fraud flag updated." });
          handleClose();
        },
        onError: () => {
          toast({
            description: "Failed to update fraud flag.",
            variant: "destructive",
          });
        },
      },
    );
  };

  const requireNote = newStatus === "resolved" || newStatus === "dismissed";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <AlertTriangle className="size-6 text-[var(--vaykae-pink)]" />
          Fraud Monitoring
        </h1>
        <p className="text-muted-foreground">
          Review and manage fraud flags across the platform
        </p>
      </div>

      {isError ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-8">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <p className="text-sm text-muted-foreground">
            {(error as Error)?.message ?? "Failed to load fraud data"}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-8 w-16" />
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-8 w-16" />
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-8 w-16" />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium">Open Flags</p>
            <p className="text-2xl font-bold">{openFlagsCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium">Critical Flags</p>
            <p className="text-2xl font-bold text-destructive">
              {criticalFlagsCount}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium">Total Flags</p>
            <p className="text-2xl font-bold">{flags.length}</p>
          </div>
        </div>
      )}

      <FraudTable onReview={handleReview} />

      <Dialog open={!!selectedFlag} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Fraud Flag Details</DialogTitle>
            <DialogDescription>
              Review and take action on this fraud flag
            </DialogDescription>
          </DialogHeader>
          {selectedFlag && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <Badge
                    variant={
                      statusVariant[
                        selectedFlag.status
                      ] as BadgeProps["variant"]
                    }
                    className="mt-1 capitalize"
                  >
                    {statusLabels[selectedFlag.status]}
                  </Badge>
                </div>
                <div>
                  <Label>User ID</Label>
                  <p className="text-sm font-mono text-muted-foreground mt-1">
                    {selectedFlag.userId}
                  </p>
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <p className="text-sm mt-1">{selectedFlag.description}</p>
                </div>
                <div>
                  <Label>Created</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(selectedFlag.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select
                  value={newStatus}
                  onValueChange={(v) => setNewStatus(v as FraudFlagStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {requireNote && (
                <div className="space-y-2">
                  <Label htmlFor="resolutionNote">Resolution Note</Label>
                  <Textarea
                    id="resolutionNote"
                    placeholder="Enter resolution details..."
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isReviewing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isReviewing || (requireNote && !resolutionNote.trim())}
            >
              {isReviewing
                ? "Updating..."
                : newStatus === "resolved"
                  ? "Resolve"
                  : newStatus === "dismissed"
                    ? "Dismiss"
                    : "Set to Reviewing"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
