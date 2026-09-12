import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getToken, setToken, removeToken, isTokenExpired } from "../lib/auth-client";
import type { UserRole } from "../types/common";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  platformRole: "super_admin";
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setAuth: (user: User, token: { accessToken: string; expiresAt: number }) => void;
  logout: () => void;
  hydrate: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      setAuth: (user, token) => {
        setToken(token);
        set({
          user,
          accessToken: token.accessToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },

      logout: () => {
        removeToken();
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      hydrate: async () => {
        const token = getToken();
        if (!token || isTokenExpired(token)) {
          removeToken();
          set({ isLoading: false, isAuthenticated: false, user: null, accessToken: null });
          return;
        }
        // Token exists and is valid - we will fetch user from /me on first protected route
        set({
          accessToken: token.accessToken,
          isAuthenticated: true,
          isLoading: false,
          user: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "veakay_admin_auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
