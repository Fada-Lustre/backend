import db from "../db";
import type { AddressResponse } from "../types/address";

const COLUMNS = "id, street, floor_number, door_number, additional_info, entrance_notes, label, custom_label, is_default";

// ── Lookups ────────────────────────────────────────────────────────────

export async function findByIdWithOwner(
  id: string
): Promise<{ id: string; user_id: string } | null> {
  const rows = await db.query(
    `SELECT id, user_id FROM addresses WHERE id = $1 AND deleted_at IS NULL`,
    [id]
  ) as { id: string; user_id: string }[];
  return rows[0] ?? null;
}

export async function findByIdAndUser(
  id: string,
  userId: string
): Promise<{ id: string } | null> {
  const rows = await db.query(
    `SELECT id FROM addresses WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
    [id, userId]
  ) as { id: string }[];
  return rows[0] ?? null;
}

export async function findByIdForUser(
  id: string,
  userId: string
): Promise<AddressResponse | null> {
  const rows = await db.query(
    `SELECT ${COLUMNS} FROM addresses WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
    [id, userId]
  ) as AddressResponse[];
  return rows[0] ?? null;
}

export async function listByUser(userId: string): Promise<AddressResponse[]> {
  return await db.query(
    `SELECT ${COLUMNS} FROM addresses WHERE user_id = $1 AND deleted_at IS NULL ORDER BY is_default DESC, created_at DESC`,
    [userId]
  ) as AddressResponse[];
}

export async function findById(
  id: string
): Promise<AddressResponse | null> {
  const rows = await db.query(
    `SELECT ${COLUMNS} FROM addresses WHERE id = $1 AND deleted_at IS NULL`,
    [id]
  ) as AddressResponse[];
  return rows[0] ?? null;
}

// ── Mutations ──────────────────────────────────────────────────────────

export async function create(
  userId: string,
  data: {
    street: string;
    floor_number?: string | null;
    door_number?: string | null;
    additional_info?: string | null;
    entrance_notes?: string | null;
    label: string;
    custom_label?: string | null;
  }
): Promise<AddressResponse> {
  const rows = await db.query(
    `INSERT INTO addresses (user_id, street, floor_number, door_number, additional_info, entrance_notes, label, custom_label)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING ${COLUMNS}`,
    [userId, data.street, data.floor_number ?? null, data.door_number ?? null,
     data.additional_info ?? null, data.entrance_notes ?? null, data.label, data.custom_label ?? null]
  ) as AddressResponse[];
  return rows[0]!;
}

export async function createSimple(
  userId: string,
  street: string,
  label: string
): Promise<{ id: string }> {
  const rows = await db.query(
    `INSERT INTO addresses (user_id, street, label) VALUES ($1, $2, $3) RETURNING id`,
    [userId, street, label]
  ) as { id: string }[];
  return rows[0]!;
}

export async function update(
  id: string,
  data: {
    street: string;
    floor_number?: string | null;
    door_number?: string | null;
    additional_info?: string | null;
    entrance_notes?: string | null;
    label: string;
    custom_label?: string | null;
  }
): Promise<AddressResponse | null> {
  const rows = await db.query(
    `UPDATE addresses SET street = $1, floor_number = $2, door_number = $3, additional_info = $4,
     entrance_notes = $5, label = $6, custom_label = $7
     WHERE id = $8 AND deleted_at IS NULL RETURNING ${COLUMNS}`,
    [data.street, data.floor_number ?? null, data.door_number ?? null,
     data.additional_info ?? null, data.entrance_notes ?? null, data.label,
     data.custom_label ?? null, id]
  ) as AddressResponse[];
  return rows[0] ?? null;
}

export async function softDelete(id: string): Promise<void> {
  await db.query(
    `UPDATE addresses SET deleted_at = NOW() WHERE id = $1`, [id]
  );
}
