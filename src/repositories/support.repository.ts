import db from "../db";
import { addSearchFilter } from "../lib/query-helpers";
import type { CountRow } from "../types/rows";

// ── Customer-facing ────────────────────────────────────────────────────

export async function createTicket(
  userId: string,
  title: string,
  message: string
): Promise<{ id: string; status: string; created_at: string }> {
  const rows = await db.query(
    `INSERT INTO support_tickets (user_id, title, message) VALUES ($1, $2, $3) RETURNING id, status, created_at`,
    [userId, title, message]
  ) as { id: string; status: string; created_at: string }[];
  return rows[0]!;
}

export async function listTicketsByUser(
  userId: string,
  statusFilter: string,
  page: number,
  limit: number
): Promise<{ data: Record<string, unknown>[]; total: number }> {
  const pageSize = Math.min(limit, 50);
  const offset = (page - 1) * pageSize;

  const conditions: string[] = ["user_id = $1"];
  const params: (string | number)[] = [userId];

  if (statusFilter !== "all") {
    params.push(statusFilter);
    conditions.push(`status = $${params.length}`);
  }

  const where = conditions.join(" AND ");
  params.push(pageSize, offset);

  const countRows = await db.query(
    `SELECT COUNT(*) FROM support_tickets WHERE ${where}`,
    params.slice(0, -2) as string[]
  ) as CountRow[];

  const rows = await db.query(
    `SELECT id, title, status, created_at, last_message_at
     FROM support_tickets WHERE ${where}
     ORDER BY created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params as string[]
  ) as Record<string, unknown>[];

  return { data: rows, total: parseInt(countRows[0]!.count, 10) };
}

export async function findTicketById(
  id: string
): Promise<{ id: string; user_id: string; title: string; status: string; created_at: string } | null> {
  const rows = await db.query(
    `SELECT id, user_id, title, status, created_at FROM support_tickets WHERE id = $1`,
    [id]
  ) as { id: string; user_id: string; title: string; status: string; created_at: string }[];
  return rows[0] ?? null;
}

export async function listMessagesByTicket(
  ticketId: string
): Promise<{ id: string; sender_id: string; is_bot: boolean; body: string; created_at: string }[]> {
  return await db.query(
    `SELECT id, sender_id, is_bot, body, created_at FROM support_messages WHERE ticket_id = $1 ORDER BY created_at ASC`,
    [ticketId]
  ) as { id: string; sender_id: string; is_bot: boolean; body: string; created_at: string }[];
}

// ── Admin-facing ───────────────────────────────────────────────────────

export async function listTicketsAdmin(
  filters: { status?: string; search?: string },
  page: number,
  limit: number
): Promise<{ data: Record<string, unknown>[]; stats: Record<string, unknown>; total: number }> {
  const conditions: string[] = [];
  const params: (string | number)[] = [];
  let idx = 1;

  if (filters.status && filters.status !== "all") {
    conditions.push(`st.status = $${idx++}`);
    params.push(filters.status);
  }

  const state = { conditions, params, idx };
  addSearchFilter(state, ["st.title", "u.first_name", "u.email"], filters.search);
  idx = state.idx;

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countRows = await db.query(
    `SELECT COUNT(*)::int AS total FROM support_tickets st JOIN users u ON u.id = st.user_id ${where}`, params
  ) as { total: number }[];

  const statsRows = await db.query(
    `SELECT COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE st.status = 'open')::int AS open,
            COUNT(*) FILTER (WHERE st.status = 'in_progress')::int AS in_progress,
            COUNT(*) FILTER (WHERE st.status = 'resolved')::int AS resolved,
            COUNT(*) FILTER (WHERE st.status = 'closed')::int AS closed
     FROM support_tickets st JOIN users u ON u.id = st.user_id ${where}`, params
  ) as Record<string, unknown>[];

  const offset = (page - 1) * limit;
  const data = await db.query(
    `SELECT st.id,
            CONCAT(u.first_name, ' ', COALESCE(u.last_name, '')) AS user_name,
            st.title, st.status, st.created_at, st.last_message_at
     FROM support_tickets st JOIN users u ON u.id = st.user_id
     ${where}
     ORDER BY st.last_message_at DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, limit, offset]
  ) as Record<string, unknown>[];

  return { data, stats: statsRows[0]!, total: countRows[0]!.total };
}

export async function getTicketAdmin(
  id: string
): Promise<Record<string, unknown> | null> {
  const rows = await db.query(
    `SELECT st.id, st.title, st.message, st.status, st.created_at,
            json_build_object('id', u.id, 'name', CONCAT(u.first_name, ' ', COALESCE(u.last_name, '')), 'email', u.email) AS user,
            CASE WHEN au.id IS NOT NULL THEN json_build_object('id', au.id, 'name', CONCAT(au.first_name, ' ', COALESCE(au.last_name, ''))) ELSE NULL END AS assigned_to
     FROM support_tickets st
     JOIN users u ON u.id = st.user_id
     LEFT JOIN users au ON au.id = st.assigned_to
     WHERE st.id = $1`,
    [id]
  ) as Record<string, unknown>[];
  return rows[0] ?? null;
}

export async function listMessagesAdmin(
  ticketId: string
): Promise<Record<string, unknown>[]> {
  return await db.query(
    `SELECT sm.id, CONCAT(s.first_name, ' ', COALESCE(s.last_name, '')) AS sender,
            sm.body, sm.created_at
     FROM support_messages sm
     LEFT JOIN users s ON s.id = sm.sender_id
     WHERE sm.ticket_id = $1
     ORDER BY sm.created_at`,
    [ticketId]
  ) as Record<string, unknown>[];
}

export async function existsTicketById(id: string): Promise<boolean> {
  const rows = await db.query(
    `SELECT id FROM support_tickets WHERE id = $1`, [id]
  ) as { id: string }[];
  return rows.length > 0;
}

export async function createMessage(
  ticketId: string,
  senderId: string,
  body: string
): Promise<{ id: string; body: string; created_at: string }> {
  const rows = await db.query(
    `INSERT INTO support_messages (ticket_id, sender_id, body) VALUES ($1, $2, $3) RETURNING id, body, created_at`,
    [ticketId, senderId, body]
  ) as { id: string; body: string; created_at: string }[];
  return rows[0]!;
}

export async function updateTicketLastMessage(ticketId: string): Promise<void> {
  await db.query(
    `UPDATE support_tickets SET last_message_at = NOW() WHERE id = $1`, [ticketId]
  );
}

export async function updateTicket(
  id: string,
  fields: Record<string, string | number>
): Promise<Record<string, unknown> | null> {
  const sets: string[] = [];
  const params: (string | number)[] = [];
  let idx = 1;

  for (const [key, val] of Object.entries(fields)) {
    sets.push(`${key} = $${idx++}`);
    params.push(val);
  }

  if (sets.length === 0) return null;

  params.push(id);
  const rows = await db.query(
    `UPDATE support_tickets SET ${sets.join(", ")} WHERE id = $${idx}
     RETURNING id, title, status, assigned_to`,
    params
  ) as Record<string, unknown>[];
  return rows[0] ?? null;
}
