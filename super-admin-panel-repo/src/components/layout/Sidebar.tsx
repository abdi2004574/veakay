import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Menu } from "lucide-react";
import { ROUTES, APP_TITLE } from "@/lib/constants";
import Navigation from "./Navigation";
import { useUiStore } from "@/stores/ui-store";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GradientButton } from "@/components/ui/gradient-button";

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUiStore();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-background transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-3">
        <div
          className={cn(
            "relative overflow-hidden rounded-xl bg-[var(--vaykae-gradient)] p-3",
            sidebarCollapsed ? "px-2" : "",
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                <span className="text-lg font-bold text-[var(--vaykae-pink)]">
                  V
                </span>
              </div>
              {!sidebarCollapsed && (
                <span className="text-lg font-bold text-white drop-shadow-sm">
                  {APP_TITLE}
                </span>
              )}
            </Link>
            <button
              onClick={toggleSidebar}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/20 text-white transition-colors hover:bg-white/35"
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              {sidebarCollapsed ? (
                <Menu className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <Navigation />
      </div>

      {user && (
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src="" alt={user.email} />
              <AvatarFallback className="bg-[var(--vaykae-gradient-light)] text-[var(--vaykae-pink)]">
                {user.email?.[0]?.toUpperCase() ?? "A"}
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {user.email}
                </span>
                <span className="block text-xs text-muted-foreground">
                  Super Admin
                </span>
              </div>
            )}
          </div>
          <div className={cn("mt-2", sidebarCollapsed ? "hidden" : "block")}>
            <GradientButton
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleLogout}
            >
              Log out
            </GradientButton>
          </div>
        </div>
      )}
    </aside>
  );
}
