import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FolderKanban,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Clock,
} from "lucide-react";

const kpiData = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Active Campaigns",
    value: "342",
    change: "+8.2%",
    trend: "up",
    icon: FolderKanban,
    color: "from-vaykae-pink to-vaykae-purple",
  },
  {
    title: "Total Funds Raised",
    value: "$2.4M",
    change: "+23.1%",
    trend: "up",
    icon: DollarSign,
    color: "from-green-500 to-green-600",
  },
  {
    title: "Platform Revenue",
    value: "$186K",
    change: "+15.3%",
    trend: "up",
    icon: TrendingUp,
    color: "from-orange-500 to-orange-600",
  },
];

const recentActivity = [
  { id: 1, action: "New agency registered", entity: "WanderLux Travel", time: "2 min ago", status: "pending" },
  { id: 2, action: "Campaign approved", entity: "Summer in Japan", time: "15 min ago", status: "approved" },
  { id: 3, action: "Withdrawal request", entity: "$5,000 to agency", time: "1 hour ago", status: "pending" },
  { id: 4, action: "User flagged", entity: "user_12345", time: "2 hours ago", status: "flagged" },
  { id: 5, action: "Payment received", entity: "$250 donation", time: "3 hours ago", status: "completed" },
];

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
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ArrowUpRight className="size-3 text-green-500" />
                  {kpi.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                      <Activity className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.entity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        item.status === "approved" || item.status === "completed"
                          ? "success"
                          : item.status === "pending"
                          ? "pending"
                          : "outline"
                      }
                    >
                      {item.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" />
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
}