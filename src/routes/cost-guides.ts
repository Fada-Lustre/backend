import express, { Request, Response } from "express";
import db from "../db";

const costGuidesRouter = express.Router();

costGuidesRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const rows = await db.query(
      "SELECT id, title, slug, summary, published_at FROM cost_guides WHERE deleted_at IS NULL ORDER BY published_at DESC"
    );
    res.json({ data: rows, meta: { total: rows.length } });
  } catch (err) {
    console.error("Error fetching cost guides:", err);
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch cost guides" } });
  }
});

costGuidesRouter.get("/:slug", async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const rows = await db.query(
      "SELECT * FROM cost_guides WHERE slug = $1 AND deleted_at IS NULL",
      [slug]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Cost guide not found" } });
      return;
    }

    const guide: any = rows[0];

    const pricingRows = await db.query(
      "SELECT service_category, rate, explanation FROM cost_guide_pricing WHERE cost_guide_id = $1 ORDER BY display_order ASC",
      [guide.id]
    );

    res.json({ ...guide, pricing_table: pricingRows });
  } catch (err) {
    console.error("Error fetching cost guide:", err);
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch cost guide" } });
  }
});

export default costGuidesRouter;
