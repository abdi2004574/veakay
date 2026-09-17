import TwoFactorForm from '@/features/auth/components/TwoFactorForm';

export default function TwoFactorPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-[var(--vaykae-gradient-light)] p-4'>
      <div className='w-full max-w-md'>
        <div className='mb-8 text-center'>
          <div className='mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--vaykae-gradient)] text-2xl font-bold text-white shadow-[0_10px_28px_var(--vaykae-shadow)]'>
            V
          </div>
          <p className='text-lg font-bold text-[var(--vaykae-purple)]'>Vekay</p>
          <h1 className='mt-6 text-2xl font-bold'>Two-Factor Authentication</h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            Enter the 6-digit code from your authenticator app
          </p>
        </div>
        <div className='rounded-2xl border border-border/80 bg-white p-6 shadow-[0_20px_60px_var(--vaykae-shadow)] sm:p-8'>
          <TwoFactorForm />
        </div>
      </div>
    </div>
  );
}
