export type AddressLabel = "home" | "office" | "custom";

export interface CreateAddressRequest {
  /** 1-500 chars */
  street: string;
  /** 1-10 chars */
  floor_number?: string;
  /** 1-10 chars */
  door_number?: string;
  /** 0-2000 chars */
  additional_info?: string;
  /** 0-2000 chars */
  entrance_notes?: string;
  label: AddressLabel;
  /** Required when label is "custom", 1-50 chars */
  custom_label?: string;
}

export interface UpdateAddressRequest extends CreateAddressRequest {}

export interface AddressResponse {
  id: string;
  street: string;
  floor_number: string | null;
  door_number: string | null;
  additional_info: string | null;
  entrance_notes: string | null;
  label: string;
  custom_label: string | null;
  is_default: boolean;
}
