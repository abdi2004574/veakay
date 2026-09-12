import { type ApiResult, type ApiResponse } from "../types/api";
import { getToken, isTokenExpired, removeToken } from "../lib/auth-client";
import { ROUTES } from "../lib/constants";

const API_BASE = import.meta.env.VITE_API_URL || "/api/v1";

class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<ApiResult<T>> {
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    if (response.status === 204) {
      return { success: true, data: undefined as T };
    }
    throw new ApiError("INTERNAL_ERROR", "Unexpected response format", response.status);
  }

  const body = (await response.json()) as ApiResult<T>;

  if (body.success === false) {
    throw new ApiError(body.error.code, body.error.message, response.status);
  }

  return body;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();

  if (isTokenExpired(token)) {
    removeToken();
    window.location.href = ROUTES.LOGIN;
    throw new ApiError("UNAUTHORIZED", "Session expired", 401);
  }

  const url = `${API_BASE}${endpoint}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token?.accessToken) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token.accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 by clearing auth
  if (response.status === 401) {
    removeToken();
    window.location.href = ROUTES.LOGIN;
  }

  const result = await handleResponse<T>(response);

  if (result.success === false) {
    throw new ApiError(result.error.code, result.error.message, response.status);
  }

  return result;
}

export async function getApi<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  return apiRequest<T>(`${endpoint}${query}`, { method: "GET" });
}

export async function postApi<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function patchApi<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function deleteApi<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, { method: "DELETE" });
}

export function parseCursorMeta(headers: Headers): { cursor: string; hasMore: boolean } | null {
  const cursor = headers.get("X-Next-Cursor");
  const hasMore = headers.get("X-Has-More") === "true";
  if (!cursor) return null;
  return { cursor, hasMore };
}
