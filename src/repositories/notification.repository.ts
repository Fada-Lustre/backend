import db from "../db";
import type { CountRow } from "../types/rows";

export async function listByUser(userId: string, page: number, limit: number): Promise<{ data: Record<string, unknown>[]; total: number }> {
  const pageSize = Math.min(limit, 50);
  const offset = (page - 1) * pageSize;
  const countRows = await db.query("SELECT COUNT(*) FROM notifications WHERE user_id = $1", [userId]) as CountRow[];
  const rows = await db.query(
    `SELECT id, type, title, body, (read_at IS NOT NULL) AS read, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [userId, pageSize, offset]
  ) as Record<string, unknown>[];
  return { data: rows, total: parseInt(countRows[0]!.count, 10) };
}

export async function findOwnerById(id: string): Promise<{ user_id: string } | null> {
  const rows = await db.query("SELECT user_id FROM notifications WHERE id = $1", [id]) as { user_id: string }[];
  return rows[0] ?? null;
}

export async function markRead(id: string): Promise<void> {
  await db.query("UPDATE notifications SET read_at = NOW() WHERE id = $1 AND read_at IS NULL", [id]);
}

export async function createForBookingCustomer(bookingId: string, type: string, title: string, body: string): Promise<void> {
  await db.query(
    `INSERT INTO notifications (user_id, type, title, body) SELECT customer_id, $2, $3, $4 FROM bookings WHERE id = $1`,
    [bookingId, type, title, body]
  );
}
