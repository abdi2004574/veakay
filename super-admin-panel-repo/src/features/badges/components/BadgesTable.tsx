import { useMemo, useState } from "react";
import { useBadgesList } from "../hooks/use-badges-queries";
import { useRevokeBadge } from "../hooks/use-badges-mutations";
import type { VerifiedBadge, VerifiedBadgeSubjectType } from "../types";
import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState, ErrorState } from "@/components/shared/DataState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Award, Building2, Search, ShieldCheck, UserRound } from "lucide-react";

type SubjectFilter = "all" | VerifiedBadgeSubjectType;

const subjectLabels: Record<VerifiedBadgeSubjectType, string> = {
  user: "User",
  agency: "Agency",
};

function formatDate(value: string | null | undefined) {
  if (!value) return "Not revoked";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getStatusVariant(revokedAt: string | null) {
  return revokedAt ? "destructive" : "success";
}

function getStatusLabel(revokedAt: string | null) {
  return revokedAt ? "Revoked" : "Active";
}

function getSubjectIcon(subjectType: VerifiedBadgeSubjectType) {
  return subjectType === "user" ? (
    <UserRound className="h-4 w-4" />
  ) : (
    <Building2 className="h-4 w-4" />
  );
}

export default function BadgesTable() {
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>("all");
  const [badgeToRevoke, setBadgeToRevoke] = useState<VerifiedBadge | null>(null);
  const { data, isLoading, isError, error, refetch } = useBadgesList();
  const revokeMutation = useRevokeBadge();
  const badges = data?.data ?? [];

  const filteredBadges = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    return badges.filter((badge) => {
      const matchesSubject =
        subjectFilter === "all" || badge.subjectType === subjectFilter;
      const matchesSearch =
        !searchTerm ||
        badge.subjectId.toLowerCase().includes(searchTerm) ||
        badge.assignedById.toLowerCase().includes(searchTerm) ||
        badge.id.toLowerCase().includes(searchTerm);
      return matchesSubject && matchesSearch;
    });
  }, [badges, search, subjectFilter]);

  const activeCount = badges.filter((badge) => !badge.revokedAt).length;
  const hasFilters = Boolean(search.trim()) || subjectFilter !== "all";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">Badge assignments</h2>
            <Badge variant="outline" className="tabular-nums">
              {badges.length} total
            </Badge>
            <Badge variant="success" className="tabular-nums">
              {activeCount} active
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Review verified users and agencies across the platform.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="badge-search"
              type="search"
              placeholder="Search subject or ID"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
            />
          </div>
          <div className="w-full sm:w-40">
            <label htmlFor="badge-subject-filter" className="sr-only">
              Subject type
            </label>
            <select
              id="badge-subject-filter"
              value={subjectFilter}
              onChange={(event) =>
                setSubjectFilter(event.target.value as SubjectFilter)
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="all">All subjects</option>
              <option value="user">Users</option>
              <option value="agency">Agencies</option>
            </select>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl border border-border bg-card shadow-sm"
        aria-busy={isLoading || revokeMutation.isPending}
      >
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned by</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead>Revoked</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell colSpan={7} className="px-4 py-8">
                  <ErrorState
                    title="Unable to load verified badges"
                    message={error?.message ?? "Please try again."}
                    onRetry={() => void refetch()}
                  />
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-44" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-9 w-28" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredBadges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="px-4 py-8">
                  <EmptyState
                    icon={<Award className="h-6 w-6 text-[var(--vaykae-pink)]" />}
                    title={hasFilters ? "No matching badges" : "No verified badges"}
                    description={
                      hasFilters
                        ? "Try changing your search or subject filter."
                        : "Assign a verified badge to a trusted user or agency."
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredBadges.map((badge) => {
                const statusVariant = getStatusVariant(
                  badge.revokedAt,
                ) as BadgeProps["variant"];
                return (
                  <TableRow
                    key={badge.id}
                    className="border-t border-border hover:bg-muted/30"
                  >
                    <TableCell className="px-4 py-3 font-medium">
                      <div className="flex min-w-0 items-center gap-2">
                        {getSubjectIcon(badge.subjectType)}
                        <span className="truncate font-mono text-xs">
                          {badge.subjectId}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant="outline" className="capitalize">
                        {subjectLabels[badge.subjectType]}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant={statusVariant} className="capitalize">
                        <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                        {getStatusLabel(badge.revokedAt)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      <span className="truncate font-mono text-xs" title={badge.assignedById}>
                        {badge.assignedById}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(badge.assignedAt)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(badge.revokedAt)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      {badge.revokedAt ? (
                        <Button type="button" variant="ghost" size="sm" disabled>
                          Revoked
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={revokeMutation.isPending}
                          onClick={() => setBadgeToRevoke(badge)}
                          aria-label={`Revoke badge for ${badge.subjectId}`}
                        >
                          Revoke
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        title="Revoke this verified badge?"
        description={
          badgeToRevoke
            ? `The badge for ${badgeToRevoke.subjectId} will no longer be active.`
            : undefined
        }
        confirmLabel="Revoke badge"
        cancelLabel="Cancel"
        confirmVariant="destructive"
        open={Boolean(badgeToRevoke)}
        onOpenChange={(open) => {
          if (!open) setBadgeToRevoke(null);
        }}
        onConfirm={() => {
          if (!badgeToRevoke) return;
          revokeMutation.mutate(badgeToRevoke.id, {
            onSuccess: () => setBadgeToRevoke(null),
          });
        }}
        isPending={revokeMutation.isPending}
      />
    </div>
  );
}