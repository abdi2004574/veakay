import {
  TrendingUp,
  Package,
  Users,
  DollarSign,
  Star,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { AgencyHeader } from "../../components/AgencyHeader";
import { AgencySideMenu } from "../../components/AgencySideMenu";
import { useAgencyScrollContext } from "../../AgencyRoot";

const fundingData = [
  { month: "Jan", amount: 15000 },
  { month: "Feb", amount: 22000 },
  { month: "Mar", amount: 18000 },
  { month: "Apr", amount: 28000 },
  { month: "May", amount: 35000 },
  { month: "Jun", amount: 42000 },
];

const destinationData = [
  { destination: "Paris", bookings: 45 },
  { destination: "Tokyo", bookings: 38 },
  { destination: "Bali", bookings: 32 },
  { destination: "Dubai", bookings: 28 },
  { destination: "NYC", bookings: 25 },
];

const demographicData = [
  { name: "18-25", value: 30, color: "#da01a6" },
  { name: "26-35", value: 45, color: "#a800b5" },
  { name: "36-50", value: 20, color: "#7600c5" },
  { name: "50+", value: 5, color: "#5500d5" },
];

export default function AgencyDashboardScreen() {
  const navigate = useNavigate();
  const { hideNav, setHideNav } = useAgencyScrollContext();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <AgencyHeader onMenuClick={() => setMenuOpen(true)} hidden={hideNav} />

      {/* Side Menu */}
      <AgencySideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Welcome Card */}
        <div
          className="p-6 pb-8 text-white relative overflow-hidden"
          style={{ background: "var(--vaykae-gradient)" }}
        >
          <div className="relative z-10">
            <p className="text-white/80 mb-1">Welcome back</p>
            <h1 className="text-2xl mb-3">Paradise Travel Co.</h1>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm">Verified Agency</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mb-10" />
        </div>

        {/* Stats Cards */}
        <div className="px-6 mx-[0px] mt-[20px] mb-[24px]">
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<Package className="w-5 h-5" />}
              label="Active Trips"
              value="24"
              change="+12%"
              isPositive={true}
            />
            <StatCard
              icon={<Users className="w-5 h-5" />}
              label="Total Bookings"
              value="186"
              change="+8%"
              isPositive={true}
            />
            <StatCard
              icon={<DollarSign className="w-5 h-5" />}
              label="Monthly Revenue"
              value="$42K"
              change="+24%"
              isPositive={true}
            />
            <StatCard
              icon={<Star className="w-5 h-5" />}
              label="Reputation"
              value="4.8"
              change="+0.2"
              isPositive={true}
            />
          </div>
        </div>

        {/* Funding Trends Chart */}
        <div className="px-6 mb-6">
          <div className="bg-card rounded-3xl p-4 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="mb-1">Funding Trends</h3>
                <p className="text-sm text-muted-foreground">Last 6 months</p>
              </div>
              <TrendingUp className="w-5 h-5" style={{ color: "var(--vaykae-pink)" }} />
            </div>
            <ResponsiveContainer width="100%" height={180} key="funding-chart">
              <LineChart data={fundingData}>
                <defs>
                  <linearGradient id="agencyLineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#da01a6" key="line-stop-0" />
                    <stop offset="100%" stopColor="#7600c5" key="line-stop-100" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" key="line-grid" />
                <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: "12px" }} key="line-xaxis" />
                <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} key="line-yaxis" />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  key="line-tooltip"
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="url(#agencyLineGradient)"
                  strokeWidth={3}
                  dot={{ fill: "#da01a6", r: 4 }}
                  key="line-series"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Destinations Chart */}
        <div className="px-6 mb-6">
          <div className="bg-card rounded-3xl p-4 border border-border shadow-sm">
            <div className="mb-4">
              <h3 className="mb-1">Popular Destinations</h3>
              <p className="text-sm text-muted-foreground">Top performing packages</p>
            </div>
            <ResponsiveContainer width="100%" height={200} key="destinations-chart">
              <BarChart data={destinationData}>
                <defs>
                  <linearGradient id="agencyBarChartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#da01a6" key="bar-stop-0" />
                    <stop offset="100%" stopColor="#7600c5" key="bar-stop-100" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" key="bar-grid" />
                <XAxis dataKey="destination" stroke="#6b7280" style={{ fontSize: "12px" }} key="bar-xaxis" />
                <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} key="bar-yaxis" />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  key="bar-tooltip"
                />
                <Bar dataKey="bookings" fill="url(#agencyBarChartGradient)" radius={[8, 8, 0, 0]} key="bar-series" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Demographics */}
        <div className="px-6 mb-6">
          <div className="bg-card rounded-3xl p-4 border border-border shadow-sm">
            <div className="mb-4">
              <h3 className="mb-1">User Demographics</h3>
              <p className="text-sm text-muted-foreground">Age distribution</p>
            </div>
            <div className="flex items-center justify-between">
              <ResponsiveContainer width="50%" height={180} key="demographics-chart">
                <PieChart>
                  <Pie
                    data={demographicData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    key="pie-series"
                  >
                    {demographicData.map((entry) => (
                      <Cell key={`demographic-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip key="pie-tooltip" />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {demographicData.map((item) => (
                  <div key={`legend-${item.name}`} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 mb-6">
          <h3 className="mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickActionCard title="Create Package" icon={<Package className="w-5 h-5" />} />
            <QuickActionCard title="View Requests" icon={<Users className="w-5 h-5" />} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
  isPositive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}) {
  return (
    <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
      <div
        className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, rgba(218, 1, 166, 0.1) 0%, rgba(118, 0, 197, 0.1) 100%)" }}
      >
        <div style={{ color: "var(--vaykae-pink)" }}>{icon}</div>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl">{value}</p>
        <div
          className={`flex items-center gap-1 text-xs ${
            isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          <span>{change}</span>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <button className="bg-card rounded-2xl p-4 border border-border shadow-sm hover:border-purple-300 dark:hover:border-purple-700 transition-colors text-left">
      <div
        className="w-10 h-10 rounded-xl mb-2 flex items-center justify-center"
        style={{ background: "var(--vaykae-gradient)" }}
      >
        <div className="text-white">{icon}</div>
      </div>
      <p className="text-sm">{title}</p>
    </button>
  );
}