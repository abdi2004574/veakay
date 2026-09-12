import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReports, resolveReport } from "../api/content";
import { Table } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import StatusBadge from "../../../components/shared/StatusBadge";
import { useState } from "react";
import { Check, X } from "lucide-react";
import type { ContentReport } from "../types";

export default function ModerationQueue() {
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["reports", statusFilter],
    queryFn: () => getReports(statusFilter ? { status: statusFilter as "pending" | "reviewed" | "actioned" | "dismissed" } : undefined),
  });

  const resolve = useMutation({
    mutationFn: ({ id, action, note }: { id: string; action: "dismissed" | "actioned"; note?: string }) =>
      resolveReport(id, action, note),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reports"] }),
  });

  const reports = (data?.data.data ?? []) as ContentReport[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Moderation</h1>
          <p className="text-muted-foreground">Review and act on reported content</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="actioned">Actioned</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>
      <div className="rounded-md border border-border">
        <Table>
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Target ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Reason</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Reported</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : reports.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No reports found</td></tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm">
                    <Badge variant="outline" className="capitalize">{report.targetType}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono">{report.targetId.slice(0, 8)}...</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{report.reason}</td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {report.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => resolve.mutate({ id: report.id, action: "dismissed" })}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => {
                            const note = prompt("Action note (e.g., removed content):") || undefined;
                            resolve.mutate({ id: report.id, action: "actioned", note });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}