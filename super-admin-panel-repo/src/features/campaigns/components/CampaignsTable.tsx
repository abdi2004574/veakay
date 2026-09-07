import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCampaigns, flagCampaign, unflagCampaign } from "../api/campaigns";
import { Table } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { useState } from "react";
import { Flag, Eye } from "lucide-react";

export default function CampaignsTable() {
  const [search, setSearch] = useState("");
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["campaigns", search],
    queryFn: () => getCampaigns({ search, limit: 20 }),
  });

  const flag = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => flagCampaign(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });

  const unflag = useMutation({
    mutationFn: unflagCampaign,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });

  const campaigns = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">Monitor and moderate traveler campaigns</p>
        </div>
        <Input
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border border-border">
        <Table>
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Creator</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Goal</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Progress</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : campaigns.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No campaigns found</td></tr>
            ) : (
              campaigns.map((campaign) => {
                const progress = campaign.goalAmount > 0
                  ? Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)
                  : 0;
                return (
                  <tr key={campaign.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm font-medium">{campaign.title}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{campaign.creator.displayName}</td>
                    <td className="px-4 py-3 text-sm">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: campaign.currency }).format(campaign.goalAmount)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <StatusBadge status={campaign.status} />
                    </td>
                    <td className="px-4 py-3 text-sm">{progress}%</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        {!campaign.flaggedAt ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-amber-500 text-amber-600 hover:bg-amber-50"
                            onClick={() => {
                              const reason = prompt("Flag reason:");
                              if (reason) flag.mutate({ id: campaign.id, reason });
                            }}
                          >
                            <Flag className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() => unflag.mutate(campaign.id)}
                          >
                            Unflag
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="h-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}