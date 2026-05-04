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
  /** E.164 phone number */
  phone: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface VerifyOtpRequest {
  /** E.164 phone number */
  phone: string;
  /** 6-digit numeric code */
  code: string;
}

export interface VerifyOtpResponse {
  verified: boolean;
}

export interface ResetPasswordRequest {
  /** E.164 phone number — must have a verified OTP */
  phone: string;
  /** Min 8 chars, >= 1 number */
  new_password: string;
  confirm_password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  /** Min 8 chars, >= 1 number */
  new_password: string;
  confirm_password: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponse {
  token: string;
  refresh_token: string;
}

export interface AdminForgotPasswordRequest {
  email: string;
}

export interface AdminForgotPasswordResponse {
  message: string;
}

export interface AdminResetPasswordRequest {
  email: string;
  code: string;
  new_password: string;
  confirm_password: string;
}

export interface AdminResetPasswordResponse {
  message: string;
}

export interface AdminVerifyOtpRequest {
  email: string;
  /** 6-digit numeric code */
  code: string;
}

export interface AdminVerifyOtpResponse {
  verified: boolean;
}
