import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

const routeLabels: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.USERS]: 'Users',
  [ROUTES.AGENCIES]: 'Agencies',
  [ROUTES.CAMPAIGNS]: 'Campaigns',
  [ROUTES.PAYMENTS]: 'Payments',
  [ROUTES.CONTENT]: 'Content',
  [ROUTES.NOTIFICATIONS]: 'Notifications',
  [ROUTES.AUDIT]: 'Audit Log',
  [ROUTES.SETTINGS]: 'Settings',
  [ROUTES.LOGIN]: 'Login',
  [ROUTES.TWO_FACTOR]: 'Two-Factor',
  [ROUTES.FORGOT_PASSWORD]: 'Forgot Password',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  const items: BreadcrumbItem[] = [{ label: 'Home', to: ROUTES.DASHBOARD }];

  let accumulatedPath = '';
  for (const segment of segments) {
    accumulatedPath += `/${segment}`;
    const label = routeLabels[accumulatedPath] ?? segment.charAt(0).toUpperCase() + segment.slice(1);
    items.push({ label, to: accumulatedPath });
  }

  return (
    <nav
      aria-label="breadcrumb"
      className="flex items-center text-sm text-muted-foreground"
    >
      <Home className="h-4 w-4" />
      {items.map((item, index) => (
        <span key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="mx-1 h-3 w-3" />}
          {item.to && index < items.length - 1 ? (
            <Link to={item.to} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className={cn('text-foreground', index === 0 && 'sr-only')}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
