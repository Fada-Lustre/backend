// Shared types used across multiple controllers

export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
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

export interface MessageResponse {
  message: string;
}

export interface IdStatusResponse {
  id: string;
  status: string;
}

export interface ReviewSnippet {
  rating: number;
  review_text: string | null;
  created_at: string;
}

export interface PersonSummary {
  id: string;
  name: string;
}

export interface PersonDetail {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}
