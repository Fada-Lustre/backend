import express, { Request, Response } from "express";
import db from "../db";

const servicesRouter = express.Router();

servicesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    let query = "SELECT * FROM services WHERE deleted_at IS NULL";
    const values: string[] = [];

    if (q && typeof q === "string") {
      query +=
        " AND (title ILIKE $1 OR description ILIKE $1)";
      values.push(`%${q}%`);
    }

    query += " ORDER BY display_order ASC";

    const rows = await db.query(query, values);
    res.json({ data: rows, meta: { total: rows.length } });
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch services" } });
  }
});

servicesRouter.get("/:slug", async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const rows = await db.query(
      "SELECT * FROM services WHERE slug = $1 AND deleted_at IS NULL",
      [slug]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Service not found" } });
      return;
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching service:", err);
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch service" } });
  }
});

export default servicesRouter;
