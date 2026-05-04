import type { IdStatusResponse, ReviewSnippet } from "./common";

export interface AdminCleanerListItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  rating: number;
  status: string;
  joined: string;
}

export interface AdminCleanerDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  rating: number;
  joined: string;
  location: string | null;
  reviews: ReviewSnippet[];
}

export type BlockCleanerResponse = IdStatusResponse;

export interface PayCleanerRequest {
  amount: number;
  account_number: string;
  bank_name: string;
}

export interface PayCleanerResponse {
  transaction_id: string;
  amount: number;
  status: string;
}
