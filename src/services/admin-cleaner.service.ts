import * as userRepo from "../repositories/user.repository";
import * as reviewRepo from "../repositories/review.repository";
import * as txRepo from "../repositories/transaction.repository";
import { ApplicationError } from "../errors";
import { logActivity } from "./activity-log.service";
import { firstOr404 } from "../lib/query-helpers";
import { blockUserByRole } from "./user-actions.service";

export async function listCleaners(
  page: number,
  limit: number,
  filters: { status?: string; location?: string; service?: string; search?: string }
): Promise<{ data: Record<string, unknown>[]; stats: Record<string, unknown>; meta: { total: number; page: number; limit: number } }> {
  const result = await userRepo.listCleanersAdmin(filters, page, limit);
  return { data: result.data as unknown as Record<string, unknown>[], stats: result.stats, meta: { total: result.total, page, limit } };
}

export async function getCleaner(cleanerId: string): Promise<Record<string, unknown>> {
  const cleaner = await userRepo.getCleanerAdmin(cleanerId);
  firstOr404(cleaner ? [cleaner] : [], "Cleaner not found");

  const reviews = await reviewRepo.listByReviewee(cleanerId);
  const enrichment = await userRepo.getCleanerEnrichment(cleanerId);
  const paymentHistory = await txRepo.listCleanerPayouts(cleanerId, 10);

  return {
    ...cleaner!,
    reviews,
    ...enrichment,
    payment_history: paymentHistory,
  };
}

export async function blockCleaner(
  actorId: string,
  cleanerId: string
): Promise<{ id: string; status: string }> {
  return blockUserByRole(actorId, cleanerId, "cleaner");
}

export async function payCleaner(
  actorId: string,
  cleanerId: string,
  amount: number,
  accountNumber: string,
  bankName: string
): Promise<{ transaction_id: string; amount: number; status: string }> {
  if (amount <= 0) {
    throw new ApplicationError(400, "Amount must be greater than 0", "VALIDATION_ERROR");
  }
  if (!bankName || bankName.length > 200) {
    throw new ApplicationError(400, "Bank name must be 1-200 characters", "VALIDATION_ERROR");
  }

  const cleaner = await userRepo.findByIdAndRole(cleanerId, 'cleaner');
  if (!cleaner) {
    throw new ApplicationError(404, "Cleaner not found", "NOT_FOUND");
  }

  const refNumber = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const tx = await txRepo.create({
    ref_number: refNumber, payee_id: cleanerId, type: 'payout',
    amount, payment_method: `bank:${bankName}:${accountNumber}`,
    status: 'pending', description: `Payout to ${cleaner.first_name}`,
  });

  await logActivity(actorId, `Paid cleaner ${cleaner.first_name} ${cleaner.last_name ?? ""} £${amount}`.trim(), "transaction", tx.id);

  return { transaction_id: tx.id, amount, status: tx.status };
}
