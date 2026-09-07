import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground mb-6">
          The page you are looking for does not exist.
        </p>
        <Link
          to={ROUTES.DASHBOARD}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Home className="h-4 w-4" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
