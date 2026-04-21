import * as quoteRepo from "../repositories/quote.repository";
import { ApplicationError } from "../errors";
import type { PricingConfig, QuoteRequest, QuoteResponse, QuoteScheduleResponse, AddOnSlug } from "../types/quotes";

const VALID_HOURS = [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];
const VALID_TIMES = [
  "09:00","09:30","10:00","10:30","11:00","11:30","12:00",
  "12:30","13:00","13:30","14:00","14:30","15:00","15:30",
  "16:00","16:30","17:00",
];
const UK_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

function extractTime(raw: string): string | null {
  if (/^\d{2}:\d{2}$/.test(raw)) return raw;
  const parsed = new Date(raw);
  if (isNaN(parsed.getTime())) return null;
  return `${String(parsed.getUTCHours()).padStart(2, "0")}:${String(parsed.getUTCMinutes()).padStart(2, "0")}`;
}

function extractDate(raw: string): string | null {
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const parsed = new Date(raw);
  if (isNaN(parsed.getTime())) return null;
  return parsed.toISOString().split("T")[0] as string;
}

async function loadPricingConfig(): Promise<Record<string, number>> {
  const rows = await quoteRepo.loadPricingConfig();
  const config: Record<string, number> = {};
  for (const row of rows) config[row.key] = parseFloat(row.value);
  return config;
}

export async function getPricingConfig(): Promise<PricingConfig> {
  const config = await loadPricingConfig();
  const addOns = await quoteRepo.listActiveAddOns();
  return {
    hourly_rate: config["hourly_rate"] ?? 22.5,
    cleaning_products_fee: config["cleaning_products_fee"] ?? 6.0,
    service_fee: config["service_fee"] ?? 2.5,
    weekend_surcharge: config["weekend_surcharge"] ?? 10.0,
    currency: "GBP",
    add_ons: addOns.map((a) => ({ id: a.id, name: a.name, slug: a.slug as AddOnSlug, hours_added: parseFloat(a.hours_added) })),
    frequencies: ["one-off", "2-3-times-a-week", "every-week", "every-2-weeks"],
    cleaning_products_note: "We can provide sprays and cloths NOT mops, buckets or vacuums",
  };
}

export async function createQuote(body: QuoteRequest): Promise<QuoteResponse> {
  if (!UK_POSTCODE_RE.test(body.postcode)) {
    throw new ApplicationError(400, "Invalid UK postcode", "VALIDATION_ERROR");
  }
  if (!VALID_HOURS.includes(body.hours)) {
    throw new ApplicationError(400, `Hours must be one of: ${VALID_HOURS.join(", ")}`, "VALIDATION_ERROR");
  }

  const config = await loadPricingConfig();
  const hourlyRate = config["hourly_rate"] ?? 22.5;
  const productsFee = body.cleaning_products === "bring" ? (config["cleaning_products_fee"] ?? 6.0) : 0;
  const serviceFee = config["service_fee"] ?? 2.5;
  const labourCost = body.hours * hourlyRate;
  const total = parseFloat((Math.round((labourCost + productsFee + serviceFee) * 100) / 100).toFixed(2));

  const lineItems = [
    { label: `${body.hours} hours at £${hourlyRate.toFixed(2)}/hour`, amount: labourCost },
    ...(productsFee > 0 ? [{ label: "Cleaning products", amount: productsFee }] : []),
    { label: "Service fee", amount: serviceFee },
  ];

  const addOns = body.add_ons ?? [];
  const preferredDays = body.preferred_days ?? [];
  const recommendedHours = Math.round((body.rooms * 0.75 + body.bathrooms * 0.5) * 2) / 2;

  const row = await quoteRepo.create([
    body.postcode, body.rooms, body.bathrooms, JSON.stringify(addOns), body.hours,
    body.cleaning_products, body.frequency, JSON.stringify(preferredDays),
    body.email, body.newsletter_opt_in ?? false, total, JSON.stringify(lineItems),
  ]);

  return {
    id: row.id,
    postcode: body.postcode,
    rooms: body.rooms,
    bathrooms: body.bathrooms,
    add_ons: addOns,
    hours: body.hours,
    cleaning_products: body.cleaning_products,
    frequency: body.frequency,
    preferred_days: preferredDays,
    line_items: lineItems,
    total,
    currency: "GBP",
    recommended_hours: recommendedHours,
  };
}

export async function scheduleQuote(
  id: string,
  body: { preferred_date: string; preferred_time: string }
): Promise<QuoteScheduleResponse> {
  const time = extractTime(body.preferred_time);
  if (!time || !VALID_TIMES.includes(time)) {
    throw new ApplicationError(
      400,
      'preferred_time must be a 30-min slot between 09:00 and 17:00 (e.g. "10:00")',
      "VALIDATION_ERROR"
    );
  }

  const date = extractDate(body.preferred_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!date || new Date(date) < today) {
    throw new ApplicationError(400, "preferred_date must be today or a future date", "VALIDATION_ERROR");
  }

  const existing = await quoteRepo.findById(id);
  if (!existing) {
    throw new ApplicationError(404, "Quote not found", "NOT_FOUND");
  }

  const baseTotal = parseFloat(existing.total);
  const dayOfWeek = new Date(date).getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;

  const surchargeVal = await quoteRepo.getPricingValue('weekend_surcharge');
  const weekendSurcharge = isWeekend ? parseFloat(surchargeVal ?? "10") : 0;
  const finalTotal = parseFloat((baseTotal + weekendSurcharge).toFixed(2));

  await quoteRepo.updateSchedule(id, date, time, weekendSurcharge, finalTotal);

  return { id, preferred_date: date, preferred_time: time, weekend_surcharge: weekendSurcharge, final_total: finalTotal, currency: "GBP" };
}
