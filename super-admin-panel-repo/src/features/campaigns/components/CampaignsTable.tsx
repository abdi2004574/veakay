import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCampaigns, flagCampaign, unflagCampaign } from "../api/campaigns";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GradientButton } from "@/components/ui/gradient-button";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/shared/StatusBadge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Flag, Eye } from "lucide-react";
import type { AdminCampaign } from "../types";

export default function CampaignsTable() {
  const [search, setSearch] = useState("");
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [flagCampaignId, setFlagCampaignId] = useState<string | null>(null);
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["campaigns", search],
    queryFn: () => getCampaigns({ search, limit: 20 }),
  });

  const flag = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      flagCampaign(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      toast({
        title: "Campaign flagged",
        description: "The campaign has been flagged for review.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to flag campaign.",
        variant: "destructive",
      });
    },
  });

  const unflag = useMutation({
    mutationFn: unflagCampaign,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["campaigns"] });
      toast({
        title: "Campaign unflagged",
        description: "The campaign has been unflagged.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to unflag campaign.",
        variant: "destructive",
      });
    },
  });

  const campaigns = (data?.data ?? []) as AdminCampaign[];

  const handleFlagClick = (campaignId: string) => {
    setFlagCampaignId(campaignId);
    setFlagDialogOpen(true);
  };

  const handleConfirmFlag = (reason?: string) => {
    if (flagCampaignId) {
      flag.mutate({ id: flagCampaignId, reason: reason ?? "" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Monitor and moderate traveler campaigns
          </p>
        </div>
        <Input
          placeholder="Search campaigns..."
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
                Title
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Creator
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Goal
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Progress
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="px-4 py-8">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
            ) : campaigns.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No campaigns found
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((campaign) => {
                const progress =
                  campaign.goalAmount > 0
                    ? Math.round(
                        (campaign.raisedAmount / campaign.goalAmount) * 100,
                      )
                    : 0;
                return (
                  <TableRow
                    key={campaign.id}
                    className="border-t border-border hover:bg-muted/30"
                  >
                    <TableCell className="px-4 py-3 text-sm font-medium">
                      {campaign.title}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {campaign.creator.displayName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: campaign.currency,
                      }).format(campaign.goalAmount)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={campaign.status} />
                        <span>{progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        {!campaign.flaggedAt ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleFlagClick(campaign.id)}
                            disabled={flag.isPending}
                          >
                            <Flag className="h-4 w-4" />
                          </Button>
                        ) : (
                          <GradientButton
                            size="sm"
                            variant="primary"
                            onClick={() => unflag.mutate(campaign.id)}
                            disabled={unflag.isPending}
                          >
                            Unflag
                          </GradientButton>
                        )}
                        <Button size="sm" variant="ghost" className="h-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        title="Flag Campaign"
        messageLabel="Reason"
        messagePlaceholder="Why is this campaign being flagged?"
        confirmLabel="Flag"
        cancelLabel="Cancel"
        confirmVariant="destructive"
        open={flagDialogOpen}
        onOpenChange={setFlagDialogOpen}
        onConfirm={handleConfirmFlag}
        isPending={flag.isPending}
      />
    </div>
  );
}
