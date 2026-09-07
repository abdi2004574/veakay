import { Link } from 'react-router-dom';
import { ChevronLeft, Menu } from 'lucide-react';
import { ROUTES, APP_TITLE } from '@/lib/constants';
import Navigation from './Navigation';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const user = useAuthStore((s) => s.user);

  return (
    <aside
      className={cn(
        'flex flex-col border-r bg-sidebar transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!sidebarCollapsed && (
          <Link to={ROUTES.DASHBOARD} className="text-xl font-bold text-sidebar-primary">
            {APP_TITLE}
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="rounded-md p-1 hover:bg-sidebar-accent"
        >
          {sidebarCollapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Navigation />
      </div>

      {user && (
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={user.email} />
              <AvatarFallback>{user.email?.[0]?.toUpperCase() ?? 'A'}</AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-sidebar-primary">
                  {user.email}
                </span>
                <span className="text-xs text-sidebar-foreground/70">
                  Super Admin
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
