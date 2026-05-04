import type { PersonDetail } from "./common";

export interface AdminBookingListItem {
  id: string;
  customer_name: string;
  customer_location: string | null;
  service_type: string;
  scheduled_date: string;
  time_start: string;
  time_end: string | null;
  status: string;
  total_price: number;
  cleaner_name: string | null;
  created_at: string;
}

export interface AdminBookingDetail {
  id: string;
  service_type: string;
  booked_on: string;
  booked_for: { date: string; time_start: string; time_end: string | null };
  location: string | null;
  price: number;
  payment_method: string | null;
  status: string;
  transaction_ref: string | null;
  additional_info: string | null;
  property_type: string | null;
  total_sq_metres: number | null;
  floors: number;
  rooms: number;
  bathrooms: number;
  customer: PersonDetail | null;
  cleaner: PersonDetail | null;
  images: { id: string; url: string; uploaded_at: string }[];
}

export interface AdminCreateBookingRequest {
  customer_name: string;
  location: string;
  email: string;
  phone: string;
  service_type: string;
  condition?: string;
  property_type?: string;
  total_sq_metres?: number;
  rooms: number;
  floors?: number;
  bathrooms: number;
  add_ons?: string[];
  date: string;
  time_start: string;
  time_end?: string;
  cleaning_address: string;
  additional_info?: string;
  use_same_cleaner?: boolean;
  total_price?: number;
}

export interface AdminAssignRequest {
  cleaner_id: string;
}

export interface AdminRescheduleRequest {
  date: string;
  start_time: string;
  end_time?: string;
}
