import db from "../db";
import { addSearchFilter } from "../lib/query-helpers";

// ── Row types ──────────────────────────────────────────────────────────

export interface UserRow {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  password_hash: string;
  role: string;
  status: string;
  profile_image_url: string | null;
  rating_avg: string | null;
  admin_role_id: string | null;
  service_type: string | null;
  transaction_pin_hash: string | null;
  created_at: string;
  last_login_at: string | null;
}

export interface UserNameRow {
  id: string;
  first_name: string;
  last_name: string | null;
}

export interface CleanerProfileRow {
  id: string;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  email: string;
  profile_image_url: string | null;
  rating: string | null;
  home_street: string | null;
  home_country: string | null;
  home_postcode: string | null;
  home_floor_number: string | null;
  home_door_number: string | null;
  home_entrance_notes: string | null;
  completed_bookings: number;
}

export interface AdminUserListRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  last_login: string | null;
  joined: string;
  status: string;
}

export interface AdminPersonListRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  rating: number;
  status: string;
  joined: string;
  bookings_count?: number;
}

export interface AdminPersonStats {
  total: number;
  active: number;
  [key: string]: number;
}

export interface TopRatedRow {
  id: string;
  name: string;
  rating: number;
}

// ── Core lookups ───────────────────────────────────────────────────────

const BASE_COLS = `id, first_name, last_name, email, phone, password_hash, role, status,
  profile_image_url, rating_avg, admin_role_id, service_type, transaction_pin_hash,
  created_at, last_login_at`;

export async function findById(id: string): Promise<UserRow | null> {
  const rows = await db.query(
    `SELECT ${BASE_COLS} FROM users WHERE id = $1 AND deleted_at IS NULL`,
    [id]
  ) as UserRow[];
  return rows[0] ?? null;
}

export async function findByEmail(email: string): Promise<UserRow | null> {
  const rows = await db.query(
    `SELECT ${BASE_COLS} FROM users WHERE email = $1 AND deleted_at IS NULL`,
    [email]
  ) as UserRow[];
  return rows[0] ?? null;
}

export async function findByPhone(phone: string): Promise<UserRow | null> {
  const rows = await db.query(
    `SELECT ${BASE_COLS} FROM users WHERE phone = $1 AND deleted_at IS NULL`,
    [phone]
  ) as UserRow[];
  return rows[0] ?? null;
}

export async function findByIdAndRole(id: string, role: string): Promise<UserRow | null> {
  const rows = await db.query(
    `SELECT ${BASE_COLS} FROM users WHERE id = $1 AND role = $2 AND deleted_at IS NULL`,
    [id, role]
  ) as UserRow[];
  return rows[0] ?? null;
}

export async function findByEmailAndRole(email: string, role: string): Promise<UserRow | null> {
  const rows = await db.query(
    `SELECT ${BASE_COLS} FROM users WHERE email = $1 AND role = $2 AND deleted_at IS NULL`,
    [email, role]
  ) as UserRow[];
  return rows[0] ?? null;
}

export async function findStatusById(id: string): Promise<{ status: string } | null> {
  const rows = await db.query(
    `SELECT status FROM users WHERE id = $1 AND deleted_at IS NULL`,
    [id]
  ) as { status: string }[];
  return rows[0] ?? null;
}

export async function findNameById(id: string): Promise<UserNameRow | null> {
  const rows = await db.query(
    `SELECT id, first_name, last_name FROM users WHERE id = $1`,
    [id]
  ) as UserNameRow[];
  return rows[0] ?? null;
}

// ── Profile lookups ────────────────────────────────────────────────────

export async function findCleanerProfileById(id: string): Promise<CleanerProfileRow | null> {
  const rows = await db.query(
    `SELECT u.id, u.first_name, u.last_name, u.phone, u.email, u.profile_image_url,
            u.rating_avg AS rating,
            u.home_street, u.home_country, u.home_postcode,
            u.home_floor_number, u.home_door_number, u.home_entrance_notes,
            (SELECT COUNT(*)::int FROM bookings WHERE cleaner_id = u.id AND status = 'done') AS completed_bookings
     FROM users u WHERE u.id = $1 AND u.deleted_at IS NULL`,
    [id]
  ) as CleanerProfileRow[];
  return rows[0] ?? null;
}

// ── Mutations ──────────────────────────────────────────────────────────

export interface CreateUserData {
  first_name: string;
  email: string;
  password_hash: string;
  role?: string;
  phone?: string | null;
  service_type?: string | null;
  admin_role_id?: string | null;
  status?: string;
}

export async function create(data: CreateUserData): Promise<UserRow> {
  const cols = ["first_name", "email", "password_hash"];
  const vals: (string | null)[] = [data.first_name, data.email, data.password_hash];

  if (data.role !== undefined) { cols.push("role"); vals.push(data.role); }
  if (data.phone !== undefined) { cols.push("phone"); vals.push(data.phone); }
  if (data.service_type !== undefined) { cols.push("service_type"); vals.push(data.service_type); }
  if (data.admin_role_id !== undefined) { cols.push("admin_role_id"); vals.push(data.admin_role_id); }
  if (data.status !== undefined) { cols.push("status"); vals.push(data.status); }

  const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
  const rows = await db.query(
    `INSERT INTO users (${cols.join(", ")}) VALUES (${placeholders}) RETURNING ${BASE_COLS}`,
    vals
  ) as UserRow[];
  return rows[0]!;
}

export async function updateById(
  id: string,
  fields: Record<string, string | number | boolean | null | undefined>
): Promise<UserRow | null> {
  const sets: string[] = [];
  const params: (string | number | boolean | null)[] = [];
  let idx = 1;

  for (const [key, val] of Object.entries(fields)) {
    if (val !== undefined) {
      sets.push(`${key} = $${idx++}`);
      params.push(val as string | number | boolean | null);
    }
  }

  if (sets.length === 0) return findById(id);

  sets.push("updated_at = NOW()");
  params.push(id);

  const rows = await db.query(
    `UPDATE users SET ${sets.join(", ")} WHERE id = $${idx} AND deleted_at IS NULL RETURNING ${BASE_COLS}`,
    params
  ) as UserRow[];
  return rows[0] ?? null;
}

export async function updateProfileImage(
  id: string,
  imageUrl: string,
  publicId: string | null
): Promise<void> {
  await db.query(
    `UPDATE users SET profile_image_url = $1, profile_image_public_id = $2, updated_at = NOW()
     WHERE id = $3 AND deleted_at IS NULL`,
    [imageUrl, publicId, id]
  );
}

export async function updatePasswordHashById(id: string, hash: string): Promise<{ id: string } | null> {
  const rows = await db.query(
    `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2 AND deleted_at IS NULL RETURNING id`,
    [hash, id]
  ) as { id: string }[];
  return rows[0] ?? null;
}

export async function updatePasswordHashByPhone(phone: string, hash: string): Promise<{ id: string } | null> {
  const rows = await db.query(
    `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE phone = $2 AND deleted_at IS NULL RETURNING id`,
    [hash, phone]
  ) as { id: string }[];
  return rows[0] ?? null;
}

export async function blockByIdAndRole(
  id: string,
  role: string
): Promise<{ id: string; status: string; first_name: string; last_name: string | null } | null> {
  const rows = await db.query(
    `UPDATE users SET status = 'blocked'
     WHERE id = $1 AND role = $2 AND deleted_at IS NULL
     RETURNING id, status, first_name, last_name`,
    [id, role]
  ) as { id: string; status: string; first_name: string; last_name: string | null }[];
  return rows[0] ?? null;
}

// ── Admin list / detail queries ────────────────────────────────────────

export async function listCustomersAdmin(
  filters: { status?: string; search?: string },
  page: number,
  limit: number
): Promise<{ data: AdminPersonListRow[]; stats: AdminPersonStats; total: number }> {
  const conditions: string[] = [`u.role = 'customer'`, `u.deleted_at IS NULL`];
  const params: (string | number)[] = [];
  let idx = 1;

  if (filters.status) { conditions.push(`u.status = $${idx++}`); params.push(filters.status); }

  const state = { conditions, params, idx };
  addSearchFilter(state, ["u.first_name", "u.last_name", "u.email"], filters.search);
  idx = state.idx;

  const where = conditions.join(" AND ");

  const countRows = await db.query(
    `SELECT COUNT(*)::int AS total FROM users u WHERE ${where}`, params
  ) as { total: number }[];

  const statsRows = await db.query(
    `SELECT COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE u.status = 'active')::int AS active,
            0 AS churn_rate
     FROM users u WHERE ${where}`, params
  ) as AdminPersonStats[];

  const offset = (page - 1) * limit;
  const data = await db.query(
    `SELECT u.id, CONCAT(u.first_name, ' ', COALESCE(u.last_name, '')) AS name,
            u.email, u.phone, COALESCE(u.rating_avg, 0)::float AS rating,
            (SELECT COUNT(*)::int FROM bookings b WHERE b.customer_id = u.id) AS bookings_count,
            u.status, u.created_at AS joined
     FROM users u WHERE ${where}
     ORDER BY u.created_at DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, limit, offset]
  ) as AdminPersonListRow[];

  return { data, stats: statsRows[0]!, total: countRows[0]!.total };
}

export async function getCustomerAdmin(
  id: string
): Promise<Record<string, unknown> | null> {
  const rows = await db.query(
    `SELECT u.id, CONCAT(u.first_name, ' ', COALESCE(u.last_name, '')) AS name,
            u.email, u.phone, COALESCE(u.rating_avg, 0)::float AS rating,
            u.created_at AS joined,
            (SELECT COUNT(*)::int FROM bookings b WHERE b.customer_id = u.id) AS bookings_count,
            (SELECT MAX(b.scheduled_date)::text FROM bookings b WHERE b.customer_id = u.id) AS last_booked
     FROM users u
     WHERE u.id = $1 AND u.role = 'customer' AND u.deleted_at IS NULL`,
    [id]
  ) as Record<string, unknown>[];
  return rows[0] ?? null;
}

export async function listCleanersAdmin(
  filters: { status?: string; search?: string },
  page: number,
  limit: number
): Promise<{ data: AdminPersonListRow[]; stats: AdminPersonStats; total: number }> {
  const conditions: string[] = [`u.role = 'cleaner'`, `u.deleted_at IS NULL`];
  const params: (string | number)[] = [];
  let idx = 1;

  if (filters.status) { conditions.push(`u.status = $${idx++}`); params.push(filters.status); }

  const state = { conditions, params, idx };
  addSearchFilter(state, ["u.first_name", "u.last_name", "u.email"], filters.search);
  idx = state.idx;

  const where = conditions.join(" AND ");

  const countRows = await db.query(
    `SELECT COUNT(*)::int AS total FROM users u WHERE ${where}`, params
  ) as { total: number }[];

  const statsRows = await db.query(
    `SELECT COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE u.status = 'active')::int AS active,
            COUNT(*) FILTER (WHERE u.status = 'inactive')::int AS inactive
     FROM users u WHERE ${where}`, params
  ) as AdminPersonStats[];

  const offset = (page - 1) * limit;
  const data = await db.query(
    `SELECT u.id, CONCAT(u.first_name, ' ', COALESCE(u.last_name, '')) AS name,
            u.email, u.phone, COALESCE(u.rating_avg, 0)::float AS rating,
            u.status, u.created_at AS joined
     FROM users u WHERE ${where}
     ORDER BY u.created_at DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, limit, offset]
  ) as AdminPersonListRow[];

  return { data, stats: statsRows[0]!, total: countRows[0]!.total };
}

export async function getCleanerAdmin(id: string): Promise<Record<string, unknown> | null> {
  const rows = await db.query(
    `SELECT u.id, CONCAT(u.first_name, ' ', COALESCE(u.last_name, '')) AS name,
            u.email, u.phone, COALESCE(u.rating_avg, 0)::float AS rating,
            u.created_at AS joined
     FROM users u
     WHERE u.id = $1 AND u.role = 'cleaner' AND u.deleted_at IS NULL`,
    [id]
  ) as Record<string, unknown>[];
  return rows[0] ?? null;
}

export async function listAdminsAdmin(
  filters: { status?: string; search?: string },
  page: number,
  limit: number
): Promise<{ data: AdminUserListRow[]; total: number }> {
  const conditions: string[] = [`u.role = 'admin'`, `u.deleted_at IS NULL`];
  const params: (string | number)[] = [];
  let idx = 1;

  if (filters.status) { conditions.push(`u.status = $${idx++}`); params.push(filters.status); }

  const state = { conditions, params, idx };
  addSearchFilter(state, ["u.first_name", "u.last_name", "u.email"], filters.search);
  idx = state.idx;

  const where = conditions.join(" AND ");

  const countRows = await db.query(
    `SELECT COUNT(*)::int AS total FROM users u WHERE ${where}`, params
  ) as { total: number }[];

  const offset = (page - 1) * limit;
  const data = await db.query(
    `SELECT u.id, CONCAT(u.first_name, ' ', COALESCE(u.last_name, '')) AS name,
            u.email, u.phone, COALESCE(r.display_name, 'Admin') AS role,
            u.last_login_at AS last_login, u.created_at AS joined, u.status
     FROM users u
     LEFT JOIN roles r ON r.id = u.admin_role_id
     WHERE ${where}
     ORDER BY u.created_at DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, limit, offset]
  ) as AdminUserListRow[];

  return { data, total: countRows[0]!.total };
}

export async function countByAdminRole(roleId: string): Promise<number> {
  const rows = await db.query(
    `SELECT COUNT(*)::int AS cnt FROM users WHERE admin_role_id = $1 AND deleted_at IS NULL`,
    [roleId]
  ) as { cnt: number }[];
  return rows[0]!.cnt;
}

// ── Dashboard ──────────────────────────────────────────────────────────

export async function topByRating(role: string, limit: number): Promise<TopRatedRow[]> {
  return await db.query(
    `SELECT u.id, CONCAT(u.first_name, ' ', COALESCE(u.last_name, '')) AS name,
            COALESCE(u.rating_avg, 0)::float AS rating
     FROM users u
     WHERE u.role = $1 AND u.deleted_at IS NULL
     ORDER BY u.rating_avg DESC NULLS LAST LIMIT $2`,
    [role, limit]
  ) as TopRatedRow[];
}

// ── RBAC permission check (joins users + role_permissions) ─────────────

export async function hasPermission(userId: string, permissions: string[]): Promise<boolean> {
  const rows = await db.query(
    `SELECT 1 FROM role_permissions rp
     JOIN users u ON u.admin_role_id = rp.role_id
     WHERE u.id = $1 AND rp.permission = ANY($2)`,
    [userId, permissions] as unknown as (string | number)[]
  );
  return rows.length > 0;
}

export async function activateProfile(
  id: string,
  fields: { first_name: string; last_name: string; phone: string; password_hash: string }
): Promise<{ id: string; email: string; role: string } | null> {
  const rows = await db.query(
    `UPDATE users
     SET first_name = $1, last_name = $2, phone = $3, password_hash = $4,
         status = 'active', activated_at = NOW(), updated_at = NOW()
     WHERE id = $5 AND deleted_at IS NULL
     RETURNING id, email, role`,
    [fields.first_name, fields.last_name, fields.phone, fields.password_hash, id]
  ) as { id: string; email: string; role: string }[];
  return rows[0] ?? null;
}

// ── Admin customer enrichment (GAP-05) ─────────────────────────────────

export async function getCustomerServiceTypes(customerId: string): Promise<string[]> {
  const rows = await db.query(
    `SELECT DISTINCT service_type FROM bookings WHERE customer_id = $1 ORDER BY service_type`,
    [customerId]
  ) as { service_type: string }[];
  return rows.map(r => r.service_type);
}

export async function getCustomerBookingFrequency(customerId: string): Promise<string | null> {
  const rows = await db.query(
    `SELECT CASE
       WHEN COUNT(*) >= 4 THEN 'Weekly'
       WHEN COUNT(*) >= 2 THEN 'Bi-weekly'
       WHEN COUNT(*) >= 1 THEN 'Monthly'
       ELSE NULL
     END AS frequency
     FROM bookings WHERE customer_id = $1
     AND scheduled_date >= (CURRENT_DATE - INTERVAL '30 days')`,
    [customerId]
  ) as { frequency: string | null }[];
  return rows[0]?.frequency ?? null;
}

export async function getCustomerLastPaymentMethod(customerId: string): Promise<string | null> {
  const rows = await db.query(
    `SELECT payment_method FROM bookings
     WHERE customer_id = $1 AND payment_method IS NOT NULL
     ORDER BY created_at DESC LIMIT 1`,
    [customerId]
  ) as { payment_method: string }[];
  return rows[0]?.payment_method ?? null;
}

// ── Admin cleaner enrichment (GAP-06) ──────────────────────────────────

export async function getCleanerEnrichment(cleanerId: string): Promise<{
  bookings_count: number;
  total_earned: number;
  last_booked: string | null;
  status: string;
  unavailable_window: string | null;
  home_address: string | null;
  payment_method: string | null;
}> {
  const rows = await db.query(
    `SELECT
       (SELECT COUNT(*)::int FROM bookings WHERE cleaner_id = u.id) AS bookings_count,
       (SELECT COALESCE(SUM(t.amount), 0)::float FROM transactions t WHERE t.payee_id = u.id AND t.type = 'payout' AND t.status = 'successful') AS total_earned,
       (SELECT MAX(b.scheduled_date)::text FROM bookings b WHERE b.cleaner_id = u.id) AS last_booked,
       u.status,
       CASE WHEN ca.accept_bookings = false THEN 'Not accepting bookings' WHEN ca.mode = 'custom' THEN 'Custom schedule' ELSE CONCAT(ca.mode, ': ', COALESCE(ca.default_start, ''), ' – ', COALESCE(ca.default_end, '')) END AS unavailable_window,
       CASE WHEN u.home_street IS NOT NULL THEN CONCAT(u.home_street, ', ', COALESCE(u.home_postcode, '')) ELSE NULL END AS home_address,
       (SELECT pm.bank_name FROM payment_methods pm WHERE pm.user_id = u.id AND pm.type = 'bank_account' ORDER BY pm.created_at DESC LIMIT 1) AS payment_method
     FROM users u
     LEFT JOIN cleaner_availability ca ON ca.cleaner_id = u.id
     WHERE u.id = $1`,
    [cleanerId]
  ) as {
    bookings_count: number; total_earned: number; last_booked: string | null;
    status: string; unavailable_window: string | null; home_address: string | null;
    payment_method: string | null;
  }[];
  return rows[0] ?? {
    bookings_count: 0, total_earned: 0, last_booked: null,
    status: 'active', unavailable_window: null, home_address: null, payment_method: null,
  };
}
