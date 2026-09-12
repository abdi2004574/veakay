import { apiRequest } from '@/utils/api';
import { getToken, removeToken } from '@/lib/auth-client';
import { queryClient } from '@/lib/query-client';
import type { AuthResponse, LoginCredentials, TwoFactorCredentials, PendingTwoFactor } from '@/features/auth/types';

export const AUTH_QUERY_KEYS = {
  me: ['auth', 'me'],
  sessions: ['auth', 'sessions'],
} as const;

export async function login(credentials: LoginCredentials): Promise<PendingTwoFactor> {
  const res = await apiRequest<{ pendingToken: string; email: string }>(
    '/admin/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(credentials),
    },
  );
  return res.data;
}

export async function verifyTwoFactor(
  credentials: TwoFactorCredentials,
): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>('/admin/auth/2fa', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  return res.data;
}

export async function refreshAccessToken(refreshToken: string): Promise<AuthResponse> {
  const res = await apiRequest<{ accessToken: string; refreshToken: string; expiresIn: number }>(
    '/auth/refresh',
    {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    },
  );
  return {
    user: {
      id: '',
      email: '',
      displayName: '',
      role: '',
      isEmailVerified: false,
      onboardingComplete: false,
    },
    accessToken: res.data.accessToken,
    refreshToken: res.data.refreshToken,
    expiresIn: res.data.expiresIn,
    twoFactorConfirmed: true,
  };
}

export async function logout(): Promise<void> {
  const token = getToken();
  if (token) {
    await apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: token }),
    }).catch(() => {});
  }
  removeToken();
  queryClient.clear();
}

export async function forgotPassword(email: string): Promise<string> {
  const res = await apiRequest<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return res.data.message;
}
