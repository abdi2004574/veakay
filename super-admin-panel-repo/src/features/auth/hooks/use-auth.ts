import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { login, verifyTwoFactor, logout, forgotPassword } from '@/features/auth/api/auth';
import { AUTH_QUERY_KEYS } from '@/features/auth/api/auth';
import { setToken, removeToken, getToken } from '@/lib/auth-client';
import { useAuthStore } from '@/stores/auth-store';
import type { LoginCredentials, TwoFactorCredentials, AuthResponse } from '@/features/auth/types';

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.me });
    },
  });
}

export function useTwoFactor() {
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: verifyTwoFactor,
    onSuccess: (data: AuthResponse) => {
      const expiresIn = data.expiresIn || 900;
      setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: Date.now() + expiresIn * 1000,
        user: {
          id: data.user.id,
          email: data.user.email,
          displayName: data.user.displayName,
          role: data.user.role,
          platformRole: data.user.role,
          isEmailVerified: data.user.isEmailVerified,
        },
      });
    },
  });
}

export function useLogout() {
  const { logout: storeLogout } = useAuthStore();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      storeLogout();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useCurrentUser() {
  const token = getToken();
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me,
    queryFn: () => {
      if (!token) return null;
      return { user: token.user };
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
}
