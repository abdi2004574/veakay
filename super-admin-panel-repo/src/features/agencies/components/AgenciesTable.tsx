import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAgencies, approveAgency, rejectAgency } from "../api/agencies";
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
import { GradientButton } from "@/components/ui/gradient-button";
import StatusBadge from "@/components/shared/StatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Check, X, Eye } from "lucide-react";
import type { AdminAgency } from "../types";

export default function AgenciesTable() {
  const [search, setSearch] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectAgencyId, setRejectAgencyId] = useState<string | null>(null);
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["agencies", search],
    queryFn: () => getAgencies({ search, limit: 20 }),
  });

  const approve = useMutation({
    mutationFn: approveAgency,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agencies"] });
      toast({
        title: "Agency approved",
        description: "The agency has been approved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve agency.",
        variant: "destructive",
      });
    },
  });

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectAgency(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agencies"] });
      toast({
        title: "Agency rejected",
        description: "The agency has been rejected.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject agency.",
        variant: "destructive",
      });
    },
  });

  const agencies = (data?.data ?? []) as AdminAgency[];

  const handleRejectClick = (agencyId: string) => {
    setRejectAgencyId(agencyId);
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = (reason?: string) => {
    if (rejectAgencyId) {
      reject.mutate({ id: rejectAgencyId, reason: reason ?? "" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agencies</h1>
          <p className="text-muted-foreground">
            Manage travel agency registrations
          </p>
        </div>
        <Input
          placeholder="Search agencies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm rounded-2xl border border-border bg-[var(--input-background)]"
        />
      </div>
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Agency
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Contact
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Tier
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Status
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : agencies.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No agencies found
                </TableCell>
              </TableRow>
            ) : (
              agencies.map((agency) => (
                <TableRow
                  key={agency.id}
                  className="border-t border-border hover:bg-muted/30"
                >
                  <TableCell className="px-4 py-3 text-sm font-medium">
                    {agency.agencyName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                    {agency.businessContact}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    <Badge variant="outline" className="capitalize">
                      {agency.subscriptionTier}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    <StatusBadge status={agency.status} />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      {agency.status === "pending_verification" && (
                        <>
                          <GradientButton
                            size="sm"
                            variant="primary"
                            onClick={() => approve.mutate(agency.id)}
                            disabled={approve.isPending}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </GradientButton>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectClick(agency.id)}
                            disabled={reject.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" className="h-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        title="Reject Agency"
        messageLabel="Rejection reason"
        messagePlaceholder="Reason for rejection..."
        confirmLabel="Reject"
        cancelLabel="Cancel"
        confirmVariant="destructive"
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        onConfirm={handleConfirmReject}
        isPending={reject.isPending}
      />
    </div>
  );
}
