export type ServiceType = "domestic" | "commercial" | "hotel" | "laundry" | "end_of_tenancy" | "appliance";
export type PropertyCondition = "mildly_used" | "heavily_used" | "new";
export type PropertyType = "home" | "condo" | "office" | "hotel";
export type PaymentMethod = "cash" | "card" | "apple_pay" | "google_pay";
export type BookingStatus = "unassigned" | "scheduled" | "on_the_way" | "ongoing" | "done" | "cancelled";
export type PaymentStatus = "pending" | "successful" | "failed" | "refunded" | "partially_refunded";
export type BookingAddOn = "oven" | "dryer" | "airfryer" | "dishwasher";

export interface CreateBookingRequest {
  address_id: string;
  service_type: ServiceType;
  condition: PropertyCondition;
  property_type: PropertyType;
  total_sq_metres: number;
  /** 1-50 */
  rooms: number;
  /** 1-20 */
  floors: number;
  /** 0-20 */
  bathrooms: number;
  add_ons?: BookingAddOn[];
  /** ISO date, must be in the future */
  date: string;
  /** HH:MM format */
  time: string;
  /** 0-2000 chars */
  additional_info?: string;
  use_same_cleaner?: boolean;
}

export interface BookingListItem {
  id: string;
  service_type: string;
  date: string;
  time: string;
  status: string;
  cleaner: { name: string; rating: number | null } | null;
}

export interface BookingDetail {
  id: string;
  service_type: string;
  status: string;
  date: string;
  time: string;
  additional_info: string | null;
  use_same_cleaner: boolean;
  cleaner: { id: string; name: string; rating: number | null; completed_bookings: number; location: string | null } | null;
  payment: {
    booking_fee: string | null;
    charges: string | null;
    discount: string | null;
    total: string | null;
    method: string | null;
    status: string;
  };
}

export interface PayBookingRequest {
  method: PaymentMethod;
  /** >= 0, default 0. 100% to cleaner */
  tip?: number;
}

export interface PayBookingResponse {
  transaction_id: string;
  client_secret?: string;
  status: string;
}

export interface AmendBookingRequest {
  floors?: number;
  rooms?: number;
  bathrooms?: number;
  add_ons?: BookingAddOn[];
  additional_info?: string;
}

export interface RescheduleBookingRequest {
  /** Future ISO date */
  date: string;
  /** HH:MM */
  time: string;
}

export interface RateBookingRequest {
  /** 1-5 */
  rating: number;
  /** 0-2000 chars */
  review?: string;
}

export interface BookingImageResponse {
  id: string;
  url: string;
  uploaded_at: string;
}

export interface ReceiptResponse {
  booking_fee: string | null;
  charges: string | null;
  discount: string | null;
  total: string | null;
  payment_method: string | null;
  payment_status: string;
  service: string;
  additional_info: string | null;
}
