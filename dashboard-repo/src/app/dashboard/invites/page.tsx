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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingState, ErrorState, EmptyState } from "@/components/data-display";
import { useInvitesList, useCreateInvite, useRevokeInvite } from "@/hooks/api/useInvitesApi";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { AdminInvite } from "@/types";
import { Plus, Mail, Calendar, CheckCircle, XCircle } from "lucide-react";

const statusIcons = {
  pending: Mail,
  accepted: CheckCircle,
  revoked: XCircle,
  expired: Calendar,
};

export default function InvitesPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { data: invites, isLoading, isError, error, refetch } = useInvitesList();
  const { mutate: createInvite, isPending: isCreating } = useCreateInvite();
  const { mutate: revokeInvite, isPending: isRevoking } = useRevokeInvite();

  const handleCreate = () => {
    if (!email.trim()) return;
    createInvite({
      email,
      platformRole: "super_admin",
      acceptUrl: `${window.location.origin}/login`,
    });
    toast.success("Invite sent to " + email);
    setEmail("");
    setCreateDialogOpen(false);
  };

  const handleRevoke = (invite: AdminInvite) => {
    revokeInvite(invite.id);
    toast.success("Invite revoked.");
  };

  const pendingCount = invites?.filter((i) => i.status === "pending").length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Invites</h1>
          <p className="text-muted-foreground">Invite and manage admin accounts</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" size="sm">
              <Plus className="size-4 mr-2" />
              New Invite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New Admin</DialogTitle>
              <DialogDescription>
                Send an admin invitation via email. The recipient will receive a link to accept.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@veakay.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="gradient"
                size="sm"
                disabled={!email.trim() || isCreating}
                onClick={handleCreate}
              >
                {isCreating ? "Sending..." : "Send Invite"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Invites</CardTitle>
          <CardDescription>
            {pendingCount} pending, {invites?.length ?? 0} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isError && <ErrorState error={error} onRetry={() => refetch()} />}
          {isLoading && <LoadingState message="Loading invites..." />}
          {!isLoading && !isError && (!invites || invites.length === 0) && (
            <EmptyState title="No invites yet" description="Invite an admin to get started." />
          )}
          {!isLoading && !isError && invites && invites.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.map((invite) => {
                  const StatusIcon = statusIcons[invite.status as keyof typeof statusIcons] ?? Mail;
                  return (
                    <TableRow key={invite.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="size-4 text-muted-foreground" />
                          <span>{invite.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={invite.status === "accepted" ? "success" : invite.status === "revoked" ? "destructive" : invite.status === "expired" ? "warning" : "pending"}>
                          {invite.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{formatDate(invite.expiresAt)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{formatDate(invite.createdAt)}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        {invite.status === "pending" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={isRevoking}
                            onClick={() => handleRevoke(invite)}
                          >
                            Revoke
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
