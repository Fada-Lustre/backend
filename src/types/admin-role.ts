export interface RoleListItem {
  id: string;
  name: string;
  display_name: string;
  access: string[];
  user_count: number;
  date_added: string;
  is_system: boolean;
}

export interface RoleListResponse {
  data: RoleListItem[];
}

export interface CreateRoleRequest {
  /** Unique, 1-100 chars */
  name: string;
  display_name: string;
  access: string[];
}

export interface CreateRoleResponse {
  id: string;
  name: string;
  access: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  display_name?: string;
  access?: string[];
}

export interface ArchiveRoleResponse {
  id: string;
  status: string;
}
