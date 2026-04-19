import db from "../db";

// ── Row types ──────────────────────────────────────────────────────────

export interface RoleRow {
  id: string;
  name: string;
  display_name: string;
  is_system: boolean;
  created_at: string;
}

export interface RoleWithAccessRow extends RoleRow {
  access: string[];
  user_count: number;
}

// ── Lookups ────────────────────────────────────────────────────────────

export async function findById(id: string): Promise<RoleRow | null> {
  const rows = await db.query(
    `SELECT id, name, display_name, is_system, created_at FROM roles WHERE id = $1 AND deleted_at IS NULL`,
    [id]
  ) as RoleRow[];
  return rows[0] ?? null;
}

export async function existsById(id: string): Promise<boolean> {
  const rows = await db.query(
    `SELECT id FROM roles WHERE id = $1 AND deleted_at IS NULL`, [id]
  ) as { id: string }[];
  return rows.length > 0;
}

// ── List ───────────────────────────────────────────────────────────────

export async function listWithPermissions(): Promise<RoleWithAccessRow[]> {
  return await db.query(
    `SELECT r.id, r.name, r.display_name, r.is_system, r.created_at AS date_added,
            COALESCE(
              (SELECT json_agg(rp.permission) FROM role_permissions rp WHERE rp.role_id = r.id),
              '[]'::json
            ) AS access,
            (SELECT COUNT(*)::int FROM users u WHERE u.admin_role_id = r.id AND u.deleted_at IS NULL) AS user_count
     FROM roles r
     WHERE r.deleted_at IS NULL
     ORDER BY r.created_at`,
    []
  ) as RoleWithAccessRow[];
}

export async function findByIdWithAccess(id: string): Promise<RoleWithAccessRow | null> {
  const rows = await db.query(
    `SELECT r.id, r.name, r.display_name, r.is_system, r.created_at AS date_added,
            COALESCE(
              (SELECT json_agg(rp.permission) FROM role_permissions rp WHERE rp.role_id = r.id),
              '[]'::json
            ) AS access
     FROM roles r WHERE r.id = $1`,
    [id]
  ) as RoleWithAccessRow[];
  return rows[0] ?? null;
}

// ── Mutations ──────────────────────────────────────────────────────────

export async function create(name: string, displayName: string): Promise<{ id: string }> {
  const rows = await db.query(
    `INSERT INTO roles (name, display_name) VALUES ($1, $2) RETURNING id`,
    [name, displayName]
  ) as { id: string }[];
  return rows[0]!;
}

export async function updateById(
  id: string,
  fields: Record<string, string | boolean>
): Promise<void> {
  const sets: string[] = [];
  const params: (string | boolean)[] = [];
  let idx = 1;

  for (const [key, val] of Object.entries(fields)) {
    if (val !== undefined) {
      sets.push(`${key} = $${idx++}`);
      params.push(val);
    }
  }

  if (sets.length === 0) return;
  params.push(id);
  await db.query(`UPDATE roles SET ${sets.join(", ")} WHERE id = $${idx}`, params);
}

export async function archive(id: string): Promise<void> {
  await db.query(`UPDATE roles SET deleted_at = NOW() WHERE id = $1`, [id]);
}

// ── Permissions ────────────────────────────────────────────────────────

export async function setPermissions(roleId: string, permissions: string[]): Promise<void> {
  await db.query(`DELETE FROM role_permissions WHERE role_id = $1`, [roleId]);
  for (const perm of permissions) {
    await db.query(
      `INSERT INTO role_permissions (role_id, permission) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [roleId, perm]
    );
  }
}

export async function addPermission(roleId: string, permission: string): Promise<void> {
  await db.query(
    `INSERT INTO role_permissions (role_id, permission) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [roleId, permission]
  );
}
