import { getToken, isTokenExpired } from "../lib/auth-client";

export function requireAuth(): void {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    window.location.href = "/login";
    throw new Error("Not authenticated");
  }
}

export function getTokenExpiry(token: { accessToken: string; expiresAt: number } | null): number {
  return token?.expiresAt ?? 0;
}