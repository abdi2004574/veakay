import { useMemo } from "react";
import { useAuthStore } from "@/store/auth.store";

export function useAuth() {
  const { token, refreshToken, user, isAuthenticated, setTokens, setUser, clearAuth } =
    useAuthStore();

  const value = useMemo(
    () => ({
      token,
      refreshToken,
      user,
      isAuthenticated,
      setTokens,
      setUser,
      clearAuth,
    }),
    [token, refreshToken, user, isAuthenticated, setTokens, setUser, clearAuth],
  );

  return value;
}