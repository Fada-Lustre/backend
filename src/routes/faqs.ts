import express, { Request, Response } from "express";
import db from "../db";

const faqsRouter = express.Router();

faqsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    let query = "SELECT * FROM faqs WHERE deleted_at IS NULL";
    const values: string[] = [];

    if (q && typeof q === "string") {
      query += " AND (question ILIKE $1 OR answer ILIKE $1)";
      values.push(`%${q}%`);
    }

    query += " ORDER BY display_order ASC";

    const rows = await db.query(query, values);
    res.json({ data: rows, meta: { total: rows.length } });
  } catch (err) {
    console.error("Error fetching FAQs:", err);
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch FAQs" } });
  }
});

export default faqsRouter;
