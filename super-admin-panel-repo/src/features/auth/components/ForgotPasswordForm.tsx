import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { GradientButton } from '@/components/ui/gradient-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { postApi } from '@/utils/api';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const request = useMutation({
    mutationFn: () => postApi('/auth/forgot-password', { email }, true),
    onSuccess: () => {
      setMessage('If an account exists, a reset link has been sent.');
    },
    onError: (err: Error) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    request.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      {error && <p className='text-sm font-medium text-destructive' role='alert'>{error}</p>}
      {message && <p className='text-sm font-medium text-[var(--vaykae-purple)]' role='status'>{message}</p>}
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          name='email'
          type='email'
          autoComplete='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={request.isPending}
          className='h-11 rounded-2xl border-border bg-[var(--input-background)]'
        />
      </div>
      <GradientButton type='submit' className='w-full' disabled={request.isPending}>
        {request.isPending ? 'Sending...' : 'Send Reset Link'}
      </GradientButton>
    </form>
  );
}
