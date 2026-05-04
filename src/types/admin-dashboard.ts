export interface DashboardResponse {
  balance: number;
  pending: number;
  total_bookings: number;
  top_clients: { id: string; name: string; rating: number; profile_image_url: string | null }[];
  top_cleaners: { id: string; name: string; rating: number; profile_image_url: string | null }[];
  upcoming_bookings: { service: string; started: number; pending: number; total: number }[];
  service_counts: Record<string, number>;
  recent_transactions: {
    data: { id: string; ref: string; name: string; type: string; amount: number; date: string; time: string; status: string }[];
    meta: { total: number; page: number; limit: number };
  };
}
