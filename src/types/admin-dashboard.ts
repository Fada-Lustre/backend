export interface DashboardResponse {
  balance: number;
  pending: number;
  total_bookings: number;
  top_clients: { id: string; name: string; rating: number }[];
  top_cleaners: { id: string; name: string; rating: number }[];
  upcoming_bookings: { service: string; started: number; pending: number; total: number }[];
  service_counts: Record<string, number>;
  recent_transactions: { id: string; ref: string; name: string; type: string; amount: number; date: string; time: string; status: string }[];
}
