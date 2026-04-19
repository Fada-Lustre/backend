export interface CleanerProfileResponse {
  id: string;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  email: string;
  profile_image_url: string | null;
  rating: number | null;
  completed_bookings: number;
  location: string | null;
  address: CleanerHomeAddress | null;
}

export interface CleanerHomeAddress {
  street: string | null;
  country: string | null;
  postcode: string | null;
  floor_number: string | null;
  door_number: string | null;
  entrance_notes: string | null;
}

export interface UpdateCleanerProfileRequest {
  /** 1-100 chars */
  first_name?: string;
  /** 1-100 chars */
  last_name?: string;
}

import type { UpdatePhoneRequest, UpdatePhoneResponse } from "./profile";

export type UpdateCleanerPhoneRequest = UpdatePhoneRequest;
export type UpdateCleanerPhoneResponse = UpdatePhoneResponse;

export interface UpdateCleanerAddressRequest {
  /** Required */
  address: string;
  /** Required */
  country: string;
  /** Required */
  postcode: string;
  floor_number?: string;
  door_number?: string;
  entrance_notes?: string;
}

export interface UpdateCleanerAddressResponse {
  street: string;
  country: string;
  postcode: string;
  floor_number: string | null;
  door_number: string | null;
  entrance_notes: string | null;
}
