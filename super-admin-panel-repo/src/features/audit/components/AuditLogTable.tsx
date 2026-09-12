import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "../api/audit";
import { Table } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Skeleton } from "../../../components/ui/skeleton";
import { useState } from "react";
import type { AuditLogEntry } from "../types";

export default function AuditLogTable() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["audit", "logs", search],
    queryFn: () => getAuditLogs({ limit: 20 }),
  });

  const logs = (data?.data.data ?? []) as AuditLogEntry[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">Immutable record of all admin actions</p>
        </div>
        <Input
          placeholder="Filter logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border border-border">
        <Table>
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actor</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Target</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="px-4 py-8"><Skeleton className="h-4 w-full" /></td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No audit logs found</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-medium">
                    <Badge variant="secondary" className="font-mono text-xs">{log.action}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {log.actorUser?.displayName ?? "system"}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {log.targetType ?? "�"}
                    {log.targetId ? ` (${log.targetId.slice(0, 8)}...)` : ""}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString()}
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