"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/data-display";
import { ErrorState } from "@/components/data-display";
import { FundingTrendsChart } from "@/components/charts/FundingTrendsChart";
import { useDashboardKpis, useFundingTrends } from "@/hooks/api/useAnalyticsApi";
import {
  Users,
  FolderKanban,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from "lucide-react";

const quickActions = [
  { title: "Invite Admin", description: "Send admin invitation", href: "/dashboard/invites" },
  { title: "Review Agencies", description: "Pending verifications", href: "/dashboard/agencies" },
  { title: "Review Campaigns", description: "Pending approvals", href: "/dashboard/campaigns" },
  { title: "View Reports", description: "User reports queue", href: "/dashboard/moderation" },
];

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Platform dashboard at a glance
        </p>
      </div>

      <KpisSection />
      <FundingTrendsSection />
      <QuickActionsSection />
    </div>
  );
}

function KpisSection() {
  const { data: metrics, isLoading, isError, error, refetch } = useDashboardKpis();

  if (isLoading) return <LoadingState message="Loading platform metrics..." />;
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;
  if (!metrics) return null;

  const kpiData = [
    {
      title: "Total Users",
      value: metrics.totalUsers.toLocaleString(),
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Agencies",
      value: metrics.totalAgencies.toLocaleString(),
      icon: TrendingUp,
      color: "from-vaykae-pink to-vaykae-purple",
    },
    {
      title: "Active Campaigns",
      value: metrics.activeCampaigns.toLocaleString(),
      icon: FolderKanban,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Total Donations",
      value: metrics.totalDonations.toLocaleString(),
      icon: DollarSign,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Total Campaigns",
      value: metrics.totalCampaigns.toLocaleString(),
      icon: FolderKanban,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Pending Agencies",
      value: metrics.pendingAgencies.toLocaleString(),
      icon: Clock,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
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
  );
}

function FundingTrendsSection() {
  const { data, isLoading, isError, error } = useFundingTrends("30d");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funding Trends (30d)</CardTitle>
        <CardDescription>Daily donation totals over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <LoadingState message="Loading funding trends..." />}
        {isError && <ErrorState error={error} />}
        {data && data.trends && <FundingTrendsChart data={data.trends} />}
      </CardContent>
    </Card>
  );
}

function QuickActionsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common admin tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{action.title}</span>
                <span className="text-xs text-muted-foreground">{action.description}</span>
              </div>
              <ArrowUpRight className="size-4" />
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
