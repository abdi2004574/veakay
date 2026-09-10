"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  FolderKanban,
  CreditCard,
  BarChart3,
  Shield,
  FileText,
  UserPlus,
  BadgeCheck,
  Activity,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/ui.store";
import { useAuthStore } from "@/store/auth.store";

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Agencies",
    href: "/dashboard/agencies",
    icon: Building2,
  },
  {
    title: "Campaigns",
    href: "/dashboard/campaigns",
    icon: FolderKanban,
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Moderation",
    href: "/dashboard/moderation",
    icon: Shield,
  },
  {
    title: "Audit Log",
    href: "/dashboard/audit-log",
    icon: FileText,
  },
  {
    title: "Invites",
    href: "/dashboard/invites",
    icon: UserPlus,
  },
  {
    title: "KYC",
    href: "/dashboard/kyc",
    icon: BadgeCheck,
  },
  {
    title: "Badges",
    href: "/dashboard/badges",
    icon: Activity,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r bg-background transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-r from-vaykae-pink to-vaykae-purple text-white">
              <span className="text-sm font-bold">V</span>
            </div>
            <span className="text-lg font-semibold">Veakay</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-vaykae-pink/10 to-vaykae-purple/10 text-vaykae-purple"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <Icon className="size-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="size-5" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}

export function MobileMenuButton() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      onClick={toggleSidebar}
    >
      {sidebarOpen ? (
        <X className="size-5" />
      ) : (
        <Menu className="size-5" />
      )}
    </Button>
  );
}