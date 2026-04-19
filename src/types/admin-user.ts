import type { IdStatusResponse } from "./common";

export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  last_login: string | null;
  joined: string;
  status: string;
}

export interface AdminUserListResponse {
  data: AdminUserListItem[];
  meta: { total: number; page: number; limit: number };
}

export interface InviteAdminRequest {
  first_name: string;
  last_name: string;
  /** Must be unique */
  email: string;
  role_id: string;
}

export interface InviteAdminResponse {
  id: string;
  message: string;
}

export type BlockAdminResponse = IdStatusResponse;
