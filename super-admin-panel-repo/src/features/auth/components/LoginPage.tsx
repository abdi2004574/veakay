import { Link } from "react-router-dom";
import { ROUTES } from "@/lib/constants";
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--vaykae-gradient-light)] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--vaykae-gradient)] text-2xl font-bold text-white shadow-[0_10px_28px_var(--vaykae-shadow)]">
            V
          </div>
          <p className="text-lg font-bold text-[var(--vaykae-purple)]">Vekay</p>
          <h1 className="mt-6 text-2xl font-bold">Super Admin Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your credentials to access the Vekay admin panel
          </p>
        </div>
        <div className="rounded-2xl border border-border/80 bg-white shadow-[0_20px_60px_var(--vaykae-shadow)]">
          <div className="p-6 sm:p-8">
            <LoginForm />
          </div>
          <div className="border-t p-4 text-center">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-sm font-medium text-[var(--vaykae-pink)] hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
