import * as bookingRepo from "../repositories/booking.repository";
import * as userRepo from "../repositories/user.repository";
import * as txRepo from "../repositories/transaction.repository";
import * as withdrawalRepo from "../repositories/withdrawal.repository";
import * as pmRepo from "../repositories/payment-method.repository";
import bcrypt from "bcryptjs";
import { ApplicationError } from "../errors";
import type { EarningsSummary, IncomeLine, WithdrawalLine, WithdrawalResponse } from "../types/cleaner-earnings";

function getDateRange(period: string, start?: string, end?: string): { from: string; to: string } {
  const now = new Date();
  if (period === "custom" && start && end) return { from: start, to: end };
  if (period === "today") {
    const d = now.toISOString().slice(0, 10);
    return { from: d, to: d };
  }
  if (period === "this_month") {
    const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
    return { from, to: now.toISOString().slice(0, 10) };
  }
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  return { from: monday.toISOString().slice(0, 10), to: now.toISOString().slice(0, 10) };
}

export async function getSummary(
  cleanerId: string, period: string, start?: string, end?: string
): Promise<EarningsSummary> {
  const { from, to } = getDateRange(period, start, end);

  const totalEarnings = await txRepo.sumCleanerEarnings(cleanerId, from, to);

  const totalWithdrawals = await withdrawalRepo.sumByCleanerInRange(cleanerId, from, to);

  const bookingsCompleted = await bookingRepo.countDoneByCleanerInRange(cleanerId, from, to);

  return {
    total_earnings: totalEarnings,
    total_withdrawals: totalWithdrawals,
    bookings_completed: bookingsCompleted,
    period,
  };
}

export async function listIncome(
  cleanerId: string, period: string, start: string | undefined, end: string | undefined, page: number, limit: number
): Promise<{ data: IncomeLine[]; total: number }> {
  const { from, to } = getDateRange(period, start, end);

  const result = await txRepo.listCleanerIncome(cleanerId, from, to, page, limit);
  return { data: result.data as unknown as IncomeLine[], total: result.total };
}

export async function listWithdrawals(
  cleanerId: string, period: string, start: string | undefined, end: string | undefined, page: number, limit: number
): Promise<{ data: WithdrawalLine[]; total: number }> {
  const { from, to } = getDateRange(period, start, end);

  const result = await withdrawalRepo.listByCleanerInRange(cleanerId, from, to, page, limit);
  return { data: result.data as unknown as WithdrawalLine[], total: result.total };
}

export async function createWithdrawal(
  cleanerId: string, amount: number, pin: string
): Promise<WithdrawalResponse> {
  if (amount <= 0) throw new ApplicationError(400, "Amount must be greater than 0", "VALIDATION_ERROR");

  const user = await userRepo.findById(cleanerId);
  if (!user) throw new ApplicationError(404, "User not found", "NOT_FOUND");
  if (!user.transaction_pin_hash) throw new ApplicationError(400, "Transaction PIN not set", "PIN_NOT_SET");

  const pinMatch = await bcrypt.compare(pin, user.transaction_pin_hash);
  if (!pinMatch) throw new ApplicationError(400, "Invalid transaction PIN", "INVALID_PIN");

  const balance = await txRepo.cleanerBalance(cleanerId);
  if (amount > balance) throw new ApplicationError(400, "Insufficient balance", "INSUFFICIENT_BALANCE");

  const pm = await pmRepo.findDefaultBankAccount(cleanerId);
  if (!pm) throw new ApplicationError(400, "No bank account found. Add a payment method first.", "NO_PAYMENT_METHOD");

  const w = await withdrawalRepo.create(cleanerId, amount, pm.id);

  return {
    id: w.id, amount: w.amount, status: w.status,
    bank_account: pm.account_number, bank_name: pm.bank_name,
  };
}
