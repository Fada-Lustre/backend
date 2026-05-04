import db from "../db";
import { addSearchFilter } from "../lib/query-helpers";

// ── Row types ──────────────────────────────────────────────────────────

export interface TransactionRow {
  id: string;
  ref_number: string | null;
  booking_id: string | null;
  payer_id: string | null;
  payee_id: string | null;
  type: string;
  amount: string;
  payment_method: string | null;
  status: string;
  description: string | null;
  created_at: string;
}

// ── Core ───────────────────────────────────────────────────────────────

export async function create(data: {
  ref_number?: string;
  booking_id?: string | null;
  payer_id?: string | null;
  payee_id?: string | null;
  type: string;
  amount: number;
  payment_method: string;
  status: string;
  description?: string | null;
}): Promise<{ id: string; amount: number; status: string }> {
  const rows = await db.query(
    `INSERT INTO transactions (ref_number, booking_id, payer_id, payee_id, type, amount, payment_method, status, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, amount::float, status`,
    [
      data.ref_number ?? null, data.booking_id ?? null,
      data.payer_id ?? null, data.payee_id ?? null,
      data.type, data.amount, data.payment_method,
      data.status, data.description ?? null,
    ]
  ) as { id: string; amount: number; status: string }[];
  return rows[0]!;
}

export async function findById(id: string): Promise<TransactionRow | null> {
  const rows = await db.query(
    `SELECT id, ref_number, booking_id, payer_id, payee_id, type, amount, payment_method, status, description, created_at
     FROM transactions WHERE id = $1`,
    [id]
  ) as TransactionRow[];
  return rows[0] ?? null;
}

export async function existsById(id: string): Promise<boolean> {
  const rows = await db.query(
    `SELECT id FROM transactions WHERE id = $1`, [id]
  ) as { id: string }[];
  return rows.length > 0;
}

export async function updateStatusByBookingIdIfPending(
  bookingId: string,
  status: string
): Promise<void> {
  await db.query(
    `UPDATE transactions SET status = $1 WHERE booking_id = $2 AND status = 'pending'`,
    [status, bookingId]
  );
}

export async function updateStatusByBookingId(
  bookingId: string,
  status: string
): Promise<void> {
  await db.query(
    `UPDATE transactions SET status = $1 WHERE booking_id = $2 AND status = 'pending'`,
    [status, bookingId]
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────

export async function balanceSummary(period?: string): Promise<{ balance: number; pending: number }> {
  let dateFilter = "";
  if (period && period !== "all_time") {
    const intervals: Record<string, string> = {
      today: "0 days", this_month: "1 month",
      past_3_months: "3 months", past_6_months: "6 months", past_year: "1 year",
    };
    const interval = intervals[period];
    if (interval !== undefined) {
      dateFilter = period === "today"
        ? ` AND created_at::date = CURRENT_DATE`
        : ` AND created_at >= NOW() - INTERVAL '${interval}'`;
    }
  }

  const rows = await db.query(
    `SELECT COALESCE(SUM(CASE WHEN status = 'successful' THEN amount ELSE 0 END), 0)::float AS balance,
            COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0)::float AS pending
     FROM transactions WHERE type = 'booking'${dateFilter}`
  ) as { balance: number; pending: number }[];
  return rows[0]!;
}

// ── Cleaner earnings ───────────────────────────────────────────────────

export async function sumCleanerEarnings(
  cleanerId: string,
  from: string,
  to: string
): Promise<string> {
  const rows = await db.query(
    `SELECT COALESCE(SUM(t.amount), 0) AS total
     FROM transactions t
     JOIN bookings b ON t.booking_id = b.id
     WHERE b.cleaner_id = $1 AND t.type = 'booking' AND t.status = 'successful'
     AND t.created_at::date BETWEEN $2 AND $3`,
    [cleanerId, from, to]
  ) as { total: string }[];
  return rows[0]!.total;
}

export async function listCleanerIncome(
  cleanerId: string,
  from: string,
  to: string,
  page: number,
  limit: number
): Promise<{ data: Record<string, unknown>[]; total: number }> {
  const countRows = await db.query(
    `SELECT COUNT(*) FROM transactions t
     JOIN bookings b ON t.booking_id = b.id
     WHERE b.cleaner_id = $1 AND t.type = 'booking' AND t.created_at::date BETWEEN $2 AND $3`,
    [cleanerId, from, to]
  ) as { count: string }[];
  const total = parseInt(countRows[0]!.count, 10);

  const rows = await db.query(
    `SELECT t.id, b.service_type AS service, u.first_name AS customer,
            b.scheduled_date AS date, b.time_start AS time,
            a.street AS address, t.amount, t.status
     FROM transactions t
     JOIN bookings b ON t.booking_id = b.id
     LEFT JOIN users u ON b.customer_id = u.id
     LEFT JOIN addresses a ON b.address_id = a.id
     WHERE b.cleaner_id = $1 AND t.type = 'booking' AND t.created_at::date BETWEEN $2 AND $3
     ORDER BY t.created_at DESC LIMIT $4 OFFSET $5`,
    [cleanerId, from, to, limit, (page - 1) * limit]
  ) as Record<string, unknown>[];

  return { data: rows, total };
}

export async function cleanerBalance(cleanerId: string): Promise<number> {
  const rows = await db.query(
    `SELECT
       COALESCE((SELECT SUM(t.amount) FROM transactions t JOIN bookings b ON t.booking_id = b.id WHERE b.cleaner_id = $1 AND t.type = 'booking' AND t.status = 'successful'), 0)
       - COALESCE((SELECT SUM(amount) FROM withdrawals WHERE cleaner_id = $1 AND status = 'successful'), 0)
       AS balance`,
    [cleanerId]
  ) as { balance: string }[];
  return parseFloat(rows[0]!.balance);
}

// ── Admin list / detail ────────────────────────────────────────────────

export async function listAdmin(
  filters: { period?: string; type?: string; search?: string; location?: string; service?: string },
  page: number,
  limit: number
): Promise<{ data: Record<string, unknown>[]; stats: Record<string, unknown>; total: number }> {
  const conditions: string[] = [];
  const params: (string | number)[] = [];
  let idx = 1;

  if (filters.period && filters.period !== "all_time") {
    const intervals: Record<string, string> = {
      today: "0 days", this_month: "1 month",
      past_3_months: "3 months", past_6_months: "6 months", past_year: "1 year",
    };
    const interval = intervals[filters.period];
    if (interval !== undefined) {
      if (filters.period === "today") {
        conditions.push(`t.created_at::date = CURRENT_DATE`);
      } else {
        conditions.push(`t.created_at >= NOW() - INTERVAL '${interval}'`);
      }
    }
  }

  if (filters.type && filters.type !== "all") {
    if (filters.type === "bookings") conditions.push(`t.type = 'booking'`);
    else if (filters.type === "payouts") conditions.push(`t.type = 'payout'`);
    else { conditions.push(`t.type = $${idx++}`); params.push(filters.type); }
  }

  if (filters.search) {
    const state = { conditions, params, idx };
    addSearchFilter(state, ["t.ref_number", "t.description"], filters.search);
    idx = state.idx;
  }

  if (filters.location) {
    conditions.push(`EXISTS (SELECT 1 FROM bookings b JOIN addresses a ON a.id = b.address_id WHERE b.id = t.booking_id AND a.street ILIKE $${idx++})`);
    params.push(`%${filters.location}%`);
  }

  if (filters.service) {
    conditions.push(`EXISTS (SELECT 1 FROM bookings b WHERE b.id = t.booking_id AND b.service_type = $${idx++})`);
    params.push(filters.service);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countRows = await db.query(
    `SELECT COUNT(*)::int AS total FROM transactions t ${where}`, params
  ) as { total: number }[];

  const statsRows = await db.query(
    `SELECT
       COALESCE(SUM(CASE WHEN t.type = 'booking' AND t.status = 'successful' THEN t.amount ELSE 0 END), 0)::float AS total_revenue,
       COALESCE(SUM(CASE WHEN t.type = 'payout' AND t.status = 'successful' THEN t.amount ELSE 0 END), 0)::float AS total_payouts,
       COALESCE(SUM(CASE WHEN t.type = 'booking' AND t.status = 'successful' THEN t.amount ELSE 0 END), 0)::float -
       COALESCE(SUM(CASE WHEN t.type = 'payout' AND t.status = 'successful' THEN t.amount ELSE 0 END), 0)::float AS total_income,
       COALESCE(SUM(CASE WHEN t.type = 'payout' AND t.status = 'pending' THEN t.amount ELSE 0 END), 0)::float AS pending_payouts
     FROM transactions t ${where}`, params
  ) as Record<string, unknown>[];

  const offset = (page - 1) * limit;
  const data = await db.query(
    `SELECT t.id, t.ref_number AS ref, t.type, t.amount::float, t.status, t.created_at,
            t.created_at::date::text AS date,
            to_char(t.created_at, 'HH:MI AM') AS time,
            COALESCE(
              CONCAT(COALESCE(pu.first_name,''), ' ', COALESCE(pu.last_name,'')),
              CONCAT(COALESCE(pe.first_name,''), ' ', COALESCE(pe.last_name,''))
            ) AS name
     FROM transactions t
     LEFT JOIN users pu ON pu.id = t.payer_id
     LEFT JOIN users pe ON pe.id = t.payee_id
     ${where}
     ORDER BY t.created_at DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, limit, offset]
  ) as Record<string, unknown>[];

  return { data, stats: statsRows[0]!, total: countRows[0]!.total };
}

export async function getAdminDetail(
  id: string
): Promise<Record<string, unknown> | null> {
  const rows = await db.query(
    `SELECT t.id, t.ref_number AS ref, t.created_at AS date,
            COALESCE(
              CONCAT(COALESCE(pu.first_name,''), ' ', COALESCE(pu.last_name,'')),
              CONCAT(COALESCE(pe.first_name,''), ' ', COALESCE(pe.last_name,''))
            ) AS name,
            t.amount::float, t.type, t.payment_method, t.status
     FROM transactions t
     LEFT JOIN users pu ON pu.id = t.payer_id
     LEFT JOIN users pe ON pe.id = t.payee_id
     WHERE t.id = $1`,
    [id]
  ) as Record<string, unknown>[];
  return rows[0] ?? null;
}

// ── Dashboard recent transactions (GAP-10) ─────────────────────────────

export async function listRecent(limit: number): Promise<{
  id: string; ref: string; name: string; type: string; amount: number;
  date: string; time: string; status: string;
}[]> {
  return await db.query(
    `SELECT t.id, t.ref_number AS ref,
            COALESCE(CONCAT(u.first_name, ' ', COALESCE(u.last_name, '')), 'Unknown') AS name,
            t.type, t.amount::float, t.created_at::date::text AS date,
            to_char(t.created_at, 'HH24:MI') AS time, t.status
     FROM transactions t
     LEFT JOIN users u ON u.id = COALESCE(t.payer_id, t.payee_id)
     ORDER BY t.created_at DESC LIMIT $1`,
    [limit]
  ) as { id: string; ref: string; name: string; type: string; amount: number; date: string; time: string; status: string }[];
}

// ── Cleaner payouts (GAP-06) ───────────────────────────────────────────

export async function listCleanerPayouts(cleanerId: string, limit: number): Promise<{
  amount: number; date: string; status: string;
}[]> {
  return await db.query(
    `SELECT t.amount::float, t.created_at::date::text AS date, t.status
     FROM transactions t
     WHERE t.payee_id = $1 AND t.type = 'payout'
     ORDER BY t.created_at DESC LIMIT $2`,
    [cleanerId, limit]
  ) as { amount: number; date: string; status: string }[];
}
