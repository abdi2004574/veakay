import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { verifyTwoFactor } from '@/features/auth/api/auth';
import type { TwoFactorCredentials, AuthResponse } from '@/features/auth/types';

export function useTwoFactorMutation() {
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);
  const [isLocked, setIsLocked] = useState(false);
  const mutation = useMutation({
    mutationFn: verifyTwoFactor,
    onError: () => {
      setAttemptsRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setIsLocked(true);
        }
        return next;
      });
    },
    onSuccess: (data: AuthResponse) => {
      // Token is set by the calling component
      return data;
    },
  });

  const resetAttempts = useCallback(() => {
    setAttemptsRemaining(5);
    setIsLocked(false);
  }, []);

  return {
    ...mutation,
    attemptsRemaining,
    isLocked,
    resetAttempts,
  };
}
