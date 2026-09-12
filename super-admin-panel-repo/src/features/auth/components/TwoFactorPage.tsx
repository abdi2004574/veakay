import TwoFactorForm from '@/features/auth/components/TwoFactorForm';

export default function TwoFactorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Two-Factor Authentication</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <TwoFactorForm />
        </div>
      </div>
    </div>
  );
}
