import { type ApiResult, type ApiResponse } from "../types/api";
import { getToken, isTokenExpired, removeToken, getRefreshToken, setToken, setRefreshToken } from "../lib/auth-client";
import { useAuthStore } from "../stores/auth-store";
import { ROUTES } from "../lib/constants";

const API_BASE = import.meta.env.VITE_API_URL || "/api/v1";
const DEFAULT_TIMEOUT = 15000; // 15 seconds

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    if (response.status === 204) {
      return { success: true, data: undefined as T };
    }
    throw new ApiError(
      "INTERNAL_ERROR",
      "Unexpected response format",
      response.status,
    );
  }

  const body = (await response.json()) as ApiResult<T>;

  if (body.success === false) {
    throw new ApiError(body.error.code, body.error.message, response.status);
  }

  return body;
}

function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch(API_BASE + "/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        return null;
      }

      const data = await res.json();
      const newAccessToken = data.data?.accessToken;
      const newRefreshToken = data.data?.refreshToken;
      const expiresIn = data.data?.expiresIn;

      if (!newAccessToken || !expiresIn) {
        return null;
      }

      const expiresAt = Date.now() + expiresIn * 1000;
      const tokenPayload = {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken || refreshToken,
        expiresAt,
      };

      setToken(tokenPayload);
      if (newRefreshToken) {
        setRefreshToken(newRefreshToken);
      }

      useAuthStore.getState().setAuth(
        useAuthStore.getState().user!,
        tokenPayload,
      );

      return newAccessToken;
    } catch {
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
  _retry?: boolean;
  timeout?: number;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const { skipAuth = false, _retry = false, timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;
  const token = getToken();

  if (!skipAuth && isTokenExpired(token)) {
    removeToken();
    window.location.href = ROUTES.LOGIN;
    throw new ApiError("UNAUTHORIZED", "Session expired", 401);
  }

  const url = API_BASE + endpoint;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token?.accessToken) {
    (headers as Record<string, string>)["Authorization"] =
      "Bearer " + token.accessToken;
  }

  // Add Idempotency-Key for mutating requests
  const method = (fetchOptions.method || "GET").toUpperCase();
  if (["POST", "PATCH", "DELETE", "PUT"].includes(method)) {
    (headers as Record<string, string>)["Idempotency-Key"] = generateIdempotencyKey();
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle 401 by attempting token refresh
    if (response.status === 401 && !skipAuth && !_retry) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        // Retry the original request with new token
        return apiRequest<T>(endpoint, { ...options, _retry: true });
      } else {
        // Refresh failed, logout and redirect
        useAuthStore.getState().logout();
        window.location.href = ROUTES.LOGIN;
        throw new ApiError("UNAUTHORIZED", "Session expired", 401);
      }
    }

    const result = await handleResponse<T>(response);

    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("TIMEOUT", `Request timed out after ${timeout}ms`, 408);
    }
    throw error;
  }
}

export async function getApi<T>(
  endpoint: string,
  params?: Record<string, string>,
): Promise<ApiResponse<T>> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  return apiRequest<T>(endpoint + query, { method: "GET" });
}

export async function postApi<T>(
  endpoint: string,
  body?: unknown,
  skipAuth = false,
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
    skipAuth,
  });
}

export async function patchApi<T>(
  endpoint: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function deleteApi<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: "DELETE" });
}

export function parseCursorMeta(
  headers: Headers,
): { cursor: string; hasMore: boolean } | null {
  const cursor = headers.get("X-Next-Cursor");
  const hasMore = headers.get("X-Has-More") === "true";
  if (!cursor) return null;
  return { cursor, hasMore };
}
