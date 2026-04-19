import db from "../db";
import type { PricingConfigRow, AddOnRow, QuoteIdRow, QuoteTotalRow } from "../types/rows";

export async function loadPricingConfig(): Promise<PricingConfigRow[]> {
  return await db.query("SELECT key, value FROM pricing_config ORDER BY key ASC") as PricingConfigRow[];
}

export async function listActiveAddOns(): Promise<AddOnRow[]> {
  return await db.query("SELECT id, name, slug, hours_added FROM add_ons WHERE active = true ORDER BY name ASC") as AddOnRow[];
}

export async function create(data: (string | number | boolean | null)[]): Promise<QuoteIdRow> {
  const rows = await db.query(
    `INSERT INTO quotes (postcode, rooms, bathrooms, add_ons, hours, cleaning_products, frequency,
     preferred_days, email, newsletter_opt_in, total, line_items_json, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'draft') RETURNING id`, data
  ) as QuoteIdRow[];
  return rows[0]!;
}

export async function findById(id: string): Promise<QuoteTotalRow | null> {
  const rows = await db.query("SELECT id, total FROM quotes WHERE id = $1", [id]) as QuoteTotalRow[];
  return rows[0] ?? null;
}

export async function getPricingValue(key: string): Promise<string | null> {
  const rows = await db.query("SELECT value FROM pricing_config WHERE key = $1", [key]) as PricingConfigRow[];
  return rows[0]?.value ?? null;
}

export async function updateSchedule(id: string, date: string, time: string, weekendSurcharge: number, finalTotal: number): Promise<void> {
  await db.query(
    `UPDATE quotes SET preferred_date=$1, preferred_time=$2, weekend_surcharge=$3,
     final_total=$4, status='scheduled', updated_at=NOW() WHERE id=$5`,
    [date, time, weekendSurcharge, finalTotal, id]
  );
}
