import { apiClient } from "./api";
import { useAuthStore } from "@/store/auth.store";

export function getServerToken(): string | null {
  try {
    return useAuthStore.getState().token;
  } catch {
    return null;
  }
}

export async function verifyServerAuth(): Promise<boolean> {
  const token = getServerToken();
  return !!token;
}

export async function login(email: string, password: string) {
  const response = await apiClient.post("/admin/auth/login", { email, password });
  return response.data.data as { pendingToken: string; requires2FA: boolean };
}

export async function verify2FA(pendingToken: string, code: string) {
  const response = await apiClient.post("/admin/auth/2fa", { pendingToken, code });
  return response.data.data as {
    user: {
      id: string;
      email: string;
      displayName: string;
      platformRole: "user" | "super_admin";
    };
    accessToken: string;
    refreshToken: string;
  };
}

export async function logout() {
  try {
    await apiClient.post("/auth/logout", {});
  } catch {
    // Ignore errors during logout
  }
  useAuthStore.getState().clearAuth();
}