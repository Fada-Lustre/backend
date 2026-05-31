/**
 * Purge expired OTP codes. Build first (`npm run build`), then run on a schedule
 * from whatever host/cron the API is deployed behind (system cron, a GitHub
 * Actions schedule, a managed job, etc.):
 *
 *   npm run cleanup:otp        # -> node ./dist/scripts/cleanup-otp.js
 *
 * Replaces the former Vercel cron (api/cron/cleanup-otp.ts).
 */
import db from "../db";

async function main(): Promise<void> {
  try {
    const rows = (await db.query(
      "DELETE FROM otp_codes WHERE expires_at < NOW() - INTERVAL '1 hour' RETURNING id"
    )) as { id: string }[];
    console.log(JSON.stringify({ deleted: rows.length, timestamp: new Date().toISOString() }));
  } catch (err) {
    console.error("OTP cleanup failed:", err);
    process.exitCode = 1;
  } finally {
    try {
      await db.end();
    } catch (err) {
      console.error("Failed to close database connection:", err);
      process.exitCode = 1;
    }
  }
}

main();
