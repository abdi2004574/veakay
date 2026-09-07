export interface TokenPayload {
  accessToken: string;
  expiresAt: number;
}

const TOKEN_KEY = "veakay_admin_token";

export function getToken(): TokenPayload | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TokenPayload;
  } catch {
    return null;
  }
}

export function setToken(payload: TokenPayload): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(payload));
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isTokenExpired(token: TokenPayload | null): boolean {
  if (!token) return true;
  return Date.now() >= token.expiresAt;
}