import db from "../db";
import type { CreatedRow } from "../types/rows";

export async function insertContactMessage(email: string, message: string, source: string | null): Promise<CreatedRow> {
  const rows = await db.query(
    "INSERT INTO contact_messages (email, message, source) VALUES ($1, $2, $3) RETURNING id, created_at",
    [email, message, source]
  ) as CreatedRow[];
  return rows[0]!;
}

export async function insertServiceRequest(name: string, email: string, phone: string | null, serviceDescription: string, preferredDate: string | null, location: string | null): Promise<CreatedRow> {
  const rows = await db.query(
    `INSERT INTO service_requests (name, email, phone, service_description, preferred_date, location)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`,
    [name, email, phone, serviceDescription, preferredDate, location]
  ) as CreatedRow[];
  return rows[0]!;
}

export async function insertCleanerApplication(data: (string | number | boolean | null)[]): Promise<CreatedRow> {
  const rows = await db.query(
    `INSERT INTO cleaner_applications (
      first_name, last_name, country_code, phone_number, email, gender,
      postcode, years_of_experience, experience_types, experience_description,
      hours_per_week, available_days, commitment_duration,
      right_to_work_uk, has_uk_bank_account, understands_self_employed,
      no_criminal_record, accepts_terms
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
    RETURNING id, created_at`, data
  ) as CreatedRow[];
  return rows[0]!;
}

export async function insertCleanerApplicationLegacy(data: (string | number | boolean | null)[]): Promise<Record<string, unknown>> {
  const rows = await db.query(
    `INSERT INTO cleaner_applications (
      first_name, last_name, country_code, phone_number, email,
      gender, postcode, years_of_experience, experience_types,
      experience_description, hours_per_week, available_days,
      commitment_duration, photo_url, photo_public_id, status
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'submitted')
    RETURNING id, status, created_at`, data
  ) as Record<string, unknown>[];
  return rows[0]!;
}

export async function updateApplicationPhoto(
  id: string,
  photoUrl: string,
  publicId: string | null
): Promise<void> {
  await db.query(
    `UPDATE cleaner_applications SET photo_url = $1, photo_public_id = $2
     WHERE id = $3 AND deleted_at IS NULL`,
    [photoUrl, publicId, id]
  );
}

export async function findCleanerApplication(id: string): Promise<Record<string, unknown> | null> {
  const rows = await db.query(
    `SELECT id, first_name, last_name, email, phone_number, status, created_at
     FROM cleaner_applications WHERE id = $1 AND deleted_at IS NULL`, [id]
  ) as Record<string, unknown>[];
  return rows[0] ?? null;
}

export async function findCleanerApplicationStatus(id: string): Promise<{ id: string; status: string } | null> {
  const rows = await db.query(
    "SELECT id, status FROM cleaner_applications WHERE id = $1 AND deleted_at IS NULL", [id]
  ) as { id: string; status: string }[];
  return rows[0] ?? null;
}

export async function updateCleanerApplication(id: string, fields: Record<string, string | number>): Promise<Record<string, unknown> | null> {
  const setClauses: string[] = [];
  const values: (string | number)[] = [];
  let idx = 1;
  for (const [key, val] of Object.entries(fields)) {
    setClauses.push(`${key} = $${idx++}`);
    values.push(val);
  }
  if (setClauses.length === 0) return null;
  values.push(id);
  const rows = await db.query(
    `UPDATE cleaner_applications SET ${setClauses.join(", ")}
     WHERE id = $${idx} AND deleted_at IS NULL
     RETURNING id, first_name, last_name, email, phone_number, status, created_at`,
    values as string[]
  ) as Record<string, unknown>[];
  return rows[0] ?? null;
}
