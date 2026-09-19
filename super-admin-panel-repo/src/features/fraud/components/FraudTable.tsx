import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, MoreHorizontal, User } from "lucide-react";
import type { BadgeProps } from "@/components/ui/badge";
import type { FraudFlag } from "../types";
import { getFraudFlags } from "../api/fraud";
import { FRAUD_FLAGS_QUERY_KEY } from "../hooks/use-fraud-queries";

const severityVariant: Record<string, BadgeProps["variant"]> = {
  low: "secondary",
  medium: "warning",
  high: "destructive",
  critical: "destructive",
};

const statusVariant: Record<string, BadgeProps["variant"]> = {
  open: "destructive",
  reviewing: "warning",
  resolved: "success",
  dismissed: "outline",
};

const typeLabels: Record<string, string> = {
  frequent_profile_changes: "Frequent Profile Changes",
  payment_method_mismatch: "Payment Method Mismatch",
  withdrawal_anomaly: "Withdrawal Anomaly",
  personal_info_mismatch: "Personal Info Mismatch",
};

interface FraudTableProps {
  onReview: (flag: FraudFlag) => void;
}

export default function FraudTable({ onReview }: FraudTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const [severityFilter, setSeverityFilter] = useState<string | undefined>(
    undefined,
  );
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [
      FRAUD_FLAGS_QUERY_KEY,
      {
        status: statusFilter,
        severity: severityFilter,
        type: typeFilter,
        search,
      },
    ],
    queryFn: () =>
      getFraudFlags({
        status: statusFilter as FraudFlag["status"],
        severity: severityFilter as FraudFlag["severity"],
        type: typeFilter as FraudFlag["type"],
        search: search || undefined,
        cursor: undefined,
        limit: 20,
      }),
    placeholderData: (prev) => prev,
  });

  const flags = data?.data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search flags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm rounded-2xl bg-[var(--input-background)]"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={statusFilter ?? ""}
          onValueChange={(v) =>
            setStatusFilter(v === "" ? undefined : (v as FraudFlag["status"]))
          }
        >
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
        <Select
          value={severityFilter ?? ""}
          onValueChange={(v) =>
            setSeverityFilter(
              v === "" ? undefined : (v as FraudFlag["severity"]),
            )
          }
        >
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
        <Select
          value={typeFilter ?? ""}
          onValueChange={(v) =>
            setTypeFilter(v === "" ? undefined : (v as FraudFlag["type"]))
          }
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="frequent_profile_changes">
              Frequent Profile Changes
            </SelectItem>
            <SelectItem value="payment_method_mismatch">
              Payment Method Mismatch
            </SelectItem>
            <SelectItem value="withdrawal_anomaly">
              Withdrawal Anomaly
            </SelectItem>
            <SelectItem value="personal_info_mismatch">
              Personal Info Mismatch
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                User
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Type
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Severity
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Status
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Description
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Created
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-sm font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="px-4 py-8">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                    <p className="text-sm text-muted-foreground">
                      {(error as Error)?.message ??
                        "Failed to load fraud flags"}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetch()}
                    >
                      Retry
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : flags.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No fraud flags found
                </TableCell>
              </TableRow>
            ) : (
              flags.map((flag) => (
                <TableRow
                  key={flag.id}
                  className="border-t border-border hover:bg-muted/30"
                >
                  <TableCell className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-xs">{flag.userId}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    <Badge variant="secondary">
                      {typeLabels[flag.type] ?? flag.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    <Badge variant={severityVariant[flag.severity]}>
                      {flag.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    <Badge variant={statusVariant[flag.status]}>
                      {flag.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground truncate max-w-xs">
                    {flag.description}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(flag.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReview(flag)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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
