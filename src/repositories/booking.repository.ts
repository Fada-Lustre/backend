import db from "../db";

// ── Row types ──────────────────────────────────────────────────────────

export interface BookingRow {
  id: string;
  customer_id: string;
  cleaner_id: string | null;
  address_id: string;
  service_type: string;
  condition: string | null;
  property_type: string | null;
  total_sq_metres: number | null;
  rooms: number;
  floors: number;
  bathrooms: number;
  add_ons: unknown;
  scheduled_date: string;
  time_start: string;
  time_end: string | null;
  additional_info: string | null;
  use_same_cleaner: boolean;
  booking_fee: string | null;
  charges: string | null;
  discount: string | null;
  total_price: string | null;
  tip_amount: string | null;
  payment_method: string | null;
  payment_status: string;
  status: string;
  rebooked_from_id: string | null;
  created_by: string;
  created_at: string;
}

// ── Core lookups ───────────────────────────────────────────────────────

export async function findById(id: string): Promise<BookingRow | null> {
  const rows = await db.query(
    `SELECT id, customer_id, cleaner_id, address_id, service_type, condition, property_type,
            total_sq_metres, rooms, floors, bathrooms, add_ons, scheduled_date, time_start,
            time_end, additional_info, use_same_cleaner, booking_fee, charges, discount,
            total_price, tip_amount, payment_method, payment_status, status, rebooked_from_id,
            created_by, created_at
     FROM bookings WHERE id = $1`,
    [id]
  ) as BookingRow[];
  return rows[0] ?? null;
}

export async function findByIdBasic(
  id: string
): Promise<{ id: string; customer_id: string; cleaner_id: string | null; status: string; payment_status: string; total_price: string | null } | null> {
  const rows = await db.query(
    `SELECT id, customer_id, cleaner_id, status, payment_status, total_price FROM bookings WHERE id = $1`,
    [id]
  ) as { id: string; customer_id: string; cleaner_id: string | null; status: string; payment_status: string; total_price: string | null }[];
  return rows[0] ?? null;
}

export async function findDetailWithCleaner(
  id: string
): Promise<Record<string, unknown> | null> {
  const rows = await db.query(
    `SELECT b.id, b.service_type, b.status, b.scheduled_date AS date, b.time_start AS time,
            b.additional_info, b.use_same_cleaner, b.customer_id,
            b.booking_fee, b.charges, b.discount, b.total_price, b.payment_method, b.payment_status,
            u.id AS cleaner_id, CONCAT(u.first_name, ' ', COALESCE(u.last_name, '')) AS cleaner_name, u.rating_avg AS cleaner_rating,
            (SELECT COUNT(*)::int FROM bookings WHERE cleaner_id = u.id AND status = 'done') AS cleaner_completed_bookings,
            CASE WHEN u.home_street IS NOT NULL OR u.home_postcode IS NOT NULL
                 THEN CONCAT_WS(', ', u.home_street, u.home_postcode) ELSE NULL END AS cleaner_location
     FROM bookings b
     LEFT JOIN users u ON b.cleaner_id = u.id
     WHERE b.id = $1`,
    [id]
  ) as Record<string, unknown>[];
  return rows[0] ?? null;
}

export async function findCleanerBookingDetail(
  id: string
): Promise<{
  id: string; service_type: string; status: string; date: string; time: string;
  additional_info: string | null; cleaner_id: string | null;
  customer_id: string | null; customer_name: string | null; customer_rating: string | null;
  customer_completed_bookings: number;
  label: string | null; street: string | null; floor_number: string | null;
  door_number: string | null; county: string | null; entrance_notes: string | null;
} | null> {
  const rows = await db.query(
    `SELECT b.id, b.service_type, b.status, b.scheduled_date AS date, b.time_start AS time,
            b.additional_info, b.cleaner_id,
            u.id AS customer_id, u.first_name AS customer_name, u.rating_avg AS customer_rating,
            (SELECT COUNT(*)::int FROM bookings WHERE customer_id = u.id AND status = 'done') AS customer_completed_bookings,
            a.label, a.street, a.floor_number, a.door_number, a.additional_info AS county, a.entrance_notes
     FROM bookings b
     LEFT JOIN users u ON b.customer_id = u.id
     LEFT JOIN addresses a ON b.address_id = a.id
     WHERE b.id = $1`,
    [id]
  ) as {
    id: string; service_type: string; status: string; date: string; time: string;
    additional_info: string | null; cleaner_id: string | null;
    customer_id: string | null; customer_name: string | null; customer_rating: string | null;
    customer_completed_bookings: number;
    label: string | null; street: string | null; floor_number: string | null;
    door_number: string | null; county: string | null; entrance_notes: string | null;
  }[];
  return rows[0] ?? null;
}

export async function findReceiptById(
  id: string
): Promise<{
  booking_fee: string | null; charges: string | null; discount: string | null;
  total: string | null; payment_method: string | null; payment_status: string;
  service: string; additional_info: string | null; customer_id: string;
} | null> {
  const rows = await db.query(
    `SELECT b.booking_fee, b.charges, b.discount, b.total_price AS total, b.payment_method,
            b.payment_status, b.service_type AS service, b.additional_info, b.customer_id
     FROM bookings b WHERE b.id = $1`,
    [id]
  ) as {
    booking_fee: string | null; charges: string | null; discount: string | null;
    total: string | null; payment_method: string | null; payment_status: string;
    service: string; additional_info: string | null; customer_id: string;
  }[];
  return rows[0] ?? null;
}

// ── Customer booking list ──────────────────────────────────────────────

export async function listByCustomer(
  customerId: string,
  statusFilter: string,
  page: number,
  limit: number
): Promise<{
  data: { id: string; service_type: string; date: string; time: string; status: string; cleaner_name: string | null; cleaner_rating: string | null }[];
  total: number;
}> {
  const conditions = ["b.customer_id = $1"];
  const params: (string | number)[] = [customerId];

  if (statusFilter === "upcoming") conditions.push("b.status NOT IN ('done', 'cancelled')");
  else if (statusFilter === "past") conditions.push("b.status IN ('done', 'cancelled')");

  const where = conditions.join(" AND ");
  const countRows = await db.query(
    `SELECT COUNT(*) FROM bookings b WHERE ${where}`, params
  ) as { count: string }[];
  const total = parseInt(countRows[0]!.count, 10);

  params.push(limit, (page - 1) * limit);
  const rows = await db.query(
    `SELECT b.id, b.service_type, b.scheduled_date AS date, b.time_start AS time, b.status,
            u.first_name AS cleaner_name, u.rating_avg AS cleaner_rating
     FROM bookings b
     LEFT JOIN users u ON b.cleaner_id = u.id
     WHERE ${where}
     ORDER BY b.scheduled_date DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params as string[]
  ) as { id: string; service_type: string; date: string; time: string; status: string; cleaner_name: string | null; cleaner_rating: string | null }[];

  return { data: rows, total };
}

// ── Cleaner booking list ───────────────────────────────────────────────

export async function listByCleaner(
  cleanerId: string,
  filter: string,
  page: number,
  limit: number
): Promise<{
  data: { id: string; service_type: string; date: string; time: string; status: string; customer_name: string | null; customer_rating: string | null }[];
  total: number;
}> {
  const conditions = ["b.cleaner_id = $1"];
  const params: (string | number)[] = [cleanerId];

  if (filter === "upcoming") conditions.push("b.status NOT IN ('done', 'cancelled')");
  else if (filter === "past") conditions.push("b.status IN ('done', 'cancelled')");
  else if (filter === "new") conditions.push("b.status = 'scheduled'");

  const where = conditions.join(" AND ");
  const countRows = await db.query(
    `SELECT COUNT(*) FROM bookings b WHERE ${where}`, params
  ) as { count: string }[];
  const total = parseInt(countRows[0]!.count, 10);

  params.push(limit, (page - 1) * limit);
  const rows = await db.query(
    `SELECT b.id, b.service_type, b.scheduled_date AS date, b.time_start AS time, b.status,
            u.first_name AS customer_name, u.rating_avg AS customer_rating
     FROM bookings b
     LEFT JOIN users u ON b.customer_id = u.id
     WHERE ${where}
     ORDER BY b.scheduled_date DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params as string[]
  ) as { id: string; service_type: string; date: string; time: string; status: string; customer_name: string | null; customer_rating: string | null }[];

  return { data: rows, total };
}

// ── Mutations ──────────────────────────────────────────────────────────

export interface CreateBookingData {
  customer_id: string;
  address_id: string;
  service_type: string;
  condition?: string | null;
  property_type?: string | null;
  total_sq_metres?: number | null;
  rooms: number;
  floors?: number;
  bathrooms: number;
  add_ons?: string;
  scheduled_date: string;
  time_start: string;
  time_end?: string | null;
  additional_info?: string | null;
  use_same_cleaner?: boolean;
  booking_fee?: number;
  total_price?: number;
  created_by: string;
  status?: string;
  rebooked_from_id?: string | null;
}

export async function create(data: CreateBookingData): Promise<{ id: string; status: string; total_price: string | null }> {
  const rows = await db.query(
    `INSERT INTO bookings (customer_id, address_id, service_type, condition, property_type,
       total_sq_metres, rooms, floors, bathrooms, add_ons,
       scheduled_date, time_start, time_end, additional_info,
       use_same_cleaner, booking_fee, total_price, created_by, status, rebooked_from_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
     RETURNING id, status, total_price`,
    [
      data.customer_id, data.address_id, data.service_type,
      data.condition ?? null, data.property_type ?? null,
      data.total_sq_metres ?? null, data.rooms, data.floors ?? 1,
      data.bathrooms, data.add_ons ?? "[]",
      data.scheduled_date, data.time_start, data.time_end ?? null,
      data.additional_info ?? null, data.use_same_cleaner ?? false,
      data.booking_fee ?? 0, data.total_price ?? 0, data.created_by,
      data.status ?? "unassigned", data.rebooked_from_id ?? null,
    ]
  ) as { id: string; status: string; total_price: string | null }[];
  return rows[0]!;
}

export async function updateStatus(
  id: string,
  status: string,
  extra?: Record<string, string | number | null>
): Promise<{ id: string; status: string; customer_id: string; cleaner_id: string | null } | null> {
  const sets = ["status = $1"];
  const params: (string | number | null)[] = [status];
  let idx = 2;

  if (extra) {
    for (const [key, val] of Object.entries(extra)) {
      sets.push(`${key} = $${idx++}`);
      params.push(val);
    }
  }

  params.push(id);
  const rows = await db.query(
    `UPDATE bookings SET ${sets.join(", ")} WHERE id = $${idx}
     RETURNING id, status, customer_id, cleaner_id`,
    params
  ) as { id: string; status: string; customer_id: string; cleaner_id: string | null }[];
  return rows[0] ?? null;
}

export async function updatePayment(
  id: string,
  fields: Record<string, string | number | null>
): Promise<void> {
  const sets: string[] = [];
  const params: (string | number | null)[] = [];
  let idx = 1;

  for (const [key, val] of Object.entries(fields)) {
    sets.push(`${key} = $${idx++}`);
    params.push(val);
  }

  params.push(id);
  await db.query(
    `UPDATE bookings SET ${sets.join(", ")} WHERE id = $${idx}`,
    params
  );
}

export async function updateSchedule(
  id: string,
  date: string,
  time: string,
  timeEnd?: string | null
): Promise<void> {
  await db.query(
    `UPDATE bookings SET scheduled_date = $1, time_start = $2, time_end = $3 WHERE id = $4`,
    [date, time, timeEnd ?? null, id]
  );
}

export async function assignCleaner(
  id: string,
  cleanerId: string
): Promise<{ id: string; status: string } | null> {
  const rows = await db.query(
    `UPDATE bookings SET cleaner_id = $1, status = 'scheduled', assigned_at = NOW()
     WHERE id = $2 AND status = 'unassigned'
     RETURNING id, status`,
    [cleanerId, id]
  ) as { id: string; status: string }[];
  return rows[0] ?? null;
}

export async function cancelBooking(
  id: string,
  cancelledBy: string
): Promise<{ id: string; status: string; customer_id: string; cleaner_id: string | null } | null> {
  const rows = await db.query(
    `UPDATE bookings SET status = 'cancelled', cancelled_at = NOW(), cancelled_by = $1
     WHERE id = $2 AND status NOT IN ('done','cancelled')
     RETURNING id, status, customer_id, cleaner_id`,
    [cancelledBy, id]
  ) as { id: string; status: string; customer_id: string; cleaner_id: string | null }[];
  return rows[0] ?? null;
}

export async function rescheduleAdmin(
  id: string,
  date: string,
  startTime: string,
  endTime?: string | null
): Promise<{ id: string; scheduled_date: string; time_start: string; time_end: string | null; status: string } | null> {
  const rows = await db.query(
    `UPDATE bookings SET scheduled_date = $1, time_start = $2, time_end = $3
     WHERE id = $4 AND status NOT IN ('done','cancelled')
     RETURNING id, scheduled_date, time_start, time_end, status`,
    [date, startTime, endTime ?? null, id]
  ) as { id: string; scheduled_date: string; time_start: string; time_end: string | null; status: string }[];
  return rows[0] ?? null;
}

export async function existsById(id: string): Promise<boolean> {
  const rows = await db.query(`SELECT id FROM bookings WHERE id = $1`, [id]) as { id: string }[];
  return rows.length > 0;
}

export async function updatePaymentStatus(
  bookingId: string,
  status: string
): Promise<void> {
  await db.query(
    `UPDATE bookings SET payment_status = $1 WHERE id = $2`,
    [status, bookingId]
  );
}

export async function updatePaymentStatusIfPending(
  bookingId: string,
  status: string
): Promise<void> {
  await db.query(
    `UPDATE bookings SET payment_status = $1 WHERE id = $2 AND payment_status = 'pending'`,
    [status, bookingId]
  );
}

// ── Admin booking queries ──────────────────────────────────────────────

export async function findAdminDetail(
  id: string
): Promise<Record<string, unknown> | null> {
  const rows = await db.query(
    `SELECT b.id, b.service_type, b.condition, b.property_type, b.total_sq_metres,
            b.rooms, b.floors, b.bathrooms, b.add_ons, b.scheduled_date, b.time_start,
            b.time_end, b.additional_info, b.use_same_cleaner, b.booking_fee, b.charges,
            b.discount, b.total_price, b.tip_amount, b.payment_method, b.payment_status,
            b.status, b.created_at, b.assigned_at, b.started_at, b.completed_at,
            b.cancelled_at, b.rebooked_from_id, b.transaction_ref,
            json_build_object('id', cu.id, 'name', CONCAT(cu.first_name, ' ', COALESCE(cu.last_name, '')), 'email', cu.email, 'phone', cu.phone) AS customer,
            CASE WHEN cl.id IS NOT NULL THEN json_build_object('id', cl.id, 'name', CONCAT(cl.first_name, ' ', COALESCE(cl.last_name, ''))) ELSE NULL END AS cleaner
     FROM bookings b
     JOIN users cu ON cu.id = b.customer_id
     LEFT JOIN users cl ON cl.id = b.cleaner_id
     WHERE b.id = $1`,
    [id]
  ) as Record<string, unknown>[];
  return rows[0] ?? null;
}

// ── Dashboard / stats ──────────────────────────────────────────────────

export async function countTotal(): Promise<number> {
  const rows = await db.query(
    `SELECT COUNT(*)::int AS total FROM bookings`
  ) as { total: number }[];
  return rows[0]!.total;
}

export async function upcomingByService(): Promise<{ service: string; started: number; pending: number; total: number }[]> {
  return await db.query(
    `SELECT service_type AS service,
            COUNT(*) FILTER (WHERE status IN ('ongoing','on_the_way'))::int AS started,
            COUNT(*) FILTER (WHERE status IN ('unassigned','scheduled'))::int AS pending,
            COUNT(*)::int AS total
     FROM bookings
     WHERE scheduled_date >= CURRENT_DATE AND status NOT IN ('done','cancelled')
     GROUP BY service_type`
  ) as { service: string; started: number; pending: number; total: number }[];
}

export async function countByServiceType(): Promise<Record<string, number>> {
  const rows = await db.query(
    `SELECT service_type, COUNT(*)::int AS cnt FROM bookings GROUP BY service_type`
  ) as { service_type: string; cnt: number }[];
  const map: Record<string, number> = {};
  for (const row of rows) map[row.service_type] = row.cnt;
  return map;
}

export async function countDoneByCleanerInRange(
  cleanerId: string,
  from: string,
  to: string
): Promise<number> {
  const rows = await db.query(
    `SELECT COUNT(*)::int AS cnt FROM bookings
     WHERE cleaner_id = $1 AND status = 'done'
     AND scheduled_date BETWEEN $2 AND $3`,
    [cleanerId, from, to]
  ) as { cnt: number }[];
  return rows[0]!.cnt;
}

export async function getCustomerIdForNotification(
  bookingId: string
): Promise<string | null> {
  const rows = await db.query(
    `SELECT customer_id FROM bookings WHERE id = $1`,
    [bookingId]
  ) as { customer_id: string }[];
  return rows[0]?.customer_id ?? null;
}

// ── Booking images ─────────────────────────────────────────────────────

export async function listImagesByBooking(
  bookingId: string
): Promise<{ id: string; url: string; uploaded_at: string }[]> {
  return await db.query(
    `SELECT id, image_url AS url, created_at AS uploaded_at FROM booking_images WHERE booking_id = $1 ORDER BY created_at`,
    [bookingId]
  ) as { id: string; url: string; uploaded_at: string }[];
}

export async function insertImage(
  bookingId: string,
  uploadedBy: string,
  imageUrl: string,
  imagePublicId?: string
): Promise<{ id: string; url: string }> {
  const rows = await db.query(
    `INSERT INTO booking_images (booking_id, uploaded_by, image_url, image_public_id)
     VALUES ($1, $2, $3, $4) RETURNING id, image_url AS url`,
    [bookingId, uploadedBy, imageUrl, imagePublicId ?? null]
  ) as { id: string; url: string }[];
  return rows[0]!;
}

// ── Booking amendments ─────────────────────────────────────────────────

export async function insertAmendment(
  bookingId: string,
  requestedBy: string,
  fields: { floors?: number | null; rooms?: number | null; bathrooms?: number | null; add_ons?: string | null; additional_info?: string | null }
): Promise<{ id: string }> {
  const rows = await db.query(
    `INSERT INTO booking_amendments (booking_id, requested_by, floors, rooms, bathrooms, add_ons, additional_info)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [bookingId, requestedBy, fields.floors ?? null, fields.rooms ?? null, fields.bathrooms ?? null, fields.add_ons ?? null, fields.additional_info ?? null]
  ) as { id: string }[];
  return rows[0]!;
}

// ── Admin list (complex with filters) ──────────────────────────────────

import { addSearchFilter } from "../lib/query-helpers";
import type { AdminBookingListItem, AdminBookingDetail } from "../types/admin-booking";

export async function listAdmin(
  filters: { date?: string; location?: string; service?: string; status?: string; search?: string },
  page: number,
  limit: number
): Promise<{
  data: AdminBookingListItem[];
  stats: { income: number; total: number; in_progress: number; unassigned: number };
  total: number;
}> {
  const conditions: string[] = [];
  const params: (string | number)[] = [];
  let idx = 1;

  if (filters.date && filters.date !== "all") {
    if (filters.date === "today") {
      conditions.push(`b.scheduled_date = CURRENT_DATE`);
    } else {
      conditions.push(`b.scheduled_date = $${idx++}`);
      params.push(filters.date);
    }
  }
  if (filters.service) {
    conditions.push(`b.service_type = $${idx++}`);
    params.push(filters.service);
  }
  if (filters.status && filters.status !== "all") {
    if (filters.status === "upcoming") {
      conditions.push(`b.status IN ('scheduled','on_the_way')`);
    } else if (filters.status === "unassigned") {
      conditions.push(`b.status = 'unassigned'`);
    } else {
      conditions.push(`b.status = $${idx++}`);
      params.push(filters.status);
    }
  }
  if (filters.search) {
    const state = { conditions, params, idx };
    addSearchFilter(state, ["cu.first_name", "cu.last_name", "cu.email"], filters.search);
    idx = state.idx;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countRows = await db.query(
    `SELECT COUNT(*)::int AS total FROM bookings b JOIN users cu ON cu.id = b.customer_id ${where}`, params
  ) as { total: number }[];

  const statsRows = await db.query(
    `SELECT
       COALESCE(SUM(b.total_price), 0)::float AS income,
       COUNT(*)::int AS total,
       COUNT(*) FILTER (WHERE b.status IN ('ongoing','on_the_way'))::int AS in_progress,
       COUNT(*) FILTER (WHERE b.status = 'unassigned')::int AS unassigned
     FROM bookings b JOIN users cu ON cu.id = b.customer_id ${where}`, params
  ) as { income: number; total: number; in_progress: number; unassigned: number }[];

  const offset = (page - 1) * limit;
  const data = await db.query(
    `SELECT b.id,
            CONCAT(cu.first_name, ' ', COALESCE(cu.last_name, '')) AS customer_name,
            cu.home_street AS customer_location,
            b.service_type, b.scheduled_date, b.time_start, b.time_end, b.status, b.total_price::float,
            CASE WHEN cl.id IS NOT NULL THEN CONCAT(cl.first_name, ' ', COALESCE(cl.last_name, '')) ELSE NULL END AS cleaner_name
     FROM bookings b
     JOIN users cu ON cu.id = b.customer_id
     LEFT JOIN users cl ON cl.id = b.cleaner_id
     ${where}
     ORDER BY b.scheduled_date DESC, b.created_at DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, limit, offset]
  ) as AdminBookingListItem[];

  return { data, stats: statsRows[0]!, total: countRows[0]!.total };
}
