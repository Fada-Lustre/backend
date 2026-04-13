// Shared types used across multiple controllers

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface PaginationMeta {
  total: number;
  page?: number;
  limit?: number;
}

export interface ListResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
