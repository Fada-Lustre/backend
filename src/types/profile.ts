export interface ProfileResponse {
  id: string;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  email: string;
  profile_image_url: string | null;
  rating: number | null;
}

export interface UpdateProfileRequest {
  /** 1-100 chars */
  first_name?: string;
  /** 1-100 chars */
  last_name?: string;
}

export interface UpdatePhoneRequest {
  /** E.164 phone number */
  phone: string;
  verification_method: "sms" | "email";
}

export interface UpdatePhoneResponse {
  message: string;
  verification_method: string;
}
