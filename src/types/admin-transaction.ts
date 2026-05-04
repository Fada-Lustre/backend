export interface AdminTransactionListItem {
  id: string;
  ref: string | null;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  date?: string;
  time?: string;
  name: string | null;
}

export interface AdminTransactionDetail {
  id: string;
  ref: string | null;
  date: string;
  name: string | null;
  amount: number;
  type: string;
  payment_method: string | null;
  status: string;
}
