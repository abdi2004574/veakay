export const AUTH_COOKIE_NAME = "veakay-access-token";

export function setAuthCookie(token: string): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${AUTH_COOKIE_NAME}=${token}; Path=/; SameSite=Lax`;
}

export function clearAuthCookie(): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}
