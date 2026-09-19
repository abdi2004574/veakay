import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReports, resolveReport } from "../api/content";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusBadge from "@/components/shared/StatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Check, X } from "lucide-react";
import type { ContentReport } from "../types";

export default function ModerationQueue() {
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionReportId, setActionReportId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"dismissed" | "actioned">(
    "actioned",
  );
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["reports", statusFilter],
    queryFn: () =>
      getReports(
        statusFilter
          ? {
              status: statusFilter as
                "pending" | "reviewed" | "actioned" | "dismissed",
            }
          : undefined,
      ),
  });

  const resolve = useMutation({
    mutationFn: ({
      id,
      action,
      note,
    }: {
      id: string;
      action: "dismissed" | "actioned";
      note?: string;
    }) => resolveReport(id, action, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reports"] });
      toast({
        title: "Report updated",
        description: "The report has been resolved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update report.",
        variant: "destructive",
      });
    },
  });

  const reports = (data?.data.items ?? []) as ContentReport[];

  const handleActionClick = (
    reportId: string,
    type: "dismissed" | "actioned",
  ) => {
    if (type === "dismissed") {
      resolve.mutate({ id: reportId, action: "dismissed" });
    } else {
      setActionReportId(reportId);
      setActionType("actioned");
      setActionDialogOpen(true);
    }
  };

  const handleConfirmAction = (note?: string) => {
    if (actionReportId) {
      resolve.mutate({ id: actionReportId, action: actionType, note });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Content Moderation
          </h1>
          <p className="text-muted-foreground">
            Review and act on reported content
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px] rounded-2xl border border-border bg-[var(--input-background)] px-3 py-2 text-sm">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="actioned">Actioned</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Type
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Target ID
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Reason
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Status
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Reported
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow
                  key={report.id}
                  className="border-t border-border hover:bg-muted/30"
                >
                  <TableCell className="px-4 py-3 text-sm">
                    <Badge variant="outline" className="capitalize">
                      {report.targetType}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-mono">
                    {report.targetId.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                    {report.reason}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    <StatusBadge status={report.status} />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    {report.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                          onClick={() =>
                            handleActionClick(report.id, "dismissed")
                          }
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-rose-500 text-rose-600 hover:bg-rose-50"
                          onClick={() =>
                            handleActionClick(report.id, "actioned")
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        title="Action Report"
        messageLabel="Resolution note"
        messagePlaceholder="e.g., removed content"
        confirmLabel="Action"
        cancelLabel="Dismiss"
        confirmVariant="destructive"
        open={actionDialogOpen}
        onOpenChange={setActionDialogOpen}
        onConfirm={handleConfirmAction}
        isPending={resolve.isPending}
      />
    </div>
  );
}
