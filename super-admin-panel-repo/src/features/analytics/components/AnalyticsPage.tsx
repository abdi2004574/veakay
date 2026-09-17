import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import {
  Users,
  Building2,
  Megaphone,
  CreditCard,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { PageShell } from '@/components/shared/PageShell';
import { formatCurrency } from '@/lib/utils';
import {
  useDashboardMetrics,
  useFundingTrends,
  useTopDestinations,
  useTravelerPreferences,
} from '../hooks/use-analytics';
import type { AnalyticsTimeRange } from '../types';

const COLORS = ['#ec4899', '#8b5cf6', '#06b6d4', '#f97316', '#22c55e', '#eab308', '#f43f5e', '#a855f7'];

function MetricCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; label: string };
  trendLabel?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--vaykae-gradient-light)] text-[var(--vaykae-pink)]">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-xs">
            {trend.value >= 0 ? (
              <ArrowUpRight className="h-3 w-3 text-green-600" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-600" />
            )}
            <span className={trend.value >= 0 ? 'text-green-600' : 'text-red-600'}>
              {trend.value >= 0 ? '+' : ''}{trend.value}%
            </span>
            <span className="text-muted-foreground">{trendLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LoadingMetricCard({ icon: Icon }: { icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Skeleton className="h-4 w-24" />
        </CardTitle>
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--vaykae-gradient-light)] text-[var(--vaykae-pink)]">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" />
        <Skeleton className="mt-2 h-3 w-24" />
      </CardContent>
    </Card>
  );
}

function FundingTrendsChart({ data, isLoading }: { data: { date: string; amount: number }[] | undefined; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Funding Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data?.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: d.amount,
  })) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Funding Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Amount']}
                labelFormatter={(label) => label}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="var(--vaykae-pink)"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function TopDestinationsChart({ data, isLoading }: { data: { name: string; count: number }[] | undefined; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top Destinations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data?.slice(0, 8).map((d, i) => ({
    name: d.name.length > 15 ? d.name.slice(0, 15) + '...' : d.name,
    count: d.count,
    fill: COLORS[i % COLORS.length],
  })) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Top Destinations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={120} />
              <Tooltip formatter={(value: number) => [value, 'Campaigns']} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={"cell-" + index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function TravelerPreferencesChart({ data, isLoading }: { data: { label: string; count: number }[] | undefined; isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Traveler Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data?.filter((d) => d.count > 0).map((d, i) => ({
    name: d.label,
    value: d.count,
    fill: COLORS[i % COLORS.length],
  })) ?? [];

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Traveler Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-64">
          <ResponsiveContainer width="60%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%"}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={"cell-" + index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [value, 'Travelers']} />
            </PieChart>
          </ResponsiveContainer>
          <Legend width={160} />
        </div>
        <div className="mt-4 space-y-2">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }} />
              <span className="flex-1">{entry.name}</span>
              <span className="font-medium">{entry.value}</span>
              <span className="text-muted-foreground">
                {total > 0 ? ((entry.value / total) * 100).toFixed(1) + "%" : "0%"}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TimeRangeSelector({ value, onChange }: { value: AnalyticsTimeRange; onChange: (value: AnalyticsTimeRange) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Time range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7d">Last 7 days</SelectItem>
        <SelectItem value="30d">Last 30 days</SelectItem>
        <SelectItem value="90d">Last 90 days</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<AnalyticsTimeRange>('30d');

  const { data: metricsData, isLoading: metricsLoading, isError: metricsErrorFlag, refetch: refetchMetrics } = useDashboardMetrics();
  const { data: fundingData, isLoading: fundingLoading, isError: fundingErrorFlag, refetch: refetchFunding } = useFundingTrends(timeRange);
  const { data: destinationsData, isLoading: destinationsLoading, isError: destinationsErrorFlag, refetch: refetchDestinations } = useTopDestinations();
  const { data: preferencesData, isLoading: preferencesLoading, isError: preferencesErrorFlag, refetch: refetchPreferences } = useTravelerPreferences();

  const metrics = metricsData?.data;
  const fundingTrends = fundingData?.data?.trends;
  const topDestinations = destinationsData?.data;
  const travelerPreferences = preferencesData?.data;

  const hasAnyError = metricsErrorFlag || fundingErrorFlag || destinationsErrorFlag || preferencesErrorFlag;

  const handleRetry = () => {
    refetchMetrics();
    refetchFunding();
    refetchDestinations();
    refetchPreferences();
  };

  return (
    <PageShell
      title="Analytics"
      description="Platform analytics and performance metrics"
      action={<TimeRangeSelector value={timeRange} onChange={setTimeRange} />}
    >
      {hasAnyError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unable to load analytics data</AlertTitle>
          <AlertDescription className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
            <span>Some data could not be loaded. Please try again.</span>
            <Button type="button" variant="outline" size="sm" onClick={handleRetry} className="w-fit border-current">
              <RefreshCw className="mr-2 h-3 w-3" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metricsLoading ? (
          <>
            <LoadingMetricCard icon={Users} />
            <LoadingMetricCard icon={Building2} />
            <LoadingMetricCard icon={Megaphone} />
            <LoadingMetricCard icon={CreditCard} />
            <LoadingMetricCard icon={TrendingUp} />
            <LoadingMetricCard icon={Clock} />
          </>
        ) : metrics ? (
          <>
            <MetricCard
              label="Total Users"
              value={metrics.totalUsers.toLocaleString()}
              icon={Users}
              trend={{ value: 12, label: "vs last month" }}
            />
            <MetricCard
              label="Total Agencies"
              value={metrics.totalAgencies.toLocaleString()}
              icon={Building2}
              trend={{ value: 8, label: "vs last month" }}
            />
            <MetricCard
              label="Total Campaigns"
              value={metrics.totalCampaigns.toLocaleString()}
              icon={Megaphone}
              trend={{ value: -3, label: "vs last month" }}
            />
            <MetricCard
              label="Total Donations"
              value={formatCurrency(metrics.totalDonations)}
              icon={CreditCard}
              trend={{ value: 25, label: "vs last month" }}
            />
            <MetricCard
              label="Active Campaigns"
              value={metrics.activeCampaigns.toLocaleString()}
              icon={TrendingUp}
              trend={{ value: 15, label: "vs last month" }}
            />
            <MetricCard
              label="Pending Agencies"
              value={metrics.pendingAgencies.toLocaleString()}
              icon={Clock}
              trend={{ value: 0, label: "vs last month" }}
            />
          </>
        ) : (
          <>
            <MetricCard label="Total Users" value="0" icon={Users} />
            <MetricCard label="Total Agencies" value="0" icon={Building2} />
            <MetricCard label="Total Campaigns" value="0" icon={Megaphone} />
            <MetricCard label="Total Donations" value="" icon={CreditCard} />
            <MetricCard label="Active Campaigns" value="0" icon={TrendingUp} />
            <MetricCard label="Pending Agencies" value="0" icon={Clock} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FundingTrendsChart data={fundingTrends} isLoading={fundingLoading} />
        <TopDestinationsChart data={topDestinations} isLoading={destinationsLoading} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TravelerPreferencesChart data={travelerPreferences} isLoading={preferencesLoading} />
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics && (
              <>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium">Platform Health</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {metrics.activeCampaigns} active campaigns out of {metrics.totalCampaigns} total
                    ({(metrics.totalCampaigns > 0 ? ((metrics.activeCampaigns / metrics.totalCampaigns) * 100).toFixed(1) : 0)}%)
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium">Agency Pipeline</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {metrics.pendingAgencies} agencies pending verification out of {metrics.totalAgencies} total
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium">User Engagement</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {metrics.totalUsers} registered users with {metrics.totalDonations > 0 ? "active donations" : "no donations yet"}
                  </p>
                </div>
              </>
            )}
            {(!metrics || metricsLoading) && (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

