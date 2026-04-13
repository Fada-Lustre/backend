import type { DayOfWeek } from "./common";

export type AddOnSlug = "oven" | "fridge" | "windows" | "chairs";
export type FrequencyOption = "one-off" | "2-3-times-a-week" | "every-week" | "every-2-weeks";
export type CleaningProducts = "bring" | "provide";

export type { DayOfWeek };

export interface AddOn {
  id: string;
  name: string;
  slug: AddOnSlug;
  hours_added: number;
}

export interface PricingConfig {
  hourly_rate: number;
  cleaning_products_fee: number;
  service_fee: number;
  weekend_surcharge: number;
  currency: "GBP";
  add_ons: AddOn[];
  frequencies: FrequencyOption[];
  cleaning_products_note: string;
}

export interface QuoteLineItem {
  label: string;
  amount: number;
}

export interface QuoteRequest {
  /** Valid UK postcode e.g. DE1 1AA */
  postcode: string;
  /** Number of rooms to clean (1–20) */
  rooms: number;
  /** Number of bathrooms (0–10) */
  bathrooms: number;
  /** Selected add-on services */
  add_ons?: AddOnSlug[];
  /** Duration in hours. Valid values: 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0 */
  hours: number;
  /** 'bring' = Fada provides sprays and cloths (not mops, buckets, or vacuums). 'provide' = customer provides all products. */
  cleaning_products: CleaningProducts;
  frequency: FrequencyOption;
  preferred_days?: DayOfWeek[];
  email: string;
  newsletter_opt_in?: boolean;
}

export interface QuoteResponse {
  id: string;
  postcode: string;
  rooms: number;
  bathrooms: number;
  add_ons: AddOnSlug[];
  hours: number;
  cleaning_products: CleaningProducts;
  frequency: FrequencyOption;
  preferred_days: DayOfWeek[];
  line_items: QuoteLineItem[];
  total: number;
  currency: "GBP";
  recommended_hours: number;
}

export interface QuoteScheduleRequest {
  /** ISO date string (YYYY-MM-DD). Must be a future date. */
  preferred_date: string;
  /** Arrival time slot. 30-min intervals between 09:00 and 17:00 e.g. "10:00" */
  preferred_time: string;
}

export interface QuoteScheduleResponse {
  id: string;
  preferred_date: string;
  preferred_time: string;
  /** Additional charge of £10 applied when booking falls on Friday, Saturday, or Sunday */
  weekend_surcharge: number;
  final_total: number;
  currency: "GBP";
}
