"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingState, ErrorState, EmptyState } from "@/components/data-display";
import { useBadgesList, useAssignBadge, useRevokeBadge } from "@/hooks/api/useBadgesApi";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { VerifiedBadge, AssignBadgeRequest } from "@/types";
import { Plus, User, Building2 } from "lucide-react";

export default function BadgesPage() {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [subjectType, setSubjectType] = useState<"user" | "agency">("user");
  const [subjectId, setSubjectId] = useState("");

  const { data: badges, isLoading, isError, error, refetch } = useBadgesList();
  const { mutate: assignBadge, isPending: isAssigning } = useAssignBadge();
  const { mutate: revokeBadge, isPending: isRevoking } = useRevokeBadge();

  const activeBadges = badges?.filter((b) => b.revokedAt === null) ?? [];
  const revokedBadges = badges?.filter((b) => b.revokedAt !== null) ?? [];

  const handleAssign = () => {
    if (!subjectId.trim()) return;
    const dto: AssignBadgeRequest = {
      subjectType: subjectType as "user" | "agency",
      subjectId,
    };
    assignBadge(dto);
    toast.success("Verified badge assigned.");
    setSubjectId("");
    setAssignDialogOpen(false);
  };

  const handleRevoke = (badge: VerifiedBadge) => {
    revokeBadge(badge.id);
    toast.success("Verified badge revoked.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Badge Management</h1>
          <p className="text-muted-foreground">Manage verified badges</p>
        </div>
        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" size="sm">
              <Plus className="size-4 mr-2" />
              Assign Badge
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Verified Badge</DialogTitle>
              <DialogDescription>
                Assign a verified badge to a user or agency.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Subject Type</Label>
                <Select value={subjectType} onValueChange={(v) => setSubjectType(v as "user" | "agency")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subjectId">Subject ID</Label>
                <Input
                  id="subjectId"
                  placeholder="Enter user or agency UUID"
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="gradient"
                size="sm"
                disabled={!subjectId.trim() || isAssigning}
                onClick={handleAssign}
              >
                {isAssigning ? "Assigning..." : "Assign Badge"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Badges</CardTitle>
          <CardDescription>
            {activeBadges.length} active, {revokedBadges.length} revoked
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <LoadingState message="Loading badges..." />}
          {isError && <ErrorState error={error} onRetry={() => refetch()} />}
          {!isLoading && !isError && !badges && (
            <EmptyState title="No badges found" description="No verified badges have been assigned yet." />
          )}
          {!isLoading && !isError && badges && badges.length === 0 && (
            <EmptyState title="No badges found" description="No verified badges have been assigned yet." />
          )}
          {!isLoading && !isError && badges && badges.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Revoked</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {badges.map((badge) => (
                  <TableRow key={badge.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {badge.subjectType === "user" ? (
                          <User className="size-4 text-muted-foreground" />
                        ) : (
                          <Building2 className="size-4 text-muted-foreground" />
                        )}
                        <code className="text-xs">{badge.subjectId}</code>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{badge.subjectType}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{formatDate(badge.assignedAt)}</span>
                    </TableCell>
                    <TableCell>
                      {badge.revokedAt ? (
                        <span className="text-sm text-muted-foreground">{formatDate(badge.revokedAt)}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {badge.revokedAt === null && (
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isRevoking}
                          onClick={() => handleRevoke(badge)}
                        >
                          Revoke
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

