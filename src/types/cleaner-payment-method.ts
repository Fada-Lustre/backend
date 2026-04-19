export interface CleanerPaymentMethodResponse {
  id: string;
  type: string;
  account_number: string | null;
  bank_name: string | null;
}

export interface CreateCleanerPaymentMethodRequest {
  account_number: string;
  account_holder: string;
  bank_name: string;
}
