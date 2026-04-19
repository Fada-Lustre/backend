import db from "../db";

export async function findByCleanerId(cleanerId: string): Promise<{ mode: string; schedule: unknown; accept_bookings: boolean } | null> {
  const rows = await db.query(
    "SELECT mode, schedule, accept_bookings FROM cleaner_availability WHERE cleaner_id = $1", [cleanerId]
  ) as { mode: string; schedule: unknown; accept_bookings: boolean }[];
  return rows[0] ?? null;
}

export async function upsert(cleanerId: string, mode: string, schedule: string, acceptBookings: boolean): Promise<void> {
  await db.query(
    `INSERT INTO cleaner_availability (cleaner_id, mode, schedule, accept_bookings)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (cleaner_id) DO UPDATE SET mode = $2, schedule = $3, accept_bookings = $4, updated_at = NOW()`,
    [cleanerId, mode, schedule, acceptBookings]
  );
}
