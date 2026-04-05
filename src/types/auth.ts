export interface RegisterRequest {
  first_name: string;
  email: string;
  /** Minimum 8 characters, must include at least one number */
  password: string;
  service_type: string;
}

export interface AuthResponse {
  id: string;
  first_name: string;
  email: string;
  token: string;
  refresh_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  first_name: string;
  token: string;
  refresh_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}
