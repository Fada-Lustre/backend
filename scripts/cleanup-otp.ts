/**
 * Purge expired OTP codes. Run on a schedule from whatever host/cron the API is
 * deployed behind (system cron, a GitHub Actions schedule, a managed job, etc.):
 *
 *   npm run cleanup:otp
 *
 * Replaces the former Vercel cron (api/cron/cleanup-otp.ts).
 */
import db from "../src/db";

async function main(): Promise<void> {
  const rows = (await db.query(
    "DELETE FROM otp_codes WHERE expires_at < NOW() - INTERVAL '1 hour' RETURNING id"
  )) as { id: string }[];
  console.log(JSON.stringify({ deleted: rows.length, timestamp: new Date().toISOString() }));
}

main()
  .catch((err) => {
    console.error("OTP cleanup failed:", err);
    process.exitCode = 1;
  })
  .finally(() => db.end());
