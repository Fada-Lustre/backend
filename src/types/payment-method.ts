export interface PaymentMethodResponse {
  id: string;
  type: string;
  last4: string | null;
  brand: string | null;
}

export interface CreatePaymentMethodRequest {
  type: "card";
  /** 1-100 chars */
  card_name: string;
  /** Valid Stripe token */
  card_token: string;
}
