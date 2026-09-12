"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingState, ErrorState, EmptyState } from "@/components/data-display";
import { useTopPerformers } from "@/hooks/api/useTopPerformersApi";
import { formatDate } from "@/lib/utils";
import { Users, TrendingUp, Activity, BadgeCheck, Search, ArrowUpRight } from "lucide-react";
import type { TopPerformer } from "@/types";

export default function TopPerformersPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error, refetch } = useTopPerformers();

  const performers = data ?? [];
  const filtered = performers.filter(
    (p) =>
      !search ||
      p.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      p.username?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalTrips = performers.reduce((sum, p) => sum + (p.completedTripCount ?? 0), 0);
  const avgTrips = performers.length > 0 ? Math.round(totalTrips / performers.length) : 0;

  const kpiData = [
    { title: "Total Performers", value: performers.length.toString(), icon: Users, color: "from-vaykae-pink to-vaykae-purple" },
    { title: "Most Completed Trips", value: performers.length > 0 ? Math.max(...performers.map((p) => p.completedTripCount)).toString() : "0", icon: TrendingUp, color: "from-vaykae-pink to-vaykae-purple" },
    { title: "Avg Trips", value: avgTrips.toString(), icon: Activity, color: "from-vaykae-pink to-vaykae-purple" },
    { title: "Verified Badges", value: performers.length.toString(), icon: BadgeCheck, color: "from-vaykae-pink to-vaykae-purple" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Top Performers</h1>
        <p className="text-muted-foreground">Travelers with the most completed trips</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <div className={"flex size-8 items-center justify-center rounded-lg bg-gradient-to-r text-white " + kpi.color}>
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Travelers</CardTitle>
          <CardDescription>
            {performers.length} performers
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
          {isLoading && <LoadingState message="Loading top performers..." />}
          {!isLoading && !isError && filtered.length === 0 && (
            <EmptyState title="No performers found" description={search ? "No travelers match your search." : "No travelers have completed enough trips yet."} />
          )}
          {!isLoading && !isError && filtered.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Traveler</TableHead>
                  <TableHead>Completed Trips</TableHead>
                  <TableHead>Badge</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Profile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((performer) => (
                  <TableRow key={performer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-r from-vaykae-pink to-vaykae-purple text-white text-xs font-semibold">
                          {performer.displayName?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-medium">{performer.displayName || performer.username}</p>
                          <p className="text-sm text-muted-foreground">{performer.username}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{performer.completedTripCount}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{performer.badge || "—"}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{formatDate(performer.createdAt)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/users`}>
                          View <ArrowUpRight className="size-3.5" />
                        </Link>
                      </Button>
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
