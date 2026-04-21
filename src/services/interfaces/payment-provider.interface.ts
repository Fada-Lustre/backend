export interface PaymentIntent {
  id: string;
  clientSecret: string;
  status: "requires_confirmation" | "requires_action" | "succeeded" | "canceled";
  amount: number;
  currency: string;
}

export interface PaymentProvider {
  createPaymentIntent(options: {
    amount: number;
    currency: string;
    metadata?: Record<string, string>;
  }): Promise<PaymentIntent>;

  attachPaymentMethod(customerId: string, token: string): Promise<{
    id: string;
    last4: string;
    brand: string;
  }>;

  detachPaymentMethod(paymentMethodId: string): Promise<void>;

  verifyWebhookSignature(payload: string | Buffer, signature: string): unknown;
}
