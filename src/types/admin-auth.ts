export interface ActivateRequest {
  email: string;
  temporary_password: string;
}

export interface ActivateResponse {
  activation_token: string;
  requires_profile_setup: boolean;
}

export interface SetupProfileRequest {
  first_name: string;
  last_name: string;
  /** E.164 phone number */
  phone: string;
  /** Min 8 chars, uppercase, lowercase, digit */
  password: string;
  confirm_password: string;
}

export interface SetupProfileResponse {
  id: string;
  token: string;
  refresh_token: string;
}
