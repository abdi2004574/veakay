import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmptyState, ErrorState } from "@/components/shared/DataState";
import { Skeleton } from "@/components/ui/skeleton";
import { useInvitesQuery } from "../hooks/use-invites-queries";
import { useRevokeInviteMutation } from "../hooks/use-invites-mutations";
import type { AdminInvite, AdminInviteStatus } from "../types";

type StatusFilter = "all" | AdminInviteStatus;

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(date);
}

function getStatusVariant(status: AdminInviteStatus) {
  switch (status) {
    case "pending":
      return "warning";
    case "accepted":
      return "success";
    case "revoked":
      return "destructive";
    case "expired":
      return "secondary";
    default:
      return "outline";
  }
}

export default function InvitesTable() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [inviteToRevoke, setInviteToRevoke] = useState<AdminInvite | null>(
    null,
  );
  const { data, isLoading, isError, error, refetch } = useInvitesQuery();
  const revokeMutation = useRevokeInviteMutation();
  const invites = data?.data ?? [];

  const filteredInvites = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    return invites.filter((invite) => {
      const matchesStatus =
        statusFilter === "all" || invite.status === statusFilter;
      const matchesSearch =
        !searchTerm ||
        invite.email.toLowerCase().includes(searchTerm) ||
        invite.id.toLowerCase().includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
  }, [invites, search, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Invitations</h2>
          <p className="text-sm text-muted-foreground">
            {invites.length} total{" "}
            {statusFilter !== "all" && `· ${statusFilter}`}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="space-y-2">
            <Label htmlFor="invite-search">Search invites</Label>
            <Input
              id="invite-search"
              type="search"
              placeholder="Email or invite ID"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="sm:w-64"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-status">Status</Label>
            <select
              id="invite-status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-40"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="revoked">Revoked</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl border border-border bg-card shadow-sm"
        aria-busy={isLoading}
      >
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-8">
                  <ErrorState
                    title="Unable to load invites"
                    message={error?.message ?? "Please try again."}
                    onRetry={() => void refetch()}
                  />
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-52" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-9 w-24" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredInvites.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-8">
                  <EmptyState
                    title={
                      search || statusFilter !== "all"
                        ? "No matching invites"
                        : "No invitations yet"
                    }
                    description={
                      search || statusFilter !== "all"
                        ? "Try changing your search or status filter."
                        : "Invite a super admin to get started."
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredInvites.map((invite) => (
                <TableRow
                  key={invite.id}
                  className="border-t border-border hover:bg-muted/30"
                >
                  <TableCell className="px-4 py-3 font-medium">
                    {invite.email}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      variant={getStatusVariant(invite.status)}
                      className="capitalize"
                    >
                      {invite.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {formatDate(invite.expiresAt)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {formatDate(invite.createdAt)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={invite.status !== "pending"}
                      onClick={() => setInviteToRevoke(invite)}
                      aria-label={`Revoke invite for ${invite.email}`}
                    >
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={Boolean(inviteToRevoke)}
        onOpenChange={(open) => {
          if (!open && !revokeMutation.isPending) {
            setInviteToRevoke(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke this invite?</AlertDialogTitle>
            <AlertDialogDescription>
              {inviteToRevoke?.email} will no longer be able to accept this
              invitation. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revokeMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              confirmVariant="destructive"
              disabled={!inviteToRevoke || revokeMutation.isPending}
              onClick={() => {
                if (!inviteToRevoke) return;
                revokeMutation.mutate(inviteToRevoke.id, {
                  onSuccess: () => setInviteToRevoke(null),
                });
              }}
            >
              {revokeMutation.isPending ? "Revoking..." : "Revoke invite"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
