import express, { Request, Response } from "express";
import db from "../db";
import { validate } from "../middleware/validate";
import { QuoteRequestSchema, QuoteScheduleSchema } from "../schemas/quote";

const quotesRouter = express.Router();

quotesRouter.get("/pricing", async (_req: Request, res: Response) => {
  try {
    const rateRows = await db.query(
      "SELECT key, value FROM pricing_config ORDER BY key ASC"
    );

    const config: Record<string, number> = {};
    for (const row of rateRows as any[]) {
      config[row.key] = parseFloat(row.value);
    }

    const addOnRows = await db.query(
      "SELECT id, name, slug, hours_added FROM add_ons WHERE active = true ORDER BY name ASC"
    );

    res.json({
      hourly_rate: config["hourly_rate"] ?? 22.5,
      cleaning_products_fee: config["cleaning_products_fee"] ?? 6.0,
      service_fee: config["service_fee"] ?? 2.5,
      weekend_surcharge: config["weekend_surcharge"] ?? 10.0,
      currency: "GBP",
      add_ons: addOnRows,
      frequencies: ["one-off", "2-3-times-a-week", "every-week", "every-2-weeks"],
      cleaning_products_note:
        "We can provide sprays and cloths NOT mops, buckets or vacuums",
    });
  } catch (err) {
    console.error("Error fetching pricing:", err);
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch pricing" } });
  }
});

quotesRouter.post(
  "/",
  validate(QuoteRequestSchema),
  async (req: Request, res: Response) => {
    try {
      const {
        postcode, rooms, bathrooms, add_ons, hours,
        cleaning_products, frequency, preferred_days,
        email, newsletter_opt_in,
      } = req.body;

      const rateRows = await db.query("SELECT key, value FROM pricing_config");
      const config: Record<string, number> = {};
      for (const row of rateRows as any[]) {
        config[row.key] = parseFloat(row.value);
      }

      const hourlyRate = config["hourly_rate"] ?? 22.5;
      const productsFee = cleaning_products === "bring"
        ? (config["cleaning_products_fee"] ?? 6.0)
        : 0;
      const serviceFee = config["service_fee"] ?? 2.5;

      const labourCost = hours * hourlyRate;
      const total = labourCost + productsFee + serviceFee;

      const lineItems = [
        { label: `${hours} hours at £${hourlyRate.toFixed(2)}/hour`, amount: labourCost },
        ...(productsFee > 0
          ? [{ label: "Cleaning products", amount: productsFee }]
          : []),
        { label: "Service fee", amount: serviceFee },
      ];

      const recommendedHours = Math.round((rooms * 0.75 + bathrooms * 0.5) * 2) / 2;

      const rows = await db.query(
        `INSERT INTO quotes (
          postcode, rooms, bathrooms, add_ons, hours,
          cleaning_products, frequency, preferred_days,
          email, newsletter_opt_in, total, line_items_json, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'draft')
         RETURNING id, created_at`,
        [
          postcode, rooms, bathrooms, JSON.stringify(add_ons), hours,
          cleaning_products, frequency, JSON.stringify(preferred_days),
          email, newsletter_opt_in, total, JSON.stringify(lineItems),
        ]
      );

      res.json({
        id: (rows[0] as any).id,
        postcode,
        rooms,
        bathrooms,
        add_ons,
        hours,
        cleaning_products,
        frequency,
        preferred_days,
        line_items: lineItems,
        total: parseFloat((Math.round(total * 100) / 100).toFixed(2)),
        currency: "GBP",
        recommended_hours: recommendedHours,
      });
    } catch (err) {
      console.error("Error calculating quote:", err);
      res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to calculate quote" } });
    }
  }
);

quotesRouter.patch(
  "/:id/schedule",
  validate(QuoteScheduleSchema),
  async (req: Request, res: Response) => {
    try {
      const quoteId = req.params.id as string;
      const { preferred_date, preferred_time } = req.body;

      const existing = await db.query(
        "SELECT id, total FROM quotes WHERE id = $1",
        [quoteId]
      );

      if (existing.length === 0) {
        res.status(404).json({ error: { code: "NOT_FOUND", message: "Quote not found" } });
        return;
      }

      const baseTotal = parseFloat((existing[0] as any).total);

      const dateObj = new Date(preferred_date);
      const dayOfWeek = dateObj.getDay(); // 0=Sun, 5=Fri, 6=Sat
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;

      const rateRows = await db.query(
        "SELECT value FROM pricing_config WHERE key = 'weekend_surcharge'"
      );
      const weekendSurcharge = isWeekend
        ? parseFloat((rateRows[0] as any)?.value ?? "10")
        : 0;

      const finalTotal = baseTotal + weekendSurcharge;

      await db.query(
        `UPDATE quotes
         SET preferred_date = $1, preferred_time = $2,
             weekend_surcharge = $3, final_total = $4,
             status = 'scheduled', updated_at = NOW()
         WHERE id = $5`,
        [preferred_date, preferred_time, weekendSurcharge, finalTotal, quoteId]
      );

      res.json({
        id: quoteId,
        preferred_date,
        preferred_time,
        weekend_surcharge: weekendSurcharge,
        final_total: Math.round(finalTotal * 100) / 100,
        currency: "GBP",
      });
    } catch (err) {
      console.error("Error scheduling quote:", err);
      res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to schedule quote" } });
    }
  }
);

export default quotesRouter;
