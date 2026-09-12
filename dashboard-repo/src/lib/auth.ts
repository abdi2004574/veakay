import { apiClient } from "./api";
import { useAuthStore } from "@/store/auth.store";
import type { LoginStep1Response, LoginStep2Response } from "@/types";

export async function login(
  email: string,
  password: string,
): Promise<LoginStep1Response> {
  const response = await apiClient.post("/admin/auth/login", { email, password });
  return response.data.data as LoginStep1Response;
}

export async function verify2FA(
  pendingToken: string,
  code: string,
): Promise<LoginStep2Response> {
  const response = await apiClient.post("/admin/auth/2fa", { pendingToken, code });
  return response.data.data as LoginStep2Response;
}

export async function logout() {
  try {
    await apiClient.post("/auth/logout", {});
  } catch {
    // Ignore errors during logout
  }
  useAuthStore.getState().clearAuth();
}