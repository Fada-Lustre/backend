export interface AdminProfileResponse {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  profile_image_url: string | null;
  role: {
    id: string;
    name: string;
    display_name: string;
    permissions: string[];
  };
  status: string;
  created_at: string;
  last_login_at: string | null;
}

export interface UpdateAdminProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
}
