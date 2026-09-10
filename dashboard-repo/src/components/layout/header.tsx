"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";

export function Header() {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-full rounded-lg border bg-background pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-vaykae-purple/50"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="size-5" />
        </Button>
        <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-vaykae-pink to-vaykae-purple text-xs font-semibold text-white">
            {user?.displayName?.[0]?.toUpperCase() || "A"}
          </div>
          <div className="hidden flex-col md:flex">
            <span className="text-sm font-medium">
              {user?.displayName || "Admin"}
            </span>
            <span className="text-xs text-muted-foreground">
              Super Admin
            </span>
          </div>
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}