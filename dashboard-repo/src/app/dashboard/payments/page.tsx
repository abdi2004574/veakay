"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState, ErrorState, EmptyState } from "@/components/data-display";
import { useWithdrawalsList } from "@/hooks/api/useWalletApi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import type { WithdrawalRequest } from "@/types";

export default function PaymentsPage() {
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useWithdrawalsList();

  const withdrawals = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments & Withdrawals</h1>
        <p className="text-muted-foreground">Review transactions and payouts</p>
      </div>

      <Card className="border-destructive/30 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            Funding Rail Pending Provider Decision
          </CardTitle>
          <CardDescription>
            The funding rail (Stripe Connect) has not been finalized. Money-moving
            mutations — approving withdrawals, marking payouts as paid, crediting
            wallets, and refunding — are disabled until a funding provider is
            confirmed. See open question #28 in the TRD.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Read-only withdrawal data below is displayed for visibility. Action
            buttons are disabled pending the provider decision.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Requests</CardTitle>
          <CardDescription>
            {withdrawals.length} withdrawal requests loaded (read-only)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isError && <ErrorState error={error} onRetry={() => refetch()} />}
          {isLoading && <LoadingState message="Loading withdrawals..." />}
          {!isLoading && !isError && withdrawals.length === 0 && (
            <EmptyState title="No withdrawal requests" description="No withdrawal requests found." />
          )}
          {!isLoading && !isError && withdrawals.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals.map((w) => (
                    <WithdrawalRow key={w.id} withdrawal={w} />
                  ))}
                </TableBody>
              </Table>
              {hasNextPage && (
                <div className="border-t pt-4 flex justify-center">
                  <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
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

function WithdrawalRow({ withdrawal }: { withdrawal: WithdrawalRequest }) {
  const statusVariant = {
    requested: "pending",
    approved: "warning",
    rejected: "destructive",
    paid: "success",
  } as const;

  return (
    <TableRow>
      <TableCell>
        <div>
          <p className="font-medium">{withdrawal.user?.email ?? "—"}</p>
          <p className="text-sm text-muted-foreground">{withdrawal.user?.username}</p>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm font-medium">
          {formatCurrency(withdrawal.amount, withdrawal.currency)}
        </span>
      </TableCell>
      <TableCell>
        <Badge variant={statusVariant[withdrawal.status as keyof typeof statusVariant] ?? "outline"}>
          {withdrawal.status}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="text-sm text-muted-foreground">{formatDate(withdrawal.createdAt)}</span>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="outline" size="sm" disabled>
          Review
        </Button>
      </TableCell>
    </TableRow>
  );
}

