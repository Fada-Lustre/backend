import db from "../db";
import { encrypt, decrypt, maskAccountNumber } from "../lib/encryption";

export async function listByUser(userId: string): Promise<Record<string, unknown>[]> {
  return await db.query(
    "SELECT id, type, last4, brand FROM payment_methods WHERE user_id = $1 AND deleted_at IS NULL", [userId]
  ) as Record<string, unknown>[];
}

export async function create(userId: string, type: string, cardHolderName: string, providerToken: string, last4: string, brand: string): Promise<Record<string, unknown>> {
  const rows = await db.query(
    `INSERT INTO payment_methods (user_id, type, card_holder_name, provider_token, last4, brand) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, type, last4, brand`,
    [userId, type, cardHolderName, providerToken, last4, brand]
  ) as Record<string, unknown>[];
  return rows[0]!;
}

export async function findByIdWithOwner(id: string): Promise<{ id: string; user_id: string } | null> {
  const rows = await db.query(
    "SELECT id, user_id FROM payment_methods WHERE id = $1 AND deleted_at IS NULL", [id]
  ) as { id: string; user_id: string }[];
  return rows[0] ?? null;
}

export async function softDelete(id: string): Promise<void> {
  await db.query("UPDATE payment_methods SET deleted_at = NOW() WHERE id = $1", [id]);
}

export async function listBankAccountsByUser(userId: string): Promise<Record<string, unknown>[]> {
  const rows = await db.query(
    "SELECT id, type, account_number, bank_name FROM payment_methods WHERE user_id = $1 AND type = 'bank_account' AND deleted_at IS NULL ORDER BY created_at DESC",
    [userId]
  ) as Record<string, unknown>[];
  return rows.map(r => ({
    ...r,
    account_number: r.account_number ? maskAccountNumber(decrypt(r.account_number as string)) : null,
  }));
}

export async function createBankAccount(userId: string, accountNumber: string, accountHolder: string, bankName: string): Promise<Record<string, unknown>> {
  const rows = await db.query(
    `INSERT INTO payment_methods (user_id, type, account_number, account_holder, bank_name)
     VALUES ($1, 'bank_account', $2, $3, $4)
     RETURNING id, type, bank_name`,
    [userId, encrypt(accountNumber), accountHolder, bankName]
  ) as Record<string, unknown>[];
  return { ...rows[0]!, account_number: maskAccountNumber(accountNumber) };
}

export async function findDefaultBankAccount(userId: string): Promise<{ id: string; account_number: string | null; bank_name: string | null } | null> {
  const rows = await db.query(
    "SELECT id, account_number, bank_name FROM payment_methods WHERE user_id = $1 AND type = 'bank_account' AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 1",
    [userId]
  ) as { id: string; account_number: string | null; bank_name: string | null }[];
  if (!rows[0]) return null;
  return {
    ...rows[0],
    account_number: rows[0].account_number ? decrypt(rows[0].account_number) : null,
  };
}
