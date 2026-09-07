import { useAuthStore } from "../stores/auth-store";

export function useAuth() {
  const { user, accessToken, isAuthenticated, isLoading, error, setAuth, logout, hydrate, clearError } = useAuthStore();

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    setAuth,
    logout,
    hydrate,
    clearError,
  };
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (!isAuthenticated && !isLoading) {
    window.location.href = "/login";
  }

  return { isAuthenticated, isLoading };
}