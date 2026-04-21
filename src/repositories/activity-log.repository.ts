import db from "../db";
import { addSearchFilter } from "../lib/query-helpers";

// ── Insert ─────────────────────────────────────────────────────────────

export async function insert(
  actorId: string,
  action: string,
  entityType?: string | null,
  entityId?: string | null,
  metadata?: Record<string, unknown>
): Promise<void> {
  await db.query(
    `INSERT INTO activity_log (actor_id, action, entity_type, entity_id, metadata)
     VALUES ($1, $2, $3, $4, $5)`,
    [actorId, action, entityType ?? null, entityId ?? null, JSON.stringify(metadata ?? {})]
  );
}

// ── Admin list ─────────────────────────────────────────────────────────

export async function listWithFilters(
  page: number,
  limit: number,
  search?: string
): Promise<{
  data: { id: string; user: string; action: string; date: string; time: string }[];
  total: number;
}> {
  const offset = (page - 1) * limit;
  const conditions: string[] = [];
  const params: (string | number)[] = [];
  let idx = 1;

  const state = { conditions, params, idx };
  addSearchFilter(state, ["al.action", "u.first_name", "u.last_name"], search);
  idx = state.idx;

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countRows = await db.query(
    `SELECT COUNT(*)::int AS total
     FROM activity_log al
     JOIN users u ON u.id = al.actor_id
     ${where}`, params
  ) as { total: number }[];

  const data = await db.query(
    `SELECT al.id,
            CONCAT(u.first_name, ' ', COALESCE(u.last_name, '')) AS user,
            al.action,
            al.created_at::date::text AS date,
            to_char(al.created_at, 'HH24:MI') AS time
     FROM activity_log al
     JOIN users u ON u.id = al.actor_id
     ${where}
     ORDER BY al.created_at DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, limit, offset]
  ) as { id: string; user: string; action: string; date: string; time: string }[];

  return { data, total: countRows[0]!.total };
}
