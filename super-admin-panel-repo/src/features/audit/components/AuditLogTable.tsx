import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "../api/audit";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import type { AuditLogEntry } from "../types";

export default function AuditLogTable() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["audit", "logs", search],
    queryFn: () => getAuditLogs({ search, limit: 20 }),
  });

  const logs = (data?.data.items ?? []) as AuditLogEntry[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            Immutable record of all admin actions
          </p>
        </div>
        <Input
          placeholder="Filter logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm rounded-2xl border border-border bg-[var(--input-background)]"
        />
      </div>
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Action
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Actor
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Target
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Timestamp
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="px-4 py-8 text-center text-destructive"
                >
                  {(error as Error)?.message ?? "Failed to load audit logs"}
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="px-4 py-8">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No audit logs found
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow
                  key={log.id}
                  className="border-t border-border hover:bg-muted/30"
                >
                  <TableCell className="px-4 py-3 text-sm font-medium">
                    <Badge
                      variant="outline"
                      className="font-mono text-xs bg-[var(--vaykae-gradient-light)] text-[var(--vaykae-pink)] border-[var(--vaykae-pink)]/20"
                    >
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                    {log.actorUser?.displayName ?? "system"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                    {log.targetType ?? "N/A"}
                    {log.targetId ? ` (${log.targetId.slice(0, 8)}...)` : ""}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
