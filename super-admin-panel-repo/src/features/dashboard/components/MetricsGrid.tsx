import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics } from "../api/dashboard";
import {
  Users,
  Building2,
  Megaphone,
  CreditCard,
  TrendingUp,
  Clock,
} from "lucide-react";
import { formatCurrency } from "../../../lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardMetrics } from "../types";

const metricCards = [
  {
    key: "totalUsers" as keyof DashboardMetrics,
    label: "Total Users",
    icon: Users,
  },
  {
    key: "totalAgencies" as keyof DashboardMetrics,
    label: "Total Agencies",
    icon: Building2,
  },
  {
    key: "totalCampaigns" as keyof DashboardMetrics,
    label: "Total Campaigns",
    icon: Megaphone,
  },
  {
    key: "totalDonations" as keyof DashboardMetrics,
    label: "Total Donations",
    icon: CreditCard,
  },
  {
    key: "activeCampaigns" as keyof DashboardMetrics,
    label: "Active Campaigns",
    icon: TrendingUp,
  },
  {
    key: "pendingAgencies" as keyof DashboardMetrics,
    label: "Pending Agencies",
    icon: Clock,
  },
] as const;

export default function MetricsGrid() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "metrics"],
    queryFn: getDashboardMetrics,
  });

  const metrics = data?.data as DashboardMetrics | undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Platform overview and key metrics
        </p>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {metricCards.map((card) => (
            <div
              key={card.key}
              className="rounded-xl border border-border bg-card shadow-sm p-6"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-2 h-8 w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {metricCards.map((card) => {
            const Icon = card.icon;
            const value = metrics?.[card.key];
            const displayValue =
              card.key === "totalDonations" && typeof value === "number"
                ? formatCurrency(value)
                : (value ?? 0);
            return (
              <div
                key={card.key}
                className="rounded-xl border border-border bg-card shadow-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--vaykae-gradient-light)] text-[var(--vaykae-pink)]">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold">{displayValue}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
