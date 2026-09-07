import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Forgot Password</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your email to receive a password reset link
          </p>
        </div>
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
