export interface TopRatedPerson {
  id: string;
  name: string;
  rating: number;
  profile_image_url: string | null;
}

export interface UpcomingBookingGroup {
  service: string;
  started: number;
  pending: number;
  total: number;
}

export interface DashboardTransactionItem {
  id: string;
  ref: string;
  name: string;
  type: string;
  amount: number;
  date: string;
  time: string;
  status: string;
}

export interface DashboardResponse {
  balance: number;
  pending: number;
  total_bookings: number;
  top_clients: TopRatedPerson[];
  top_cleaners: TopRatedPerson[];
  upcoming_bookings: UpcomingBookingGroup[];
  service_counts: Record<string, number>;
  recent_transactions: {
    data: DashboardTransactionItem[];
    meta: { total: number; page: number; limit: number };
  };
}

/**
 * Aggregate stats block — filterable by an explicit date range (from/to) or a
 * relative period. This axis filters on record creation date (created_at).
 */
export interface DashboardStatsResponse {
  balance: number;
  pending: number;
  total_bookings: number;
  top_clients: TopRatedPerson[];
  top_cleaners: TopRatedPerson[];
  service_counts: Record<string, number>;
}

/**
 * Upcoming bookings block — filtered by scheduled_date over a week/day range,
 * a genuinely different date axis from the stats block.
 */
export interface DashboardUpcomingResponse {
  upcoming_bookings: UpcomingBookingGroup[];
}

/**
 * Transactions block — paginated, filterable by type (booking/payout) and date range.
 */
export interface DashboardTransactionsResponse {
  data: DashboardTransactionItem[];
  meta: { total: number; page: number; limit: number };
}
