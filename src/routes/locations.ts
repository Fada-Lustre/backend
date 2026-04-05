import express, { Request, Response } from "express";
import db from "../db";

const locationsRouter = express.Router();

locationsRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const rows = await db.query(
      "SELECT * FROM locations ORDER BY name ASC"
    );
    res.json({ data: rows, meta: { total: rows.length } });
  } catch (err) {
    console.error("Error fetching locations:", err);
    res.status(500).json({ error: { code: "SERVER_ERROR", message: "Failed to fetch locations" } });
  }
});

export default locationsRouter;
