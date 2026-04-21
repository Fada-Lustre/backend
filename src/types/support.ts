export interface CreateTicketRequest {
  /** 1-200 chars */
  title: string;
  /** 1-5000 chars */
  message: string;
}

export interface TicketListItem {
  id: string;
  title: string;
  status: string;
  created_at: string;
  last_message_at: string | null;
}

export interface TicketDetail {
  id: string;
  title: string;
  status: string;
  created_at: string;
  messages: { id: string; sender: string; body: string; created_at: string }[];
}
