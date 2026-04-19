export interface EarningsSummary {
  total_earnings: string;
  total_withdrawals: string;
  bookings_completed: number;
  period: string;
}

export interface IncomeLine {
  id: string;
  service: string;
  customer: string;
  date: string;
  time: string;
  address: string;
  amount: string;
  status: string;
}

export interface WithdrawalLine {
  id: string;
  amount: string;
  date: string;
  time: string;
  status: string;
  bank_account: string | null;
  bank_name: string | null;
}

export interface CreateWithdrawalRequest {
  /** Must be > 0 and <= available balance */
  amount: number;
  /** 4-digit PIN string */
  pin: string;
}

export interface WithdrawalResponse {
  id: string;
  amount: string;
  status: string;
  bank_account: string | null;
  bank_name: string | null;
}
