import { apiFetch } from '@/utils/api';
import { setToken, getAccessToken, removeToken } from '@/lib/auth-client';
import { queryClient } from '@/lib/query-client';
import type { AuthResponse, LoginCredentials, TwoFactorCredentials, PendingTwoFactor } from '@/features/auth/types';

export const AUTH_QUERY_KEYS = {
  me: ['auth', 'me'],
  sessions: ['auth', 'sessions'],
} as const;

export async function login(credentials: LoginCredentials): Promise<PendingTwoFactor> {
  const res = await apiFetch<{ pendingToken: string; email: string }>(
    '/admin/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(credentials),
    },
  );
  return res as PendingTwoFactor;
}

export async function verifyTwoFactor(
  credentials: TwoFactorCredentials,
): Promise<AuthResponse> {
  const res = await apiFetch<AuthResponse>('/admin/auth/2fa', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  return res as AuthResponse;
}

export async function refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
  const res = await apiFetch<{ accessToken: string; refreshToken: string; expiresIn: number }>(
    '/auth/refresh',
    {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    },
  );
  return res as unknown as AuthResponse;
}

export async function logout(): Promise<void> {
  const token = getAccessToken();
  if (token) {
    await apiFetch('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: token }),
    }).catch(() => {});
  }
  removeToken();
  queryClient.clear();
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
