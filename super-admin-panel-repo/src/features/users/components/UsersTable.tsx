import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUserStatus } from "../api/users";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/shared/StatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Ban, UserCheck } from "lucide-react";
import type { AdminUser } from "../types";

export default function UsersTable() {
  const [search, setSearch] = useState("");
  const [dialogUser, setDialogUser] = useState<AdminUser | null>(null);
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["users", search],
    queryFn: () => getUsers({ search, limit: 20 }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => updateUserStatus(id, isActive),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toast({ description: "User status updated." });
    },
    onError: () => {
      toast({ description: "Failed to update user status.", variant: "destructive" });
    },
  });

  const users = (data?.data ?? []) as AdminUser[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage traveler and agency accounts</p>
        </div>
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm rounded-2xl bg-[var(--input-background)]"
        />
      </div>
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">Name</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">Email</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">Role</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">Status</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">Joined</TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="px-4 py-8"><Skeleton className="h-4 w-full" /></TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No users found</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="border-t border-border hover:bg-muted/30">
                  <TableCell className="px-4 py-3 text-sm font-medium">{user.displayName}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    <Badge variant="outline" className="capitalize">{user.role}</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    <StatusBadge status={user.isActive ? "active" : "inactive"} />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    {user.isActive ? (
                      <Button variant="outline" size="sm" className="text-[var(--vaykae-pink)]" onClick={() => setDialogUser(user)}>
                        <Ban className="h-4 w-4" />
                        <span className="ml-1">Deactivate</span>
                      </Button>
                    ) : (
                      <GradientButton variant="primary" size="sm" onClick={() => updateStatus.mutate({ id: user.id, isActive: true })}>
                        <UserCheck className="h-4 w-4 mr-1" />
                        Activate
                      </GradientButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {dialogUser && (
        <ConfirmDialog
          title="Deactivate User"
          messageLabel="Reason (optional)"
          confirmVariant="destructive"
          confirmLabel="Deactivate"
          open={!!dialogUser}
          onOpenChange={() => setDialogUser(null)}
          onConfirm={() => {
            updateStatus.mutate({ id: dialogUser.id, isActive: false });
            setDialogUser(null);
          }}
        />
      )}
    </div>
  );
}
