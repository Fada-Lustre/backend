import { Body, Controller, Get, Path, Post, Route, Tags, Response } from "tsoa";
import db from "../db";
import type { PricingConfig, QuoteRequest, QuoteResponse, QuoteScheduleRequest, QuoteScheduleResponse } from "../types/quotes";
import type { ErrorResponse } from "../types/common";

const VALID_HOURS = [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];
const VALID_TIMES = [
  "09:00","09:30","10:00","10:30","11:00","11:30","12:00",
  "12:30","13:00","13:30","14:00","14:30","15:00","15:30",
  "16:00","16:30","17:00",
];
const UK_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

@Route("v1")
@Tags("Quotes & Pricing")
export class QuotesController extends Controller {
  /**
   * Returns all pricing configuration: hourly rate, fees, add-ons, and frequency options.
   * The frontend should call this before rendering the quote form.
   */
  @Get("pricing")
  public async getPricing(): Promise<PricingConfig> {
    const rateRows = await db.query(
      "SELECT key, value FROM pricing_config ORDER BY key ASC"
    );
    const config: Record<string, number> = {};
    for (const row of rateRows as any[]) {
      config[row.key] = parseFloat(row.value);
    }
    const addOns = await db.query(
      "SELECT id, name, slug, hours_added FROM add_ons WHERE active = true ORDER BY name ASC"
    );
    return {
      hourly_rate: config["hourly_rate"] ?? 22.5,
      cleaning_products_fee: config["cleaning_products_fee"] ?? 6.0,
      service_fee: config["service_fee"] ?? 2.5,
      weekend_surcharge: config["weekend_surcharge"] ?? 10.0,
      currency: "GBP",
      add_ons: addOns as any[],
      frequencies: ["one-off", "2-3-times-a-week", "every-week", "every-2-weeks"],
      cleaning_products_note: "We can provide sprays and cloths NOT mops, buckets or vacuums",
    };
  }

  /**
   * Step 1 of 2 — Submit cleaning details and receive an instant quote estimate.
   * After receiving the quote ID, proceed to PATCH /v1/quotes/{id}/schedule to select a date and time.
   */
  @Post("quotes")
  @Response<ErrorResponse>(400, "Validation error")
  @Response<ErrorResponse>(500, "Server error")
  public async createQuote(@Body() body: QuoteRequest): Promise<QuoteResponse> {
    if (!UK_POSTCODE_RE.test(body.postcode)) {
      throw Object.assign(new Error("Invalid UK postcode"), {
        status: 400,
        error: { code: "VALIDATION_ERROR", message: "Invalid UK postcode" },
      });
    }
    if (!VALID_HOURS.includes(body.hours)) {
      throw Object.assign(new Error("Invalid hours value"), {
        status: 400,
        error: { code: "VALIDATION_ERROR", message: `Hours must be one of: ${VALID_HOURS.join(", ")}` },
      });
    }

    const rateRows = await db.query("SELECT key, value FROM pricing_config");
    const config: Record<string, number> = {};
    for (const row of rateRows as any[]) {
      config[row.key] = parseFloat(row.value);
    }

    const hourlyRate = config["hourly_rate"] ?? 22.5;
    const productsFee = body.cleaning_products === "bring"
      ? (config["cleaning_products_fee"] ?? 6.0)
      : 0;
    const serviceFee = config["service_fee"] ?? 2.5;
    const labourCost = body.hours * hourlyRate;
    const total = labourCost + productsFee + serviceFee;

    const lineItems = [
      { label: `${body.hours} hours at £${hourlyRate.toFixed(2)}/hour`, amount: labourCost },
      ...(productsFee > 0 ? [{ label: "Cleaning products", amount: productsFee }] : []),
      { label: "Service fee", amount: serviceFee },
    ];

    const recommendedHours = Math.round((body.rooms * 0.75 + body.bathrooms * 0.5) * 2) / 2;
    const addOns = body.add_ons ?? [];
    const preferredDays = body.preferred_days ?? [];

    const rows = await db.query(
      `INSERT INTO quotes (postcode, rooms, bathrooms, add_ons, hours, cleaning_products, frequency,
       preferred_days, email, newsletter_opt_in, total, line_items_json, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'draft') RETURNING id`,
      [
        body.postcode, body.rooms, body.bathrooms, JSON.stringify(addOns), body.hours,
        body.cleaning_products, body.frequency, JSON.stringify(preferredDays),
        body.email, body.newsletter_opt_in ?? false,
        parseFloat((Math.round(total * 100) / 100).toFixed(2)), JSON.stringify(lineItems),
      ]
    );

    this.setStatus(200);
    return {
      id: (rows[0] as any).id,
      postcode: body.postcode,
      rooms: body.rooms,
      bathrooms: body.bathrooms,
      add_ons: addOns,
      hours: body.hours,
      cleaning_products: body.cleaning_products,
      frequency: body.frequency,
      preferred_days: preferredDays,
      line_items: lineItems,
      total: parseFloat((Math.round(total * 100) / 100).toFixed(2)),
      currency: "GBP",
      recommended_hours: recommendedHours,
    };
  }

  /**
   * Step 2 of 2 — Attach a preferred date and arrival time to an existing quote.
   * Friday, Saturday, and Sunday bookings incur a £10 weekend surcharge.
   */
  @Post("quotes/{id}/schedule")
  @Response<ErrorResponse>(400, "Validation error")
  @Response<ErrorResponse>(404, "Quote not found")
  public async scheduleQuote(
    @Path() id: string,
    @Body() body: QuoteScheduleRequest
  ): Promise<QuoteScheduleResponse> {
    if (!VALID_TIMES.includes(body.preferred_time)) {
      throw Object.assign(new Error("Invalid time slot"), {
        status: 400,
        error: { code: "VALIDATION_ERROR", message: "preferred_time must be a 30-min slot between 09:00 and 17:00" },
      });
    }
    if (isNaN(Date.parse(body.preferred_date)) || new Date(body.preferred_date) <= new Date()) {
      throw Object.assign(new Error("Invalid date"), {
        status: 400,
        error: { code: "VALIDATION_ERROR", message: "preferred_date must be a valid future date (YYYY-MM-DD)" },
      });
    }

    const existing = await db.query("SELECT id, total FROM quotes WHERE id = $1", [id]);
    if (existing.length === 0) {
      throw Object.assign(new Error("Quote not found"), {
        status: 404,
        error: { code: "NOT_FOUND", message: "Quote not found" },
      });
    }

    const baseTotal = parseFloat((existing[0] as any).total);
    const dayOfWeek = new Date(body.preferred_date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;

    const surchargeRows = await db.query(
      "SELECT value FROM pricing_config WHERE key = 'weekend_surcharge'"
    );
    const weekendSurcharge = isWeekend
      ? parseFloat((surchargeRows[0] as any)?.value ?? "10")
      : 0;
    const finalTotal = parseFloat((baseTotal + weekendSurcharge).toFixed(2));

    await db.query(
      `UPDATE quotes SET preferred_date=$1, preferred_time=$2, weekend_surcharge=$3,
       final_total=$4, status='scheduled', updated_at=NOW() WHERE id=$5`,
      [body.preferred_date, body.preferred_time, weekendSurcharge, finalTotal, id]
    );

    return {
      id,
      preferred_date: body.preferred_date,
      preferred_time: body.preferred_time,
      weekend_surcharge: weekendSurcharge,
      final_total: finalTotal,
      currency: "GBP",
    };
  }
}
