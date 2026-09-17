import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock3,
  Wallet,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import StatusBadge from "@/components/shared/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import type { WithdrawalStatus } from "@/types/common";
import { getPaymentStats, getWithdrawals, reviewWithdrawal } from "../api/payments";
import type {
  AdminWithdrawal,
  PaymentStats,
} from "../types";

type ReviewInput = {
  id: string;
  decision: "approved" | "rejected";
  reason?: string;
};

function formatWithdrawalAmount(amount: string, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(amount));
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="rounded-lg bg-muted p-2 text-muted-foreground">
          {icon}
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function PaymentStatsDisplay() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["payment-stats"],
    queryFn: getPaymentStats,
  });

  if (isLoading) {
    return (
      <div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Loading payment statistics"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="border-destructive/40">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Payment statistics unavailable</AlertTitle>
        <AlertDescription className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
          <span>
            {error instanceof Error
              ? error.message
              : "Failed to load payment statistics."}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit border-current"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const stats = data?.data;
  if (!stats) {
    return (
      <Alert variant="warning" className="border-warning/40">
        <Clock3 className="h-4 w-4" />
        <AlertTitle>No payment statistics available</AlertTitle>
        <AlertDescription>
          Payment statistics could not be loaded at this time.
        </AlertDescription>
      </Alert>
    );
  }

  return <PaymentStatsGrid stats={stats} />;
}

function PaymentStatsGrid({ stats }: { stats: PaymentStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-live="polite">
      <StatCard
        label="Total withdrawn"
        value={formatCurrency(stats.totalWithdrawn)}
        icon={<Wallet className="h-4 w-4" />}
      />
      <StatCard
        label="Pending review"
        value={stats.pendingReview.toString()}
        icon={<Clock3 className="h-4 w-4" />}
      />
      <StatCard
        label="Approved"
        value={stats.approved.toString()}
        icon={<CheckCircle2 className="h-4 w-4" />}
      />
      <StatCard
        label="Rejected"
        value={stats.rejected.toString()}
        icon={<AlertCircle className="h-4 w-4" />}
      />
    </div>
  );
}

export default function PaymentsTable() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectWithdrawalId, setRejectWithdrawalId] = useState<string | null>(
    null,
  );
  const qc = useQueryClient();
  const { toast } = useToast();

  const {
    data: withdrawalsResponse,
    isLoading: withdrawalsLoading,
    isError: withdrawalsError,
    error: withdrawalsErrorValue,
    refetch: refetchWithdrawals,
  } = useQuery({
    queryKey: ["withdrawals", statusFilter],
    queryFn: () =>
      getWithdrawals(
        statusFilter
          ? {
              status: statusFilter as WithdrawalStatus,
            }
          : undefined,
      ),
  });

  const review = useMutation({
    mutationFn: ({ id, decision, reason }: ReviewInput) =>
      reviewWithdrawal(id, decision, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["withdrawals"] });
      qc.invalidateQueries({ queryKey: ["payment-stats"] });
      toast({
        title: "Withdrawal updated",
        description: "The withdrawal has been processed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update withdrawal.",
        variant: "destructive",
      });
    },
  });

  const withdrawals = withdrawalsResponse?.data.items ?? [];
  const withdrawalsErrorMessage =
    withdrawalsErrorValue instanceof Error
      ? withdrawalsErrorValue.message
      : "Failed to load withdrawals.";

  const openRejectDialog = (id: string) => {
    setRejectWithdrawalId(id);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = (reason?: string) => {
    if (rejectWithdrawalId) {
      review.mutate({ id: rejectWithdrawalId, decision: "rejected", reason });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Withdrawals</h1>
          <p className="text-muted-foreground">
            Review and process withdrawal requests
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-2xl border border-border bg-[var(--input-background)] px-3 py-2 text-sm"
          aria-label="Filter withdrawals by status"
        >
          <option value="">All Statuses</option>
          <option value="requested">Requested</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <PaymentStatsDisplay />

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                User
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Amount
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Status
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Requested
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawalsLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Loading withdrawals...
                </TableCell>
              </TableRow>
            ) : withdrawalsError ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-8">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                    <p className="text-sm font-medium">
                      Failed to load withdrawals
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {withdrawalsErrorMessage}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => refetchWithdrawals()}
                    >
                      Retry
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : withdrawals.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No withdrawals found
                </TableCell>
              </TableRow>
            ) : (
              withdrawals.map((withdrawal: AdminWithdrawal) => (
                <TableRow
                  key={withdrawal.id}
                  className="border-t border-border hover:bg-muted/30"
                >
                  <TableCell className="px-4 py-3 text-sm font-medium">
                    {withdrawal.user?.username ??
                      withdrawal.user?.email ??
                      "Unknown user"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    {formatWithdrawalAmount(
                      withdrawal.amount,
                      withdrawal.currency,
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    <StatusBadge status={withdrawal.status} />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(withdrawal.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    {withdrawal.status === "requested" && (
                      <div className="flex gap-2">
                        <GradientButton
                          size="sm"
                          variant="primary"
                          onClick={() =>
                            review.mutate({
                              id: withdrawal.id,
                              decision: "approved",
                            })
                          }
                        >
                          <Check className="h-4 w-4" />
                        </GradientButton>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => openRejectDialog(withdrawal.id)}
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
        title="Reject Withdrawal"
        messageLabel="Reason (optional)"
        confirmVariant="destructive"
        confirmLabel="Reject"
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        onConfirm={handleRejectConfirm}
        isPending={review.isPending}
      />
    </div>
  );
}
