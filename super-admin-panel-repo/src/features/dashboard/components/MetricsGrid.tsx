import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics } from "../api/dashboard";
import { Users, Building2, Megaphone, CreditCard, TrendingUp, Clock } from "lucide-react";
import { formatCurrency } from "../../../lib/utils";
import type { DashboardMetrics } from "../types";

const metricCards = [
  { key: "totalUsers" as keyof DashboardMetrics, label: "Total Users", icon: Users, color: "text-blue-500" },
  { key: "totalAgencies" as keyof DashboardMetrics, label: "Total Agencies", icon: Building2, color: "text-purple-500" },
  { key: "totalCampaigns" as keyof DashboardMetrics, label: "Total Campaigns", icon: Megaphone, color: "text-green-500" },
  { key: "totalDonations" as keyof DashboardMetrics, label: "Total Donations", icon: CreditCard, color: "text-pink-500" },
  { key: "activeCampaigns" as keyof DashboardMetrics, label: "Active Campaigns", icon: TrendingUp, color: "text-amber-500" },
  { key: "pendingAgencies" as keyof DashboardMetrics, label: "Pending Agencies", icon: Clock, color: "text-red-500" },
] as const;

export default function MetricsGrid() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "metrics"],
    queryFn: getDashboardMetrics,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metricCards.map((card) => (
          <div key={card.key} className="animate-pulse rounded-lg border border-border p-6">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="mt-2 h-8 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  const metrics = data?.data as DashboardMetrics | undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and key metrics</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metricCards.map((card) => {
          const Icon = card.icon;
          const value = metrics?.[card.key];
          const displayValue =
            card.key === "totalDonations" && typeof value === "number"
              ? formatCurrency(value)
              : value ?? 0;
          return (
            <div
              key={card.key}
              className="rounded-lg border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <p className="mt-2 text-3xl font-bold">{displayValue}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
