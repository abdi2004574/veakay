"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { LoadingState, ErrorState, EmptyState } from "@/components/data-display";
import { usePendingAgencies, useApproveAgency, useRejectAgency } from "@/hooks/api/useAgenciesApi";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { AdminAgency } from "@/types";
import { Search } from "lucide-react";

export default function AgenciesPage() {
  const [search, setSearch] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingAgency, setRejectingAgency] = useState<AdminAgency | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: agencies, isLoading, isError, error, refetch } = usePendingAgencies();
  const { mutate: approve, isPending: isApproving } = useApproveAgency();
  const { mutate: reject, isPending: isRejecting } = useRejectAgency();

  const filtered = agencies?.filter(
    (a) => !search || a.agencyName.toLowerCase().includes(search.toLowerCase()) || a.user?.email?.toLowerCase().includes(search.toLowerCase()),
  ) ?? [];

  const handleApprove = (agency: AdminAgency) => {
    approve(agency.id);
    toast.success(`"${agency.agencyName}" has been approved.`);
  };

  const handleRejectSubmit = () => {
    if (!rejectingAgency || !rejectReason.trim()) return;
    reject({ id: rejectingAgency.id, dto: { reason: rejectReason } });
    toast.success(`"${rejectingAgency.agencyName}" has been rejected.`);
    setRejectDialogOpen(false);
    setRejectingAgency(null);
    setRejectReason("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agency Management</h1>
        <p className="text-muted-foreground">Verify and manage travel agencies</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Verification</CardTitle>
          <CardDescription>
            {agencies?.length ?? 0} agencies awaiting review
          </CardDescription>
          <div className="pt-2">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search agencies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isError && <ErrorState error={error} onRetry={() => refetch()} />}
          {isLoading && <LoadingState message="Loading agencies..." />}
          {!isLoading && !isError && filtered.length === 0 && (
            <EmptyState title="No pending agencies" description="All agency applications have been reviewed." />
          )}
          {!isLoading && !isError && filtered.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agency</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((agency) => (
                  <TableRow key={agency.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{agency.agencyName}</p>
                        <p className="text-sm text-muted-foreground">{agency.businessAddress || "â€”"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{agency.user?.email}</p>
                      <p className="text-sm text-muted-foreground">{agency.businessContact || "â€”"}</p>
                    </TableCell>
                    <TableCell>
                      {agency.documents?.length ? (
                        <Badge variant="outline">{agency.documents.length} doc{agency.documents.length !== 1 ? 's' : ''}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{formatDate(agency.createdAt)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isRejecting}
                          onClick={() => {
                            setRejectingAgency(agency);
                            setRejectDialogOpen(true);
                          }}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="gradient"
                          size="sm"
                          disabled={isApproving}
                          onClick={() => handleApprove(agency)}
                        >
                          Approve
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogTrigger asChild>
          <div style={{ display: "none" }} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Agency</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting &quot;{rejectingAgency?.agencyName}&quot;.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={!rejectReason.trim() || isRejecting}
              onClick={handleRejectSubmit}
            >
              Reject Agency
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

