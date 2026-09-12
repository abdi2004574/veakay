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
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingState, ErrorState, EmptyState } from "@/components/data-display";
import { useUsersList, useVerifyKyc } from "@/hooks/api/useUsersApi";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { AdminUser, VerificationStatus } from "@/types";
import { Search, Shield } from "lucide-react";

const verificationOptions = [
  { value: "verified", label: "Verified", description: "Approve this user's KYC submission" },
  { value: "rejected", label: "Rejected", description: "Reject this user's KYC submission" },
  { value: "flagged", label: "Flagged", description: "Flag for further review" },
];

export default function KYCPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useUsersList({
    search: debouncedSearch,
    role: "traveler",
  });

  const { mutate: verifyKyc, isPending: isVerifying } = useVerifyKyc();

  const users = data?.pages.flatMap((page) => page.data) ?? [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<VerificationStatus>("verified");
  const [note, setNote] = useState("");

  const handleOpenDialog = (user: AdminUser) => {
    setSelectedUser(user);
    setSelectedStatus("verified");
    setNote("");
    setDialogOpen(true);
  };

  const handleVerify = () => {
    if (!selectedUser) return;
    verifyKyc({ userId: selectedUser.id, dto: { status: selectedStatus, note: note || undefined } });
    toast.success(`KYC ${selectedStatus} for ${selectedUser.displayName || selectedUser.email}.`);
    setDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">KYC Verification</h1>
        <p className="text-muted-foreground">Know Your Customer verification for travelers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Travelers</CardTitle>
          <CardDescription>
            {users.length} travelers listed
          </CardDescription>
          <div className="pt-2">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search travelers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isError && <ErrorState error={error} onRetry={() => refetch()} />}
          {isLoading && <LoadingState message="Loading travelers..." />}
          {!isLoading && !isError && users.length === 0 && (
            <EmptyState title="No travelers found" description="No traveler accounts found." />
          )}
          {!isLoading && !isError && users.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Badge</TableHead>
                    <TableHead>Wallet</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Shield className="size-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{user.displayName || user.email}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            {user.profile?.location && (
                              <p className="text-xs text-muted-foreground">{user.profile.location}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? "success" : "destructive"}>
                          {user.isActive ? "Active" : "Deactivated"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.profile?.badge ? (
                          <Badge variant="secondary">{user.profile.badge}</Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">â€”</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.profile?.walletConnected ? "success" : "secondary"}>
                          {user.profile?.walletConnected ? "Connected" : "Not Connected"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isVerifying}
                          onClick={() => handleOpenDialog(user)}
                        >
                          Verify KYC
                        </Button>
                      </TableCell>
                    </TableRow>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <div style={{ display: "none" }} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify KYC</DialogTitle>
            <DialogDescription>
              Review KYC submission for &quot;{selectedUser?.displayName || selectedUser?.email}&quot;.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Verification Status</Label>
              <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as VerificationStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {verificationOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex flex-col">
                        <span>{opt.label}</span>
                        <span className="text-xs text-muted-foreground">{opt.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea
                id="note"
                placeholder="Add a note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gradient"
              size="sm"
              disabled={isVerifying || !selectedStatus}
              onClick={handleVerify}
            >
              {isVerifying ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

