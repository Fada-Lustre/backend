import * as txRepo from "../repositories/transaction.repository";
import { ApplicationError } from "../errors";
import { logActivity } from "./activity-log.service";
import { firstOr404 } from "../lib/query-helpers";

export async function listTransactions(
  page: number,
  limit: number,
  filters: { period?: string; type?: string; search?: string }
): Promise<{ data: Record<string, unknown>[]; stats: Record<string, unknown>; meta: { total: number; page: number; limit: number } }> {
  const result = await txRepo.listAdmin(filters, page, limit);
  return { data: result.data, stats: result.stats, meta: { total: result.total, page, limit } };
}

export async function getTransaction(transactionId: string): Promise<Record<string, unknown>> {
  const tx = await txRepo.getAdminDetail(transactionId);
  return firstOr404(tx ? [tx] : [], "Transaction not found");
}

export async function sendReceipt(
  actorId: string,
  transactionId: string
): Promise<{ message: string }> {
  const exists = await txRepo.existsById(transactionId);
  if (!exists) {
    throw new ApplicationError(404, "Transaction not found", "NOT_FOUND");
  }

  await logActivity(actorId, `Sent receipt for transaction`, "transaction", transactionId);
  return { message: "Receipt sent" };
}
