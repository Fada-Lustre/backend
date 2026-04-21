import type { VercelRequest, VercelResponse } from "@vercel/node";
import db from "../../src/db";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const result = await db.query(
    "DELETE FROM otp_codes WHERE expires_at < NOW() - INTERVAL '1 hour' RETURNING id"
  );
  res.json({ deleted: result.rows.length, timestamp: new Date().toISOString() });
}
