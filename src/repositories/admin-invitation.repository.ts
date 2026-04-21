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
  role_id: string;
  temp_password_hash: string;
  invited_by: string;
}): Promise<{ id: string }> {
  const rows = await db.query(
    `INSERT INTO admin_invitations (email, role_id, temp_password_hash, invited_by, expires_at)
     VALUES ($1, $2, $3, $4, NOW() + INTERVAL '7 days')
     RETURNING id`,
    [data.email, data.role_id, data.temp_password_hash, data.invited_by]
  ) as { id: string }[];
  return rows[0]!;
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
