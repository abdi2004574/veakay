import { Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Settings, User } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { useAuthStore } from '@/stores/auth-store';

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <Breadcrumbs />
      <div className="flex items-center gap-2">
        <button
          className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <div className="border-l pl-2">
          <UserMenu onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}

function UserMenu({ onLogout }: { onLogout: () => void }) {
  const user = useAuthStore((s) => s.user);
  const displayName = user?.email ?? 'Admin';

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
        type="button"
        id="user-menu-button"
      >
        {displayName}
        <User className="h-4 w-4" />
      </button>
    </div>
  );
}
