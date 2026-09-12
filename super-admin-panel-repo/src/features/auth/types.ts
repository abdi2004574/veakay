import type { UserRole, PlatformRole } from '@/types/common';


export interface AdminUser {
  userId: string;
  email: string;
  displayName: string;
  role: UserRole;
  platformRole: PlatformRole;
  isEmailVerified: boolean;
  isActive: boolean;
  twoFactorConfirmed?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TwoFactorCredentials {
  pendingToken: string;
  code: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  twoFactorConfirmed: boolean;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    displayName: string;
    role: string;
    isEmailVerified: boolean;
    onboardingComplete: boolean;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  twoFactorConfirmed: boolean;
}

export interface PendingTwoFactor {
  pendingToken: string;
  email: string;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
  platformRole: PlatformRole;
  isEmailVerified: boolean;
  isActive: boolean;
  twoFactorConfirmed?: boolean;
}
