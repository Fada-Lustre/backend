import * as pmRepo from "../repositories/payment-method.repository";
import { ApplicationError } from "../errors";
import { assertOwnership } from "../middleware/ownership";
import type { PaymentMethodResponse, CreatePaymentMethodRequest } from "../types/payment-method";

export async function list(userId: string): Promise<PaymentMethodResponse[]> {
  return pmRepo.listByUser(userId) as unknown as Promise<PaymentMethodResponse[]>;
}

export async function create(
  userId: string,
  body: CreatePaymentMethodRequest
): Promise<PaymentMethodResponse> {
  const last4 = body.card_token.slice(-4);
  const brand = "visa";

  return pmRepo.create(userId, body.type, body.card_name, body.card_token, last4, brand) as unknown as Promise<PaymentMethodResponse>;
}

export async function remove(userId: string, pmId: string): Promise<void> {
  const row = await pmRepo.findByIdWithOwner(pmId);

  if (!row) {
    throw new ApplicationError(404, "Payment method not found", "NOT_FOUND");
  }

  assertOwnership(row.user_id, userId);

  await pmRepo.softDelete(pmId);
}
