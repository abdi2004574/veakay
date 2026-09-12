"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingState, ErrorState, EmptyState } from "@/components/data-display";
import { useReportsList, useReviewReport } from "@/hooks/api/useReportsApi";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { ContentReport } from "@/types";
import { Shield } from "lucide-react";

const statusLabels: Record<string, string> = {
  pending: "Pending",
  reviewing: "Reviewing",
  resolved: "Resolved",
  dismissed: "Dismissed",
  flagged: "Flagged",
  rejected: "Rejected",
};

export default function ModerationPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [targetTypeFilter, setTargetTypeFilter] = useState<string | undefined>();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useReportsList({
    status: statusFilter,
    targetType: targetTypeFilter,
  });

  const { mutate: reviewReport, isPending: isReviewing } = useReviewReport();

  const reports = data?.pages.flatMap((page) => page.items) ?? [];

  const handleReview = (report: ContentReport, status: string, note?: string) => {
    reviewReport({ id: report.id, dto: { status: status as ContentReport["status"], resolutionNote: note } });
    toast.success(`Report ${status === "resolved" ? "resolved" : status === "dismissed" ? "dismissed" : "updated"}.`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Moderation Queue</h1>
        <p className="text-muted-foreground">User reports and content moderation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>
            {reports.length} reports in queue
          </CardDescription>
          <div className="flex items-center gap-3 pt-2">
            <Select value={statusFilter ?? ""} onValueChange={(v) => setStatusFilter(v || undefined)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={targetTypeFilter ?? ""} onValueChange={(v) => setTargetTypeFilter(v || undefined)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="post">Post</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="chat_message">Chat Message</SelectItem>
                <SelectItem value="campaign_media">Campaign Media</SelectItem>
                <SelectItem value="agency_document">Agency Document</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isError && <ErrorState error={error} onRetry={() => refetch()} />}
          {isLoading && <LoadingState message="Loading reports..." />}
          {!isLoading && !isError && reports.length === 0 && (
            <EmptyState title="No reports found" description="All reports have been reviewed." />
          )}
          {!isLoading && !isError && reports.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Target</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reported</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="size-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{report.targetType}</p>
                            <p className="text-xs text-muted-foreground">{report.targetId}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm max-w-xs">{report.reason}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{statusLabels[report.status] || report.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{formatDate(report.createdAt)}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {report.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isReviewing}
                                onClick={() => handleReview(report, "dismissed")}
                              >
                                Dismiss
                              </Button>
                              <Button
                                variant="gradient"
                                size="sm"
                                disabled={isReviewing}
                                onClick={() => handleReview(report, "resolved", "Content verified.")}
                              >
                                Resolve
                              </Button>
                            </>
                          )}
                          {report.status !== "pending" && (
                            <Badge variant={report.status === "resolved" ? "success" : "outline"}>
                              {statusLabels[report.status] || report.status}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
    </div>
  );
}
