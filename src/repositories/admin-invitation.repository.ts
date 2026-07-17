import db from "../db";

// ── Row types ──────────────────────────────────────────────────────────

export interface InvitationRow {
  id: string;
  email: string;
  role_id: string;
  temp_password_hash: string;
  status: string;
  expires_at: Date;
  invited_by: string;
  created_at: string;
}

// ── Lookups ────────────────────────────────────────────────────────────

export async function findByEmail(email: string): Promise<InvitationRow | null> {
  const rows = await db.query(
    `SELECT id, email, role_id, temp_password_hash, status, expires_at, invited_by, created_at
     FROM admin_invitations WHERE email = $1`,
    [email]
  ) as InvitationRow[];
  return rows[0] ?? null;
}

export async function findPendingByEmail(email: string): Promise<{ id: string } | null> {
  const rows = await db.query(
    `SELECT id FROM admin_invitations WHERE email = $1 AND status = 'pending'`,
    [email]
  ) as { id: string }[];
  return rows[0] ?? null;
}

// ── Mutations ──────────────────────────────────────────────────────────

export async function create(data: {
  email: string;
  first_name?: string;
  last_name?: string;
  role_id: string;
  temp_password_hash: string;
  invited_by: string;
}): Promise<{ id: string }> {
  const rows = await db.query(
    `INSERT INTO admin_invitations (email, first_name, last_name, role_id, temp_password_hash, invited_by, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW() + INTERVAL '7 days')
     RETURNING id`,
    [data.email, data.first_name ?? null, data.last_name ?? null, data.role_id, data.temp_password_hash, data.invited_by]
  ) as { id: string }[];
  return rows[0]!;
}

// ── Pending-invitation listing (shaped like AdminUserListRow) ───────────

export interface PendingInvitationRow {
  id: string;
  name: string;
  email: string;
  phone: null;
  role: string;
  last_login: null;
  joined: string;
  status: string;
  expires_at: Date;
}

/**
 * List pending admin invitations. These live in `admin_invitations`, NOT in
 * `users` (a user row only exists after activation), which is why filtering
 * the users table by status='pending' returned nothing.
 */
export async function listPending(
  filters: { search?: string },
  page: number,
  limit: number
): Promise<{ data: PendingInvitationRow[]; total: number }> {
  const conditions: string[] = [`ai.status = 'pending'`];
  const params: (string | number)[] = [];
  let idx = 1;

  if (filters.search) {
    conditions.push(
      `(ai.email ILIKE $${idx} OR COALESCE(ai.first_name,'') ILIKE $${idx} OR COALESCE(ai.last_name,'') ILIKE $${idx})`
    );
    params.push(`%${filters.search}%`);
    idx++;
  }

  const where = conditions.join(" AND ");

  const countRows = await db.query(
    `SELECT COUNT(*)::int AS total FROM admin_invitations ai WHERE ${where}`,
    params
  ) as { total: number }[];

  const offset = (page - 1) * limit;
  const data = await db.query(
    `SELECT ai.id,
            TRIM(CONCAT(COALESCE(ai.first_name, ''), ' ', COALESCE(ai.last_name, ''))) AS name,
            ai.email,
            NULL::text AS phone,
            COALESCE(r.display_name, 'Admin') AS role,
            NULL::timestamptz AS last_login,
            ai.created_at AS joined,
            ai.status,
            ai.expires_at
     FROM admin_invitations ai
     LEFT JOIN roles r ON r.id = ai.role_id
     WHERE ${where}
     ORDER BY ai.created_at DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, limit, offset]
  ) as PendingInvitationRow[];

  return { data, total: countRows[0]!.total };
}

export async function updateStatus(id: string, status: string): Promise<void> {
  await db.query(
    `UPDATE admin_invitations SET status = $1 WHERE id = $2`,
    [status, id]
  );
}

export async function markActivated(email: string): Promise<void> {
  await db.query(
    `UPDATE admin_invitations SET status = 'activated', activated_at = NOW() WHERE email = $1`,
    [email]
  );
}
