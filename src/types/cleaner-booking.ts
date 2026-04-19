export interface CleanerBookingListItem {
  id: string;
  service_type: string;
  date: string;
  time: string;
  status: string;
  customer: { name: string; rating: number | null } | null;
}

export interface CleanerBookingDetail {
  id: string;
  service_type: string;
  status: string;
  date: string;
  time: string;
  additional_info: string | null;
  customer: {
    id: string;
    name: string;
    rating: number | null;
    completed_bookings: number;
  } | null;
  address: {
    label: string | null;
    street: string;
    floor_number: string | null;
    door_number: string | null;
    county: string | null;
    entrance_notes: string | null;
  } | null;
}

import type { RateBookingRequest } from "./booking";

export type CleanerRateRequest = RateBookingRequest;
