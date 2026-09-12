"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingState, ErrorState, EmptyState } from "@/components/data-display";
import { useAuditLog } from "@/hooks/api/useAuditLogApi";
import { formatDateTime } from "@/lib/utils";

export default function AuditLogPage() {
  const [actionFilter, setActionFilter] = useState("");
  const [targetTypeFilter, setTargetTypeFilter] = useState("");

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useAuditLog({
    action: actionFilter || undefined,
    targetType: targetTypeFilter || undefined,
  });

  const entries = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
        <p className="text-muted-foreground">Platform audit trail</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Entries</CardTitle>
          <CardDescription>
            {entries.length} entries recorded
          </CardDescription>
          <div className="flex items-center gap-3 pt-2">
            <Input
              placeholder="Filter by action..."
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="max-w-sm"
            />
            <Input
              placeholder="Filter by target type..."
              value={targetTypeFilter}
              onChange={(e) => setTargetTypeFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isError && <ErrorState error={error} onRetry={() => refetch()} />}
          {isLoading && <LoadingState message="Loading audit log..." />}
          {!isLoading && !isError && entries.length === 0 && (
            <EmptyState title="No audit entries" description="No entries match your filters." />
          )}
          {!isLoading && !isError && entries.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <code className="text-xs">{entry.action}</code>
                      </TableCell>
                      <TableCell>
                        {entry.targetType ? (
                          <div>
                            <p className="text-sm font-medium">{entry.targetType}</p>
                            {entry.targetId && <p className="text-xs text-muted-foreground">{entry.targetId}</p>}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">â€”</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs">{entry.actorId}</code>
                      </TableCell>
                      <TableCell>
                        {entry.metadata ? (
                          <pre className="text-xs text-muted-foreground max-w-xs truncate">
                            {JSON.stringify(entry.metadata)}
                          </pre>
                        ) : (
                          <span className="text-sm text-muted-foreground">â€”</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{formatDateTime(entry.createdAt)}</span>
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

