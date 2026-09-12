"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingState, ErrorState, EmptyState } from "@/components/data-display";
import {
  useFraudFlagsList,
  useUpdateFraudFlag,
} from "@/hooks/api/useFraudApi";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { FraudFlag, FraudFlagStatus, FraudFlagSeverity } from "@/types";
import {
  AlertTriangle,
  XCircle,
  DollarSign,
  MoreVertical,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const statusLabels: Record<FraudFlagStatus, string> = {
  open: "Open",
  reviewing: "Reviewing",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

const severityLabels: Record<FraudFlagSeverity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const typeLabels: Record<string, string> = {
  frequent_profile_changes: "Frequent Profile Changes",
  payment_method_mismatch: "Payment Method Mismatch",
  withdrawal_anomaly: "Withdrawal Anomaly",
  personal_info_mismatch: "Personal Info Mismatch",
};

const severityVariants: Record<FraudFlagSeverity, "default" | "pending" | "warning" | "destructive"> = {
  low: "default",
  medium: "pending",
  high: "warning",
  critical: "destructive",
};

const statusVariants: Record<FraudFlagStatus, "default" | "pending" | "warning" | "success" | "outline"> = {
  open: "default",
  reviewing: "pending",
  resolved: "success",
  dismissed: "outline",
};

export default function FraudPage() {
  const [statusFilter, setStatusFilter] = useState<FraudFlagStatus | undefined>();
  const [severityFilter, setSeverityFilter] = useState<FraudFlagSeverity | undefined>();
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [selectedFlag, setSelectedFlag] = useState<FraudFlag | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [newStatus, setNewStatus] = useState<FraudFlagStatus>("reviewing");

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useFraudFlagsList({
    status: statusFilter,
    severity: severityFilter,
    type: typeFilter,
  });

  const { mutate: updateFraudFlag, isPending: isUpdating } = useUpdateFraudFlag();

  const flags = data?.pages.flatMap((page) => page.items) ?? [];

  const openFlagsCount = flags.filter((f) => f.status === "open").length;
  const criticalFlagsCount = flags.filter((f) => f.severity === "critical").length;
  const highValueTxnsCount = flags.filter((f) => f.type === "withdrawal_anomaly" && f.severity === "high").length;

  const handleStatusUpdate = (flag: FraudFlag, status: FraudFlagStatus, note?: string) => {
    updateFraudFlag(
      { id: flag.id, dto: { status, resolutionNote: note } },
      {
        onSuccess: () => {
          toast.success(
            status === "resolved"
              ? "Flag resolved."
              : status === "dismissed"
              ? "Flag dismissed."
              : "Flag updated."
          );
          setSelectedFlag(null);
          setResolutionNote("");
        },
        onError: (err) => {
          toast.error(err.message ?? "Failed to update flag status");
        },
      }
    );
  };

  const handleOpenDetail = (flag: FraudFlag) => {
    setSelectedFlag(flag);
    setNewStatus(flag.status === "open" ? "reviewing" : flag.status);
    setResolutionNote("");
  };

  const handleDetailAction = () => {
    if (!selectedFlag) return;
    handleStatusUpdate(selectedFlag, newStatus, resolutionNote);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <AlertTriangle className="size-6 text-vaykae-pink" />
          Fraud Monitoring
        </h1>
        <p className="text-muted-foreground">Review and manage fraud flags across the platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Flags</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openFlagsCount}</div>
            <p className="text-xs text-muted-foreground">Flags requiring review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Flags</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalFlagsCount}</div>
            <p className="text-xs text-muted-foreground">Highest severity flags</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High-Value Txns</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highValueTxnsCount}</div>
            <p className="text-xs text-muted-foreground">Withdrawal anomalies (placeholder)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fraud Flags</CardTitle>
          <CardDescription>
            {flags.length} flags{hasNextPage ? ` (${flags.length} loaded)` : ""}
          </CardDescription>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Select value={statusFilter ?? ""} onValueChange={(v) => setStatusFilter(v === "" ? undefined : v as FraudFlagStatus)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter ?? ""} onValueChange={(v) => setSeverityFilter(v === "" ? undefined : v as FraudFlagSeverity)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Severity</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter ?? ""} onValueChange={(v) => setTypeFilter(v === "" ? undefined : v)}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="frequent_profile_changes">Frequent Profile Changes</SelectItem>
                <SelectItem value="payment_method_mismatch">Payment Method Mismatch</SelectItem>
                <SelectItem value="withdrawal_anomaly">Withdrawal Anomaly</SelectItem>
                <SelectItem value="personal_info_mismatch">Personal Info Mismatch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isError && <ErrorState error={error} onRetry={() => refetch()} />}
          {isLoading && <LoadingState message="Loading fraud flags..." />}
          {!isLoading && !isError && flags.length === 0 && (
            <EmptyState title="No fraud flags found" description="All flags have been reviewed." />
          )}
          {!isLoading && !isError && flags.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flags.map((flag) => (
                      <TableRow
                        key={flag.id}
                        className="cursor-pointer hover:bg-accent/50"
                        onClick={() => handleOpenDetail(flag)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="size-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{flag.userId}</p>
                              <p className="text-xs text-muted-foreground">{flag.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{typeLabels[flag.type] || flag.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={severityVariants[flag.severity]}>
                            {severityLabels[flag.severity]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariants[flag.status]}>
                            {statusLabels[flag.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm max-w-xs line-clamp-1">{flag.description}</p>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{formatDate(flag.createdAt)}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(flag);
                            }}
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {hasNextPage && (
                <div className="border-t pt-4 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading more..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedFlag} onOpenChange={(open) => !open && setSelectedFlag(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Fraud Flag Details</DialogTitle>
            <DialogDescription>
              Review and take action on this fraud flag
            </DialogDescription>
          </DialogHeader>
          {selectedFlag && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Badge variant="secondary" className="mt-1">
                    {typeLabels[selectedFlag.type] || selectedFlag.type}
                  </Badge>
                </div>
                <div>
                  <Label>Severity</Label>
                  <Badge variant={severityVariants[selectedFlag.severity]} className="mt-1">
                    {severityLabels[selectedFlag.severity]}
                  </Badge>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant={statusVariants[selectedFlag.status]} className="mt-1">
                    {statusLabels[selectedFlag.status]}
                  </Badge>
                </div>
                <div>
                  <Label>Created</Label>
                  <p className="text-sm text-muted-foreground mt-1">{formatDate(selectedFlag.createdAt)}</p>
                </div>
                <div className="col-span-2">
                  <Label>User ID</Label>
                  <p className="text-sm font-mono text-muted-foreground mt-1">{selectedFlag.userId}</p>
                </div>
                <div className="col-span-2">
                  <Label>Description</Label>
                  <p className="text-sm mt-1">{selectedFlag.description}</p>
                </div>
                {selectedFlag.metadata && Object.keys(selectedFlag.metadata).length > 0 && (
                  <div className="col-span-2">
                    <Label>Metadata</Label>
                    <pre className="text-xs bg-muted p-3 rounded mt-1 overflow-auto max-h-40">
                      {JSON.stringify(selectedFlag.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
              <Separator />
              <div>
                <Label>Update Status</Label>
                <div className="mt-1">
                  <Select value={newStatus} onValueChange={(v) => setNewStatus(v as FraudFlagStatus)}>
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
              </div>
              {(newStatus === "resolved" || newStatus === "dismissed") && (
                <div>
                  <Label htmlFor="resolutionNote">Resolution Note</Label>
                  <Textarea
                    id="resolutionNote"
                    placeholder="Enter resolution details..."
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedFlag(null)} disabled={isUpdating}>
                  Cancel
                </Button>
                <Button
                  variant={newStatus === "resolved" ? "gradient" : newStatus === "dismissed" ? "outline" : "default"}
                  onClick={handleDetailAction}
                  disabled={isUpdating || ((newStatus === "resolved" || newStatus === "dismissed") && !resolutionNote.trim())}
                >
                  {isUpdating
                    ? "Updating..."
                    : newStatus === "resolved"
                    ? "Resolve"
                    : newStatus === "dismissed"
                    ? "Dismiss"
                    : "Set to Reviewing"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
