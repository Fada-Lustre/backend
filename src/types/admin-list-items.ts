export interface AdminCustomerListItem {
  id: string;
  name: string;
  joined: string;
  email: string;
  phone: string | null;
  status: string;
  primary_address: string | null;
  rating: number | null;
  avg_income: number | null;
  last_booked: string | null;
}

export interface AdminCleanerListItem {
  id: string;
  name: string;
  joined: string;
  rating: number | null;
  reviews_count: number;
  services: string[];
  address: string | null;
  status: string;
  total_booked: number;
  last_appointment: string | null;
}

export interface AdminTicketListItem {
  id: string;
  title: string;
  user: { id: string; name: string; role: string };
  status: string;
  assigned_to: string | null;
  created_at: string;
  last_message_at: string | null;
}
