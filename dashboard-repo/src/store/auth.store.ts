import { create } from "zustand";
import { persist } from "zustand/middleware";
import { clearAuthCookie, setAuthCookie } from "@/lib/auth-cookie";
import type { AuthState as AuthUser } from "@/types";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      setTokens: (accessToken, refreshToken) => {
        setAuthCookie(accessToken);
        set({ token: accessToken, refreshToken, isAuthenticated: true });
      },
      setUser: (user) => set({ user }),
      clearAuth: () => {
        clearAuthCookie();
        set({ token: null, refreshToken: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "veakay-auth",
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);