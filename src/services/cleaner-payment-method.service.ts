import * as pmRepo from "../repositories/payment-method.repository";
import { ApplicationError } from "../errors";
import { assertOwnership } from "../middleware/ownership";
import type { CleanerPaymentMethodResponse, CreateCleanerPaymentMethodRequest } from "../types/cleaner-payment-method";

export async function list(userId: string): Promise<CleanerPaymentMethodResponse[]> {
  return pmRepo.listBankAccountsByUser(userId) as unknown as Promise<CleanerPaymentMethodResponse[]>;
}

export async function create(
  userId: string, body: CreateCleanerPaymentMethodRequest
): Promise<CleanerPaymentMethodResponse> {
  return pmRepo.createBankAccount(userId, body.account_number, body.account_holder, body.bank_name) as unknown as Promise<CleanerPaymentMethodResponse>;
}

export async function remove(userId: string, pmId: string): Promise<void> {
  const row = await pmRepo.findByIdWithOwner(pmId);
  if (!row) throw new ApplicationError(404, "Payment method not found", "NOT_FOUND");
  assertOwnership(row.user_id, userId);
  await pmRepo.softDelete(pmId);
}
