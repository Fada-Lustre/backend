import type { PersonSummary } from "./common";

export interface AdminTicketListItem {
  id: string;
  user_name: string;
  title: string;
  status: string;
  created_at: string;
  last_message_at: string;
}

export interface AdminTicketDetail {
  id: string;
  user: { id: string; name: string; email: string };
  title: string;
  message: string;
  status: string;
  assigned_to: PersonSummary | null;
  created_at: string;
  messages: { id: string; sender: string; body: string; created_at: string }[];
}

export interface AdminTicketMessageRequest {
  body: string;
}

export interface AdminTicketUpdateRequest {
  status?: string;
  assigned_to?: string;
}
