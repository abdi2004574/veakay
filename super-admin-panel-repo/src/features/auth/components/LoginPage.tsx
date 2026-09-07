import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import LoginForm from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Super Admin Sign In</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your credentials to access the Veakay admin panel
          </p>
        </div>
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            <Link to={ROUTES.FORGOT_PASSWORD} className="text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
