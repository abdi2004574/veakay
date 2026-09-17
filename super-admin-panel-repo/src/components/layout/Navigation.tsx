import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  CreditCard,
  Shield,
  Bell,
  History,
  Settings,
  UserPlus,
  Award,
  AlertTriangle,
  Trophy,
  BarChart3,
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
  { label: 'Campaigns', to: ROUTES.CAMPAIGNS, icon: FileText },
  { label: 'Payments', to: ROUTES.PAYMENTS, icon: CreditCard },
  { label: 'Content', to: ROUTES.CONTENT, icon: Shield },
  { label: 'Notifications', to: ROUTES.NOTIFICATIONS, icon: Bell },
  { label: 'Admin Invites', to: ROUTES.INVITES, icon: UserPlus },
  { label: 'Verified Badges', to: ROUTES.BADGES, icon: Award },
  { label: 'Fraud Flags', to: ROUTES.FRAUD, icon: AlertTriangle },
  { label: 'Top Performers', to: ROUTES.TOP_PERFORMERS, icon: Trophy },
  { label: 'Analytics', to: ROUTES.ANALYTICS, icon: BarChart3 },
  { label: 'Audit Log', to: ROUTES.AUDIT, icon: History },
  { label: 'Settings', to: ROUTES.SETTINGS, icon: Settings },
];

export default function Navigation() {
  return (
    <nav className='flex flex-col gap-1 p-2'>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'border-l-2 border-[var(--vaykae-pink)] bg-[var(--vaykae-gradient-light)] text-[var(--vaykae-pink)]'
                : 'text-muted-foreground hover:bg-muted',
            )
          }
        >
          <item.icon className='h-5 w-5' />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
