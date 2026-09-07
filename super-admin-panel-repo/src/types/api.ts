export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

export interface CursorMeta {
  cursor: string;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: CursorMeta;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;