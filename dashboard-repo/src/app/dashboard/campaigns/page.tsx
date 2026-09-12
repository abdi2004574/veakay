"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingState, ErrorState, EmptyState } from "@/components/data-display";
import { useCampaignsList, useUpdateCampaignFlag } from "@/hooks/api/useCampaignsApi";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { AdminCampaign } from "@/types";
import { Search, Flag } from "lucide-react";

const statusLabels: Record<string, string> = {
  draft: "Draft",
  active: "Active",
  funded: "Funded",
  booked: "Booked",
  completed: "Completed",
  canceled: "Canceled",
  expired: "Expired",
  flagged: "Flagged",
};

export default function CampaignsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [flaggedFilter, setFlaggedFilter] = useState<boolean | undefined>();
  const debouncedSearch = useDebounce(search, 500);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useCampaignsList({
    search: debouncedSearch,
    status: statusFilter,
    flagged: flaggedFilter,
  });

  const { mutate: flagCampaign, isPending: isFlagging } = useUpdateCampaignFlag();

  const campaigns = data?.pages.flatMap((page) => page.data) ?? [];

  const handleFlag = (campaign: AdminCampaign) => {
    if (campaign.status === "flagged") {
      flagCampaign({ campaignId: campaign.id, dto: {} });
    } else {
      flagCampaign({ campaignId: campaign.id, dto: { reason: "Inappropriate content" } });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Campaign Management</h1>
        <p className="text-muted-foreground">Review and moderate fundraising campaigns</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
          <CardDescription>
            {campaigns.length} campaigns listed
          </CardDescription>
          <div className="flex items-center gap-3 pt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter ?? ""} onValueChange={(v) => setStatusFilter(v || undefined)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="funded">Funded</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={flaggedFilter === undefined ? "" : String(flaggedFilter)} onValueChange={(v) => setFlaggedFilter(v === "" ? undefined : v === "true")}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="true">Flagged Only</SelectItem>
                <SelectItem value="false">Not Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isError && <ErrorState error={error} onRetry={() => refetch()} />}
          {isLoading && <LoadingState message="Loading campaigns..." />}
          {!isLoading && !isError && campaigns.length === 0 && (
            <EmptyState title="No campaigns found" description="Try adjusting your search or filters." />
          )}
          {!isLoading && !isError && campaigns.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Goal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{campaign.title}</p>
                            <p className="text-sm text-muted-foreground">{campaign.destination}</p>
                          </div>
                          {campaign.status === "flagged" && (
                            <Flag className="size-4 text-destructive" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{campaign.creator?.displayName}</p>
                        <p className="text-xs text-muted-foreground">{campaign.creator?.email}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">
                          {formatCurrency(campaign.raisedAmount, campaign.currency)} / {formatCurrency(campaign.goalAmount, campaign.currency)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={campaign.status === "flagged" ? "destructive" : "secondary"}>
                          {statusLabels[campaign.status] || campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{formatDate(campaign.createdAt)}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={campaign.status === "flagged" ? "outline" : "destructive"}
                          size="sm"
                          disabled={isFlagging}
                          onClick={() => handleFlag(campaign)}
                        >
                          {campaign.status === "flagged" ? "Unflag" : "Flag"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {hasNextPage && (
                <div className="border-t pt-4 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? "Loading more..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

