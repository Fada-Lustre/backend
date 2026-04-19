import db from "../db";

export async function sumByCleanerInRange(cleanerId: string, from: string, to: string): Promise<string> {
  const rows = await db.query(
    `SELECT COALESCE(SUM(amount), 0) AS total FROM withdrawals WHERE cleaner_id = $1 AND status = 'successful' AND created_at::date BETWEEN $2 AND $3`,
    [cleanerId, from, to]
  ) as { total: string }[];
  return rows[0]!.total;
}

export async function listByCleanerInRange(cleanerId: string, from: string, to: string, page: number, limit: number): Promise<{ data: Record<string, unknown>[]; total: number }> {
  const countRows = await db.query(
    `SELECT COUNT(*) FROM withdrawals WHERE cleaner_id = $1 AND created_at::date BETWEEN $2 AND $3`,
    [cleanerId, from, to]
  ) as { count: string }[];
  const total = parseInt(countRows[0]!.count, 10);

  const rows = await db.query(
    `SELECT w.id, w.amount, w.created_at AS date, w.created_at AS time, w.status,
            pm.account_number AS bank_account, pm.bank_name
     FROM withdrawals w
     LEFT JOIN payment_methods pm ON w.payment_method_id = pm.id
     WHERE w.cleaner_id = $1 AND w.created_at::date BETWEEN $2 AND $3
     ORDER BY w.created_at DESC LIMIT $4 OFFSET $5`,
    [cleanerId, from, to, limit, (page - 1) * limit]
  ) as Record<string, unknown>[];

  return { data: rows, total };
}

export async function create(cleanerId: string, amount: number, paymentMethodId: string): Promise<{ id: string; amount: string; status: string }> {
  const rows = await db.query(
    `INSERT INTO withdrawals (cleaner_id, amount, payment_method_id, status) VALUES ($1, $2, $3, 'pending') RETURNING id, amount, status`,
    [cleanerId, amount, paymentMethodId]
  ) as { id: string; amount: string; status: string }[];
  return rows[0]!;
}
