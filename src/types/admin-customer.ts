import type { IdStatusResponse, ReviewSnippet } from "./common";

export interface AdminCustomerListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  rating: number;
  bookings_count: number;
  status: string;
  joined: string;
}

export interface AdminCustomerDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  rating: number;
  joined: string;
  bookings_count: number;
  last_booked: string | null;
  location: string | null;
  reviews: ReviewSnippet[];
}

export type BlockCustomerResponse = IdStatusResponse;
