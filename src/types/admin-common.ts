import { PaginationMeta } from "./common";

export interface AdminListResponse<T> {
  data: T[];
  stats: Record<string, unknown>;
  meta: PaginationMeta;
}
