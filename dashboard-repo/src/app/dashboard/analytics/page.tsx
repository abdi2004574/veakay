"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingState, ErrorState, EmptyState } from "@/components/data-display";
import { useDashboardKpis, useFundingTrends, useTopDestinations, useTravelerPreferences } from "@/hooks/api/useAnalyticsApi";
import { FundingTrendsChart } from "@/components/charts/FundingTrendsChart";
import { BarChart as BarChartComp, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Users,
  FolderKanban,
  DollarSign,
  TrendingUp,
  BarChart3,
  MapPin,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  totalUsers: Users,
  totalAgencies: TrendingUp,
  activeCampaigns: FolderKanban,
  totalDonations: DollarSign,
  totalCampaigns: BarChart3,
  pendingAgencies: MapPin,
};

type MetricKey = keyof typeof iconMap;

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Platform metrics and insights</p>
      </div>

      <KpisSection />
      <FundingTrendsFullSection />
      <TopDestinationsSection />
      <TravelerPreferencesSection />
    </div>
  );
}

function KpisSection() {
  const { data: metrics, isLoading, isError, error, refetch } = useDashboardKpis();

  if (isLoading) return <LoadingState message="Loading metrics..." />;
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;
  if (!metrics) return null;

  const kpiItems: Array<{ key: MetricKey; label: string; value: number }> = [
    { key: "totalUsers", label: "Total Users", value: metrics.totalUsers },
    { key: "totalAgencies", label: "Total Agencies", value: metrics.totalAgencies },
    { key: "activeCampaigns", label: "Active Campaigns", value: metrics.activeCampaigns },
    { key: "totalDonations", label: "Total Donations", value: metrics.totalDonations },
    { key: "totalCampaigns", label: "Total Campaigns", value: metrics.totalCampaigns },
    { key: "pendingAgencies", label: "Pending Agencies", value: metrics.pendingAgencies },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiItems.map((item) => {
        const Icon = iconMap[item.key];
        return (
          <Card key={item.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-r from-vaykae-pink to-vaykae-purple text-white">
                <Icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function FundingTrendsFullSection() {
  const [range, setRange] = useState("30d");
  const { data, isLoading, isError, error } = useFundingTrends(range as "7d" | "30d" | "90d");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Funding Trends</CardTitle>
            <CardDescription>Daily donation totals</CardDescription>
          </div>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <LoadingState message="Loading funding trends..." />}
        {isError && <ErrorState error={error} />}
        {data && data.trends && data.trends.length === 0 && (
          <EmptyState title="No data" description="No funding records in this period." />
        )}
        {data && data.trends && data.trends.length > 0 && <FundingTrendsChart data={data.trends} />}
      </CardContent>
    </Card>
  );
}

function TopDestinationsSection() {
  const { data, isLoading, isError, error } = useTopDestinations();
  const chartData = (data ?? []).map((d) => ({ name: d.name, count: d.count }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Destinations</CardTitle>
        <CardDescription>Most common campaign destinations</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <LoadingState message="Loading destinations..." />}
        {isError && <ErrorState error={error} />}
        {!isLoading && !isError && chartData.length === 0 && (
          <EmptyState title="No destinations" description="No campaign data available." />
        )}
        {!isLoading && !isError && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={200}>
            <BarChartComp data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                interval="preserveEnd"
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
              />

              <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
            </BarChartComp>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

function TravelerPreferencesSection() {
  const { data, isLoading, isError, error } = useTravelerPreferences();
  const chartData = (data ?? []).map((d) => ({ label: d.label, count: d.count }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traveler Destination Preferences</CardTitle>
        <CardDescription>Traveler destination type distribution</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <LoadingState message="Loading preferences..." />}
        {isError && <ErrorState error={error} />}
        {!isLoading && !isError && chartData.length === 0 && (
          <EmptyState title="No data" description="No traveler preference data available." />
        )}
        {!isLoading && !isError && chartData.length > 0 && (
          <div className="space-y-2">
            {chartData.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm text-muted-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

