import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileBoard,
  CreditCard,
  Shield,
  Bell,
  History,
  Settings,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Users', to: ROUTES.USERS, icon: Users },
  { label: 'Agencies', to: ROUTES.AGENCIES, icon: Building2 },
  { label: 'Campaigns', to: ROUTES.CAMPAIGNS, icon: FileBoard },
  { label: 'Payments', to: ROUTES.PAYMENTS, icon: CreditCard },
  { label: 'Content', to: ROUTES.CONTENT, icon: Shield },
  { label: 'Notifications', to: ROUTES.NOTIFICATIONS, icon: Bell },
  { label: 'Audit Log', to: ROUTES.AUDIT, icon: History },
  { label: 'Settings', to: ROUTES.SETTINGS, icon: Settings },
];

export default function Navigation() {
  return (
    <nav className="flex flex-col gap-1 p-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-sidebar-accent text-sidebar-primary'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary',
            )
          }
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
