import db from "../db";

// ── Mutations ──────────────────────────────────────────────────────────

export async function create(
  phone: string,
  purpose: string,
  codeHash: string,
  expiresAt: Date,
  userId?: string | null
): Promise<void> {
  await db.query(
    `INSERT INTO otp_codes (user_id, phone, code_hash, purpose, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId ?? null, phone, codeHash, purpose, expiresAt]
  );
}

// ── Lookups ────────────────────────────────────────────────────────────

export async function findValid(
  phone: string,
  purpose: string
): Promise<{ id: string; code_hash: string; attempts: number; user_id: string | null } | null> {
  const rows = await db.query(
    `SELECT id, code_hash, attempts, user_id FROM otp_codes
     WHERE phone = $1 AND purpose = $2 AND expires_at > NOW() AND verified_at IS NULL
     ORDER BY created_at DESC LIMIT 1`,
    [phone, purpose]
  ) as { id: string; code_hash: string; attempts: number; user_id: string | null }[];
  return rows[0] ?? null;
}

export async function hasVerified(
  phone: string,
  purpose: string
): Promise<boolean> {
  const rows = await db.query(
    `SELECT 1 FROM otp_codes
     WHERE phone = $1 AND purpose = $2 AND verified_at IS NOT NULL
     AND created_at > NOW() - INTERVAL '15 minutes'
     ORDER BY verified_at DESC LIMIT 1`,
    [phone, purpose]
  );
  return rows.length > 0;
}

// ── Updates ────────────────────────────────────────────────────────────

export async function incrementAttempts(id: string): Promise<void> {
  await db.query(
    `UPDATE otp_codes SET attempts = attempts + 1 WHERE id = $1`, [id]
  );
}

export async function markVerified(id: string): Promise<void> {
  await db.query(
    `UPDATE otp_codes SET verified_at = NOW() WHERE id = $1`, [id]
  );
}
